import Link from 'next/link'
import { Activity, ArrowRight, BookOpen, ClipboardList, FileText, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MEDICAL_DISCLAIMER } from '@/lib/constants/copy'

const observationCards = [
  { label: 'Skrining SNAP-IV', value: '18 respons', icon: ClipboardList, className: 'left-3 top-10 report-card-float' },
  { label: 'Catatan Harian', value: '5 pola terlihat', icon: BookOpen, className: 'right-4 top-20 report-card-float report-card-float-delay-1' },
  { label: 'Aktivitas Terstruktur', value: '2 dicoba', icon: Activity, className: 'bottom-16 left-8 report-card-float report-card-float-delay-2' },
]

export function LandingHero() {
  return (
    <section className="relative mx-auto grid max-w-7xl gap-14 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:px-8 lg:pb-28 lg:pt-20">
      <div className="pointer-events-none absolute -left-32 top-16 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-28 h-96 w-96 rounded-full bg-cyan-200/40 blur-3xl" />

      <div className="relative animate-soft-in">
        <p className="mb-6 inline-flex rounded-full border border-blue-200/70 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur">
          Pendamping observasi awal untuk orang tua
        </p>

        <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-7xl">
          Ubah catatan kecil di rumah menjadi
          <span className="block bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
            bekal konsultasi yang terarah.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
          SINAD+ membantu orang tua menyusun skrining awal, aktivitas bermain terstruktur, dan catatan harian menjadi ringkasan yang lebih siap dibawa saat konsultasi profesional.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-14 rounded-2xl bg-slate-950 px-7 text-base font-semibold shadow-2xl shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-blue-700">
            <Link href="/login">
              Masuk Demo
              <ArrowRight aria-hidden="true" className="ml-2" size={18} />
            </Link>
          </Button>
          <a href="#alur" className="inline-flex h-14 items-center justify-center rounded-2xl border border-slate-200 bg-white/75 px-7 text-base font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700">
            Lihat Alur
          </a>
        </div>

        <div className="mt-8 flex max-w-xl gap-3 rounded-3xl border border-blue-100 bg-white/70 p-4 text-sm leading-6 text-slate-600 shadow-sm backdrop-blur">
          <ShieldCheck aria-hidden="true" className="mt-0.5 shrink-0 text-blue-600" size={20} />
          <p>{MEDICAL_DISCLAIMER}</p>
        </div>
      </div>

      <div className="relative min-h-[520px] animate-soft-in animate-soft-in-delay-1">
        <div className="absolute inset-0 rounded-[2.5rem] border border-white/80 bg-white/55 shadow-[0_40px_120px_rgba(37,99,235,0.18)] backdrop-blur-xl" />
        <div className="absolute inset-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-50 via-white to-orange-50">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 560 520" fill="none" aria-hidden="true">
            <path className="report-line-draw" d="M118 112 C205 130 222 196 286 242" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
            <path className="report-line-draw" d="M450 154 C388 164 356 204 310 242" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" />
            <path className="report-line-draw" d="M156 396 C224 366 254 314 292 278" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
            <circle cx="418" cy="354" r="72" fill="#FFF7ED" opacity="0.9" />
            <path d="M388 361c0-24 19-43 43-43s43 19 43 43" stroke="#FDBA74" strokeWidth="8" strokeLinecap="round" opacity="0.55" />
            <circle cx="405" cy="315" r="14" fill="#FDBA74" opacity="0.55" />
            <circle cx="444" cy="307" r="18" fill="#FDBA74" opacity="0.45" />
          </svg>

          {observationCards.map((card) => {
            const Icon = card.icon
            return (
              <div key={card.label} className={`absolute w-52 rounded-3xl border border-white/80 bg-white/90 p-4 shadow-xl shadow-blue-900/10 backdrop-blur ${card.className}`}>
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                    <Icon aria-hidden="true" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{card.label}</p>
                    <p className="text-xs text-slate-500">{card.value}</p>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                </div>
              </div>
            )
          })}

          <div className="report-sheet-enter absolute left-1/2 top-1/2 w-72 -translate-x-1/2 -translate-y-1/2 rounded-[1.75rem] border border-blue-100 bg-white p-6 shadow-2xl shadow-blue-900/15">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Ringkasan Konsultasi</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Alya · 7 tahun</h2>
              </div>
              <FileText aria-hidden="true" className="text-blue-600" size={24} />
            </div>
            <div className="space-y-3">
              <div className="rounded-2xl bg-blue-50 p-3">
                <div className="text-xs font-medium text-blue-700">Domain dominan</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">Fokus / Atensi</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <div className="text-2xl font-semibold text-slate-950">32</div>
                  <div className="text-xs text-slate-500">skor awal</div>
                </div>
                <div className="rounded-2xl bg-orange-50 p-3">
                  <div className="text-2xl font-semibold text-slate-950">5</div>
                  <div className="text-xs text-slate-500">catatan</div>
                </div>
              </div>
              <div className="rounded-2xl border border-dashed border-blue-200 bg-white p-3 text-xs leading-5 text-slate-500">
                Bukan diagnosis. Gunakan sebagai bekal diskusi dengan profesional.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
