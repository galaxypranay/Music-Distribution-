'use client'

import { useEffect, useState } from 'react'
import { LogOut } from 'lucide-react'
import Logo from '@/components/Logo'
import AdminGate from '@/components/admin/AdminGate'
import ArtistRoster from '@/components/admin/ArtistRoster'
import SubmissionsTable from '@/components/admin/SubmissionsTable'
import { useBrowserStorageValue } from '@/lib/use-browser-storage-value'
import { removeStorageItem, setStorageItem } from '@/lib/browser-storage'
import type { Artist, Release, ReleaseStatus } from '@/lib/types'

const PASSCODE_KEY = 'spilrix_admin_passcode'

export default function AdminPage() {
  // undefined = not yet resolved (brief, pre-hydration) · null = no stored passcode
  const passcode = useBrowserStorageValue('sessionStorage', PASSCODE_KEY)

  // null = "not loaded yet" — distinct from an empty array, which means "loaded, zero rows"
  const [artists, setArtists] = useState<Artist[] | null>(null)
  const [releases, setReleases] = useState<Release[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!passcode) return

    let isMounted = true

    async function loadAdminData() {
      try {
        const headers = { 'x-admin-passcode': passcode as string }
        const [artistsRes, releasesRes] = await Promise.all([
          fetch('/api/admin/artists', { headers }),
          fetch('/api/admin/releases', { headers }),
        ])

        if (!artistsRes.ok || !releasesRes.ok) {
          removeStorageItem('sessionStorage', PASSCODE_KEY)
          throw new Error('Session expired. Enter the passcode again.')
        }

        const artistsResult = await artistsRes.json()
        const releasesResult = await releasesRes.json()

        if (isMounted) {
          setArtists(artistsResult.artists ?? [])
          setReleases(releasesResult.releases ?? [])
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Could not load admin data.')
        }
      }
    }

    loadAdminData()

    return () => {
      isMounted = false
    }
  }, [passcode])

  function handleGateSuccess(code: string) {
    setStorageItem('sessionStorage', PASSCODE_KEY, code)
  }

  function handleSignOut() {
    removeStorageItem('sessionStorage', PASSCODE_KEY)
    setArtists(null)
    setReleases(null)
  }

  function handleStatusChange(releaseId: string, status: ReleaseStatus) {
    setReleases((prev) =>
      prev
        ? prev.map((release) => (release.id === releaseId ? { ...release, status } : release))
        : prev
    )
  }

  if (passcode === undefined) {
    return <div className="min-h-screen bg-void" />
  }

  if (!passcode) {
    return <AdminGate onSuccess={handleGateSuccess} />
  }

  const isLoading = artists === null || releases === null

  return (
    <main className="min-h-screen bg-void px-6 py-10 md:px-10">
      <header className="mx-auto mb-10 flex max-w-6xl items-center justify-between">
        <div>
          <Logo />
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.25em] text-brass-dim">
            Control room
          </p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-ivory-dim transition-colors hover:border-rust/50 hover:text-rust-bright"
        >
          <LogOut className="h-3.5 w-3.5" />
          Lock panel
        </button>
      </header>

      <div className="mx-auto max-w-6xl space-y-12">
        {error ? (
          <p className="rounded-md border border-rust/40 bg-rust/10 px-4 py-3 text-sm text-rust-bright">
            {error}
          </p>
        ) : null}

        {isLoading ? (
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-ivory-faint">
            Loading…
          </p>
        ) : (
          <>
            <section>
              <h2 className="mb-4 font-display text-xl text-ivory">
                Registered artists
                <span className="ml-3 font-mono text-xs font-normal text-ivory-faint">
                  {artists.length}
                </span>
              </h2>
              <ArtistRoster artists={artists} />
            </section>

            <section>
              <h2 className="mb-4 font-display text-xl text-ivory">
                All submissions
                <span className="ml-3 font-mono text-xs font-normal text-ivory-faint">
                  {releases.length}
                </span>
              </h2>
              <SubmissionsTable
                releases={releases}
                passcode={passcode}
                onStatusChange={handleStatusChange}
              />
            </section>
          </>
        )}
      </div>
    </main>
  )
}
