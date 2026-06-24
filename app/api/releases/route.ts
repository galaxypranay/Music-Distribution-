import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

interface CreateReleaseBody {
  artist_id?: string
  artist_name?: string
  song_title?: string
  genre?: string | null
  release_date?: string | null
  audio_url?: string
}

export async function POST(request: Request) {
  let body: CreateReleaseBody

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { artist_id, artist_name, song_title, genre, release_date, audio_url } = body

  if (!artist_id || !artist_name?.trim() || !song_title?.trim() || !audio_url) {
    return NextResponse.json(
      { error: 'artist_id, artist_name, song_title, and audio_url are required.' },
      { status: 400 }
    )
  }

  try {
    const supabase = getSupabaseAdminClient()

    const { data, error } = await supabase
      .from('releases')
      .insert({
        artist_id,
        artist_name: artist_name.trim(),
        song_title: song_title.trim(),
        genre: genre?.trim() || null,
        release_date: release_date || null,
        audio_url,
        status: 'Pending Review',
      })
      .select('*')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ release: data }, { status: 201 })
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

    const { data, error } = await supabase
      .from('releases')
      .select('id, artist_id, artist_name, song_title, genre, release_date, audio_url, status, created_at')
      .eq('artist_id', artistId)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ releases: data })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected server error.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
