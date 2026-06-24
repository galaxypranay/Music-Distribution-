import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'
import { cn } from '@/lib/utils'

const FIELD_BASE =
  'w-full rounded-lg border-[3px] border-ink bg-white px-3.5 py-2.5 font-body text-sm font-medium text-ink placeholder:text-ink-faint transition-shadow duration-150 focus:shadow-[3px_3px_0_0_var(--color-cobalt)] focus:outline-none disabled:opacity-50'

interface FieldWrapperProps {
  label: string
  hint?: string
  required?: boolean
  htmlFor: string
}

function FieldLabel({ label, hint, required, htmlFor }: FieldWrapperProps) {
  return (
    <div className="mb-2 flex items-baseline justify-between">
      <label
        htmlFor={htmlFor}
        className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink"
      >
        {label}
        {required ? <span className="text-punch"> *</span> : null}
      </label>
      {hint ? (
        <span className="font-mono text-[10px] text-ink-faint">{hint}</span>
      ) : null}
    </div>
  )
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
}

export function Input({ label, hint, id, required, className, ...props }: InputProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div>
      <FieldLabel label={label} hint={hint} required={required} htmlFor={fieldId} />
      <input id={fieldId} required={required} className={cn(FIELD_BASE, className)} {...props} />
    </div>
  )
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  hint?: string
}

export function Select({ label, hint, id, required, className, children, ...props }: SelectProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div>
      <FieldLabel label={label} hint={hint} required={required} htmlFor={fieldId} />
      <select
        id={fieldId}
        required={required}
        className={cn(FIELD_BASE, 'cursor-pointer appearance-none', className)}
        {...props}
      >
        {children}
      </select>
    </div>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  hint?: string
}

export function Textarea({ label, hint, id, required, className, ...props }: TextareaProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div>
      <FieldLabel label={label} hint={hint} required={required} htmlFor={fieldId} />
      <textarea
        id={fieldId}
        required={required}
        className={cn(FIELD_BASE, 'min-h-32 resize-y', className)}
        {...props}
      />
    </div>
  )
}
