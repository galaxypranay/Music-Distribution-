'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  Bell,
  Home,
  LifeBuoy,
  Lock,
  TrendingUp,
  UploadCloud,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_TABS = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/dashboard/upload', label: 'Upload', icon: UploadCloud },
  { href: '/dashboard/status', label: 'Status', icon: BarChart3 },
  { href: '/dashboard/support', label: 'Support', icon: LifeBuoy },
  { href: '/dashboard/analytics', label: 'Analytics', icon: TrendingUp },
]

const COMING_SOON_TABS = [
  { label: 'Royalties', icon: TrendingUp },
  { label: 'Notifications', icon: Bell },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [comingSoonLabel, setComingSoonLabel] = useState<string | null>(null)

  useEffect(() => {
    if (!comingSoonLabel) return
    const timer = setTimeout(() => setComingSoonLabel(null), 1800)
    return () => clearTimeout(timer)
  }, [comingSoonLabel])

  return (
    <aside className="hidden w-60 flex-col gap-3 border-r-[3px] border-ink px-4 py-8 md:flex">
      {NAV_TABS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-lg border-[3px] px-3.5 py-3 text-sm font-bold uppercase tracking-wide transition-all duration-150',
              isActive
                ? 'border-ink bg-canary text-ink shadow-[3px_3px_0_0_var(--color-ink)]'
                : 'border-transparent text-ink-soft hover:border-ink hover:bg-white hover:shadow-[3px_3px_0_0_var(--color-ink)]'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        )
      })}

      <div className="mt-2 border-t-2 border-dashed border-ink/30 pt-3">
        {COMING_SOON_TABS.map(({ label, icon: Icon }) => (
          <div key={label} className="relative">
            <button
              type="button"
              onClick={() => setComingSoonLabel(label)}
              className="flex w-full items-center gap-3 rounded-lg border-[3px] border-transparent px-3.5 py-3 text-sm font-bold uppercase tracking-wide text-ink-faint transition-colors hover:bg-paper"
            >
              <Icon className="h-4 w-4" />
              {label}
              <Lock className="ml-auto h-3.5 w-3.5" />
            </button>
            {comingSoonLabel === label ? (
              <span className="absolute left-1/2 top-full z-10 -translate-x-1/2 -translate-y-1 whitespace-nowrap rounded-md border-2 border-ink bg-ink px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-paper shadow-[2px_2px_0_0_var(--color-ink)]">
                Coming soon
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </aside>
  )
}
