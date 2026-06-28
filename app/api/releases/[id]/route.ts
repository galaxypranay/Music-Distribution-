import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase/server'
import type { ReleaseType } from '@/lib/types'

export const dynamic = 'force-dynamic'

const VALID_RELEASE_TYPES: ReleaseType[] = ['Single', 'EP', 'Album']

interface IncomingTrack {
  song_title?: string
  genre?: string | null
  audio_url?: string
  explicit?: boolean
  songwriter?: string | null
}

interface ResubmitBody {
  artist_id?: string
  title?: string
  release_type?: string
  cover_art_url?: string | null
  release_date?: string | null
  tracks?: IncomingTrack[]
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  let body: ResubmitBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { artist_id, title, cover_art_url, release_date, tracks } = body
  const releaseType = body.release_type as ReleaseType

  if (!artist_id || !title?.trim()) {
    return NextResponse.json({ error: 'artist_id and title are required.' }, { status: 400 })
  }

  if (!releaseType || !VALID_RELEASE_TYPES.includes(releaseType)) {
    return NextResponse.json(
      { error: `release_type must be one of: ${VALID_RELEASE_TYPES.join(', ')}` },
      { status: 400 }
    )
  }

  if (!tracks || tracks.length === 0) {
    return NextResponse.json({ error: 'At least one track is required.' }, { status: 400 })
  }

  for (const track of tracks) {
    if (!track.song_title?.trim() || !track.audio_url) {
      return NextResponse.json(
        { error: 'Every track needs a song_title and audio_url.' },
        { status: 400 }
      )
    }
  }

  try {
    const supabase = getSupabaseAdminClient()

    // Only the owning artist can resubmit, and only while it's Rejected —
    // this isn't real auth, but it matches the rest of the app's model and
    // stops an approved/live release from being silently rewritten.
    const { data: existing, error: fetchError } = await supabase
      .from('releases')
      .select('id, artist_id, status')
      .eq('id', id)
      .single()

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Release not found.' }, { status: 404 })
    }

    if (existing.artist_id !== artist_id) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 })
    }

    if (existing.status !== 'Rejected') {
      return NextResponse.json(
        { error: 'Only a rejected release can be resubmitted.' },
        { status: 400 }
      )
    }

    const { data: release, error: updateError } = await supabase
      .from('releases')
      .update({
        title: title.trim(),
        release_type: releaseType,
        cover_art_url: cover_art_url ?? null,
        release_date: release_date || null,
        status: 'Pending Review',
        rejection_reason: null,
      })
      .eq('id', id)
      .select('*')
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Full replace of the track list: simplest correct way to handle
    // additions, removals, and edits in one resubmission.
    const { error: deleteTracksError } = await supabase
      .from('tracks')
      .delete()
      .eq('release_id', id)

    if (deleteTracksError) {
      return NextResponse.json({ error: deleteTracksError.message }, { status: 500 })
    }

    const { data: insertedTracks, error: tracksError } = await supabase
      .from('tracks')
      .insert(
        tracks.map((track, index) => ({
          release_id: id,
          track_number: index + 1,
          song_title: track.song_title!.trim(),
          genre: track.genre?.trim() || null,
          audio_url: track.audio_url,
          explicit: track.explicit ?? false,
          songwriter: track.songwriter?.trim() || null,
        }))
      )
      .select('*')

    if (tracksError) {
      return NextResponse.json({ error: tracksError.message }, { status: 500 })
    }

    return NextResponse.json({ release: { ...release, tracks: insertedTracks } })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected server error.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
