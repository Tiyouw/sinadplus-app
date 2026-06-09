import { Brain, CheckCircle2, Database, FileText, ShieldCheck, Sparkles } from 'lucide-react'

const capabilities = [
  {
    title: 'Menggabungkan 3 sumber data',
    description: 'Skrining SNAP-IV, catatan perilaku, dan aktivitas rumah dipakai bersama agar rekomendasi tidak berhenti di angka skor.',
    icon: Database,
  },
  {
    title: 'Rekomendasi berikutnya adaptif',
    description: 'Sistem memprioritaskan aktivitas berdasarkan domain dominan, rerata fokus/kerja sama, dan konsistensi catatan orang tua.',
    icon: Brain,
  },
  {
    title: 'Narasi pendamping yang aman',
    description: 'Ringkasan disusun dengan bahasa yang mudah dipahami orang tua, tetap non-diagnostik, dan selalu menjaga batas aman medis.',
    icon: Sparkles,
  },
  {
    title: 'Output siap konsultasi',
    description: 'Insight yang sama muncul di dashboard, hasil skrining, dan laporan PDF agar cerita produk konsisten dari awal sampai konsultasi.',
    icon: FileText,
  },
]

const safeguards = [
  'Tidak mendiagnosis ADHD atau menggantikan profesional.',
  'Tidak memberi saran obat, dosis, atau klaim kesembuhan.',
  'Setiap insight menjelaskan sumber data dan alasan rekomendasi.',
]

export function InnovationSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2.25rem] border border-indigo-100 bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 p-6 text-white shadow-[0_40px_120px_rgba(30,64,175,0.24)] lg:p-10">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
              <Sparkles aria-hidden="true" size={14} />
              Lapisan insight
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
              Dari data harian menjadi arahan pendampingan yang lebih jelas.
            </h2>
            <p className="mt-5 text-base leading-8 text-blue-100">
              SINAD+ membantu menghubungkan kebutuhan orang tua, bukti observasi di rumah, dan batas aman medis agar langkah berikutnya lebih terarah.
            </p>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-400/15 p-2 text-emerald-200">
                  <ShieldCheck aria-hidden="true" size={22} />
                </div>
                <h3 className="font-semibold text-white">Batas aman medis yang jelas</h3>
              </div>
              <div className="space-y-3">
                {safeguards.map((item) => (
                  <div key={item} className="flex gap-3 text-sm leading-6 text-blue-100">
                    <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-emerald-300" size={18} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {capabilities.map((capability) => {
              const Icon = capability.icon
              return (
                <article key={capability.title} className="rounded-3xl border border-white/10 bg-white/[0.08] p-5 backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.12]">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/15 text-cyan-200">
                    <Icon aria-hidden="true" size={22} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{capability.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-blue-100">{capability.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
