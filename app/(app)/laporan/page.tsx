import { format } from 'date-fns'
import Link from 'next/link'
import { buildReportData } from '@/lib/report/build-report-data'
import { getCategoryDisplay, getDomainLabel } from '@/lib/constants/categories'
import { getActivities, getBehaviorLogs, getDemoChild, getScreenings } from '@/lib/supabase/queries'

async function loadReportData() {
  const child = await getDemoChild()
  const [screenings, logs, activities] = await Promise.all([
    getScreenings(child.id),
    getBehaviorLogs(child.id),
    getActivities(),
  ])

  return buildReportData({
    child,
    screenings,
    logs,
    activities,
  })
}

async function getSafeReportData() {
  try {
    return await loadReportData()
  } catch {
    return null
  }
}

function ReportFallback() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
        <h1 className="text-2xl font-semibold text-slate-950">Laporan belum dapat dimuat</h1>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          Data demo untuk laporan belum tersedia atau koneksi basis data belum siap. Coba masuk demo
          ulang atau kembali ke dashboard.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white" href="/dashboard">
            Kembali ke Dashboard
          </Link>
          <Link className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700" href="/login">
            Masuk Demo Ulang
          </Link>
        </div>
      </div>
    </div>
  )
}

export default async function LaporanPage() {
  const reportData = await getSafeReportData()

  if (!reportData) {
    return <ReportFallback />
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-700">Laporan Konsultasi</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Preview Laporan SINAD+</h1>
        <p className="mt-2 text-slate-600">
          Unduh ringkasan skrining, catatan perilaku, dan aktivitas pendampingan untuk dibawa ke
          konsultasi profesional.
        </p>
      </div>

      <div className="mb-8 rounded-3xl border border-blue-200 bg-blue-50 p-6">
        <h2 className="mb-3 text-xl font-semibold text-slate-950">Unduh Laporan PDF</h2>
        <p className="mb-4 text-slate-700">
          Laporan ini membantu orang tua membawa ringkasan yang rapi. Laporan bukan diagnosis medis.
        </p>
        <Link
          href="/api/reports/generate"
          className="inline-flex rounded-2xl bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Unduh Laporan PDF
        </Link>
      </div>

      <div className="space-y-6">
        <section className="sinad-card p-6">
          <h2 className="mb-4 text-xl font-semibold">Informasi Anak</h2>
          <dl className="space-y-2 text-sm text-slate-700">
            <div className="flex gap-3"><dt className="w-40 font-medium">Nama:</dt><dd>{reportData.childName}</dd></div>
            <div className="flex gap-3"><dt className="w-40 font-medium">Tanggal Lahir:</dt><dd>{format(new Date(reportData.birthDate), 'dd MMMM yyyy')}</dd></div>
            <div className="flex gap-3"><dt className="w-40 font-medium">Jenis Kelamin:</dt><dd>{reportData.gender === 'laki_laki' ? 'Laki-laki' : 'Perempuan'}</dd></div>
          </dl>
        </section>

        {reportData.latestScreening && (
          <section className="sinad-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Hasil Skrining Terbaru</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <ScoreBox label="Inatensi" value={reportData.latestScreening.inattention_score} />
              <ScoreBox label="Hiperaktif/Impulsif" value={reportData.latestScreening.hyperactivity_impulsivity_score} />
              <ScoreBox label="Total" value={reportData.latestScreening.total_score} />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <span>Kategori:</span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${getCategoryDisplay(reportData.latestScreening.category).badgeClass}`}
              >
                <span className={`h-2 w-2 rounded-full ${getCategoryDisplay(reportData.latestScreening.category).dotClass}`} />
                {getCategoryDisplay(reportData.latestScreening.category).label}
              </span>
              <span className="mx-1 text-slate-300">•</span>
              <span>
                Domain dominan:{' '}
                <strong className="text-slate-900">
                  {getDomainLabel(reportData.latestScreening.dominant_domain)}
                </strong>
              </span>
            </div>
          </section>
        )}

        <section className="sinad-card p-6">
          <h2 className="mb-3 text-xl font-semibold">Ringkasan Catatan dan Aktivitas</h2>
          <p className="text-sm text-slate-600">
            Laporan PDF akan menyertakan {Math.min(5, reportData.logs.length)} catatan perilaku
            terbaru dan {Math.min(3, reportData.activities.length)} aktivitas yang relevan.
          </p>
        </section>

        <section className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-700">Insight dan indikator terukur</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">{reportData.insights.headline}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">{reportData.insights.summary}</p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {reportData.insights.evaluationIndicators.map((indicator) => (
              <div key={indicator.label} className="rounded-2xl bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{indicator.label}</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">{indicator.value}</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">{indicator.helper}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-indigo-100 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-950">Kesiapan konsultasi: {reportData.insights.readiness.status}</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">{reportData.insights.readiness.description}</p>
              </div>
              <span className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-bold text-white">{reportData.insights.readiness.percent}%</span>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="mb-3 text-xl font-semibold text-amber-950">Penting</h2>
          <p className="text-sm leading-6 text-amber-900">{reportData.disclaimer}</p>
        </section>
      </div>
    </div>
  )
}

function ScoreBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="text-sm text-slate-600">{label}</div>
      <div className="mt-1 text-3xl font-bold text-slate-950">{value}</div>
    </div>
  )
}
