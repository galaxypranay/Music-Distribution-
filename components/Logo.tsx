import { cn } from '@/lib/utils'

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col leading-none', className)}>
      <span className="font-display text-2xl font-medium tracking-tight text-ivory">
        Spilrix
      </span>
      <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.4em] text-brass-dim">
        Distribution
      </span>
    </div>
  )
}
