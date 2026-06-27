'use client'

import { useState } from 'react'
import {
  Check,
  Download,
  Music2,
  Radio,
  Send,
  Trash2,
  X,
} from 'lucide-react'
import JSZip from 'jszip'
import type { ReleaseWithTracks } from '@/lib/types'
import { cn, formatDate, formatDaysUntil, getDaysUntil, getFileExtension } from '@/lib/utils'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import StatusBadge from '@/components/StatusBadge'

interface ReleaseManagerProps {
  releases: ReleaseWithTracks[]
  passcode: string
  onReleaseChange: (release: ReleaseWithTracks) => void
  onDelete: (releaseId: string) => void
  emptyMessage?: string
}

type ActionMode = { releaseId: string; type: 'reject' | 'live' } | null

export default function ReleaseManager({
  releases,
  passcode,
  onReleaseChange,
  onDelete,
  emptyMessage = 'No releases yet.',
}: ReleaseManagerProps) {
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [errorId, setErrorId] = useState<string | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [actionMode, setActionMode] = useState<ActionMode>(null)
  const [reasonDraft, setReasonDraft] = useState('')
  const [linkDrafts, setLinkDrafts] = useState({ spotify: '', apple: '', youtube: '' })

  async function patchRelease(
    release: ReleaseWithTracks,
    body: Record<string, unknown>
  ): Promise<void> {
    setPendingId(release.id)
    setErrorId(null)

    try {
      const response = await fetch(`/api/admin/releases/${release.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode,
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) throw new Error('Update failed')

      const result = await response.json()
      onReleaseChange(result.release as ReleaseWithTracks)
      setActionMode(null)
    } catch {
      setErrorId(release.id)
    } finally {
      setPendingId(null)
    }
  }

  function startReject(release: ReleaseWithTracks) {
    setReasonDraft(release.rejection_reason ?? '')
    setActionMode({ releaseId: release.id, type: 'reject' })
  }

  function startLive(release: ReleaseWithTracks) {
    setLinkDrafts({
      spotify: release.spotify_url ?? '',
      apple: release.apple_music_url ?? '',
      youtube: release.youtube_url ?? '',
    })
    setActionMode({ releaseId: release.id, type: 'live' })
  }

  async function deleteRelease(release: ReleaseWithTracks) {
    const confirmed = window.confirm(
      `Delete "${release.title}"? This removes it and all its tracks/cover art from Storage. This cannot be undone.`
    )
    if (!confirmed) return

    setPendingId(release.id)
    setErrorId(null)

    try {
      const response = await fetch(`/api/admin/releases/${release.id}`, {
        method: 'DELETE',
        headers: { 'x-admin-passcode': passcode },
      })

      if (!response.ok) throw new Error('Delete failed')

      onDelete(release.id)
    } catch {
      setErrorId(release.id)
      setPendingId(null)
    }
  }

  async function downloadZip(release: ReleaseWithTracks) {
    setDownloadingId(release.id)

    try {
      const zip = new JSZip()

      if (release.cover_art_url) {
        const response = await fetch(release.cover_art_url)
        const blob = await response.blob()
        const extension = getFileExtension(release.cover_art_url) || 'jpg'
        zip.file(`cover.${extension}`, blob)
      }

      for (const track of release.tracks) {
        const response = await fetch(track.audio_url)
        const blob = await response.blob()
        const extension = getFileExtension(track.audio_url) || 'mp3'
        zip.file(`${track.track_number} - ${track.song_title}.${extension}`, blob)
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(zipBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${release.title}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch {
      setErrorId(release.id)
    } finally {
      setDownloadingId(null)
    }
  }

  if (releases.length === 0) {
    return (
      <Card className="px-6 py-10 text-center">
        <p className="text-sm font-medium text-ink-soft">{emptyMessage}</p>
      </Card>
    )
  }

  const sorted = [...releases].sort((a, b) => {
    const aDays = getDaysUntil(a.release_date)
    const bDays = getDaysUntil(b.release_date)
    if (aDays === null) return 1
    if (bDays === null) return -1
    return aDays - bDays
  })

  return (
    <div className="flex flex-col gap-5">
      {sorted.map((release) => {
        const isPending = pendingId === release.id
        const isDownloading = downloadingId === release.id
        const days = getDaysUntil(release.release_date)
        const isUrgent =
          days !== null && days <= 3 && !['Live', 'Sent to Platforms'].includes(release.status)
        const isOverdue = days !== null && days < 0 && release.status !== 'Live'
        const inReject = actionMode?.releaseId === release.id && actionMode.type === 'reject'
        const inLive = actionMode?.releaseId === release.id && actionMode.type === 'live'

        return (
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
                  {days !== null ? (
                    <span
                      className={cn(
                        'rounded-md border-2 border-ink px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.1em]',
                        isOverdue ? 'bg-punch text-white' : isUrgent ? 'bg-canary text-ink' : 'bg-white text-ink-soft'
                      )}
                    >
                      {formatDaysUntil(days)}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                  {release.artist_name} · Release date: {formatDate(release.release_date)}
                </p>

                <ul className="mt-3 flex flex-col gap-2">
                  {release.tracks.map((track) => (
                    <li key={track.id} className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-bold text-ink">
                        {track.track_number}. {track.song_title}
                      </span>
                      {track.genre ? <span className="text-ink-faint">{track.genre}</span> : null}
                      {track.explicit ? (
                        <span className="rounded border-2 border-ink bg-punch px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase text-white">
                          E
                        </span>
                      ) : null}
                      <audio controls src={track.audio_url} className="h-8 w-44" />
                    </li>
                  ))}
                </ul>

                {release.status === 'Rejected' && release.rejection_reason ? (
                  <p className="mt-3 rounded-md border-2 border-ink bg-punch/10 px-3 py-2 text-sm font-medium text-ink">
                    <span className="font-bold text-punch">Reason given: </span>
                    {release.rejection_reason}
                  </p>
                ) : null}

                {errorId === release.id ? (
                  <p className="mt-2 font-mono text-[10px] font-bold text-punch">Action failed</p>
                ) : null}

                {inReject ? (
                  <div className="mt-3 rounded-md border-2 border-ink bg-paper p-3">
                    <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-ink">
                      Why is this being rejected?
                    </label>
                    <textarea
                      value={reasonDraft}
                      onChange={(e) => setReasonDraft(e.target.value)}
                      placeholder="e.g. Audio quality is too low, please re-upload."
                      className="min-h-20 w-full rounded-md border-[2.5px] border-ink bg-white px-3 py-2 text-sm font-medium text-ink placeholder:text-ink-faint focus:outline-none"
                    />
                    <div className="mt-2 flex gap-2">
                      <Button
                        type="button"
                        variant="danger"
                        isLoading={isPending}
                        disabled={isPending || !reasonDraft.trim()}
                        onClick={() =>
                          patchRelease(release, { status: 'Rejected', rejection_reason: reasonDraft })
                        }
                      >
                        Confirm reject
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => setActionMode(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : null}

                {inLive ? (
                  <div className="mt-3 rounded-md border-2 border-ink bg-paper p-3">
                    <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-ink">
                      Live links (optional, add what you have)
                    </label>
                    <div className="flex flex-col gap-2">
                      <input
                        value={linkDrafts.spotify}
                        onChange={(e) => setLinkDrafts((d) => ({ ...d, spotify: e.target.value }))}
                        placeholder="Spotify URL"
                        className="w-full rounded-md border-[2.5px] border-ink bg-white px-3 py-2 text-sm font-medium text-ink placeholder:text-ink-faint focus:outline-none"
                      />
                      <input
                        value={linkDrafts.apple}
                        onChange={(e) => setLinkDrafts((d) => ({ ...d, apple: e.target.value }))}
                        placeholder="Apple Music URL"
                        className="w-full rounded-md border-[2.5px] border-ink bg-white px-3 py-2 text-sm font-medium text-ink placeholder:text-ink-faint focus:outline-none"
                      />
                      <input
                        value={linkDrafts.youtube}
                        onChange={(e) => setLinkDrafts((d) => ({ ...d, youtube: e.target.value }))}
                        placeholder="YouTube URL"
                        className="w-full rounded-md border-[2.5px] border-ink bg-white px-3 py-2 text-sm font-medium text-ink placeholder:text-ink-faint focus:outline-none"
                      />
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Button
                        type="button"
                        isLoading={isPending}
                        disabled={isPending}
                        onClick={() =>
                          patchRelease(release, {
                            status: 'Live',
                            spotify_url: linkDrafts.spotify.trim() || null,
                            apple_music_url: linkDrafts.apple.trim() || null,
                            youtube_url: linkDrafts.youtube.trim() || null,
                          })
                        }
                      >
                        Confirm live
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => setActionMode(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : null}

                {!inReject && !inLive ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <ActionPill
                      icon={Check}
                      label="Approve"
                      fill="bg-lime text-ink"
                      disabled={isPending || release.status === 'Approved'}
                      onClick={() => patchRelease(release, { status: 'Approved' })}
                    />
                    <ActionPill
                      icon={X}
                      label="Reject"
                      fill="bg-punch text-white"
                      disabled={isPending}
                      onClick={() => startReject(release)}
                    />
                    <ActionPill
                      icon={Send}
                      label="Mark sent"
                      fill="bg-cobalt text-white"
                      disabled={isPending || ['Sent to Platforms', 'Live'].includes(release.status)}
                      onClick={() => patchRelease(release, { status: 'Sent to Platforms' })}
                    />
                    <ActionPill
                      icon={Radio}
                      label="Mark live"
                      fill="bg-ink text-paper"
                      disabled={isPending}
                      onClick={() => startLive(release)}
                    />
                    <ActionPill
                      icon={Download}
                      label={isDownloading ? 'Zipping…' : 'Download ZIP'}
                      fill="bg-white text-ink"
                      disabled={isDownloading}
                      onClick={() => downloadZip(release)}
                    />
                    <ActionPill
                      icon={Trash2}
                      label="Delete"
                      fill="bg-white text-ink"
                      disabled={isPending}
                      onClick={() => deleteRelease(release)}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

function ActionPill({
  icon: Icon,
  label,
  fill,
  disabled,
  onClick,
}: {
  icon: typeof Check
  label: string
  fill: string
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'brutal-press flex items-center gap-1.5 rounded-md border-[2.5px] border-ink px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em] shadow-[2px_2px_0_0_var(--color-ink)] transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none',
        fill
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  )
}
