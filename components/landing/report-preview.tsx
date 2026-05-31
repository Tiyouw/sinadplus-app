import Link from 'next/link'
import { ArrowRight, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

const annotations = [
  'Profil anak dan konteks singkat',
  'Ringkasan skrining terbaru',
  'Catatan perilaku beberapa hari',
  'Aktivitas yang pernah dicoba',
  'Disclaimer non-diagnosis',
]

export function ReportPreviewSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Flagship output</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            Bukti akhirnya konkret: laporan yang bisa dibawa saat konsultasi.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Landing page harus membuat juri melihat bahwa SINAD+ bukan hanya formulir. Nilai utamanya adalah mengubah observasi rumah menjadi dokumen yang lebih terstruktur.
          </p>
          <Button asChild size="lg" className="mt-8 h-14 rounded-2xl bg-blue-600 px-7 text-base font-semibold hover:bg-blue-700">
            <Link href="/laporan">
              Lihat Demo Laporan
              <ArrowRight aria-hidden="true" className="ml-2" size={18} />
            </Link>
          </Button>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-blue-200/50 to-orange-100/70 blur-2xl" />
          <div className="relative rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-[0_40px_120px_rgba(37,99,235,0.18)] backdrop-blur-xl">
            <div className="rounded-[1.5rem] bg-slate-950 p-4 text-white">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Preview PDF</p>
                  <h3 className="mt-1 text-2xl font-semibold">Laporan Konsultasi SINAD+</h3>
                </div>
                <FileText aria-hidden="true" className="text-cyan-300" size={28} />
              </div>

              <div className="grid gap-4 rounded-[1.25rem] bg-white p-5 text-slate-950 md:grid-cols-[1fr_0.72fr]">
                <div className="space-y-4">
                  <div className="rounded-2xl bg-blue-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Profil</p>
                    <p className="mt-2 text-xl font-semibold">Alya · 7 tahun</p>
                    <p className="text-sm text-slate-500">Data demo fiktif untuk presentasi</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">Skor awal</p>
                      <p className="text-3xl font-semibold text-slate-950">32</p>
                    </div>
                    <div className="rounded-2xl bg-cyan-50 p-4">
                      <p className="text-sm text-slate-500">Domain</p>
                      <p className="text-lg font-semibold text-slate-950">Fokus</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-dashed border-blue-200 p-4 text-sm leading-6 text-slate-600">
                    SINAD+ bukan alat diagnosis. Ringkasan ini membantu menyiapkan diskusi dengan profesional.
                  </div>
                </div>

                <div className="space-y-3">
                  {annotations.map((annotation) => (
                    <div key={annotation} className="rounded-2xl bg-orange-50 px-4 py-3 text-sm font-medium text-orange-900">
                      {annotation}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
