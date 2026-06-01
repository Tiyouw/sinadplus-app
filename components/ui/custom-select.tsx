'use client'

import { useEffect, useRef, useState, useId, type KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
}

interface CustomSelectProps {
  /** FormData field name written to the hidden input */
  name: string
  label: string
  options: SelectOption[]
  /** Placeholder text shown when nothing is selected */
  placeholder: string
  required?: boolean
  /** Initial selected value */
  defaultValue?: string
}

export function CustomSelect({
  name,
  label,
  options,
  placeholder,
  required = false,
  defaultValue = '',
}: CustomSelectProps) {
  const [value, setValue] = useState(defaultValue)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const listId = useId()

  const selectedOption = options.find((o) => o.value === value) ?? null

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

  // Move focus into the listbox when it opens so arrow-key navigation works.
  useEffect(() => {
    if (open) listRef.current?.focus()
  }, [open])

  function openList() {
    const currentIndex = options.findIndex((o) => o.value === value)
    setActiveIndex(currentIndex >= 0 ? currentIndex : 0)
    setOpen(true)
  }

  function commit(index: number) {
    const option = options[index]
    if (option) {
      setValue(option.value)
      setOpen(false)
    }
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (open) {
        commit(activeIndex)
      } else {
        openList()
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) openList()
    }
  }

  function handleListKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((i) => (i + 1) % options.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((i) => (i - 1 + options.length) % options.length)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      commit(activeIndex)
    } else if (event.key === 'Home') {
      event.preventDefault()
      setActiveIndex(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      setActiveIndex(options.length - 1)
    }
  }

  return (
    <div className={cn('animate-fade-in relative', open && 'z-30')}>
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

      <input type="hidden" name={name} value={value} />

      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => (open ? setOpen(false) : openList())}
          onKeyDown={handleTriggerKeyDown}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="flex w-full items-center justify-between rounded-xl border border-slate-300 px-4 py-2 text-left transition-colors hover:border-blue-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <span className={selectedOption ? 'text-slate-900' : 'text-slate-400'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            className={cn('h-5 w-5 text-slate-400 transition-transform', open && 'rotate-180')}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {open && (
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-label={label}
            tabIndex={-1}
            onKeyDown={handleListKeyDown}
            className="animate-scale-in absolute z-20 mt-2 max-h-60 w-full origin-top overflow-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10 focus:outline-none"
          >
            {options.map((option, index) => {
              const isSelected = option.value === value
              const isActive = index === activeIndex
              return (
                <li
                  key={option.value || `__empty-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => commit(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    'flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors',
                    isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-700',
                    isSelected && 'font-semibold',
                  )}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
