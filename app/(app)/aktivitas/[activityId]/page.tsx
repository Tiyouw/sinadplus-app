import { getActivityById } from '@/lib/supabase/queries'
import { AlertCircle, ArrowLeft, Clock, Target, Users, Wrench, ListChecks, Eye, ShieldAlert, StopCircle, BookOpen } from 'lucide-react'
import Link from 'next/link'

type ActivityData = Awaited<ReturnType<typeof getActivityById>>

function ActivityFallback() {
  return (
    <div className="mx-auto max-w-4xl p-6 lg:p-8">
      <div className="mb-6">
        <Link
          href="/aktivitas"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Kembali ke Daftar Aktivitas
        </Link>
      </div>
      <div className="rounded-3xl border border-amber-200 bg-amber-50/80 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
            <AlertCircle aria-hidden="true" size={24} />
          </div>
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-950">
                Aktivitas tidak ditemukan
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700">
                Aktivitas yang Anda cari tidak tersedia atau belum dapat dimuat saat ini.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/aktivitas"
                className="inline-flex items-center rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Lihat Semua Aktivitas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ActivityContent({ activity }: { activity: ActivityData }) {
  const steps = Array.isArray(activity.steps_json)
    ? activity.steps_json.filter((step): step is string => typeof step === 'string')
    : []

  return (
    <div className="mx-auto max-w-4xl p-6 lg:p-8">
      <div className="mb-6">
        <Link
          href="/aktivitas"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Kembali ke Daftar Aktivitas
        </Link>
      </div>

      <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm leading-relaxed text-blue-900">
          <strong>Catatan Penting:</strong> Ini adalah aktivitas bermain terstruktur, bukan terapi medis.
          Aktivitas dirancang untuk membantu orang tua mengamati dan mendampingi anak dalam lingkungan rumah yang aman.
        </p>
      </div>

      <div className="sinad-card mb-6 p-8">
        <div className="mb-4 inline-block rounded-xl bg-purple-100 px-3 py-1.5 text-sm font-medium text-purple-700">
          {activity.domain}
        </div>
        <h1 className="mb-4 text-3xl font-bold text-slate-900">{activity.title}</h1>

        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Users aria-hidden="true" className="text-slate-400" size={18} />
            <span>Usia {activity.age_min}-{activity.age_max} tahun</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock aria-hidden="true" className="text-slate-400" size={18} />
            <span>{activity.duration_minutes} menit</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <section className="sinad-card p-6">
          <div className="mb-3 flex items-center gap-2">
            <Target aria-hidden="true" className="text-blue-600" size={20} />
            <h2 className="text-lg font-semibold text-slate-900">Tujuan Aktivitas</h2>
          </div>
          <p className="text-slate-700">{activity.objective}</p>
        </section>

        <section className="sinad-card p-6">
          <div className="mb-3 flex items-center gap-2">
            <Wrench aria-hidden="true" className="text-purple-600" size={20} />
            <h2 className="text-lg font-semibold text-slate-900">Alat dan Bahan</h2>
          </div>
          <p className="text-slate-700">{activity.tools}</p>
        </section>

        <section className="sinad-card p-6">
          <div className="mb-3 flex items-center gap-2">
            <ListChecks aria-hidden="true" className="text-green-600" size={20} />
            <h2 className="text-lg font-semibold text-slate-900">Langkah-Langkah</h2>
          </div>
          {steps.length > 0 ? (
            <ol className="space-y-3">
              {steps.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-700">
                    {index + 1}
                  </span>
                  <span className="flex-1 pt-0.5 text-slate-700">{step}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-slate-700">Langkah-langkah akan ditampilkan di sini.</p>
          )}
        </section>

        <section className="sinad-card p-6">
          <div className="mb-3 flex items-center gap-2">
            <Eye aria-hidden="true" className="text-indigo-600" size={20} />
            <h2 className="text-lg font-semibold text-slate-900">Perilaku yang Diamati</h2>
          </div>
          <p className="text-slate-700">{activity.observed_behaviors}</p>
        </section>

        <section className="sinad-card border-amber-200 bg-amber-50/50 p-6">
          <div className="mb-3 flex items-center gap-2">
            <ShieldAlert aria-hidden="true" className="text-amber-600" size={20} />
            <h2 className="text-lg font-semibold text-slate-900">Catatan Keamanan</h2>
          </div>
          <p className="text-slate-700">{activity.safety_notes}</p>
        </section>

        <section className="sinad-card border-red-200 bg-red-50/50 p-6">
          <div className="mb-3 flex items-center gap-2">
            <StopCircle aria-hidden="true" className="text-red-600" size={20} />
            <h2 className="text-lg font-semibold text-slate-900">Kapan Harus Berhenti</h2>
          </div>
          <p className="text-slate-700">{activity.stop_conditions}</p>
        </section>

        <section className="sinad-card p-6">
          <div className="mb-3 flex items-center gap-2">
            <BookOpen aria-hidden="true" className="text-slate-600" size={20} />
            <h2 className="text-lg font-semibold text-slate-900">Dasar Pemikiran</h2>
          </div>
          <p className="mb-4 text-slate-700">{activity.rationale}</p>
          <div className="border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-500">
              <strong>Sumber:</strong> {activity.source_label}
            </p>
          </div>
        </section>
      </div>

      <div className="mt-8 rounded-2xl bg-slate-100 p-4">
        <p className="text-xs leading-relaxed text-slate-600">
          <strong>Disclaimer:</strong> Aktivitas ini bersifat edukatif dan tidak menggantikan
          evaluasi atau intervensi profesional. Untuk kekhawatiran perkembangan anak, konsultasikan
          dengan psikolog, psikiater anak, atau dokter anak.
        </p>
      </div>
    </div>
  )
}

async function getSafeActivity(activityId: string) {
  try {
    return await getActivityById(activityId)
  } catch {
    return null
  }
}

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ activityId: string }>
}) {
  const { activityId } = await params
  const activity = await getSafeActivity(activityId)

  if (!activity) {
    return <ActivityFallback />
  }

  return <ActivityContent activity={activity} />
}
