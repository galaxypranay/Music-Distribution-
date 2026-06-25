import { LifeBuoy, User as UserIcon } from 'lucide-react'
import type { Artist } from '@/lib/types'
import { formatDate, cn } from '@/lib/utils'
import Card from '@/components/ui/Card'

export interface ArtistReleaseCounts {
  total: number
  pending: number
  approved: number
  rejected: number
}

export interface ArtistTicketCounts {
  total: number
  open: number
}

interface ArtistRosterProps {
  artists: Artist[]
  countsByArtistId: Record<string, ArtistReleaseCounts>
  ticketCountsByArtistId: Record<string, ArtistTicketCounts>
  selectedArtistId: string | null
  onSelectArtist: (artistId: string) => void
}

export default function ArtistRoster({
  artists,
  countsByArtistId,
  ticketCountsByArtistId,
  selectedArtistId,
  onSelectArtist,
}: ArtistRosterProps) {
  if (artists.length === 0) {
    return (
      <Card className="px-6 py-10 text-center">
        <p className="text-sm font-medium text-ink-soft">No artists match that search.</p>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {artists.map((artist) => {
        const counts = countsByArtistId[artist.id] ?? {
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
        }
        const ticketCounts = ticketCountsByArtistId[artist.id] ?? { total: 0, open: 0 }
        const isSelected = artist.id === selectedArtistId

        return (
          <button
            key={artist.id}
            type="button"
            onClick={() => onSelectArtist(artist.id)}
            aria-pressed={isSelected}
            className={cn(
              'brutal-press flex flex-col gap-3 rounded-xl border-[3px] border-ink bg-white p-4 text-left transition-shadow',
              isSelected
                ? 'shadow-[5px_5px_0_0_var(--color-cobalt)]'
                : 'shadow-[5px_5px_0_0_var(--color-ink)]'
            )}
          >
            <div className="flex items-center gap-4">
              {artist.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={artist.photo_url}
                  alt={artist.name}
                  className="h-12 w-12 shrink-0 rounded-md border-[2.5px] border-ink object-cover"
                />
              ) : (
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border-[2.5px] border-ink bg-canary">
                  <UserIcon className="h-5 w-5 text-ink" />
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate font-bold text-ink">{artist.name}</p>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-ink-faint">
                  Joined {formatDate(artist.created_at)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-md border-2 border-ink bg-paper px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-ink">
                {counts.total} {counts.total === 1 ? 'release' : 'releases'}
              </span>
              {counts.pending > 0 ? (
                <span className="stamp-rotate rounded-md border-2 border-ink bg-canary px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-ink">
                  {counts.pending} pending
                </span>
              ) : null}
              {ticketCounts.open > 0 ? (
                <span className="stamp-rotate flex items-center gap-1 rounded-md border-2 border-ink bg-cobalt px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-white">
                  <LifeBuoy className="h-3 w-3" />
                  {ticketCounts.open} open
                </span>
              ) : null}
            </div>
          </button>
        )
      })}
    </div>
  )
}
