'use client'

import { useState } from 'react'
import { Check, Trash2, X } from 'lucide-react'
import type { Release, ReleaseStatus } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import Card from '@/components/ui/Card'
import StatusBadge from '@/components/StatusBadge'

interface SubmissionsTableProps {
  releases: Release[]
  passcode: string
  onStatusChange: (releaseId: string, status: ReleaseStatus) => void
  /** Omit to disable the delete action entirely. */
  onDelete?: (releaseId: string) => void
  /** Hide the redundant Artist column when the table is already scoped to one artist. */
  showArtistColumn?: boolean
  emptyMessage?: string
}

export default function SubmissionsTable({
  releases,
  passcode,
  onStatusChange,
  onDelete,
  showArtistColumn = true,
  emptyMessage = 'No submissions yet.',
}: SubmissionsTableProps) {
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [errorId, setErrorId] = useState<string | null>(null)

  async function updateStatus(releaseId: string, status: ReleaseStatus) {
    setPendingId(releaseId)
    setErrorId(null)

    try {
      const response = await fetch(`/api/admin/releases/${releaseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode,
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error('Update failed')

      onStatusChange(releaseId, status)
    } catch {
      setErrorId(releaseId)
    } finally {
      setPendingId(null)
    }
  }

  async function deleteRelease(release: Release) {
    const confirmed = window.confirm(
      `Delete "${release.song_title}"? This removes it from the catalog and deletes the audio file from Storage. This cannot be undone.`
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

      onDelete?.(release.id)
    } catch {
      setErrorId(release.id)
      setPendingId(null)
    }
  }

  if (releases.length === 0) {
    return (
      <Card className="px-6 py-10 text-center">
        <p className="text-sm font-medium text-ink-soft">{emptyMessage}</p>
      </Card>
    )
  }

  return (
    <Card className="overflow-x-auto">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead>
          <tr className="border-b-[3px] border-ink bg-canary">
            {showArtistColumn ? (
              <th className="px-5 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink">
                Artist
              </th>
            ) : null}
            <th className="px-5 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink">
              Song
            </th>
            <th className="px-5 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink">
              Date
            </th>
            <th className="px-5 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink">
              Preview
            </th>
            <th className="px-5 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink">
              Status
            </th>
            <th className="px-5 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {releases.map((release) => {
            const isPending = pendingId === release.id

            return (
              <tr key={release.id} className="border-b-[2.5px] border-ink last:border-0">
                {showArtistColumn ? (
                  <td className="px-5 py-4 font-bold text-ink">{release.artist_name}</td>
                ) : null}
                <td className="px-5 py-4">
                  <p className="font-bold text-ink">{release.song_title}</p>
                  <p className="text-xs font-medium text-ink-faint">{release.genre ?? '—'}</p>
                </td>
                <td className="px-5 py-4 font-medium text-ink-soft">{formatDate(release.release_date)}</td>
                <td className="px-5 py-4">
                  <audio controls src={release.audio_url} className="h-9 w-52" />
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={release.status} />
                  {errorId === release.id ? (
                    <p className="mt-1 font-mono text-[10px] font-bold text-punch">Action failed</p>
                  ) : null}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isPending || release.status === 'Approved'}
                      onClick={() => updateStatus(release.id, 'Approved')}
                      className="brutal-press flex h-9 w-9 items-center justify-center rounded-md border-[2.5px] border-ink bg-lime text-ink shadow-[2px_2px_0_0_var(--color-ink)] transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                      aria-label="Approve"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={isPending || release.status === 'Rejected'}
                      onClick={() => updateStatus(release.id, 'Rejected')}
                      className="brutal-press flex h-9 w-9 items-center justify-center rounded-md border-[2.5px] border-ink bg-punch text-white shadow-[2px_2px_0_0_var(--color-ink)] transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                      aria-label="Reject"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {onDelete ? (
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => deleteRelease(release)}
                        className="brutal-press flex h-9 w-9 items-center justify-center rounded-md border-[2.5px] border-ink bg-ink text-paper shadow-[2px_2px_0_0_var(--color-ink)] transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Card>
  )
}
