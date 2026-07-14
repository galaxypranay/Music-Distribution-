import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase/server'
import { logActivity } from '@/lib/log-activity'

export const dynamic = 'force-dynamic'

interface CreateTicketBody {
  artist_id?: string
  artist_name?: string
  subject?: string
  message?: string
  attachment_url?: string | null
  attachment_name?: string | null
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

    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .insert({ artist_id, artist_name: artist_name.trim(), subject: subject.trim(), status: 'Open' })
      .select('*')
      .single()

    if (ticketError) return NextResponse.json({ error: ticketError.message }, { status: 500 })

    const { data: firstMessage, error: messageError } = await supabase
      .from('ticket_messages')
      .insert({
        ticket_id: ticket.id,
        sender: 'artist',
        message: message.trim(),
        attachment_url: body.attachment_url ?? null,
        attachment_name: body.attachment_name ?? null,
      })
      .select('*')
      .single()

    if (messageError) {
      await supabase.from('tickets').delete().eq('id', ticket.id)
      return NextResponse.json({ error: messageError.message }, { status: 500 })
    }

    await logActivity(supabase, { artistId: artist_id, artistName: artist_name, action: 'ticket_opened', detail: subject })

    return NextResponse.json({ ticket: { ...ticket, messages: [firstMessage] } }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error.' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const artistId = searchParams.get('artist_id')
  if (!artistId) return NextResponse.json({ error: 'artist_id is required.' }, { status: 400 })

  try {
    const supabase = getSupabaseAdminClient()
    const { data, error } = await supabase
      .from('tickets')
      .select('*, messages:ticket_messages(*)')
      .eq('artist_id', artistId)
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const tickets = (data ?? []).map((t) => ({
      ...t,
      messages: [...(t.messages ?? [])].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      ),
    }))

    return NextResponse.json({ tickets })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error.' }, { status: 500 })
  }
}
