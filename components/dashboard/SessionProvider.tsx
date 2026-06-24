'use client'

import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { clearSession, parseSession, SESSION_STORAGE_KEY, type ArtistSession } from '@/lib/session'
import { useBrowserStorageValue } from '@/lib/use-browser-storage-value'

interface SessionContextValue {
  artist: ArtistSession
  signOut: () => void
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function DashboardSessionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const raw = useBrowserStorageValue('localStorage', SESSION_STORAGE_KEY)
  // undefined = not yet resolved (brief, pre-hydration) · null = definitely no session
  const artist = raw === undefined ? undefined : parseSession(raw)

  useEffect(() => {
    // A navigation call, not a setState call — this is exactly what effects are for.
    if (artist === null) router.replace('/')
  }, [artist, router])

  function signOut() {
    clearSession()
    router.replace('/')
  }

  if (!artist) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-void">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass-dim">
          Loading dashboard…
        </p>
      </div>
    )
  }

  return (
    <SessionContext.Provider value={{ artist, signOut }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useArtistSession(): SessionContextValue {
  const ctx = useContext(SessionContext)
  if (!ctx) {
    throw new Error('useArtistSession must be used within DashboardSessionProvider')
  }
  return ctx
}
