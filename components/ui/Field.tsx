import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'
import { cn } from '@/lib/utils'

const FIELD_BASE =
  'w-full rounded-md border border-line bg-surface px-3.5 py-2.5 font-body text-sm text-ivory placeholder:text-ivory-faint transition-colors duration-150 focus:border-brass-dim focus:outline-none disabled:opacity-50'

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
        className="font-mono text-[11px] uppercase tracking-[0.18em] text-ivory-dim"
      >
        {label}
        {required ? <span className="text-brass"> *</span> : null}
      </label>
      {hint ? (
        <span className="font-mono text-[10px] text-ivory-faint">{hint}</span>
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
