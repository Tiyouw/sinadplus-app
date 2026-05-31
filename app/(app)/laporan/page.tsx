import { getDemoChild, getLatestScreening, getBehaviorLogs, getActivities } from '@/lib/supabase/queries'
import { buildReportData } from '@/lib/report/build-report-data'
import Link from 'next/link'
import { format } from 'date-fns'

async function getReportData() {
  const child = await getDemoChild()
  const latestScreening = await getLatestScreening(child.id)
  const logs = await getBehaviorLogs(child.id)
  const activities = await getActivities()

  return buildReportData({
    child,
    screenings: latestScreening ? [latestScreening] : [],
    logs,
    activities,
  })
}

export default async function LaporanPage() {
  const reportData = await getReportData()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Laporan Konsultasi</h1>
        <p className="text-gray-600">
          Unduh laporan lengkap untuk dibawa ke konsultasi dengan psikolog atau dokter anak
        </p>
      </div>

      {/* Download Button */}
      <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Unduh Laporan PDF</h2>
        <p className="text-gray-700 mb-4">
          Laporan ini berisi ringkasan hasil skrining, catatan perilaku, dan aktivitas pendampingan yang telah dilakukan.
        </p>
        <Link
          href="/api/reports/generate"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Unduh Laporan PDF
        </Link>
      </div>

      {/* Preview Sections */}
      <div className="space-y-6">
        {/* Child Information */}
        <section className="p-6 bg-white border border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Informasi Anak</h2>
          <dl className="space-y-2">
            <div className="flex">
              <dt className="font-medium w-40">Nama:</dt>
              <dd>{reportData.childName}</dd>
            </div>
            <div className="flex">
              <dt className="font-medium w-40">Tanggal Lahir:</dt>
              <dd>{format(new Date(reportData.birthDate), 'dd MMMM yyyy')}</dd>
            </div>
            <div className="flex">
              <dt className="font-medium w-40">Jenis Kelamin:</dt>
              <dd>{reportData.gender === 'laki_laki' ? 'Laki-laki' : 'Perempuan'}</dd>
            </div>
          </dl>
        </section>

        {/* Latest Screening */}
        {reportData.latestScreening && (
          <section className="p-6 bg-white border border-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Hasil Skrining Terbaru</h2>
            <div className="space-y-3">
              <div className="flex">
                <span className="font-medium w-40">Tanggal:</span>
                <span>
                  {format(new Date(reportData.latestScreening.completed_at), 'dd MMMM yyyy')}
                </span>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Skor Inatensi</div>
                    <div className="text-2xl font-bold">
                      {reportData.latestScreening.inattention_score}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Skor Hiperaktivitas/Impulsivitas</div>
                    <div className="text-2xl font-bold">
                      {reportData.latestScreening.hyperactivity_impulsivity_score}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-gray-600">Skor Total</div>
                  <div className="text-3xl font-bold">
                    {reportData.latestScreening.total_score}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="font-medium">Kategori:</span>
                    <span className="font-semibold">{reportData.latestScreening.category}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="font-medium">Domain Dominan:</span>
                    <span>{reportData.latestScreening.dominant_domain}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Behavior Logs Summary */}
        {reportData.logs.length > 0 && (
          <section className="p-6 bg-white border border-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              Catatan Perilaku ({reportData.logs.length})
            </h2>
            <p className="text-gray-600 mb-4">
              Laporan PDF akan menyertakan {Math.min(5, reportData.logs.length)} catatan perilaku terbaru.
            </p>
            <div className="space-y-3">
              {reportData.logs.slice(0, 3).map((log) => (
                <div key={log.id} className="p-3 bg-gray-50 rounded">
                  <div className="font-medium text-sm">
                    {format(new Date(log.log_date), 'dd MMMM yyyy')}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Fokus: {log.focus_rating}/5 | Impulsivitas: {log.impulsivity_rating}/5 | Kerjasama: {log.cooperation_rating}/5
                  </div>
                </div>
              ))}
              {reportData.logs.length > 3 && (
                <p className="text-sm text-gray-500">
                  ... dan {reportData.logs.length - 3} catatan lainnya
                </p>
              )}
            </div>
          </section>
        )}

        {/* Activities Summary */}
        {reportData.activities.length > 0 && (
          <section className="p-6 bg-white border border-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              Aktivitas Pendampingan ({reportData.activities.length})
            </h2>
            <p className="text-gray-600 mb-4">
              Laporan PDF akan menyertakan {Math.min(3, reportData.activities.length)} aktivitas yang relevan.
            </p>
            <div className="space-y-3">
              {reportData.activities.slice(0, 3).map((activity) => (
                <div key={activity.id} className="p-3 bg-gray-50 rounded">
                  <div className="font-medium">{activity.title}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {activity.domain} • {activity.duration_minutes} menit
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Disclaimer */}
        <section className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-yellow-900">Penting</h2>
          <p className="text-yellow-800">{reportData.disclaimer}</p>
        </section>
      </div>
    </div>
  )
}
