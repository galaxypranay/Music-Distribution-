'use client'

import { useEffect, useMemo, useState } from 'react'
import { LogOut, Search } from 'lucide-react'
import Logo from '@/components/Logo'
import AdminGate from '@/components/admin/AdminGate'
import ArtistRoster, { type ArtistReleaseCounts } from '@/components/admin/ArtistRoster'
import ArtistDetailPanel from '@/components/admin/ArtistDetailPanel'
import SubmissionsTable from '@/components/admin/SubmissionsTable'
import StorageUsageMeter from '@/components/admin/StorageUsageMeter'
import { cn } from '@/lib/utils'
import { useBrowserStorageValue } from '@/lib/use-browser-storage-value'
import { removeStorageItem, setStorageItem } from '@/lib/browser-storage'
import type { Artist, Release, ReleaseStatus, StorageUsage } from '@/lib/types'

const PASSCODE_KEY = 'spilrix_admin_passcode'

type StatusFilter = 'All' | ReleaseStatus

const STATUS_FILTERS: StatusFilter[] = ['All', 'Pending Review', 'Approved', 'Rejected']

export default function AdminPage() {
  // undefined = not yet resolved (brief, pre-hydration) · null = no stored passcode
  const passcode = useBrowserStorageValue('sessionStorage', PASSCODE_KEY)

  // null = "not loaded yet" — distinct from an empty array, which means "loaded, zero rows"
  const [artists, setArtists] = useState<Artist[] | null>(null)
  const [releases, setReleases] = useState<Release[] | null>(null)
  // Storage usage fails soft: an older Supabase project that hasn't re-run
  // schema.sql yet just won't show the meter, rather than breaking the page.
  const [storageUsage, setStorageUsage] = useState<StorageUsage | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [artistSearch, setArtistSearch] = useState('')
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')

  useEffect(() => {
    if (!passcode) return

    let isMounted = true

    async function loadAdminData() {
      try {
        const headers = { 'x-admin-passcode': passcode as string }
        const [artistsRes, releasesRes, storageRes] = await Promise.all([
          fetch('/api/admin/artists', { headers }),
          fetch('/api/admin/releases', { headers }),
          fetch('/api/admin/storage', { headers }),
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

        if (storageRes.ok && isMounted) {
          const storageResult = await storageRes.json()
          setStorageUsage(storageResult as StorageUsage)
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

  // Per-artist release counts, recomputed whenever the releases list changes.
  const countsByArtistId = useMemo(() => {
    const counts: Record<string, ArtistReleaseCounts> = {}

    for (const release of releases ?? []) {
      const entry = counts[release.artist_id] ?? {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
      }

      entry.total += 1
      if (release.status === 'Pending Review') entry.pending += 1
      if (release.status === 'Approved') entry.approved += 1
      if (release.status === 'Rejected') entry.rejected += 1

      counts[release.artist_id] = entry
    }

    return counts
  }, [releases])

  const filteredArtists = useMemo(() => {
    if (!artists) return []
    const query = artistSearch.trim().toLowerCase()
    if (!query) return artists
    return artists.filter((artist) => artist.name.toLowerCase().includes(query))
  }, [artists, artistSearch])

  const selectedArtist = artists?.find((artist) => artist.id === selectedArtistId) ?? null

  const selectedArtistReleases = useMemo(
    () => (releases ?? []).filter((release) => release.artist_id === selectedArtistId),
    [releases, selectedArtistId]
  )

  const filteredReleases = useMemo(() => {
    if (!releases) return []
    if (statusFilter === 'All') return releases
    return releases.filter((release) => release.status === statusFilter)
  }, [releases, statusFilter])

  function handleGateSuccess(code: string) {
    setStorageItem('sessionStorage', PASSCODE_KEY, code)
  }

  function handleSignOut() {
    removeStorageItem('sessionStorage', PASSCODE_KEY)
    setArtists(null)
    setReleases(null)
    setSelectedArtistId(null)
  }

  function handleStatusChange(releaseId: string, status: ReleaseStatus) {
    setReleases((prev) =>
      prev
        ? prev.map((release) => (release.id === releaseId ? { ...release, status } : release))
        : prev
    )
  }

  function handleSelectArtist(artistId: string) {
    setSelectedArtistId((current) => (current === artistId ? null : artistId))
  }

  if (passcode === undefined) {
    return <div className="min-h-screen bg-paper" />
  }

  if (!passcode) {
    return <AdminGate onSuccess={handleGateSuccess} />
  }

  const isLoading = artists === null || releases === null

  return (
    <main className="min-h-screen bg-paper px-6 py-10 md:px-10">
      <header className="mx-auto mb-10 flex max-w-6xl items-center justify-between border-b-[3px] border-ink pb-6">
        <div>
          <Logo />
          <p className="mt-3 inline-block -rotate-2 bg-canary px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ink">
            Control room
          </p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="brutal-press flex items-center gap-2 rounded-lg border-[3px] border-ink bg-white px-4 py-2.5 text-sm font-bold uppercase text-ink shadow-[3px_3px_0_0_var(--color-ink)] transition-colors hover:bg-punch hover:text-white"
        >
          <LogOut className="h-3.5 w-3.5" />
          Lock panel
        </button>
      </header>

      <div className="mx-auto max-w-6xl space-y-12">
        {storageUsage ? (
          <div className="max-w-sm">
            <StorageUsageMeter usage={storageUsage} />
          </div>
        ) : null}

        {error ? (
          <p className="rounded-lg border-[2.5px] border-ink bg-punch px-4 py-3 text-sm font-bold text-white shadow-[3px_3px_0_0_var(--color-ink)]">
            {error}
          </p>
        ) : null}

        {isLoading ? (
          <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-ink-faint">
            Loading…
          </p>
        ) : (
          <>
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="font-display text-xl uppercase text-ink">
                  Registered artists
                  <span className="ml-3 font-mono text-xs font-normal text-ink-faint">
                    {artists.length}
                  </span>
                </h2>

                <div className="relative w-full max-w-xs">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                  <input
                    type="text"
                    value={artistSearch}
                    onChange={(e) => setArtistSearch(e.target.value)}
                    placeholder="Search artists…"
                    className="w-full rounded-lg border-[3px] border-ink bg-white py-2 pl-9 pr-3 text-sm font-medium text-ink placeholder:text-ink-faint focus:shadow-[3px_3px_0_0_var(--color-cobalt)] focus:outline-none"
                  />
                </div>
              </div>

              <ArtistRoster
                artists={filteredArtists}
                countsByArtistId={countsByArtistId}
                selectedArtistId={selectedArtistId}
                onSelectArtist={handleSelectArtist}
              />

              {selectedArtist ? (
                <ArtistDetailPanel
                  artist={selectedArtist}
                  releases={selectedArtistReleases}
                  counts={
                    countsByArtistId[selectedArtist.id] ?? {
                      total: 0,
                      pending: 0,
                      approved: 0,
                      rejected: 0,
                    }
                  }
                  passcode={passcode}
                  onStatusChange={handleStatusChange}
                  onClose={() => setSelectedArtistId(null)}
                />
              ) : null}
            </section>

            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="font-display text-xl uppercase text-ink">
                  All submissions
                  <span className="ml-3 font-mono text-xs font-normal text-ink-faint">
                    {releases.length}
                  </span>
                </h2>

                <div className="flex flex-wrap gap-2">
                  {STATUS_FILTERS.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setStatusFilter(filter)}
                      className={cn(
                        'rounded-md border-[2.5px] border-ink px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] transition-colors',
                        statusFilter === filter
                          ? 'bg-ink text-paper'
                          : 'bg-white text-ink hover:bg-paper'
                      )}
                    >
                      {filter === 'Pending Review' ? 'Pending' : filter}
                    </button>
                  ))}
                </div>
              </div>

              <SubmissionsTable
                releases={filteredReleases}
                passcode={passcode}
                onStatusChange={handleStatusChange}
                emptyMessage={
                  statusFilter === 'All'
                    ? 'No submissions yet.'
                    : `No submissions with status "${statusFilter}".`
                }
              />
            </section>
          </>
        )}
      </div>
    </main>
  )
}
