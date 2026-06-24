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

export default function MobileTabs() {
  const pathname = usePathname()

  return (
    <nav className="flex border-b border-line md:hidden">
      {TABS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-1 flex-col items-center gap-1 border-b-2 py-3 text-xs font-medium',
              isActive
                ? 'border-brass text-ivory'
                : 'border-transparent text-ivory-dim'
            )}
          >
            <Icon className={cn('h-4 w-4', isActive ? 'text-brass' : 'text-ivory-faint')} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
