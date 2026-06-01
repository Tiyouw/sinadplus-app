import { getActivities } from '@/lib/supabase/queries'
import { BookOpen, Clock, Target } from 'lucide-react'
import Link from 'next/link'

type ActivitiesData = Awaited<ReturnType<typeof getActivities>>

function ActivitiesFallback() {
  return (
    <div className="mx-auto max-w-4xl p-6 lg:p-8">
      <div className="rounded-3xl border border-amber-200 bg-amber-50/80 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
            <BookOpen aria-hidden="true" size={24} />
          </div>
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-950">
                Aktivitas belum dapat dimuat
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700">
                Kami belum dapat menampilkan daftar aktivitas saat ini. Pastikan konfigurasi
                database sudah tersedia, lalu coba muat ulang halaman.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
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

function ActivitiesContent({ activities }: { activities: ActivitiesData }) {
  return (
    <div className="mx-auto max-w-7xl p-6 lg:p-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-700">Perpustakaan Aktivitas</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Aktivitas Bermain Terstruktur</h1>
        <p className="mt-2 text-slate-600">
          Kumpulan aktivitas bermain yang dapat membantu mengamati dan mendampingi perkembangan anak
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm leading-relaxed text-blue-900">
          <strong>Catatan Penting:</strong> Aktivitas ini bukan terapi medis. Aktivitas dirancang
          sebagai pendampingan bermain terstruktur yang aman dilakukan di rumah untuk membantu
          orang tua mengamati perilaku anak dalam berbagai situasi.
        </p>
      </div>

      {activities.length === 0 ? (
        <div className="sinad-card p-8 text-center">
          <BookOpen aria-hidden="true" className="mx-auto mb-4 text-slate-400" size={48} />
          <h2 className="mb-2 text-lg font-semibold text-slate-900">Belum ada aktivitas</h2>
          <p className="text-sm text-slate-600">
            Aktivitas bermain terstruktur akan ditampilkan di sini setelah data tersedia.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity) => (
            <Link
              key={activity.id}
              href={`/aktivitas/${activity.id}`}
              className="sinad-card group p-6 transition-all hover:shadow-lg"
            >
              <div className="mb-4">
                <div className="mb-2 inline-block rounded-xl bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                  {activity.domain}
                </div>
                <h2 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600">
                  {activity.title}
                </h2>
              </div>

              <div className="mb-4 space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Target aria-hidden="true" className="flex-shrink-0 text-slate-400" size={16} />
                  <span className="line-clamp-2">{activity.objective}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock aria-hidden="true" className="flex-shrink-0 text-slate-400" size={16} />
                  <span>{activity.duration_minutes} menit</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <div className="text-xs text-slate-500">
                  Usia {activity.age_min}-{activity.age_max} tahun
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 rounded-2xl bg-slate-100 p-4">
        <p className="text-xs leading-relaxed text-slate-600">
          <strong>Disclaimer:</strong> Aktivitas ini bersifat edukatif dan tidak menggantikan
          intervensi profesional. Jika Anda memiliki kekhawatiran tentang perkembangan anak,
          konsultasikan dengan psikolog, psikiater anak, atau dokter anak.
        </p>
      </div>
    </div>
  )
}

async function getSafeActivities() {
  try {
    return await getActivities()
  } catch {
    return null
  }
}

export default async function ActivitiesPage() {
  const activities = await getSafeActivities()

  if (!activities) {
    return <ActivitiesFallback />
  }

  return <ActivitiesContent activities={activities} />
}
