import { getActivities, getBehaviorLogs, getDemoChild, getScreenings } from '@/lib/supabase/queries'
import { getCategoryDisplay, getDomainLabel } from '@/lib/constants/categories'
import { buildBehaviorInsights } from '@/lib/insights/behavior-insights'
import { generateAiInsightSummary } from '@/lib/insights/ai-insight'
import { AlertCircle, ArrowRight, Activity, FileText, TrendingUp, Award, Sparkles, Brain, CheckCircle2, Target } from 'lucide-react'
import Link from 'next/link'

type DashboardData = Awaited<ReturnType<typeof loadDashboardData>>

async function loadDashboardData() {
  const child = await getDemoChild()
  const [screenings, behaviorLogs, activities] = await Promise.all([
    getScreenings(child.id),
    getBehaviorLogs(child.id),
    getActivities(),
  ])
  const latestScreening = screenings[0] ?? null
  const insights = buildBehaviorInsights({
    childName: child.name,
    screenings,
    logs: behaviorLogs,
    activities,
  })

  const aiInsight = await generateAiInsightSummary(insights)

  return { child, latestScreening, behaviorLogs, activities, screenings, insights, aiInsight }
}

function DashboardFallback() {
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
                Data demo belum dapat dimuat
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700">
                Kami belum dapat menampilkan ringkasan pendampingan saat ini. Pastikan konfigurasi
                Supabase dan data seed demo sudah tersedia, lalu coba muat ulang halaman.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex items-center rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Masuk Demo Ulang
              </Link>
              <Link
                href="/"
                className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Kembali ke Beranda
              </Link>
            </div>
            <p className="text-xs leading-5 text-slate-500">
              Catatan: SINAD+ adalah alat pendamping awal dan bukan alat diagnosis medis.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardContent({ child, latestScreening, behaviorLogs, insights, aiInsight }: DashboardData) {
  const hasScreening = latestScreening !== null

  return (
    <div className="mx-auto max-w-7xl p-6 lg:p-8 animate-fade-in">
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-700">Dashboard Orang Tua</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Selamat datang kembali</h1>
        <p className="mt-2 text-slate-600">Ringkasan perkembangan dan aktivitas {child.name}</p>
      </div>

      {!hasScreening && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <AlertCircle aria-hidden="true" className="mt-0.5 flex-shrink-0 text-amber-600" size={20} />
          <div className="flex-1">
            <h2 className="mb-1 font-semibold text-amber-900">Belum ada hasil skrining</h2>
            <p className="mb-3 text-sm text-amber-800">
              Mulai dengan melakukan skrining SNAP-IV untuk mendapatkan gambaran awal perilaku anak.
            </p>
            <Link
              href="/skrining"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700"
            >
              Mulai Skrining
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="sinad-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-blue-100 p-2">
              <TrendingUp aria-hidden="true" className="text-blue-600" size={24} />
            </div>
            <h2 className="font-semibold text-slate-900">Skrining Terakhir</h2>
          </div>
          {hasScreening ? (
            <div>
              <div className="mb-3">
                <div className="mb-1 text-3xl font-bold text-slate-900">{latestScreening.total_score}</div>
                <div className="text-sm text-slate-600">Total Skor</div>
              </div>
              <div className="border-t border-slate-100 pt-3">
                <div className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <span>Kategori:</span>
                  {(() => {
                    const display = getCategoryDisplay(latestScreening.category)
                    return (
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold animate-pop ${display.badgeClass}`}
                      >
                        <span className={`h-2 w-2 rounded-full ${display.dotClass}`} />
                        {display.label}
                      </span>
                    )
                  })()}
                </div>
                <div className="text-xs text-slate-500">
                  {new Date(latestScreening.completed_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-500">Belum ada data skrining</div>
          )}
        </div>

        <div className="sinad-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-purple-100 p-2">
              <Activity aria-hidden="true" className="text-purple-600" size={24} />
            </div>
            <h2 className="font-semibold text-slate-900">Domain Dominan</h2>
          </div>
          {hasScreening ? (
            <div>
              <div className="mb-3">
                <div className="mb-1 text-lg font-semibold text-slate-900">
                  {getDomainLabel(latestScreening.dominant_domain)}
                </div>
                <div className="text-sm text-slate-600">
                  {latestScreening.dominant_domain === 'inattention'
                    ? `Skor: ${latestScreening.inattention_score}`
                    : `Skor: ${latestScreening.hyperactivity_impulsivity_score}`}
                </div>
              </div>
              <div className="border-t border-slate-100 pt-3">
                <p className="text-xs text-slate-500">
                  Domain dengan skor tertinggi dari hasil skrining awal.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-500">Belum ada data skrining</div>
          )}
        </div>

        <div className="sinad-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-green-100 p-2">
              <FileText aria-hidden="true" className="text-green-600" size={24} />
            </div>
            <h2 className="font-semibold text-slate-900">Catatan Perilaku</h2>
          </div>
          <div className="mb-3">
            <div className="mb-1 text-3xl font-bold text-slate-900">{behaviorLogs.length}</div>
            <div className="text-sm text-slate-600">Total Catatan</div>
          </div>
          <div className="border-t border-slate-100 pt-3">
            <Link
              href="/catatan"
              className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Lihat Semua
              <ArrowRight aria-hidden="true" size={14} />
            </Link>
          </div>
        </div>
      </div>

      <AdaptiveInsightPanel insights={insights} aiInsight={aiInsight} />

      <ParentProgressPanel hasScreening={hasScreening} logCount={behaviorLogs.length} />

      <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 lg:p-8">
        <div className="max-w-3xl">
          <h2 className="mb-3 text-2xl font-bold text-slate-900">Kesiapan Konsultasi</h2>
          <p className="mb-6 text-slate-700">
            Untuk menyiapkan diskusi awal dengan profesional, pastikan Anda telah:
          </p>

          <div className="mb-6 space-y-3">
            <ReadinessItem complete={hasScreening} title="Melakukan skrining SNAP-IV" subtitle={hasScreening ? 'Selesai' : 'Belum dilakukan'} />
            <ReadinessItem
              complete={behaviorLogs.length >= 3}
              title="Mencatat minimal 3 observasi perilaku"
              subtitle={behaviorLogs.length >= 3 ? `${behaviorLogs.length} catatan tersedia` : `${behaviorLogs.length} dari 3 catatan`}
            />
          </div>

          <div className="border-t border-blue-200 pt-4">
            <p className="mb-4 text-sm text-slate-600">
              Hasil skrining dan catatan perilaku dapat menjadi bahan awal saat berkonsultasi dengan
              psikolog, psikiater anak, atau dokter anak.
            </p>
            <Link
              href="/laporan"
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Lihat Laporan Lengkap
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-slate-100 p-4">
        <p className="text-xs leading-relaxed text-slate-600">
          <strong>Catatan Penting:</strong> Informasi yang ditampilkan di dashboard ini bersifat
          edukatif dan tidak menggantikan diagnosis medis profesional. Untuk evaluasi lengkap,
          konsultasikan dengan psikolog, psikiater, atau tenaga kesehatan profesional yang berkompeten.
        </p>
      </div>
    </div>
  )
}

function AdaptiveInsightPanel({
  insights,
  aiInsight,
}: {
  insights: DashboardData['insights']
  aiInsight: DashboardData['aiInsight']
}) {
  return (
    <section className="mb-8 overflow-hidden rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-orange-50 p-6 shadow-sm lg:p-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700">
            <Brain aria-hidden="true" size={14} />
            Insight adaptif berbasis observasi
          </div>
          <h2 className="text-2xl font-bold text-slate-950 lg:text-3xl">{insights.headline}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700 lg:text-base lg:leading-7">{insights.summary}</p>
          <div className="mt-4 rounded-2xl border border-indigo-100 bg-white/85 p-4">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Sparkles aria-hidden="true" className="text-indigo-600" size={16} />
              <p className="text-sm font-semibold text-slate-950">Narasi pendamping</p>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${aiInsight.source === 'ai' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                {aiInsight.source === 'ai' ? 'AI aktif' : 'Rule-based fallback'}
              </span>
            </div>
            <p className="text-sm leading-6 text-slate-700">{aiInsight.summary ?? insights.summary}</p>
            <p className="mt-2 text-xs leading-5 text-slate-500">{aiInsight.reason}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-white bg-white/80 p-4 shadow-sm lg:w-64">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Kesiapan konsultasi</p>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-3xl font-bold text-slate-950">{insights.readiness.percent}%</span>
            <span className="pb-1 text-sm font-semibold text-indigo-700">{insights.readiness.status}</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-indigo-600" style={{ width: `${insights.readiness.percent}%` }} />
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-600">{insights.readiness.description}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {insights.metrics.slice(0, 4).map((metric) => (
              <InsightMetricCard key={`${metric.label}-${metric.value}`} metric={metric} />
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/85 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Target aria-hidden="true" className="text-orange-600" size={20} />
              <h3 className="font-semibold text-slate-950">Indikator evaluasi yang bisa ditunjukkan ke juri</h3>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {insights.evaluationIndicators.map((indicator) => (
                <div key={indicator.label} className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{indicator.label}</p>
                  <p className="mt-2 text-xl font-bold text-slate-950">{indicator.value}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">{indicator.helper}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {insights.recommendedActivity && (
            <div className="rounded-2xl border border-orange-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-700">Rekomendasi aktivitas berikutnya</p>
              <h3 className="mt-2 text-xl font-bold text-slate-950">{insights.recommendedActivity.title}</h3>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium">
                <span className="rounded-full bg-orange-100 px-3 py-1 text-orange-800">{insights.recommendedActivity.domainLabel}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{insights.recommendedActivity.durationLabel}</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-700">{insights.recommendedActivity.reason}</p>
              <p className="mt-3 rounded-2xl bg-orange-50 p-3 text-xs leading-5 text-orange-900">{insights.recommendedActivity.objective}</p>
              <Link
                href={insights.recommendedActivity.href}
                className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
              >
                Coba aktivitas ini
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
          )}

          <div className="rounded-2xl border border-indigo-100 bg-white/85 p-5">
            <h3 className="mb-3 font-semibold text-slate-950">Checklist data konsultasi</h3>
            <div className="space-y-3">
              {insights.readiness.criteria.map((criterion) => (
                <div key={criterion.label} className="flex gap-3">
                  <CheckCircle2
                    aria-hidden="true"
                    className={criterion.complete ? 'mt-0.5 text-emerald-600' : 'mt-0.5 text-slate-300'}
                    size={18}
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{criterion.label}</p>
                    <p className="text-xs leading-5 text-slate-600">{criterion.helper}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-5 rounded-2xl bg-white/70 p-3 text-xs leading-5 text-slate-600">
        <strong>Transparansi:</strong> {insights.safetyNote}
      </p>
    </section>
  )
}

function InsightMetricCard({ metric }: { metric: DashboardData['insights']['metrics'][number] }) {
  const toneClasses = {
    blue: 'border-blue-100 bg-blue-50 text-blue-700',
    emerald: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    amber: 'border-amber-100 bg-amber-50 text-amber-700',
    purple: 'border-purple-100 bg-purple-50 text-purple-700',
    slate: 'border-slate-100 bg-slate-50 text-slate-700',
  }[metric.tone]

  return (
    <div className={`rounded-2xl border p-4 ${toneClasses}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] opacity-80">{metric.label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-950">{metric.value}</p>
      <p className="mt-1 text-xs leading-5 text-slate-600">{metric.helper}</p>
    </div>
  )
}

function ParentProgressPanel({ hasScreening, logCount }: { hasScreening: boolean; logCount: number }) {
  const planSteps = [
    { label: 'Skrining awal sudah tersedia', complete: hasScreening },
    { label: 'Catatan perilaku mulai terkumpul', complete: logCount >= 1 },
    { label: 'Konsisten mencatat (minimal 3 catatan)', complete: logCount >= 3 },
    { label: 'Artikel edukasi tersedia untuk dibaca', complete: true },
    { label: 'Dukungan dan tips terkurasi tersedia', complete: true },
    { label: 'Laporan konsultasi siap dibuat', complete: hasScreening },
  ]
  const completed = planSteps.filter((s) => s.complete).length
  const percent = Math.round((completed / planSteps.length) * 100)

  const badges = [
    { label: 'Mulai Memantau', earned: hasScreening },
    { label: 'Konsisten Mencatat', earned: logCount >= 3 },
    { label: 'Siap Konsultasi', earned: hasScreening && logCount >= 3 },
  ]

  return (
    <div className="mb-8 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 lg:p-8">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-emerald-100 p-2">
          <Sparkles aria-hidden="true" className="text-emerald-600" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Rencana 7 Hari Memahami Pola Anak</h2>
          <p className="text-sm text-slate-600">
            Progres ini menunjukkan konsistensi penggunaan aplikasi, bukan perubahan kondisi anak.
          </p>
        </div>
      </div>

      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
          <span>Progres pemakaian</span>
          <span>{completed} dari {planSteps.length}</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-white">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-2 md:grid-cols-2">
        {planSteps.map((step) => (
          <div key={step.label} className="flex items-start gap-2">
            <div className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${step.complete ? 'bg-emerald-500' : 'bg-slate-300'}`}>
              {step.complete && (
                <svg aria-hidden="true" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className={`text-sm ${step.complete ? 'text-slate-800' : 'text-slate-500'}`}>{step.label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        {badges.map((badge) => (
          <span
            key={badge.label}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
              badge.earned
                ? 'bg-emerald-600 text-white'
                : 'border border-slate-200 bg-white text-slate-400'
            }`}
          >
            <Award aria-hidden="true" size={14} />
            {badge.label}
          </span>
        ))}
      </div>
    </div>
  )
}

function ReadinessItem({ complete, title, subtitle }: { complete: boolean; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className={`mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${complete ? 'bg-green-500' : 'bg-slate-300'}`}>
        {complete && (
          <svg aria-hidden="true" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <div>
        <div className="font-medium text-slate-900">{title}</div>
        <div className="text-sm text-slate-600">{subtitle}</div>
      </div>
    </div>
  )
}

async function getSafeDashboardData() {
  try {
    return await loadDashboardData()
  } catch {
    return null
  }
}

export default async function DashboardPage() {
  const data = await getSafeDashboardData()

  if (!data) {
    return <DashboardFallback />
  }

  return <DashboardContent {...data} />
}
