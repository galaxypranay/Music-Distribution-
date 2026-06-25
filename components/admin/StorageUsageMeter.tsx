import { formatBytes } from '@/lib/utils'
import type { StorageUsage } from '@/lib/types'
import Card from '@/components/ui/Card'

export default function StorageUsageMeter({ usage }: { usage: StorageUsage }) {
  const percent = usage.limitBytes > 0 ? (usage.usedBytes / usage.limitBytes) * 100 : 0
  const clampedPercent = Math.min(100, Math.max(0, percent))

  const fillColor =
    percent >= 90 ? 'bg-punch' : percent >= 70 ? 'bg-canary' : 'bg-lime'

  return (
    <Card className="px-5 py-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink">
          Supabase storage
        </p>
        <p className="font-mono text-xs font-bold text-ink-soft">
          {formatBytes(usage.usedBytes)} / {formatBytes(usage.limitBytes)}
          <span className="ml-2 text-ink-faint">({usage.fileCount} files)</span>
        </p>
      </div>

      <div
        role="progressbar"
        aria-valuenow={Math.round(clampedPercent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Supabase storage used"
        className="mt-2.5 h-4 w-full overflow-hidden rounded-md border-[2.5px] border-ink bg-paper"
      >
        <div
          className={`h-full ${fillColor} transition-[width] duration-500`}
          style={{ width: `${clampedPercent}%` }}
        />
      </div>

      {percent >= 90 ? (
        <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-punch">
          Almost full — consider upgrading your Supabase plan or clearing unused files.
        </p>
      ) : null}
    </Card>
  )
}
