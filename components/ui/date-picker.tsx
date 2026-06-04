'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  /** FormData field name written to the hidden input (value "YYYY-MM-DD") */
  name: string
  label: string
  required?: boolean
}

const MONTHS_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

const WEEKDAYS_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

/** Format a Date as YYYY-MM-DD using local calendar parts (no timezone shift). */
function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Format a Date as e.g. "1 Juni 2026". */
function formatIndonesian(date: Date): string {
  return `${date.getDate()} ${MONTHS_ID[date.getMonth()]} ${date.getFullYear()}`
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function DatePicker({ name, label, required = false }: DatePickerProps) {
  // Lazy initializers compute "today" at first client render (not module load),
  // avoiding a setState-in-effect cascade while still defaulting to today.
  const [selected, setSelected] = useState<Date>(() => new Date())
  const [viewMonth, setViewMonth] = useState<Date>(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function handlePointer(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    function handleKey(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  function goToMonth(offset: number) {
    setViewMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1))
  }

  function selectDay(day: Date) {
    setSelected(day)
    setOpen(false)
  }

  // Build the grid for the currently viewed month.
  const grid: Array<Date | null> = []
  const firstWeekday = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1).getDay()
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate()
  for (let i = 0; i < firstWeekday; i++) grid.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    grid.push(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d))
  }

  const today = new Date()

  return (
    <div className={cn('animate-fade-in relative', open && 'z-40')}>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}{' '}
        {required && (
          <>
            <span className="sr-only">(wajib)</span>
            <span aria-hidden="true" className="text-red-500">
              *
            </span>
          </>
        )}
      </label>

      <input type="hidden" name={name} value={toISODate(selected)} />

      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="dialog"
          aria-expanded={open}
          className="flex w-full items-center justify-between rounded-xl border border-slate-300 px-4 py-2 text-left text-slate-900 transition-colors hover:border-blue-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <span className="text-slate-900">{formatIndonesian(selected)}</span>
          <svg
            className="h-5 w-5 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0V11.25A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
            />
          </svg>
        </button>

        {open && (
          <div
            role="dialog"
            aria-label="Pilih tanggal"
            className="animate-scale-in absolute z-50 mt-2 w-72 origin-top rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/20 ring-1 ring-slate-900/5"
          >
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => goToMonth(-1)}
                aria-label="Bulan sebelumnya"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>
              <span className="text-sm font-semibold text-slate-800">
                {MONTHS_ID[viewMonth.getMonth()]} {viewMonth.getFullYear()}
              </span>
              <button
                type="button"
                onClick={() => goToMonth(1)}
                aria-label="Bulan berikutnya"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>

            <div className="mb-1 grid grid-cols-7 gap-1">
              {WEEKDAYS_ID.map((wd) => (
                <span key={wd} className="flex h-8 items-center justify-center text-xs font-medium text-slate-400">
                  {wd}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {grid.map((day, idx) => {
                if (!day) return <span key={`empty-${idx}`} />
                const isSelected = sameDay(day, selected)
                const isToday = sameDay(day, today)
                return (
                  <button
                    key={toISODate(day)}
                    type="button"
                    onClick={() => selectDay(day)}
                    aria-pressed={isSelected}
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40',
                      isSelected
                        ? 'bg-blue-600 font-semibold text-white'
                        : isToday
                          ? 'bg-blue-50 font-medium text-blue-700 hover:bg-blue-100'
                          : 'text-slate-700 hover:bg-slate-100',
                    )}
                  >
                    {day.getDate()}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
