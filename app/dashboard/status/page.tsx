'use client'

import { useEffect, useState } from 'react'
import { ExternalLink, Hourglass, Music2, RotateCcw } from 'lucide-react'
import { useArtistSession } from '@/components/dashboard/SessionProvider'
import ReleaseForm from '@/components/dashboard/ReleaseForm'
import { formatDate, formatDateTime } from '@/lib/utils'
import type { ReleaseWithTracks } from '@/lib/types'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import StatusBadge from '@/components/StatusBadge'

export default function StatusPage() {
  const { artist } = useArtistSession()
  const [releases, setReleases] = useState<ReleaseWithTracks[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [resubmittingId, setResubmittingId] = useState<string | null>(null)

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

  function handleResubmitSuccess() {
    setResubmittingId(null)
    setIsLoading(true)
    setError(null)
    fetch(`/api/releases?artist_id=${artist.id}`)
      .then((res) => res.json())
      .then((result) => setReleases(result.releases ?? []))
      .catch(() => setError('Resubmitted, but could not refresh the list. Reload the page.'))
      .finally(() => setIsLoading(false))
  }

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
        <div className="flex flex-col gap-5">
          {releases.map((release) =>
            resubmittingId === release.id ? (
              <div key={release.id}>
                <p className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-ink-faint">
                  Resubmitting &ldquo;{release.title}&rdquo;
                </p>
                <ReleaseForm
                  mode="resubmit"
                  initialRelease={release}
                  onSuccess={handleResubmitSuccess}
                  onCancel={() => setResubmittingId(null)}
                />
              </div>
            ) : (
              <Card key={release.id} className="overflow-hidden">
                <div className="flex flex-wrap items-start gap-4 p-5">
                  {release.cover_art_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={release.cover_art_url}
                      alt={release.title}
                      className="h-20 w-20 shrink-0 rounded-md border-[2.5px] border-ink object-cover"
                    />
                  ) : (
                    <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md border-[2.5px] border-ink bg-paper">
                      <Music2 className="h-7 w-7 text-ink-faint" />
                    </span>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-lg uppercase text-ink">{release.title}</p>
                      <span className="rounded-md border-2 border-ink bg-paper px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-ink">
                        {release.release_type}
                      </span>
                      <StatusBadge status={release.status} />
                    </div>
                    <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                      Release date: {formatDate(release.release_date)}
                    </p>

                    <ul className="mt-3 flex flex-col gap-1">
                      {release.tracks.map((track) => (
                        <li key={track.id} className="text-sm font-medium text-ink-soft">
                          {track.track_number}. {track.song_title}
                          {track.genre ? (
                            <span className="text-ink-faint"> — {track.genre}</span>
                          ) : null}
                        </li>
                      ))}
                    </ul>

                    {release.scheduled_deletion_at ? (
                      <p className="mt-3 flex items-start gap-2 rounded-md border-2 border-ink bg-punch px-3 py-2 text-sm font-bold text-white">
                        <Hourglass className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>
                          Scheduled for removal on {formatDateTime(release.scheduled_deletion_at)}.
                          {release.deletion_reason ? <> Reason: {release.deletion_reason}</> : null}
                        </span>
                      </p>
                    ) : null}

                    {release.status === 'Rejected' && release.rejection_reason ? (
                      <p className="mt-3 rounded-md border-2 border-ink bg-punch/10 px-3 py-2 text-sm font-medium text-ink">
                        <span className="font-bold text-punch">Why: </span>
                        {release.rejection_reason}
                      </p>
                    ) : null}

                    {release.status === 'Rejected' ? (
                      <Button
                        type="button"
                        variant="secondary"
                        className="mt-3"
                        onClick={() => setResubmittingId(release.id)}
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Resubmit
                      </Button>
                    ) : null}

                    {release.status === 'Live' ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {release.spotify_url ? (
                          <LiveLink href={release.spotify_url} label="Spotify" />
                        ) : null}
                        {release.apple_music_url ? (
                          <LiveLink href={release.apple_music_url} label="Apple Music" />
                        ) : null}
                        {release.youtube_url ? (
                          <LiveLink href={release.youtube_url} label="YouTube" />
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              </Card>
            )
          )}
        </div>
      )}
    </div>
  )
}

function LiveLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="brutal-press flex items-center gap-1.5 rounded-md border-[2.5px] border-ink bg-lime px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-ink shadow-[2px_2px_0_0_var(--color-ink)] transition-colors hover:bg-lime-deep"
    >
      Listen on {label}
      <ExternalLink className="h-3 w-3" />
    </a>
  )
}
