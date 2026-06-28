import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase/server'
import { processScheduledDeletions } from '@/lib/process-scheduled-deletions'
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

interface CreateReleaseBody {
  artist_id?: string
  artist_name?: string
  title?: string
  release_type?: string
  cover_art_url?: string | null
  release_date?: string | null
  tracks?: IncomingTrack[]
}

export async function POST(request: Request) {
  let body: CreateReleaseBody

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { artist_id, artist_name, title, cover_art_url, release_date, tracks } = body
  const releaseType = body.release_type as ReleaseType

  if (!artist_id || !artist_name?.trim() || !title?.trim()) {
    return NextResponse.json(
      { error: 'artist_id, artist_name, and title are required.' },
      { status: 400 }
    )
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

  const supabase = getSupabaseAdminClient()

  try {
    const { data: release, error: releaseError } = await supabase
      .from('releases')
      .insert({
        artist_id,
        artist_name: artist_name.trim(),
        title: title.trim(),
        release_type: releaseType,
        cover_art_url: cover_art_url ?? null,
        release_date: release_date || null,
        status: 'Pending Review',
      })
      .select('*')
      .single()

    if (releaseError) {
      return NextResponse.json({ error: releaseError.message }, { status: 500 })
    }

    const { data: insertedTracks, error: tracksError } = await supabase
      .from('tracks')
      .insert(
        tracks.map((track, index) => ({
          release_id: release.id,
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
      // Roll back the release so we don't leave an empty, track-less project behind.
      await supabase.from('releases').delete().eq('id', release.id)
      return NextResponse.json({ error: tracksError.message }, { status: 500 })
    }

    return NextResponse.json(
      { release: { ...release, tracks: insertedTracks } },
      { status: 201 }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected server error.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const artistId = searchParams.get('artist_id')

  if (!artistId) {
    return NextResponse.json({ error: 'artist_id query parameter is required.' }, { status: 400 })
  }

  try {
    const supabase = getSupabaseAdminClient()

    await processScheduledDeletions(supabase)

    const { data, error } = await supabase
      .from('releases')
      .select('*, tracks(*)')
      .eq('artist_id', artistId)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const releases = (data ?? []).map((release) => ({
      ...release,
      tracks: [...(release.tracks ?? [])].sort((a, b) => a.track_number - b.track_number),
    }))

    return NextResponse.json({ releases })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected server error.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
