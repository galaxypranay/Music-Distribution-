import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase/server'
import { isAdminAuthorized } from '@/lib/admin-auth'
import { parseStoragePathFromPublicUrl } from '@/lib/supabase/storage-path'
import type { ReleaseStatus } from '@/lib/types'

export const dynamic = 'force-dynamic'

const VALID_STATUSES: ReleaseStatus[] = ['Pending Review', 'Approved', 'Rejected']

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { id } = await params

  let body: { status?: string }
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

  try {
    const supabase = getSupabaseAdminClient()

    const { data, error } = await supabase
      .from('releases')
      .update({ status: body.status })
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ release: data })
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

    // Delete the DB row first — that's the part the user actually sees, so
    // it should never appear to "fail" because of a Storage hiccup.
    const { data: deletedRelease, error: deleteError } = await supabase
      .from('releases')
      .delete()
      .eq('id', id)
      .select('*')
      .single()

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    // Best-effort: also remove the underlying audio file so it doesn't sit
    // around counting against Supabase Storage quota with nothing pointing
    // to it. If this fails for any reason, the release is still gone from
    // the catalog — we just log it rather than failing the whole request.
    if (deletedRelease?.audio_url) {
      const parsed = parseStoragePathFromPublicUrl(deletedRelease.audio_url)
      if (parsed) {
        const { error: storageError } = await supabase.storage
          .from(parsed.bucket)
          .remove([parsed.path])

        if (storageError) {
          console.error('Storage cleanup failed for release', id, storageError.message)
        }
      }
    }

    return NextResponse.json({ release: deletedRelease })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected server error.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
