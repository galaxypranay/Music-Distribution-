'use client'

import { useState, type FormEvent } from 'react'
import { useArtistSession } from '@/components/dashboard/SessionProvider'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Field'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

export default function SupportPage() {
  const { artist } = useArtistSession()

  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [state, setState] = useState<SubmitState>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setState('submitting')

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artist_id: artist.id,
          artist_name: artist.name,
          subject,
          message,
        }),
      })

      const result = await response.json()

      if (!response.ok) throw new Error(result.error ?? 'Could not submit your query.')

      setState('success')
      setSubject('')
      setMessage('')
    } catch (err) {
      setState('error')
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.')
    }
  }

  const isSubmitting = state === 'submitting'

  return (
    <div className="mx-auto max-w-2xl animate-fade-up">
      <header className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-brass-dim">
          Get help
        </p>
        <h1 className="mt-2 font-display text-3xl text-ivory">Support</h1>
        <p className="mt-2 text-sm text-ivory-dim">
          Send a query to the Spilrix team. We reply by email within two business days.
        </p>
      </header>

      <Card className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Subject"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Release date change request"
          />

          <Textarea
            label="Message"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your question or issue in detail…"
          />

          {error ? (
            <p className="rounded-md border border-rust/40 bg-rust/10 px-4 py-3 text-sm text-rust-bright">
              {error}
            </p>
          ) : null}

          {state === 'success' ? (
            <p className="rounded-md border border-emerald-bright/40 bg-emerald/10 px-4 py-3 text-sm text-emerald-bright">
              Sent. Our team has received your query.
            </p>
          ) : null}

          <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
            {isSubmitting ? 'Sending…' : 'Send to support'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
