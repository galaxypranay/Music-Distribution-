import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase/server'
import { isAdminAuthorized } from '@/lib/admin-auth'
import { parseStoragePathFromPublicUrl } from '@/lib/supabase/storage-path'
import type { ReleaseStatus, Track } from '@/lib/types'

export const dynamic = 'force-dynamic'

const VALID_STATUSES: ReleaseStatus[] = [
  'Pending Review',
  'Approved',
  'Sent to Platforms',
  'Live',
  'Rejected',
]

interface PatchBody {
  status?: string
  rejection_reason?: string | null
  spotify_url?: string | null
  apple_music_url?: string | null
  youtube_url?: string | null
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { id } = await params

  let body: PatchBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (!body.status || !VALID_STATUSES.includes(body.status as ReleaseStatus)) {
    return NextResponse.json(
      { error: `status must be one of: ${VALID_STATUSES.join(', ')}` },
      { status: 400 }
    )
  }

  const update: Record<string, unknown> = { status: body.status }

  // A stale rejection reason from a previous cycle shouldn't linger once
  // the release moves on to something other than Rejected.
  update.rejection_reason = body.status === 'Rejected' ? body.rejection_reason ?? null : null

  if (body.status === 'Live') {
    update.spotify_url = body.spotify_url ?? null
    update.apple_music_url = body.apple_music_url ?? null
    update.youtube_url = body.youtube_url ?? null
  }

  try {
    const supabase = getSupabaseAdminClient()

    const { data, error } = await supabase
      .from('releases')
      .update(update)
      .eq('id', id)
      .select('*, tracks(*)')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      release: {
        ...data,
        tracks: [...(data.tracks ?? [])].sort((a, b) => a.track_number - b.track_number),
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected server error.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { id } = await params

  try {
    const supabase = getSupabaseAdminClient()

    // Read everything we need to clean up Storage *before* deleting — once
    // the release row is gone, cascading deletes take the tracks (and
    // their URLs) with it.
    const { data: release, error: fetchError } = await supabase
      .from('releases')
      .select('*, tracks(*)')
      .eq('id', id)
      .single()

    if (fetchError || !release) {
      return NextResponse.json({ error: 'Release not found.' }, { status: 404 })
    }

    const { error: deleteError } = await supabase.from('releases').delete().eq('id', id)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    // Best-effort Storage cleanup — the release is already gone from the
    // catalog at this point regardless of what happens below.
    const urlsToClean = [
      release.cover_art_url,
      ...((release.tracks ?? []) as Track[]).map((track) => track.audio_url),
    ].filter((url): url is string => Boolean(url))

    for (const url of urlsToClean) {
      const parsed = parseStoragePathFromPublicUrl(url)
      if (!parsed) continue

      const { error: storageError } = await supabase.storage
        .from(parsed.bucket)
        .remove([parsed.path])

      if (storageError) {
        console.error('Storage cleanup failed for release', id, storageError.message)
      }
    }

    return NextResponse.json({ release })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected server error.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
