'use client'

import { useState } from 'react'
import { RotateCcw, Check } from 'lucide-react'
import type { Ticket, TicketStatus } from '@/lib/types'
import { formatDateTime, cn } from '@/lib/utils'
import Card from '@/components/ui/Card'

interface TicketsListProps {
  tickets: Ticket[]
  passcode: string
  onStatusChange: (ticketId: string, status: TicketStatus) => void
}

export default function TicketsList({ tickets, passcode, onStatusChange }: TicketsListProps) {
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [errorId, setErrorId] = useState<string | null>(null)

  async function updateStatus(ticketId: string, status: TicketStatus) {
    setPendingId(ticketId)
    setErrorId(null)

    try {
      const response = await fetch(`/api/admin/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode,
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error('Update failed')

      onStatusChange(ticketId, status)
    } catch {
      setErrorId(ticketId)
    } finally {
      setPendingId(null)
    }
  }

  if (tickets.length === 0) {
    return (
      <Card className="px-6 py-8 text-center">
        <p className="text-sm font-medium text-ink-soft">No support tickets from this artist.</p>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {tickets.map((ticket) => {
        const isPending = pendingId === ticket.id
        const isOpen = ticket.status === 'Open'

        return (
          <Card key={ticket.id} className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold text-ink">{ticket.subject}</p>
                  <span
                    className={cn(
                      'stamp-rotate rounded-md border-2 border-ink px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.1em]',
                      isOpen ? 'bg-cobalt text-white' : 'bg-lime text-ink'
                    )}
                  >
                    {ticket.status}
                  </span>
                </div>
                <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                  {formatDateTime(ticket.created_at)}
                </p>
              </div>

              <button
                type="button"
                disabled={isPending}
                onClick={() => updateStatus(ticket.id, isOpen ? 'Closed' : 'Open')}
                className={cn(
                  'brutal-press flex shrink-0 items-center gap-1.5 rounded-md border-[2.5px] border-ink px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em] shadow-[2px_2px_0_0_var(--color-ink)] transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none',
                  isOpen ? 'bg-lime text-ink' : 'bg-white text-ink hover:bg-paper'
                )}
              >
                {isOpen ? <Check className="h-3 w-3" /> : <RotateCcw className="h-3 w-3" />}
                {isOpen ? 'Resolve' : 'Reopen'}
              </button>
            </div>

            <p className="mt-3 whitespace-pre-wrap text-sm font-medium text-ink-soft">
              {ticket.message}
            </p>

            {errorId === ticket.id ? (
              <p className="mt-2 font-mono text-[10px] font-bold text-punch">Update failed</p>
            ) : null}
          </Card>
        )
      })}
    </div>
  )
}
