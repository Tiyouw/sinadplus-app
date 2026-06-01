import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function FinalCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white shadow-[0_40px_120px_rgba(15,23,42,0.25)] md:p-12">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Siap dicoba</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
              Coba alur demo dan lihat bagaimana laporan konsultasi disusun.
            </h2>
          </div>
          <Button asChild size="lg" className="h-14 rounded-2xl bg-white px-7 text-base font-semibold text-slate-950 hover:bg-blue-50">
            <Link href="/login">
              Masuk Demo
              <ArrowRight aria-hidden="true" className="ml-2" size={18} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
