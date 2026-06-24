import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

interface CreateArtistBody {
  name?: string
  photo_url?: string | null
}

export async function POST(request: Request) {
  let body: CreateArtistBody

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const name = body.name?.trim()

  if (!name) {
    return NextResponse.json({ error: 'Artist name is required.' }, { status: 400 })
  }

  try {
    const supabase = getSupabaseAdminClient()

    const { data, error } = await supabase
      .from('artists')
      .insert({ name, photo_url: body.photo_url ?? null })
      .select('id, name, photo_url, created_at')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ artist: data }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected server error.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
