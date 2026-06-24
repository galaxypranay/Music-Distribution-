import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export default function Card({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl border-[3px] border-ink bg-white shadow-[5px_5px_0_0_var(--color-ink)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
