import { User as UserIcon } from 'lucide-react'
import type { Artist } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import Card from '@/components/ui/Card'

export default function ArtistRoster({ artists }: { artists: Artist[] }) {
  if (artists.length === 0) {
    return (
      <Card className="px-6 py-10 text-center">
        <p className="text-sm text-ivory-dim">No artists have registered yet.</p>
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
              className="h-12 w-12 shrink-0 rounded-full border border-brass-dim/50 object-cover"
            />
          ) : (
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-brass-dim/50 bg-surface-raised">
              <UserIcon className="h-5 w-5 text-ivory-dim" />
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate font-medium text-ivory">{artist.name}</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ivory-faint">
              Joined {formatDate(artist.created_at)}
            </p>
          </div>
        </Card>
      ))}
    </div>
  )
}
