'use client'

import { useRouter } from 'next/navigation'
import ReleaseForm from '@/components/dashboard/ReleaseForm'

export default function UploadPage() {
  const router = useRouter()

  return (
    <div className="mx-auto max-w-2xl animate-fade-up">
      <header className="mb-8">
        <p className="inline-block -rotate-2 bg-cobalt px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white">
          New submission
        </p>
        <h1 className="mt-3 font-display text-3xl uppercase text-ink">Upload a release</h1>
        <p className="mt-2 text-sm font-medium text-ink-soft">
          Singles, EPs, and albums all go through Pending Review before they reach the catalog.
        </p>
      </header>

      <ReleaseForm mode="create" onSuccess={() => router.push('/dashboard/status')} />
    </div>
  )
}
