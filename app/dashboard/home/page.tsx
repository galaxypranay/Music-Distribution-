'use client'

import Link from 'next/link'
import {
  UploadCloud,
  ClipboardCheck,
  Send,
  Music2,
  BarChart3,
  LifeBuoy,
  ShieldCheck,
  Wallet,
  Headphones,
  ArrowRight,
} from 'lucide-react'
import { useArtistSession } from '@/components/dashboard/SessionProvider'
import EqualizerAnimation from '@/components/EqualizerAnimation'
import Card from '@/components/ui/Card'

const STEPS = [
  {
    icon: UploadCloud,
    title: '1. Upload',
    body: 'Submit your release — cover art, tracks and metadata — in a few minutes from the Upload tab.',
  },
  {
    icon: ClipboardCheck,
    title: '2. Review',
    body: 'Our team checks audio quality, artwork and metadata for platform compliance.',
  },
  {
    icon: Send,
    title: '3. Distribute',
    body: 'Once approved, we send your release to Spotify, Apple Music, YouTube and more.',
  },
  {
    icon: Music2,
    title: '4. Live',
    body: 'Your release goes live on platforms. Track every stage from the Status tab.',
  },
]

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Quality checked',
    body: 'Every release is reviewed before it reaches platforms, so rejections stay rare.',
  },
  {
    icon: Wallet,
    title: 'No paperwork',
    body: 'No password, no contracts to chase — just your name and your music.',
  },
  {
    icon: Headphones,
    title: 'Major platforms',
    body: 'Spotify, Apple Music and YouTube — with direct listen links once you\u2019re live.',
  },
]

const QUICK_LINKS = [
  {
    href: '/dashboard/upload',
    icon: UploadCloud,
    title: 'Upload a release',
    body: 'Start a new Single, EP or Album submission.',
    accent: 'bg-canary',
  },
  {
    href: '/dashboard/status',
    icon: BarChart3,
    title: 'Check status',
    body: 'See where every submission stands right now.',
    accent: 'bg-cobalt text-white',
  },
  {
    href: '/dashboard/support',
    icon: LifeBuoy,
    title: 'Get support',
    body: 'Send the team a question about your release.',
    accent: 'bg-lime',
  },
]

export default function DashboardHomePage() {
  const { artist } = useArtistSession()
  const firstName = artist.name.split(' ')[0]

  return (
    <div className="mx-auto max-w-5xl animate-fade-up">
      {/* Hero */}
      <header className="mb-10 flex flex-col gap-6 rounded-2xl border-[3px] border-ink bg-white p-7 shadow-[6px_6px_0_0_var(--color-ink)] md:flex-row md:items-center md:justify-between md:p-9">
        <div>
          <p className="inline-block -rotate-2 bg-punch px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white">
            Welcome back
          </p>
          <h1 className="mt-3 font-display text-3xl uppercase text-ink md:text-4xl">
            Hey {firstName}, let&apos;s get your music out there.
          </h1>
          <p className="mt-3 max-w-xl text-sm font-medium text-ink-soft">
            Spilrix Distribution is the simplest way for independent artists to release music on
            Spotify, Apple Music and YouTube — no label, no middlemen.
          </p>
        </div>
        <EqualizerAnimation className="hidden shrink-0 md:flex" />
      </header>

      {/* What it does */}
      <section className="mb-10">
        <h2 className="font-display text-xl uppercase text-ink">What this platform does</h2>
        <p className="mt-2 max-w-3xl text-sm font-medium text-ink-soft">
          Spilrix takes the music you make and gets it onto every major streaming platform under
          your own name. You upload, our team reviews and submits it on your behalf, and you keep
          track of the whole journey — from &ldquo;Pending Review&rdquo; to &ldquo;Live&rdquo; —
          right here in the dashboard.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-md border-[2.5px] border-ink bg-paper">
                <Icon className="h-5 w-5 text-ink" />
              </span>
              <p className="mt-3 font-display text-base uppercase text-ink">{title}</p>
              <p className="mt-1 text-sm font-medium text-ink-soft">{body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mb-10">
        <h2 className="font-display text-xl uppercase text-ink">How it works</h2>
        <p className="mt-2 max-w-3xl text-sm font-medium text-ink-soft">
          Four steps from your hard drive to the world&apos;s speakers.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="flex flex-col p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-md border-[2.5px] border-ink bg-canary">
                <Icon className="h-5 w-5 text-ink" />
              </span>
              <p className="mt-3 font-display text-base uppercase text-ink">{title}</p>
              <p className="mt-1 text-sm font-medium text-ink-soft">{body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick links */}
      <section>
        <h2 className="font-display text-xl uppercase text-ink">Jump in</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {QUICK_LINKS.map(({ href, icon: Icon, title, body, accent }) => (
            <Link key={href} href={href} className="group block">
              <Card className="brutal-press flex h-full flex-col justify-between p-5 transition-transform group-hover:-translate-y-0.5">
                <div>
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-md border-[2.5px] border-ink ${accent}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-3 font-display text-base uppercase text-ink">{title}</p>
                  <p className="mt-1 text-sm font-medium text-ink-soft">{body}</p>
                </div>
                <span className="mt-4 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink">
                  Go
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
