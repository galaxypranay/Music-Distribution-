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
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-brass-dim">
          Catalog
        </p>
        <h1 className="mt-2 font-display text-3xl text-ivory">Submission status</h1>
        <p className="mt-2 text-sm text-ivory-dim">
          Every release you&apos;ve submitted, and where it stands.
        </p>
      </header>

      {error ? (
        <p className="rounded-md border border-rust/40 bg-rust/10 px-4 py-3 text-sm text-rust-bright">
          {error}
        </p>
      ) : null}

      {isLoading ? (
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-ivory-faint">
          Loading…
        </p>
      ) : releases.length === 0 ? (
        <Card className="px-6 py-12 text-center">
          <p className="font-display text-lg text-ivory">No submissions yet</p>
          <p className="mt-2 text-sm text-ivory-dim">
            Upload your first release to see it tracked here.
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ivory-faint">
                  Song title
                </th>
                <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ivory-faint">
                  Genre
                </th>
                <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ivory-faint">
                  Release date
                </th>
                <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ivory-faint">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {releases.map((release) => (
                <tr key={release.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-4 font-medium text-ivory">{release.song_title}</td>
                  <td className="px-5 py-4 text-ivory-dim">{release.genre ?? '—'}</td>
                  <td className="px-5 py-4 text-ivory-dim">{formatDate(release.release_date)}</td>
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
