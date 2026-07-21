'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  BarChart3,
  Disc3,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Search,
  Settings,
  Users,
} from 'lucide-react'
import Logo from '@/components/Logo'
import AdminGate from '@/components/admin/AdminGate'
import ArtistRoster, {
  type ArtistReleaseCounts,
  type ArtistTicketCounts,
} from '@/components/admin/ArtistRoster'
import ArtistDetailPanel from '@/components/admin/ArtistDetailPanel'
import StorageUsageMeter from '@/components/admin/StorageUsageMeter'
import AdminOverview from '@/components/admin/AdminOverview'
import ActivityLogsPanel from '@/components/admin/ActivityLogsPanel'
import AdminSettingsPanel from '@/components/admin/AdminSettingsPanel'
import ReleaseManager from '@/components/admin/ReleaseManager'
import TicketsList from '@/components/admin/TicketsList'
import { cn } from '@/lib/utils'
import { useBrowserStorageValue } from '@/lib/use-browser-storage-value'
import { removeStorageItem, setStorageItem } from '@/lib/browser-storage'
import type {
  ActivityLog,
  AppSettings,
  Artist,
  ReleaseWithTracks,
  StorageUsage,
  TicketWithMessages,
  TicketMessage,
  TicketStatus,
} from '@/lib/types'

const PASSCODE_KEY = 'spilrix_admin_passcode'

type AdminTab = 'overview' | 'artists' | 'releases' | 'tickets' | 'logs' | 'settings'

const ADMIN_TABS: { id: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'artists', label: 'Artists', icon: Users },
  { id: 'releases', label: 'Releases', icon: Disc3 },
  { id: 'tickets', label: 'Tickets', icon: LifeBuoy },
  { id: 'logs', label: 'Activity', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const RELEASE_FILTERS = [
  'All',
  'Pending Review',
  'Needs Changes',
  'Approved',
  'Sent to Platforms',
  'Live',
  'Rejected',
] as const

const TICKET_FILTERS = ['All', 'Open', 'Closed'] as const

interface OverviewData {
  stats: {
    totalArtists: number
    totalReleases: number
    pendingReleases: number
    liveReleases: number
    rejectedReleases: number
    openTickets: number
  }
  recentReleases: {
    id: string
    title: string
    release_type: string
    artist_name: string
    status: ReleaseWithTracks['status']
    cover_art_url: string | null
    created_at: string
  }[]
}

export default function AdminPage() {
  const passcode = useBrowserStorageValue('sessionStorage', PASSCODE_KEY)

  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [artists, setArtists] = useState<Artist[] | null>(null)
  const [releases, setReleases] = useState<ReleaseWithTracks[] | null>(null)
  const [tickets, setTickets] = useState<TicketWithMessages[] | null>(null)
  const [storageUsage, setStorageUsage] = useState<StorageUsage | null>(null)
  const [overview, setOverview] = useState<OverviewData | null>(null)
  const [activityLogs, setActivityLogs] = useState<ActivityLog[] | null>(null)
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [artistSearch, setArtistSearch] = useState('')
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null)
  const [releaseSearch, setReleaseSearch] = useState('')
  const [releaseFilter, setReleaseFilter] =
    useState<(typeof RELEASE_FILTERS)[number]>('All')
  const [ticketFilter, setTicketFilter] =
    useState<(typeof TICKET_FILTERS)[number]>('All')

  useEffect(() => {
    if (!passcode) return

    let isMounted = true

    async function loadAdminData() {
      try {
        const headers = { 'x-admin-passcode': passcode as string }

        const [
          artistsRes,
          releasesRes,
          ticketsRes,
          storageRes,
          overviewRes,
          logsRes,
          settingsRes,
        ] = await Promise.all([
          fetch('/api/admin/artists', { headers }),
          fetch('/api/admin/releases', { headers }),
          fetch('/api/admin/tickets', { headers }),
          fetch('/api/admin/storage', { headers }),
          fetch('/api/admin/overview', { headers }),
          fetch('/api/admin/activity-logs', { headers }),
          fetch('/api/admin/settings', { headers }),
        ])

        if (!artistsRes.ok || !releasesRes.ok || !ticketsRes.ok) {
          removeStorageItem('sessionStorage', PASSCODE_KEY)
          throw new Error('Session expired. Enter the passcode again.')
        }

        const [
          artistsResult,
          releasesResult,
          ticketsResult,
        ] = await Promise.all([
          artistsRes.json(),
          releasesRes.json(),
          ticketsRes.json(),
        ])

        if (isMounted) {
          setArtists(artistsResult.artists ?? [])
          setReleases(releasesResult.releases ?? [])
          setTickets(ticketsResult.tickets ?? [])
          setError(null)
        }

        if (storageRes.ok && isMounted) {
          setStorageUsage((await storageRes.json()) as StorageUsage)
        }

        if (overviewRes.ok && isMounted) {
          setOverview(await overviewRes.json())
        }

        if (logsRes.ok && isMounted) {
          const logsResult = await logsRes.json()
          setActivityLogs(logsResult.logs ?? [])
        }

        if (settingsRes.ok && isMounted) {
          const settingsResult = await settingsRes.json()
          setAppSettings(settingsResult.settings as AppSettings)
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

  const countsByArtistId = useMemo(() => {
    const counts: Record<string, ArtistReleaseCounts> = {}

    for (const release of releases ?? []) {
      const entry = counts[release.artist_id] ?? {
        total: 0, pending: 0, approved: 0, sent: 0, live: 0, rejected: 0,
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
        artist.name.toLowerCase().includes(query) ||
        String(artist.display_id).includes(query)
    )
  }, [artists, artistSearch])

  const filteredReleases = useMemo(() => {
    let list = releases ?? []
    if (releaseFilter !== 'All') {
      list = list.filter((r) => r.status === releaseFilter)
    }
    const query = releaseSearch.trim().toLowerCase()
    if (query) {
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.artist_name.toLowerCase().includes(query)
      )
    }
    return list
  }, [releases, releaseFilter, releaseSearch])

  const filteredTickets = useMemo(() => {
    if (ticketFilter === 'All') return tickets ?? []
    return (tickets ?? []).filter((t) => t.status === ticketFilter)
  }, [tickets, ticketFilter])

  const selectedArtist = artists?.find((a) => a.id === selectedArtistId) ?? null

  const selectedArtistReleases = useMemo(
    () => (releases ?? []).filter((r) => r.artist_id === selectedArtistId),
    [releases, selectedArtistId]
  )

  const selectedArtistTickets = useMemo(
    () => (tickets ?? []).filter((t) => t.artist_id === selectedArtistId),
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
    setOverview(null)
    setActivityLogs(null)
    setAppSettings(null)
    setSelectedArtistId(null)
  }

  function handleReleaseChange(updatedRelease: ReleaseWithTracks) {
    setReleases((prev) =>
      prev ? prev.map((r) => (r.id === updatedRelease.id ? updatedRelease : r)) : prev
    )
  }

  function handleTicketStatusChange(ticketId: string, status: TicketStatus) {
    setTickets((prev) =>
      prev ? prev.map((t) => (t.id === ticketId ? { ...t, status } : t)) : prev
    )
  }

  function handleNewMessage(ticketId: string, message: TicketMessage) {
    setTickets((prev) =>
      prev
        ? prev.map((t) =>
            t.id === ticketId
              ? { ...t, messages: [...(t.messages ?? []), message] }
              : t
          )
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

  const isLoading = artists === null || releases === null || tickets === null

  return (
    <main className="min-h-screen bg-paper">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b-[3px] border-ink bg-paper px-6 md:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between py-4">
          <div className="flex items-center gap-6">
            <div>
              <Logo />
              <p className="mt-1 inline-block -rotate-2 bg-canary px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-ink">
                Control room
              </p>
            </div>

            {/* Tab nav */}
            <nav className="hidden items-center gap-1 md:flex">
              {ADMIN_TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md border-[2.5px] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em] transition-all',
                    activeTab === id
                      ? 'border-ink bg-ink text-paper shadow-[2px_2px_0_0_var(--color-canary)]'
                      : 'border-transparent text-ink-soft hover:border-ink hover:bg-white'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="brutal-press flex items-center gap-2 rounded-lg border-[3px] border-ink bg-white px-4 py-2.5 text-sm font-bold uppercase text-ink shadow-[3px_3px_0_0_var(--color-ink)] transition-colors hover:bg-punch hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" />
            Lock
          </button>
        </div>

        {/* Mobile tab strip */}
        <nav className="flex border-t-[3px] border-ink md:hidden">
          {ADMIN_TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 border-r-[3px] border-ink py-2.5 text-[9px] font-bold uppercase last:border-r-0',
                activeTab === id ? 'bg-canary text-ink' : 'bg-paper text-ink-soft'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8 md:px-10">
        {error ? (
          <p className="mb-6 rounded-lg border-[2.5px] border-ink bg-punch px-4 py-3 text-sm font-bold text-white shadow-[3px_3px_0_0_var(--color-ink)]">
            {error}
          </p>
        ) : null}

        {isLoading ? (
          <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-ink-faint">
            Loading…
          </p>
        ) : (
          <>
            {/* Overview */}
            {activeTab === 'overview' ? (
              <div className="space-y-8">
                {storageUsage ? (
                  <div className="max-w-sm">
                    <StorageUsageMeter usage={storageUsage} />
                  </div>
                ) : null}
                {overview ? (
                  <AdminOverview
                    stats={overview.stats}
                    recentReleases={overview.recentReleases}
                  />
                ) : (
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-ink-faint">
                    Loading overview…
                  </p>
                )}
              </div>
            ) : null}

            {/* Artists */}
            {activeTab === 'artists' ? (
              <div className="space-y-4">
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
                        total: 0, pending: 0, approved: 0, sent: 0, live: 0, rejected: 0,
                      }
                    }
                    tickets={selectedArtistTickets}
                    ticketCounts={
                      ticketCountsByArtistId[selectedArtist.id] ?? { total: 0, open: 0 }
                    }
                    passcode={passcode}
                    onReleaseChange={handleReleaseChange}
                    onTicketStatusChange={handleTicketStatusChange}
                    onNewMessage={handleNewMessage}
                    onClose={() => setSelectedArtistId(null)}
                  />
                ) : null}
              </div>
            ) : null}

            {/* Releases (all releases incl. live-links management) */}
            {activeTab === 'releases' ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h2 className="font-display text-xl uppercase text-ink">
                    Releases
                    <span className="ml-3 font-mono text-xs font-normal text-ink-faint">
                      {filteredReleases.length}
                    </span>
                  </h2>

                  <div className="relative w-full max-w-xs">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                    <input
                      type="text"
                      value={releaseSearch}
                      onChange={(e) => setReleaseSearch(e.target.value)}
                      placeholder="Search by title or artist…"
                      className="w-full rounded-lg border-[3px] border-ink bg-white py-2 pl-9 pr-3 text-sm font-medium text-ink placeholder:text-ink-faint focus:shadow-[3px_3px_0_0_var(--color-cobalt)] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {RELEASE_FILTERS.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setReleaseFilter(filter)}
                      className={cn(
                        'brutal-press rounded-md border-[2.5px] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em] transition-colors',
                        releaseFilter === filter
                          ? 'border-ink bg-canary text-ink shadow-[2px_2px_0_0_var(--color-ink)]'
                          : 'border-ink bg-white text-ink-soft hover:bg-paper'
                      )}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <ReleaseManager
                  releases={filteredReleases}
                  passcode={passcode}
                  onReleaseChange={handleReleaseChange}
                  emptyMessage="No releases match this filter."
                />
              </div>
            ) : null}

            {/* Tickets (global, across all artists) */}
            {activeTab === 'tickets' ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h2 className="font-display text-xl uppercase text-ink">
                    Support tickets
                    <span className="ml-3 font-mono text-xs font-normal text-ink-faint">
                      {filteredTickets.length}
                    </span>
                  </h2>

                  <div className="flex flex-wrap gap-2">
                    {TICKET_FILTERS.map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setTicketFilter(filter)}
                        className={cn(
                          'brutal-press rounded-md border-[2.5px] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em] transition-colors',
                          ticketFilter === filter
                            ? 'border-ink bg-canary text-ink shadow-[2px_2px_0_0_var(--color-ink)]'
                            : 'border-ink bg-white text-ink-soft hover:bg-paper'
                        )}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                <TicketsList
                  tickets={filteredTickets}
                  passcode={passcode}
                  onStatusChange={handleTicketStatusChange}
                  onNewMessage={handleNewMessage}
                />
              </div>
            ) : null}

            {/* Activity Logs */}
            {activeTab === 'logs' ? (
              <div className="space-y-4">
                <h2 className="font-display text-xl uppercase text-ink">Activity log</h2>
                {activityLogs ? (
                  <ActivityLogsPanel logs={activityLogs} />
                ) : (
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-ink-faint">
                    Loading logs…
                  </p>
                )}
              </div>
            ) : null}

            {/* Settings */}
            {activeTab === 'settings' ? (
              <div className="max-w-2xl space-y-4">
                <h2 className="font-display text-xl uppercase text-ink">Admin settings</h2>
                {appSettings ? (
                  <AdminSettingsPanel
                    settings={appSettings}
                    passcode={passcode}
                    onSaved={(updated) => setAppSettings(updated)}
                  />
                ) : (
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-ink-faint">
                    Loading settings…
                  </p>
                )}
              </div>
            ) : null}
          </>
        )}
      </div>
    </main>
  )
}
