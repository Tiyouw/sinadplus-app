import { getDemoChild, getLatestScreening, getBehaviorLogs } from '@/lib/supabase/queries'
import { AlertCircle, TrendingUp, Activity, FileText, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const child = await getDemoChild()
  const latestScreening = await getLatestScreening(child.id)
  const behaviorLogs = await getBehaviorLogs(child.id)

  const hasScreening = latestScreening !== null

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Dashboard
        </h1>
        <p className="text-slate-600">
          Ringkasan perkembangan dan aktivitas {child.name}
        </p>
      </div>

      {/* Alert if no screening */}
      {!hasScreening && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900 mb-1">
              Belum ada hasil skrining
            </h3>
            <p className="text-sm text-amber-800 mb-3">
              Mulai dengan melakukan skrining SNAP-IV untuk mendapatkan gambaran awal perilaku anak.
            </p>
            <Link
              href="/skrining"
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
            >
              Mulai Skrining
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Latest Screening Score */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
            <h3 className="font-semibold text-slate-900">Skrining Terakhir</h3>
          </div>
          {hasScreening ? (
            <div>
              <div className="mb-3">
                <div className="text-3xl font-bold text-slate-900 mb-1">
                  {latestScreening.total_score}
                </div>
                <div className="text-sm text-slate-600">
                  Total Skor
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100">
                <div className="text-sm font-medium text-slate-700 mb-1">
                  Kategori: <span className="text-slate-900">{latestScreening.category}</span>
                </div>
                <div className="text-xs text-slate-500">
                  {new Date(latestScreening.completed_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-500">
              Belum ada data skrining
            </div>
          )}
        </div>

        {/* Dominant Domain */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="text-purple-600" size={24} />
            </div>
            <h3 className="font-semibold text-slate-900">Domain Dominan</h3>
          </div>
          {hasScreening ? (
            <div>
              <div className="mb-3">
                <div className="text-lg font-semibold text-slate-900 mb-1">
                  {latestScreening.dominant_domain === 'inattention' ? 'Inatensi' : 'Hiperaktivitas-Impulsivitas'}
                </div>
                <div className="text-sm text-slate-600">
                  {latestScreening.dominant_domain === 'inattention' 
                    ? `Skor: ${latestScreening.inattention_score}`
                    : `Skor: ${latestScreening.hyperactivity_impulsivity_score}`
                  }
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Domain dengan skor tertinggi dari hasil skrining
                </p>
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-500">
              Belum ada data skrining
            </div>
          )}
        </div>

        {/* Behavior Logs Count */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="text-green-600" size={24} />
            </div>
            <h3 className="font-semibold text-slate-900">Catatan Perilaku</h3>
          </div>
          <div>
            <div className="mb-3">
              <div className="text-3xl font-bold text-slate-900 mb-1">
                {behaviorLogs.length}
              </div>
              <div className="text-sm text-slate-600">
                Total Catatan
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100">
              <Link
                href="/catatan"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
              >
                Lihat Semua
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Consultation Readiness Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6 lg:p-8">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Kesiapan Konsultasi
          </h2>
          <p className="text-slate-700 mb-6">
            Untuk mendapatkan rekomendasi yang lebih komprehensif, pastikan Anda telah:
          </p>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                hasScreening ? 'bg-green-500' : 'bg-slate-300'
              }`}>
                {hasScreening && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div>
                <div className="font-medium text-slate-900">Melakukan skrining SNAP-IV</div>
                <div className="text-sm text-slate-600">
                  {hasScreening ? 'Selesai' : 'Belum dilakukan'}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                behaviorLogs.length >= 3 ? 'bg-green-500' : 'bg-slate-300'
              }`}>
                {behaviorLogs.length >= 3 && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div>
                <div className="font-medium text-slate-900">Mencatat minimal 3 observasi perilaku</div>
                <div className="text-sm text-slate-600">
                  {behaviorLogs.length >= 3 
                    ? `${behaviorLogs.length} catatan tersedia` 
                    : `${behaviorLogs.length} dari 3 catatan`
                  }
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-blue-200">
            <p className="text-sm text-slate-600 mb-4">
              Hasil skrining dan catatan perilaku akan membantu tenaga profesional memberikan rekomendasi yang lebih tepat.
            </p>
            <Link
              href="/laporan"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Lihat Laporan Lengkap
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-slate-100 rounded-lg">
        <p className="text-xs text-slate-600 leading-relaxed">
          <strong>Catatan Penting:</strong> Informasi yang ditampilkan di dashboard ini bersifat edukatif dan tidak menggantikan diagnosis medis profesional. 
          Untuk evaluasi lengkap dan diagnosis yang akurat, konsultasikan dengan psikolog, psikiater, atau tenaga kesehatan profesional yang berkompeten.
        </p>
      </div>
    </div>
  )
}
