import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'ghost' | 'danger' | 'outline'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  isLoading?: boolean
}

const VARIANT_STYLES: Record<Variant, string> = {
  primary:
    'bg-brass text-void hover:bg-brass-bright disabled:bg-brass-dim disabled:text-ivory-faint',
  ghost:
    'bg-transparent text-ivory-dim hover:text-ivory hover:bg-surface-raised disabled:text-ivory-faint',
  outline:
    'bg-transparent text-ivory border border-line hover:border-brass-dim disabled:text-ivory-faint',
  danger:
    'bg-transparent text-rust-bright border border-rust/50 hover:bg-rust/10 disabled:text-ivory-faint',
}

export default function Button({
  variant = 'primary',
  isLoading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 font-body text-sm font-medium transition-colors duration-150 disabled:cursor-not-allowed',
        VARIANT_STYLES[variant],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  )
}
