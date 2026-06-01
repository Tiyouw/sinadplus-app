import { Activity, BookOpen, ClipboardList, FileText } from 'lucide-react'

const steps = [
  {
    title: 'Skrining Awal',
    parent: 'Orang tua menjawab pertanyaan observasi awal.',
    system: 'SINAD+ menyusun skor dan domain yang perlu diperhatikan.',
    boundary: 'Hasil adalah indikasi awal, bukan diagnosis.',
    icon: ClipboardList,
  },
  {
    title: 'Aktivitas Bermain Terstruktur',
    parent: 'Orang tua mencoba aktivitas singkat yang aman di rumah.',
    system: 'SINAD+ menghubungkan aktivitas dengan area pengamatan.',
    boundary: 'Aktivitas adalah observasi rumah, bukan arahan profesional.',
    icon: Activity,
  },
  {
    title: 'Catatan Harian',
    parent: 'Orang tua mencatat mood, fokus, kerja sama, dan kejadian penting.',
    system: 'SINAD+ merapikan pola dari beberapa hari pengamatan.',
    boundary: 'Catatan hanya mendukung diskusi, bukan penilaian final.',
    icon: BookOpen,
  },
  {
    title: 'Laporan Konsultasi',
    parent: 'Orang tua membawa ringkasan yang lebih rapi saat bertemu profesional.',
    system: 'SINAD+ membuat PDF berisi profil, skrining, catatan, aktivitas, dan disclaimer.',
    boundary: 'Keputusan tetap dilakukan bersama profesional.',
    icon: FileText,
  },
]

export function SolutionFlow() {
  return (
    <section id="alur" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Alur produk</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            SINAD+ merapikan observasi menjadi langkah yang bisa diikuti.
          </h2>
        </div>
        <p className="max-w-md text-base leading-7 text-slate-600">
          Setiap tahap menjelaskan apa yang dilakukan orang tua, apa yang disusun sistem, dan batasan aman yang harus tetap terlihat.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <article key={step.title} className="relative rounded-[1.75rem] border border-white/80 bg-white/75 p-6 shadow-[0_24px_80px_rgba(30,64,175,0.08)] backdrop-blur">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <Icon aria-hidden="true" size={22} />
                </div>
                <span className="text-sm font-bold text-blue-600">0{index + 1}</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-950">{step.title}</h3>
              <dl className="mt-5 space-y-4 text-sm leading-6">
                <div>
                  <dt className="font-semibold text-slate-900">Orang tua</dt>
                  <dd className="text-slate-600">{step.parent}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">SINAD+</dt>
                  <dd className="text-slate-600">{step.system}</dd>
                </div>
                <div className="rounded-2xl bg-blue-50 p-3">
                  <dt className="font-semibold text-blue-900">Batas aman</dt>
                  <dd className="text-blue-800/80">{step.boundary}</dd>
                </div>
              </dl>
            </article>
          )
        })}
      </div>
    </section>
  )
}
