'use client'

import { useState, type FormEvent } from 'react'
import { Lock } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface AdminGateProps {
  onSuccess: (passcode: string) => void
}

export default function AdminGate({ onSuccess }: AdminGateProps) {
  const [passcode, setPasscode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsVerifying(true)

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error ?? 'Incorrect passcode.')
      }

      onSuccess(passcode)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Incorrect passcode.')
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-void px-6">
      <Card className="w-full max-w-sm p-8 animate-fade-up">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-brass-dim/50 bg-surface-raised">
            <Lock className="h-4 w-4 text-brass" />
          </span>
          <h1 className="mt-4 font-display text-xl text-ivory">Control room</h1>
          <p className="mt-1 text-sm text-ivory-dim">Enter the admin passcode to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <input
            type="password"
            required
            autoFocus
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Passcode"
            className="w-full rounded-md border border-line bg-surface-raised px-3.5 py-3 text-center font-mono text-sm tracking-[0.3em] text-ivory placeholder:tracking-normal placeholder:text-ivory-faint focus:border-brass-dim focus:outline-none"
          />

          {error ? (
            <p className="rounded-md border border-rust/40 bg-rust/10 px-4 py-2.5 text-center text-sm text-rust-bright">
              {error}
            </p>
          ) : null}

          <Button type="submit" isLoading={isVerifying} disabled={isVerifying} className="w-full">
            Unlock
          </Button>
        </form>
      </Card>
    </main>
  )
}
