import { getScreeningById, getActivities } from '@/lib/supabase/queries'
import { MEDICAL_DISCLAIMER } from '@/lib/constants/copy'
import { getCategoryDisplay, getDomainLabel } from '@/lib/constants/categories'
import { AlertCircle, TrendingUp, Activity, ArrowRight, Lightbulb, BookOpen, FileText, HeartHandshake, ClipboardList } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ screeningId: string }>
}

async function loadScreeningData(screeningId: string) {
  try {
    const screening = await getScreeningById(screeningId)
    const activities = await getActivities(screening.dominant_domain)
    return { screening, activities }
  } catch (error) {
    console.error('Error loading screening data:', error)
    return null
  }
}

function ResultsFallback() {
  return (
    <div className="mx-auto max-w-4xl p-6 lg:p-8">
      <div className="rounded-3xl border border-amber-200 bg-amber-50/80 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
            <AlertCircle aria-hidden="true" size={24} />
          </div>
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-950">
                Hasil skrining tidak ditemukan
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700">
                Kami tidak dapat menemukan hasil skrining yang Anda cari. Pastikan tautan yang
                digunakan benar atau lakukan skrining baru.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/skrining"
                className="inline-flex items-center rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Mulai Skrining Baru
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Kembali ke Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ResultsContent({
  screening,
  activities,
}: {
  screening: Awaited<ReturnType<typeof getScreeningById>>
  activities: Awaited<ReturnType<typeof getActivities>>
}) {
  const categoryDisplay = getCategoryDisplay(screening.category)
  const domainLabel = getDomainLabel(screening.dominant_domain)

  const suggestedActivities = activities.slice(0, 3)

  return (
    <div className="mx-auto max-w-4xl p-6 lg:p-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-700">Hasil Skrining SNAP-IV</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Hasil Skrining Anda</h1>
        <p className="mt-2 text-slate-600">
          Berikut adalah ringkasan hasil skrining perilaku anak berdasarkan SNAP-IV.
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle aria-hidden="true" className="mt-0.5 flex-shrink-0 text-red-600" size={20} />
          <div>
            <h2 className="mb-1 font-semibold text-red-900">Disclaimer Medis</h2>
            <p className="text-sm text-red-800">{MEDICAL_DISCLAIMER}</p>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="sinad-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-blue-100 p-2">
              <TrendingUp aria-hidden="true" className="text-blue-600" size={24} />
            </div>
            <h2 className="font-semibold text-slate-900">Total Skor</h2>
          </div>
          <div className="mb-3">
            <div className="mb-1 text-4xl font-bold text-slate-900">{screening.total_score}</div>
            <div className="text-sm text-slate-600">dari 54 maksimal</div>
          </div>
          <div className="border-t border-slate-100 pt-3">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <span>Kategori:</span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold animate-pop ${categoryDisplay.badgeClass}`}
              >
                <span className={`h-2 w-2 rounded-full ${categoryDisplay.dotClass}`} />
                {categoryDisplay.label}
              </span>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">{categoryDisplay.description}</p>
          </div>
        </div>

        <div className="sinad-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-purple-100 p-2">
              <Activity aria-hidden="true" className="text-purple-600" size={24} />
            </div>
            <h2 className="font-semibold text-slate-900">Skor Atensi</h2>
          </div>
          <div className="mb-3">
            <div className="mb-1 text-4xl font-bold text-slate-900">
              {screening.inattention_score}
            </div>
            <div className="text-sm text-slate-600">dari 27 maksimal</div>
          </div>
          <div className="border-t border-slate-100 pt-3">
            <p className="text-xs text-slate-500">Skor domain ketidakperhatian</p>
          </div>
        </div>

        <div className="sinad-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-green-100 p-2">
              <Activity aria-hidden="true" className="text-green-600" size={24} />
            </div>
            <h2 className="font-semibold text-slate-900">Skor Hiperaktif/Impulsif</h2>
          </div>
          <div className="mb-3">
            <div className="mb-1 text-4xl font-bold text-slate-900">
              {screening.hyperactivity_impulsivity_score}
            </div>
            <div className="text-sm text-slate-600">dari 27 maksimal</div>
          </div>
          <div className="border-t border-slate-100 pt-3">
            <p className="text-xs text-slate-500">Skor domain hiperaktivitas-impulsivitas</p>
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-6 lg:p-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-2xl bg-purple-100 p-2">
            <Lightbulb aria-hidden="true" className="text-purple-600" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Domain Dominan: {domainLabel}</h2>
        </div>
        <p className="mb-6 text-slate-700">
          Berdasarkan hasil skrining, domain {domainLabel.toLowerCase()} menunjukkan skor yang
          lebih tinggi. Berikut adalah beberapa aktivitas yang dapat membantu:
        </p>

        {suggestedActivities.length > 0 ? (
          <div className="space-y-4">
            {suggestedActivities.map((activity) => (
              <Link
                key={activity.id}
                href={`/aktivitas/${activity.id}`}
                className="block rounded-2xl border border-purple-200 bg-white p-4 transition-all hover:border-purple-300 hover:shadow-md"
              >
                <h3 className="mb-2 font-semibold text-slate-900">{activity.title}</h3>
                <p className="mb-3 text-sm text-slate-600">{activity.objective}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>Usia: {activity.age_min}-{activity.age_max} tahun</span>
                  <span>Durasi: {activity.duration_minutes} menit</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-600">
            Belum ada aktivitas yang tersedia untuk domain ini.
          </p>
        )}
      </div>

      <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 lg:p-8">
        <h2 className="mb-3 text-2xl font-bold text-slate-900">Langkah Selanjutnya</h2>
        <p className="mb-6 text-slate-700">
          Hasil skrining ini adalah awal dari satu alur pendampingan. Ikuti langkah berikut secara
          bertahap untuk memahami pola anak dan menyiapkan diskusi dengan profesional.
        </p>

        <ol className="mb-6 space-y-3">
          {[
            { step: 'Pahami ringkasan hasil di halaman ini.', href: null, icon: TrendingUp },
            { step: 'Baca artikel edukasi terkait perilaku anak.', href: '/edukasi', icon: BookOpen },
            { step: 'Coba aktivitas terstruktur untuk diamati.', href: '/aktivitas', icon: Activity },
            { step: 'Catat respons anak setelah aktivitas.', href: '/catatan', icon: ClipboardList },
            { step: 'Siapkan laporan untuk konsultasi.', href: '/laporan', icon: FileText },
            { step: 'Lihat cerita dan tips orang tua terkurasi.', href: '/dukungan', icon: HeartHandshake },
          ].map((item, index) => {
            const Icon = item.icon
            const content = (
              <div className="flex items-center gap-4 rounded-2xl border border-blue-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <Icon aria-hidden="true" className="flex-shrink-0 text-blue-600" size={20} />
                <span className="flex-1 text-sm font-medium text-slate-800">{item.step}</span>
                {item.href && <ArrowRight aria-hidden="true" className="flex-shrink-0 text-blue-400" size={18} />}
              </div>
            )
            return (
              <li key={item.step}>
                {item.href ? <Link href={item.href}>{content}</Link> : content}
              </li>
            )
          })}
        </ol>

        <Link
          href="/laporan"
          className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Lihat Laporan Lengkap
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </div>

      <div className="mt-6 rounded-2xl bg-slate-100 p-4">
        <p className="text-xs leading-relaxed text-slate-600">
          <strong>Catatan:</strong> Hasil skrining ini bersifat edukatif dan tidak menggantikan
          diagnosis medis profesional. Untuk evaluasi lengkap, konsultasikan dengan psikolog,
          psikiater anak, atau dokter anak yang berkompeten.
        </p>
      </div>
    </div>
  )
}

export default async function HasilPage({ params }: PageProps) {
  const { screeningId } = await params

  if (!screeningId) {
    notFound()
  }

  const data = await loadScreeningData(screeningId)

  if (!data) {
    return <ResultsFallback />
  }

  return <ResultsContent {...data} />
}
