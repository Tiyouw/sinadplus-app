import { HelpCircle, MessageSquareText, NotebookPen } from 'lucide-react'

const problems = [
  {
    title: 'Catatan tercecer',
    body: 'Orang tua mengingat banyak kejadian kecil, tetapi sering belum tersusun menjadi pola yang mudah dibaca.',
    icon: NotebookPen,
  },
  {
    title: 'Bingung harus mulai dari mana',
    body: 'Kekhawatiran muncul, tetapi langkah pertama yang aman dan tidak berlebihan belum selalu jelas.',
    icon: HelpCircle,
  },
  {
    title: 'Sulit menjelaskan pola saat konsultasi',
    body: 'Saat bertemu profesional, orang tua membutuhkan ringkasan yang rapi, bukan ingatan yang terpencar.',
    icon: MessageSquareText,
  },
]

export function ProblemSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Masalah orang tua</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
          Banyak tanda terlihat di rumah, tetapi belum tentu siap diceritakan.
        </h2>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          SINAD+ tidak menakut-nakuti orang tua. Produk ini membantu menyusun pengamatan sehari-hari agar lebih mudah dipahami dan dibawa ke konsultasi.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {problems.map((problem, index) => {
          const Icon = problem.icon
          return (
            <article key={problem.title} className={`sinad-card animate-soft-in animate-soft-in-delay-${index + 1} p-7`}>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                <Icon aria-hidden="true" size={24} />
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-slate-950">{problem.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{problem.body}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
