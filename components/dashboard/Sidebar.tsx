'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, Home, LifeBuoy, UploadCloud } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { href: '/dashboard/home', label: 'Home', icon: Home },
  { href: '/dashboard/upload', label: 'Upload', icon: UploadCloud },
  { href: '/dashboard/status', label: 'Status', icon: BarChart3 },
  { href: '/dashboard/support', label: 'Support', icon: LifeBuoy },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-60 flex-col gap-3 border-r-[3px] border-ink px-4 py-8 md:flex">
      {TABS.map(({ href, label, icon: Icon }) => {
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
    </aside>
  )
}
