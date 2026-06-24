'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import type { Release, ReleaseStatus } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import Card from '@/components/ui/Card'
import StatusBadge from '@/components/StatusBadge'

interface SubmissionsTableProps {
  releases: Release[]
  passcode: string
  onStatusChange: (releaseId: string, status: ReleaseStatus) => void
}

export default function SubmissionsTable({
  releases,
  passcode,
  onStatusChange,
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

  if (releases.length === 0) {
    return (
      <Card className="px-6 py-10 text-center">
        <p className="text-sm text-ivory-dim">No submissions yet.</p>
      </Card>
    )
  }

  return (
    <Card className="overflow-x-auto">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead>
          <tr className="border-b border-line">
            <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ivory-faint">
              Artist
            </th>
            <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ivory-faint">
              Song
            </th>
            <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ivory-faint">
              Date
            </th>
            <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ivory-faint">
              Preview
            </th>
            <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ivory-faint">
              Status
            </th>
            <th className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ivory-faint">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {releases.map((release) => {
            const isPending = pendingId === release.id

            return (
              <tr key={release.id} className="border-b border-line last:border-0">
                <td className="px-5 py-4 text-ivory">{release.artist_name}</td>
                <td className="px-5 py-4">
                  <p className="font-medium text-ivory">{release.song_title}</p>
                  <p className="text-xs text-ivory-faint">{release.genre ?? '—'}</p>
                </td>
                <td className="px-5 py-4 text-ivory-dim">{formatDate(release.release_date)}</td>
                <td className="px-5 py-4">
                  <audio controls src={release.audio_url} className="h-9 w-52" />
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={release.status} />
                  {errorId === release.id ? (
                    <p className="mt-1 font-mono text-[10px] text-rust-bright">Update failed</p>
                  ) : null}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isPending || release.status === 'Approved'}
                      onClick={() => updateStatus(release.id, 'Approved')}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-emerald-bright/40 text-emerald-bright transition-colors hover:bg-emerald/15 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Approve"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={isPending || release.status === 'Rejected'}
                      onClick={() => updateStatus(release.id, 'Rejected')}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-rust-bright/40 text-rust-bright transition-colors hover:bg-rust/15 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Reject"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
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
