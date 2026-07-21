import { formatDateTime } from '@/lib/utils'
import type { ActivityLog } from '@/lib/types'
import Card from '@/components/ui/Card'

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  artist_registered:          { label: 'Registered',          color: 'bg-cobalt text-white' },
  release_submitted:          { label: 'Submitted',            color: 'bg-canary text-ink' },
  release_edited:             { label: 'Edited',               color: 'bg-white text-ink' },
  release_duplicated:         { label: 'Duplicated',           color: 'bg-white text-ink' },
  release_deleted:            { label: 'Deleted',              color: 'bg-punch text-white' },
  release_approved:           { label: 'Approved',             color: 'bg-lime text-ink' },
  release_rejected:           { label: 'Rejected',             color: 'bg-punch text-white' },
  release_needs_changes:      { label: 'Needs changes',        color: 'bg-canary text-ink' },
  release_sent:               { label: 'Sent',                 color: 'bg-ink text-paper' },
  release_live:               { label: 'Live',                 color: 'bg-lime text-ink' },
  release_deletion_scheduled: { label: 'Deletion scheduled',   color: 'bg-punch text-white' },
  release_deletion_cancelled: { label: 'Deletion cancelled',   color: 'bg-white text-ink' },
  ticket_opened:              { label: 'Ticket opened',        color: 'bg-cobalt text-white' },
  ticket_resolved:            { label: 'Ticket resolved',      color: 'bg-lime text-ink' },
  ticket_reopened:            { label: 'Ticket reopened',      color: 'bg-canary text-ink' },
  profile_updated:            { label: 'Profile updated',      color: 'bg-white text-ink' },
}

interface ActivityLogsPanelProps {
  logs: ActivityLog[]
}

export default function ActivityLogsPanel({ logs }: ActivityLogsPanelProps) {
  if (logs.length === 0) {
    return (
      <Card className="px-6 py-10 text-center">
        <p className="text-sm font-medium text-ink-soft">No activity recorded yet.</p>
      </Card>
    )
  }

  return (
    <Card className="divide-y-[2.5px] divide-ink overflow-hidden">
      {logs.map((log) => {
        const meta = ACTION_LABELS[log.action] ?? { label: log.action, color: 'bg-white text-ink' }

        return (
          <div key={log.id} className="flex flex-wrap items-start gap-3 p-4">
            <span
              className={`mt-0.5 shrink-0 rounded-md border-2 border-ink px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.08em] shadow-[1px_1px_0_0_var(--color-ink)] ${meta.color}`}
            >
              {meta.label}
            </span>
            <div className="min-w-0 flex-1">
              {log.artist_name ? (
                <p className="text-sm font-bold text-ink">{log.artist_name}</p>
              ) : null}
              {log.detail ? (
                <p className="text-sm font-medium text-ink-soft">{log.detail}</p>
              ) : null}
              <p className="mt-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-ink-faint">
                {formatDateTime(log.created_at)}
              </p>
            </div>
          </div>
        )
      })}
    </Card>
  )
}
