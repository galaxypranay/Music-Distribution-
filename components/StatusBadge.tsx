import { cn } from '@/lib/utils'
import type { ReleaseStatus } from '@/lib/types'

const DOT_STYLES: Record<ReleaseStatus, string> = {
  'Pending Review': 'bg-brass',
  Approved: 'bg-emerald-bright',
  Rejected: 'bg-rust-bright',
}

const TEXT_STYLES: Record<ReleaseStatus, string> = {
  'Pending Review': 'text-brass border-brass/35 bg-brass/10',
  Approved: 'text-emerald-bright border-emerald-bright/35 bg-emerald/15',
  Rejected: 'text-rust-bright border-rust-bright/35 bg-rust/15',
}

const LABELS: Record<ReleaseStatus, string> = {
  'Pending Review': 'Pending',
  Approved: 'Approved',
  Rejected: 'Rejected',
}

export default function StatusBadge({ status }: { status: ReleaseStatus }) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.18em]',
        TEXT_STYLES[status]
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', DOT_STYLES[status])} />
      {LABELS[status]}
    </span>
  )
}
