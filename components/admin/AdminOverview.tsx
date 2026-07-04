'use client'

import { Music2 } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import Card from '@/components/ui/Card'
import StatusBadge from '@/components/StatusBadge'
import type { ReleaseStatus } from '@/lib/types'

interface OverviewStats {
  totalArtists: number
  totalReleases: number
  pendingReleases: number
  liveReleases: number
  rejectedReleases: number
  openTickets: number
}

interface RecentRelease {
  id: string
  title: string
  release_type: string
  artist_name: string
  status: ReleaseStatus
  cover_art_url: string | null
  created_at: string
}

interface AdminOverviewProps {
  stats: OverviewStats
  recentReleases: RecentRelease[]
}

export default function AdminOverview({ stats, recentReleases }: AdminOverviewProps) {
  const STAT_CARDS = [
    { label: 'Artists', value: stats.totalArtists, fill: 'bg-white' },
    { label: 'Total releases', value: stats.totalReleases, fill: 'bg-white' },
    { label: 'Pending', value: stats.pendingReleases, fill: 'bg-canary text-ink' },
    { label: 'Live', value: stats.liveReleases, fill: 'bg-lime text-ink' },
    { label: 'Rejected', value: stats.rejectedReleases, fill: 'bg-punch text-white' },
    { label: 'Open tickets', value: stats.openTickets, fill: 'bg-cobalt text-white' },
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {STAT_CARDS.map(({ label, value, fill }) => (
          <div
            key={label}
            className={`rounded-xl border-[3px] border-ink p-4 shadow-[4px_4px_0_0_var(--color-ink)] ${fill}`}
          >
            <p className="font-display text-3xl">{value}</p>
            <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.08em] opacity-70">
              {label}
            </p>
          </div>
        ))}
      </div>

      {recentReleases.length > 0 ? (
        <div>
          <p className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink-faint">
            Recent uploads
          </p>
          <Card className="divide-y-[2.5px] divide-ink overflow-hidden">
            {recentReleases.map((release) => (
              <div key={release.id} className="flex items-center gap-4 p-4">
                {release.cover_art_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={release.cover_art_url}
                    alt={release.title}
                    className="h-10 w-10 shrink-0 rounded-md border-2 border-ink object-cover"
                  />
                ) : (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-2 border-ink bg-paper">
                    <Music2 className="h-4 w-4 text-ink-faint" />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-ink">{release.title}</p>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-ink-faint">
                    {release.release_type} · {release.artist_name} · {formatDateTime(release.created_at)}
                  </p>
                </div>
                <StatusBadge status={release.status} />
              </div>
            ))}
          </Card>
        </div>
      ) : null}
    </div>
  )
}
