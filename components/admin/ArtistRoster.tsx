import { User as UserIcon } from 'lucide-react'
import type { Artist } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import Card from '@/components/ui/Card'

export default function ArtistRoster({ artists }: { artists: Artist[] }) {
  if (artists.length === 0) {
    return (
      <Card className="px-6 py-10 text-center">
        <p className="text-sm font-medium text-ink-soft">No artists have registered yet.</p>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {artists.map((artist) => (
        <Card key={artist.id} className="flex items-center gap-4 p-4">
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
        </Card>
      ))}
    </div>
  )
}
