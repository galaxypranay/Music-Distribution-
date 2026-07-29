'use client'

import { useState } from 'react'
import { Check, Copy, LockKeyhole, MessageCircle, Send } from 'lucide-react'
import { useArtistSession } from '@/components/dashboard/SessionProvider'
import { formatDate, getDaysUntil } from '@/lib/utils'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export function UploadAccessSummary() {
  const { uploadAccess } = useArtistSession()
  if (!uploadAccess?.active || !uploadAccess.access) return null
  const { access } = uploadAccess
  const plan = access.plan_name === 'Custom' ? access.custom_plan_name : access.plan_name
  const days = getDaysUntil(access.expiry_date)
  return <Card className="mt-6 border-l-[8px] border-l-lime p-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><p className="font-mono text-[10px] font-bold uppercase tracking-[.15em] text-ink-faint">Current plan</p><p className="mt-1 font-display text-xl uppercase">{plan}</p></div>
      <span className="rounded-md border-2 border-ink bg-lime px-2 py-1 font-mono text-[10px] font-bold uppercase">Active</span>
    </div>
    <div className="mt-4 grid gap-3 text-sm font-bold sm:grid-cols-2"><p>Expiry Date <span className="ml-1 text-ink-soft">{formatDate(access.expiry_date)}</span></p><p>Days Remaining <span className="ml-1 text-ink-soft">{days === 0 ? 'Expires today' : `${days} Days Remaining`}</span></p></div>
  </Card>
}

export function UploadAccessLocked() {
  const { artist, uploadAccess } = useArtistSession()
  const [copied, setCopied] = useState(false)
  const expired = uploadAccess?.expired
  const copy = async () => { await navigator.clipboard.writeText(String(artist.display_id ?? artist.id)); setCopied(true); setTimeout(() => setCopied(false), 1600) }
  return <div className="mx-auto max-w-2xl animate-fade-up"><Card className="overflow-hidden shadow-[7px_7px_0_0_var(--color-punch)]"><div className="bg-punch px-6 py-5 text-white"><LockKeyhole className="mb-3 h-8 w-8" /><h1 className="font-display text-3xl uppercase">{expired ? 'Subscription Expired' : 'Upload Access Locked'}</h1></div><div className="space-y-6 p-6"><p className="text-sm font-medium text-ink-soft">{expired ? 'Your upload access has expired. Please contact support to renew.' : 'Your account does not currently have upload access. Please contact the Spilrix team and provide your Artist UID to activate your plan.'}</p><div className="flex items-center justify-between gap-3 rounded-lg border-[3px] border-ink bg-canary p-4"><div><p className="font-mono text-[10px] font-bold uppercase tracking-[.14em]">Artist UID</p><p className="font-display text-2xl">{artist.display_id ?? artist.id}</p></div><Button type="button" variant="ghost" size="sm" onClick={copy}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? 'Copied' : 'Copy'}</Button></div><div className="flex flex-wrap gap-3"><a href="/dashboard/support"><Button type="button" variant="secondary"><MessageCircle className="h-4 w-4" />Contact Support</Button></a><a href="https://wa.me/" target="_blank" rel="noreferrer"><Button type="button" variant="ghost"><MessageCircle className="h-4 w-4" />WhatsApp</Button></a><a href="https://t.me/" target="_blank" rel="noreferrer"><Button type="button" variant="ghost"><Send className="h-4 w-4" />Telegram</Button></a></div></div></Card></div>
}
