'use client'

import { useEffect, useRef } from 'react'
import { User as UserIcon, X } from 'lucide-react'
import type { Artist, Release, ReleaseStatus } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import type { ArtistReleaseCounts } from '@/components/admin/ArtistRoster'
import Card from '@/components/ui/Card'
import SubmissionsTable from '@/components/admin/SubmissionsTable'

interface ArtistDetailPanelProps {
  artist: Artist
  releases: Release[]
  counts: ArtistReleaseCounts
  passcode: string
  onStatusChange: (releaseId: string, status: ReleaseStatus) => void
  onClose: () => void
}

export default function ArtistDetailPanel({
  artist,
  releases,
  counts,
  passcode,
  onStatusChange,
  onClose,
}: ArtistDetailPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // A scroll call, not a setState call — bringing a newly opened panel
    // into view is exactly the kind of external-system side effect
    // useEffect exists for.
    panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [artist.id])

  return (
    <Card
      ref={panelRef}
      className="animate-fade-up overflow-hidden shadow-[6px_6px_0_0_var(--color-cobalt)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-[3px] border-ink bg-cobalt px-6 py-5">
        <div className="flex items-center gap-4">
          {artist.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={artist.photo_url}
              alt={artist.name}
              className="h-12 w-12 shrink-0 rounded-md border-[2.5px] border-ink object-cover"
            />
          ) : (
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border-[2.5px] border-ink bg-white">
              <UserIcon className="h-5 w-5 text-ink" />
            </span>
          )}
          <div>
            <p className="font-display text-lg uppercase text-white">{artist.name}</p>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/80">
              Joined {formatDate(artist.created_at)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <CountChip label="Total" value={counts.total} fillClassName="bg-white text-ink" />
            <CountChip label="Pending" value={counts.pending} fillClassName="bg-canary text-ink" />
            <CountChip label="Approved" value={counts.approved} fillClassName="bg-lime text-ink" />
            <CountChip label="Rejected" value={counts.rejected} fillClassName="bg-punch text-white" />
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close artist panel"
            className="brutal-press flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-[2.5px] border-ink bg-white text-ink shadow-[2px_2px_0_0_var(--color-ink)] transition-colors hover:bg-punch hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <SubmissionsTable
          releases={releases}
          passcode={passcode}
          onStatusChange={onStatusChange}
          showArtistColumn={false}
          emptyMessage={`${artist.name} hasn't submitted anything yet.`}
        />
      </div>
    </Card>
  )
}

function CountChip({
  label,
  value,
  fillClassName,
}: {
  label: string
  value: number
  fillClassName: string
}) {
  return (
    <span
      className={`rounded-md border-2 border-ink px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.08em] ${fillClassName}`}
    >
      {value} {label}
    </span>
  )
}
