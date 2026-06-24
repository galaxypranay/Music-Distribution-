'use client'

import { useEffect, useState } from 'react'
import { useArtistSession } from '@/components/dashboard/SessionProvider'
import { formatDate } from '@/lib/utils'
import type { Release } from '@/lib/types'
import Card from '@/components/ui/Card'
import StatusBadge from '@/components/StatusBadge'

export default function StatusPage() {
  const { artist } = useArtistSession()
  const [releases, setReleases] = useState<Release[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadReleases() {
      try {
        const response = await fetch(`/api/releases?artist_id=${artist.id}`)
        const result = await response.json()

        if (!response.ok) throw new Error(result.error ?? 'Could not load releases.')
        if (isMounted) setReleases(result.releases ?? [])
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Could not load releases.')
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadReleases()
    return () => {
      isMounted = false
    }
  }, [artist.id])

  return (
    <div className="mx-auto max-w-4xl animate-fade-up">
      <header className="mb-8">
        <p className="inline-block -rotate-2 bg-cobalt px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white">
          Catalog
        </p>
        <h1 className="mt-3 font-display text-3xl uppercase text-ink">Submission status</h1>
        <p className="mt-2 text-sm font-medium text-ink-soft">
          Every release you&apos;ve submitted, and where it stands.
        </p>
      </header>

      {error ? (
        <p className="mb-6 rounded-lg border-[2.5px] border-ink bg-punch px-4 py-3 text-sm font-bold text-white shadow-[3px_3px_0_0_var(--color-ink)]">
          {error}
        </p>
      ) : null}

      {isLoading ? (
        <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-ink-faint">
          Loading…
        </p>
      ) : releases.length === 0 ? (
        <Card className="px-6 py-12 text-center">
          <p className="font-display text-lg uppercase text-ink">No submissions yet</p>
          <p className="mt-2 text-sm font-medium text-ink-soft">
            Upload your first release to see it tracked here.
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b-[3px] border-ink bg-canary">
                <th className="px-5 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink">
                  Song title
                </th>
                <th className="px-5 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink">
                  Genre
                </th>
                <th className="px-5 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink">
                  Release date
                </th>
                <th className="px-5 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {releases.map((release) => (
                <tr key={release.id} className="border-b-[2.5px] border-ink last:border-0">
                  <td className="px-5 py-4 font-bold text-ink">{release.song_title}</td>
                  <td className="px-5 py-4 font-medium text-ink-soft">{release.genre ?? '—'}</td>
                  <td className="px-5 py-4 font-medium text-ink-soft">{formatDate(release.release_date)}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={release.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}
