import { getBehaviorLogs, getActivities } from '@/lib/supabase/queries'
import { AlertCircle, FileText, Calendar, Brain, Zap, Users as UsersIcon } from 'lucide-react'
import Link from 'next/link'
import { BehaviorLogForm } from './behavior-log-form'

type BehaviorLogsData = Awaited<ReturnType<typeof getBehaviorLogs>>
type ActivitiesData = Awaited<ReturnType<typeof getActivities>>

function CatatanFallback() {
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
                Catatan belum dapat dimuat
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700">
                Kami belum dapat menampilkan catatan perilaku saat ini. Pastikan konfigurasi
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

function CatatanContent({ logs, activities }: { logs: BehaviorLogsData; activities: ActivitiesData }) {
  return (
    <div className="mx-auto max-w-7xl p-6 lg:p-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-700">Catatan Perilaku</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Observasi Harian</h1>
        <p className="mt-2 text-slate-600">
          Catat perilaku anak untuk membantu memahami pola dan perkembangan
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Tambah Catatan Baru</h2>
          <div className="sinad-card p-6">
            <BehaviorLogForm activities={activities} />
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-xl font-semibold text-slate-900">
            Riwayat Catatan ({logs.length})
          </h2>
          <p className="mb-4 text-sm text-slate-500">
            Catatan terbaru tampil di atas. Jika catatan semakin banyak, daftar ini dapat digulir tanpa menutup formulir.
          </p>

          {logs.length === 0 ? (
            <div className="sinad-card p-8 text-center">
              <FileText aria-hidden="true" className="mx-auto mb-4 text-slate-400" size={48} />
              <h3 className="mb-2 text-lg font-semibold text-slate-900">Belum ada catatan</h3>
              <p className="text-sm text-slate-600">
                Mulai mencatat observasi perilaku anak menggunakan formulir di sebelah kiri.
              </p>
            </div>
          ) : (
            <div
              data-testid="catatan-history-scroll"
              className="space-y-4 pr-1 lg:max-h-[calc(100vh-14rem)] lg:overflow-y-auto lg:overscroll-contain"
            >
              {logs.map((log) => (
                <div key={log.id} className="sinad-card p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar aria-hidden="true" size={16} />
                      <span>
                        {new Date(log.log_date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="inline-block rounded-xl bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      {log.mood}
                    </div>
                  </div>

                  <div className="mb-4 grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Brain aria-hidden="true" className="flex-shrink-0 text-purple-600" size={18} />
                      <div>
                        <div className="text-xs text-slate-500">Fokus</div>
                        <div className="font-semibold text-slate-900">{log.focus_rating}/5</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap aria-hidden="true" className="flex-shrink-0 text-amber-600" size={18} />
                      <div>
                        <div className="text-xs text-slate-500">Impulsivitas</div>
                        <div className="font-semibold text-slate-900">{log.impulsivity_rating}/5</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <UsersIcon aria-hidden="true" className="flex-shrink-0 text-green-600" size={18} />
                      <div>
                        <div className="text-xs text-slate-500">Kerja Sama</div>
                        <div className="font-semibold text-slate-900">{log.cooperation_rating}/5</div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-slate-700">{log.notes}</p>
                  </div>

                  {log.incident_text && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                      <p className="text-xs font-medium text-amber-900">Insiden Khusus:</p>
                      <p className="mt-1 text-sm text-amber-800">{log.incident_text}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-slate-100 p-4">
        <p className="text-xs leading-relaxed text-slate-600">
          <strong>Catatan:</strong> Catatan perilaku ini bersifat observasi pribadi dan dapat membantu
          Anda memahami pola perilaku anak. Informasi ini dapat dibagikan kepada profesional kesehatan
          saat konsultasi untuk memberikan gambaran yang lebih lengkap.
        </p>
      </div>
    </div>
  )
}

async function getSafeCatatanData() {
  try {
    const [logs, activities] = await Promise.all([
      getBehaviorLogs(),
      getActivities(),
    ])
    return { logs, activities }
  } catch {
    return null
  }
}

export default async function CatatanPage() {
  const data = await getSafeCatatanData()

  if (!data) {
    return <CatatanFallback />
  }

  return <CatatanContent logs={data.logs} activities={data.activities} />
}
