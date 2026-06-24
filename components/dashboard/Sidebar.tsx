'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, LifeBuoy, UploadCloud } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { href: '/dashboard/upload', label: 'Upload', icon: UploadCloud },
  { href: '/dashboard/status', label: 'Status', icon: BarChart3 },
  { href: '/dashboard/support', label: 'Support', icon: LifeBuoy },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-60 flex-col gap-1 border-r border-line px-4 py-8 md:flex">
      {TABS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-md border-l-2 px-3.5 py-3 text-sm font-medium transition-colors duration-150',
              isActive
                ? 'border-brass bg-surface text-ivory'
                : 'border-transparent text-ivory-dim hover:bg-surface/60 hover:text-ivory'
            )}
          >
            <Icon className={cn('h-4 w-4', isActive ? 'text-brass' : 'text-ivory-faint')} />
            {label}
          </Link>
        )
      })}
    </aside>
  )
}
