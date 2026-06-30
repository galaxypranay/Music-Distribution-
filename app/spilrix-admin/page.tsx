'use client'

import { useEffect, useMemo, useState } from 'react'
import { LogOut, Search } from 'lucide-react'
import Logo from '@/components/Logo'
import AdminGate from '@/components/admin/AdminGate'
import ArtistRoster, {
  type ArtistReleaseCounts,
  type ArtistTicketCounts,
} from '@/components/admin/ArtistRoster'
import ArtistDetailPanel from '@/components/admin/ArtistDetailPanel'
import StorageUsageMeter from '@/components/admin/StorageUsageMeter'
import { useBrowserStorageValue } from '@/lib/use-browser-storage-value'
import { removeStorageItem, setStorageItem } from '@/lib/browser-storage'
import type { Artist, ReleaseWithTracks, StorageUsage, Ticket, TicketStatus } from '@/lib/types'

const PASSCODE_KEY = 'spilrix_admin_passcode'

export default function AdminPage() {
  // undefined = not yet resolved (brief, pre-hydration) · null = no stored passcode
  const passcode = useBrowserStorageValue('sessionStorage', PASSCODE_KEY)

  // null = "not loaded yet" — distinct from an empty array, which means "loaded, zero rows"
  const [artists, setArtists] = useState<Artist[] | null>(null)
  const [releases, setReleases] = useState<ReleaseWithTracks[] | null>(null)
  const [tickets, setTickets] = useState<Ticket[] | null>(null)
  // Storage usage fails soft: an older Supabase project that hasn't re-run
  // schema.sql yet just won't show the meter, rather than breaking the page.
  const [storageUsage, setStorageUsage] = useState<StorageUsage | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [artistSearch, setArtistSearch] = useState('')
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null)

  useEffect(() => {
    if (!passcode) return

    let isMounted = true

    async function loadAdminData() {
      try {
        const headers = { 'x-admin-passcode': passcode as string }
        const [artistsRes, releasesRes, ticketsRes, storageRes] = await Promise.all([
          fetch('/api/admin/artists', { headers }),
          fetch('/api/admin/releases', { headers }),
          fetch('/api/admin/tickets', { headers }),
          fetch('/api/admin/storage', { headers }),
        ])

        if (!artistsRes.ok || !releasesRes.ok || !ticketsRes.ok) {
          removeStorageItem('sessionStorage', PASSCODE_KEY)
          throw new Error('Session expired. Enter the passcode again.')
        }

        const artistsResult = await artistsRes.json()
        const releasesResult = await releasesRes.json()
        const ticketsResult = await ticketsRes.json()

        if (isMounted) {
          setArtists(artistsResult.artists ?? [])
          setReleases(releasesResult.releases ?? [])
          setTickets(ticketsResult.tickets ?? [])
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
        sent: 0,
        live: 0,
        rejected: 0,
      }

      entry.total += 1
      if (release.status === 'Pending Review') entry.pending += 1
      if (release.status === 'Approved') entry.approved += 1
      if (release.status === 'Sent to Platforms') entry.sent += 1
      if (release.status === 'Live') entry.live += 1
      if (release.status === 'Rejected') entry.rejected += 1

      counts[release.artist_id] = entry
    }

    return counts
  }, [releases])

  // Per-artist ticket counts, recomputed whenever the tickets list changes.
  const ticketCountsByArtistId = useMemo(() => {
    const counts: Record<string, ArtistTicketCounts> = {}

    for (const ticket of tickets ?? []) {
      const entry = counts[ticket.artist_id] ?? { total: 0, open: 0 }
      entry.total += 1
      if (ticket.status === 'Open') entry.open += 1
      counts[ticket.artist_id] = entry
    }

    return counts
  }, [tickets])

  const filteredArtists = useMemo(() => {
    if (!artists) return []
    const query = artistSearch.trim().toLowerCase()
    if (!query) return artists
    return artists.filter(
      (artist) =>
        artist.name.toLowerCase().includes(query) || String(artist.display_id).includes(query)
    )
  }, [artists, artistSearch])

  const selectedArtist = artists?.find((artist) => artist.id === selectedArtistId) ?? null

  const selectedArtistReleases = useMemo(
    () => (releases ?? []).filter((release) => release.artist_id === selectedArtistId),
    [releases, selectedArtistId]
  )

  const selectedArtistTickets = useMemo(
    () => (tickets ?? []).filter((ticket) => ticket.artist_id === selectedArtistId),
    [tickets, selectedArtistId]
  )

  function handleGateSuccess(code: string) {
    setStorageItem('sessionStorage', PASSCODE_KEY, code)
  }

  function handleSignOut() {
    removeStorageItem('sessionStorage', PASSCODE_KEY)
    setArtists(null)
    setReleases(null)
    setTickets(null)
    setSelectedArtistId(null)
  }

  function handleReleaseChange(updatedRelease: ReleaseWithTracks) {
    setReleases((prev) =>
      prev ? prev.map((release) => (release.id === updatedRelease.id ? updatedRelease : release)) : prev
    )
  }

  function handleTicketStatusChange(ticketId: string, status: TicketStatus) {
    setTickets((prev) =>
      prev ? prev.map((ticket) => (ticket.id === ticketId ? { ...ticket, status } : ticket)) : prev
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

  const isLoading = artists === null || releases === null || tickets === null

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
                  placeholder="Search by name or UID…"
                  className="w-full rounded-lg border-[3px] border-ink bg-white py-2 pl-9 pr-3 text-sm font-medium text-ink placeholder:text-ink-faint focus:shadow-[3px_3px_0_0_var(--color-cobalt)] focus:outline-none"
                />
              </div>
            </div>

            <ArtistRoster
              artists={filteredArtists}
              countsByArtistId={countsByArtistId}
              ticketCountsByArtistId={ticketCountsByArtistId}
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
                    sent: 0,
                    live: 0,
                    rejected: 0,
                  }
                }
                tickets={selectedArtistTickets}
                ticketCounts={ticketCountsByArtistId[selectedArtist.id] ?? { total: 0, open: 0 }}
                passcode={passcode}
                onReleaseChange={handleReleaseChange}
                onTicketStatusChange={handleTicketStatusChange}
                onClose={() => setSelectedArtistId(null)}
              />
            ) : null}
          </section>
        )}
      </div>
    </main>
  )
}
