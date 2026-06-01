import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { APP_NAME } from '@/lib/constants/copy'

export function PublicNav() {
  return (
    <nav aria-label="Navigasi utama" className="sticky top-0 z-50 border-b border-white/60 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-transform group-hover:scale-105">
              S+
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-slate-950">{APP_NAME}</div>
              <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">Parent companion</div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-xl shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-blue-700/20"
            >
              Masuk Demo
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
