'use client'

import { LogOut, User as UserIcon } from 'lucide-react'
import Logo from '@/components/Logo'
import { useArtistSession } from '@/components/dashboard/SessionProvider'

export default function TopNav() {
  const { artist, signOut } = useArtistSession()

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-line bg-void/95 px-6 backdrop-blur-sm md:px-10">
      <Logo />

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 rounded-full border border-line bg-surface py-1.5 pl-1.5 pr-4">
          {artist.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={artist.photo_url}
              alt={artist.name}
              className="h-9 w-9 rounded-full border border-brass-dim/60 object-cover"
            />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-brass-dim/60 bg-surface-raised">
              <UserIcon className="h-4 w-4 text-ivory-dim" />
            </span>
          )}
          <span className="text-sm font-medium text-ivory">{artist.name}</span>
        </div>

        <button
          type="button"
          onClick={signOut}
          aria-label="Sign out"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ivory-dim transition-colors hover:border-rust/50 hover:text-rust-bright"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
