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
        'rounded-xl border border-line bg-surface/80 backdrop-blur-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
