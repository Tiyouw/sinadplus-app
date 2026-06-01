import { APP_NAME, MEDICAL_DISCLAIMER } from '@/lib/constants/copy'
import { BrandMark } from '@/components/brand/brand-mark'

export default function DemoLoginLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 via-white to-amber-50/40 px-4">
      <div className="animate-fade-in flex w-full max-w-md flex-col items-center text-center">
        {/* Animated orb with brand mark */}
        <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
          <span className="loading-orb absolute inset-0 rounded-full bg-blue-500/20" aria-hidden="true" />
          <span className="loading-orb absolute inset-3 rounded-full bg-blue-500/30" aria-hidden="true" />
          <BrandMark className="relative h-14 w-14 rounded-full" priority />
        </div>

        <h1 className="text-xl font-semibold text-slate-900">
          Menyiapkan demo {APP_NAME}…
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Mohon tunggu sebentar, kami sedang memuat data demo Anda.
        </p>

        {/* Calm disclaimer card */}
        <div className="animate-scale-in mt-8 w-full rounded-3xl border border-blue-100 bg-white/80 p-5 text-left shadow-sm backdrop-blur-sm">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
            Catatan Penting
          </p>
          <p className="text-sm leading-relaxed text-slate-600">
            {MEDICAL_DISCLAIMER}
          </p>
        </div>
      </div>
    </main>
  )
}
