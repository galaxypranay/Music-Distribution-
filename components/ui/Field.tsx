'use client'

import {
  Children,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react'
import { ChevronDown } from 'lucide-react'
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

interface SelectProps {
  label: string
  hint?: string
  id?: string
  required?: boolean
  className?: string
  value: string
  onChange: (value: string) => void
  /** Pass plain <option value="…">Label</option> elements, same as a native select. */
  children: ReactNode
}

export function Select({ label, hint, id, required, className, value, onChange, children }: SelectProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const options = Children.toArray(children)
    .filter(isValidElement)
    .map((child) => {
      const props = child.props as { value?: string; children?: ReactNode }
      return { value: String(props.value ?? ''), label: props.children }
    })

  const selected = options.find((option) => option.value === value)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  function handleSelect(optionValue: string) {
    onChange(optionValue)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <FieldLabel label={label} hint={hint} required={required} htmlFor={fieldId} />
      <button
        type="button"
        id={fieldId}
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(FIELD_BASE, 'flex cursor-pointer items-center justify-between gap-2 text-left', className)}
      >
        <span className="truncate">{selected?.label}</span>
        <ChevronDown
          className={cn('h-4 w-4 shrink-0 text-ink-faint transition-transform duration-150', open && 'rotate-180')}
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          tabIndex={-1}
          className="scrollbar-thin absolute z-30 mt-2 max-h-60 w-full overflow-y-auto rounded-lg border-[3px] border-ink bg-white shadow-[4px_4px_0_0_var(--color-ink)]"
        >
          {options.map((option) => {
            const isSelected = option.value === value
            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'flex w-full items-center px-3.5 py-2.5 text-left font-body text-sm font-bold transition-colors',
                    isSelected ? 'bg-canary text-ink' : 'text-ink hover:bg-paper'
                  )}
                >
                  {option.label}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
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
