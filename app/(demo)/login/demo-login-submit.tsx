'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { BrandMark } from '@/components/brand/brand-mark'

export function DemoLoginSubmit() {
  const { pending } = useFormStatus()

  return (
    <>
      <Button type="submit" className="w-full" size="lg" disabled={pending} aria-disabled={pending}>
        {pending ? 'Masuk Demo…' : 'Masuk Demo'}
      </Button>

      {pending && (
        <div
          className="animate-fade-in mt-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-4"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center">
              <span className="loading-orb absolute inset-0 rounded-full bg-blue-500/20" aria-hidden="true" />
              <BrandMark className="relative h-8 w-8 rounded-full" imageClassName="p-0.5" priority />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-900">Sedang menyiapkan dashboard demo…</p>
              <p className="text-xs text-blue-800">Mohon tunggu sebentar.</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
