import { HeartHandshake, BookOpen, MessageCircleQuestion, ShieldAlert, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import {
  PARENT_STORIES,
  SUPPORT_TIPS,
  CONSULTATION_QUESTIONS,
} from '@/lib/seed-data/support-content'

export default function DukunganPage() {
  return (
    <div className="mx-auto max-w-5xl p-6 lg:p-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-700">Dukungan Terkurasi</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Cerita dan Tips Orang Tua</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Kumpulan cerita, tips aman, dan pertanyaan persiapan konsultasi yang dikurasi untuk
          membantu refleksi orang tua. Halaman ini bukan forum langsung dan bukan nasihat medis.
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <HeartHandshake aria-hidden="true" className="mt-0.5 flex-shrink-0 text-blue-600" size={20} />
          <p className="text-sm leading-relaxed text-blue-900">
            Cerita di sini bersifat umum dan disusun untuk inspirasi, bukan kesaksian keberhasilan
            terapi. Setiap anak berbeda, dan hasil dapat bervariasi.
          </p>
        </div>
      </div>

      {/* Cerita Orang Tua Terkurasi */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-2xl bg-indigo-100 p-2">
            <BookOpen aria-hidden="true" className="text-indigo-600" size={22} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Cerita Orang Tua Terkurasi</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PARENT_STORIES.map((story) => (
            <article key={story.id} className="sinad-card flex flex-col p-6">
              <div className="mb-3 inline-block w-fit rounded-xl bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                {story.childContext}
              </div>
              <div className="space-y-3 text-sm leading-6 text-slate-600">
                <p>
                  <span className="font-semibold text-slate-800">Situasi:</span> {story.situation}
                </p>
                <p>
                  <span className="font-semibold text-slate-800">Yang diamati:</span> {story.observed}
                </p>
                <p>
                  <span className="font-semibold text-slate-800">Persiapan:</span> {story.prepared}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Tips Aman */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-2xl bg-green-100 p-2">
            <CheckCircle2 aria-hidden="true" className="text-green-600" size={22} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Tips Aman dari Pengalaman Orang Tua</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {SUPPORT_TIPS.map((tip) => (
            <div key={tip.id} className="sinad-card p-5">
              <h3 className="mb-1 font-semibold text-slate-900">{tip.title}</h3>
              <p className="text-sm leading-6 text-slate-600">{tip.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pertanyaan untuk Konsultasi */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-2xl bg-purple-100 p-2">
            <MessageCircleQuestion aria-hidden="true" className="text-purple-600" size={22} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Pertanyaan untuk Konsultasi</h2>
        </div>
        <div className="sinad-card p-6">
          <p className="mb-4 text-sm text-slate-600">
            Anda dapat membawa pertanyaan berikut saat berkonsultasi dengan psikolog, psikiater
            anak, atau dokter anak:
          </p>
          <ul className="space-y-3">
            {CONSULTATION_QUESTIONS.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                  ?
                </span>
                <span className="text-sm leading-6 text-slate-700">{item.question}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 border-t border-slate-100 pt-4">
            <Link
              href="/laporan"
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Siapkan Laporan Konsultasi
            </Link>
          </div>
        </div>
      </section>

      {/* Batasan Dukungan */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-start gap-3">
          <ShieldAlert aria-hidden="true" className="mt-0.5 flex-shrink-0 text-amber-600" size={20} />
          <div>
            <h2 className="mb-1 font-semibold text-amber-900">Batasan Dukungan</h2>
            <p className="text-sm leading-6 text-amber-900">
              Cerita dan tips di halaman ini bersifat informatif dan tidak menggantikan evaluasi
              profesional. SINAD+ tidak membuat diagnosis. Untuk kekhawatiran yang mendesak atau
              berat, diskusikan dengan psikolog, psikiater anak, atau dokter anak yang berkompeten.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
