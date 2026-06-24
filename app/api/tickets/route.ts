import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

interface CreateTicketBody {
  artist_id?: string
  artist_name?: string
  subject?: string
  message?: string
}

export async function POST(request: Request) {
  let body: CreateTicketBody

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { artist_id, artist_name, subject, message } = body

  if (!artist_id || !artist_name?.trim() || !subject?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: 'artist_id, artist_name, subject, and message are required.' },
      { status: 400 }
    )
  }

  try {
    const supabase = getSupabaseAdminClient()

    const { data, error } = await supabase
      .from('tickets')
      .insert({
        artist_id,
        artist_name: artist_name.trim(),
        subject: subject.trim(),
        message: message.trim(),
        status: 'Open',
      })
      .select('*')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ticket: data }, { status: 201 })
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'Unexpected server error.'
    return NextResponse.json({ error: errMessage }, { status: 500 })
  }
}
