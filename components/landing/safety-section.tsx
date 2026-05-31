import { ShieldCheck } from 'lucide-react'

const safetyPoints = [
  'Bukan alat diagnosis',
  'Tidak menggantikan psikolog, psikiater anak, atau dokter anak',
  'Membantu orang tua menyiapkan observasi yang lebih rapi',
]

export function SafetySection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-blue-100 bg-blue-50/80 p-8 shadow-[0_24px_80px_rgba(30,64,175,0.08)] backdrop-blur md:p-12">
        <div className="grid gap-8 md:grid-cols-[0.7fr_1fr] md:items-center">
          <div>
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-sm">
              <ShieldCheck aria-hidden="true" size={26} />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Batasan aman</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              Lebih rapi untuk konsultasi, bukan menggantikan konsultasi.
            </h2>
          </div>
          <div className="grid gap-4">
            {safetyPoints.map((point) => (
              <div key={point} className="rounded-3xl bg-white/80 p-5 text-base font-semibold leading-7 text-slate-800 shadow-sm">
                {point}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
