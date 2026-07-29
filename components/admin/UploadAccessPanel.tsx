'use client'

import { useEffect, useState } from 'react'
import { CalendarDays, Lock, Unlock } from 'lucide-react'
import type { AccessPlanName, ArtistAccess } from '@/lib/types'
import { formatDate, formatDateTime } from '@/lib/utils'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Input, Select, Textarea } from '@/components/ui/Field'

const PLANS: AccessPlanName[] = ['Single Release', '1 Month Unlimited', '6 Months Unlimited', '1 Year Unlimited', 'Custom']
const today = () => new Date().toISOString().slice(0, 10)

export default function UploadAccessPanel({ artistId, passcode }: { artistId: string; passcode: string }) {
  const [current, setCurrent] = useState<ArtistAccess | null>(null)
  const [history, setHistory] = useState<ArtistAccess[]>([])
  const [enabled, setEnabled] = useState(false)
  const [plan, setPlan] = useState<AccessPlanName>('Single Release')
  const [customPlan, setCustomPlan] = useState('')
  const [expiry, setExpiry] = useState('')
  const [notes, setNotes] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const load = async () => {
    const res = await fetch(`/api/admin/artists/${artistId}/access`, { headers: { 'x-admin-passcode': passcode } })
    if (!res.ok) return
    const data = await res.json()
    setCurrent(data.access ?? null); setHistory(data.history ?? [])
    if (data.access) { setEnabled(data.active); setPlan(data.access.plan_name ?? 'Single Release'); setCustomPlan(data.access.custom_plan_name ?? ''); setExpiry(data.access.expiry_date ?? ''); setNotes(data.access.admin_notes ?? '') }
  }
  useEffect(() => { void load() }, [artistId, passcode])

  const save = async (force?: boolean) => {
    const unlock = force ?? enabled
    setBusy(true); setMessage(null)
    const res = await fetch(`/api/admin/artists/${artistId}/access`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-passcode': passcode }, body: JSON.stringify({ upload_access: unlock, plan_name: plan, custom_plan_name: customPlan, start_date: today(), expiry_date: expiry, admin_notes: notes }) })
    const data = await res.json(); setBusy(false)
    if (!res.ok) { setMessage(data.error ?? 'Could not save access.'); return }
    setMessage(unlock ? 'Upload access unlocked and saved.' : 'Upload access locked.'); setEnabled(unlock); await load()
  }

  return <div><p className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[.16em] text-ink-faint">Upload access</p><Card className="p-4 md:p-5"><div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b-[2.5px] border-dashed border-ink/30 pb-4"><div><p className="font-display text-lg uppercase">Manual upload entitlement</p><p className="text-xs font-medium text-ink-soft">Every save is retained in the access history.</p></div><span className={`rounded-md border-2 border-ink px-2 py-1 font-mono text-[10px] font-bold uppercase ${current && enabled ? 'bg-lime' : 'bg-punch text-white'}`}>{current && enabled ? 'Unlocked' : 'Locked'}</span></div><div className="grid gap-5 md:grid-cols-2"><div className="space-y-5"><div className="flex items-center justify-between rounded-lg border-[3px] border-ink bg-paper p-3"><div><p className="font-mono text-[10px] font-bold uppercase tracking-[.12em]">Upload Access</p><p className="mt-1 text-sm font-bold">{enabled ? 'Unlocked' : 'Locked'}</p></div><button type="button" aria-pressed={enabled} onClick={() => setEnabled(!enabled)} className={`brutal-press flex h-9 w-16 items-center rounded-full border-[3px] border-ink p-1 transition-colors ${enabled ? 'bg-lime justify-end' : 'bg-white justify-start'}`}><span className="h-5 w-5 rounded-full border-2 border-ink bg-ink" /></button></div><Select label="Plan Name" value={plan} onChange={(e) => setPlan(e.target.value as AccessPlanName)}>{PLANS.map(p => <option key={p} value={p}>{p}</option>)}</Select>{plan === 'Custom' ? <Input label="Custom Plan Name" value={customPlan} onChange={e => setCustomPlan(e.target.value)} /> : null}<Input label="Access Expiry" type="date" min={today()} value={expiry} onChange={e => setExpiry(e.target.value)} /><Textarea label="Admin Notes" placeholder="Paid via UPI&#10;Manual Activation&#10;Special Offer" value={notes} onChange={e => setNotes(e.target.value)} className="min-h-24" /></div><div className="rounded-lg border-[3px] border-ink bg-paper p-4"><p className="mb-3 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[.13em]"><CalendarDays className="h-4 w-4" />Access History</p>{history.length ? <div className="max-h-[410px] space-y-3 overflow-auto pr-1">{history.map(row => <div key={row.id} className="border-2 border-ink bg-white p-3"><div className="flex justify-between gap-2"><p className="font-bold">{row.plan_name === 'Custom' ? row.custom_plan_name : row.plan_name ?? 'No plan'}</p><span className={`h-fit rounded border border-ink px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase ${row.upload_access ? 'bg-lime' : 'bg-punch text-white'}`}>{row.status}</span></div><p className="mt-1 text-xs text-ink-soft">{formatDate(row.start_date)} → {formatDate(row.expiry_date)}</p><p className="mt-1 font-mono text-[9px] uppercase text-ink-faint">{row.updated_by ?? 'Admin'} · {formatDateTime(row.updated_at)}</p>{row.admin_notes ? <p className="mt-2 text-xs font-medium">{row.admin_notes}</p> : null}</div>)}</div> : <p className="text-sm font-medium text-ink-soft">No access updates yet. New artists are locked by default.</p>}</div></div>{message ? <p className="mt-4 text-sm font-bold text-punch">{message}</p> : null}<div className="mt-5 flex flex-wrap gap-3"><Button type="button" isLoading={busy} onClick={() => void save()}><CalendarDays className="h-4 w-4" />Save Changes</Button><Button type="button" variant="danger" disabled={busy} onClick={() => void save(false)}><Lock className="h-4 w-4" />Lock Now</Button><Button type="button" variant="secondary" disabled={busy} onClick={() => void save(true)}><Unlock className="h-4 w-4" />Unlock Now</Button></div></Card></div>
}
