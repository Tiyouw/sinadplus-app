'use client'

import { useState, useId, type KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'

interface RatingScaleProps {
  /** FormData field name written to the hidden input */
  name: string
  /** Visible label text */
  label: string
  /** Helper text shown below (e.g. "1 = Sangat sulit fokus, 5 = Sangat fokus") */
  helper: string
  /** Whether a value is required */
  required?: boolean
  /** Initial selected value (1-5), defaults to none */
  defaultValue?: number
}

const VALUES = [1, 2, 3, 4, 5] as const

export function RatingScale({ name, label, helper, required = false, defaultValue }: RatingScaleProps) {
  const [value, setValue] = useState<number | null>(defaultValue ?? null)
  const groupId = useId()

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const current = value ?? 0
    let next: number | null = null

    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      next = current >= 5 ? 1 : current + 1
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      next = current <= 1 ? 5 : current - 1
    } else if (event.key === 'Home') {
      next = 1
    } else if (event.key === 'End') {
      next = 5
    }

    if (next !== null) {
      event.preventDefault()
      setValue(next)
    }
  }

  return (
    <div className="animate-fade-in">
      <span id={`${groupId}-label`} className="mb-2 block text-sm font-medium text-slate-700">
        {label}{' '}
        {required && (
          <>
            <span className="sr-only">(wajib)</span>
            <span aria-hidden="true" className="text-red-500">
              *
            </span>
          </>
        )}
      </span>

      <input type="hidden" name={name} value={value ?? ''} />

      <div
        role="radiogroup"
        aria-labelledby={`${groupId}-label`}
        aria-required={required}
        onKeyDown={handleKeyDown}
        className="flex gap-2"
      >
        {VALUES.map((v) => {
          const selected = value === v
          // Roving tabindex: the selected (or first when none) button is focusable.
          const focusable = selected || (value === null && v === 1)
          return (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={focusable ? 0 : -1}
              onClick={() => setValue(v)}
              className={cn(
                'flex h-12 flex-1 items-center justify-center rounded-xl border text-base font-semibold transition-all',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40',
                selected
                  ? 'animate-pop border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'border-slate-300 bg-white text-slate-600 hover:border-blue-400 hover:bg-blue-50',
              )}
            >
              {v}
            </button>
          )
        })}
      </div>

      <p className="mt-1.5 text-xs text-slate-500">{helper}</p>
    </div>
  )
}
