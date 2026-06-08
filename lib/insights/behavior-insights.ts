import { getDomainLabel } from '@/lib/constants/categories'
import type { SnapIvDomain } from '@/lib/scoring/snap-iv'
import type { Database } from '@/lib/supabase/types'

type Screening = Database['public']['Tables']['screenings']['Row']
type BehaviorLog = Database['public']['Tables']['behavior_logs']['Row']
type Activity = Database['public']['Tables']['activities']['Row']

type MetricTone = 'blue' | 'emerald' | 'amber' | 'purple' | 'slate'

type ReadinessStatus = 'Belum lengkap' | 'Mulai terbentuk' | 'Hampir siap' | 'Siap dibawa konsultasi'

export interface BehaviorInsightInput {
  childName: string
  screenings: Screening[]
  logs: BehaviorLog[]
  activities: Activity[]
}

export interface InsightMetric {
  label: string
  value: string
  helper: string
  tone: MetricTone
}

export interface ConsultationReadinessCriterion {
  label: string
  complete: boolean
  helper: string
}

export interface ConsultationReadiness {
  percent: number
  status: ReadinessStatus
  description: string
  criteria: ConsultationReadinessCriterion[]
}

export interface AdaptiveActivityRecommendation {
  id: string
  title: string
  href: string
  domainLabel: string
  durationLabel: string
  objective: string
  reason: string
}

export interface ScreeningTrend {
  label: string
  value: string
  helper: string
  tone: MetricTone
}

export interface BehaviorInsights {
  headline: string
  summary: string
  safetyNote: string
  focusDomainLabel: string
  trend: ScreeningTrend | null
  metrics: InsightMetric[]
  evaluationIndicators: InsightMetric[]
  recommendedActivity: AdaptiveActivityRecommendation | null
  readiness: ConsultationReadiness
}

function sortScreeningsNewestFirst(screenings: Screening[]) {
  return [...screenings].sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
}

function sortLogsNewestFirst(logs: BehaviorLog[]) {
  return [...logs].sort((a, b) => new Date(b.log_date).getTime() - new Date(a.log_date).getTime())
}

function average(values: number[]) {
  if (values.length === 0) return null
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function formatAverage(value: number | null) {
  return value === null ? '—' : `${value.toFixed(1)}/5`
}

function chooseRecommendationDomain(latest: Screening | null, logs: BehaviorLog[]): SnapIvDomain {
  if (latest) return latest.dominant_domain

  const focusAverage = average(logs.map((log) => log.focus_rating))
  const impulsivityAverage = average(logs.map((log) => log.impulsivity_rating))

  if (focusAverage !== null && focusAverage < 3) return 'inattention'
  if (impulsivityAverage !== null && impulsivityAverage >= 3) return 'hyperactivity_impulsivity'

  return 'inattention'
}

function buildTrend(screenings: Screening[]): ScreeningTrend | null {
  const sorted = sortScreeningsNewestFirst(screenings)
  const latest = sorted[0]
  const previous = sorted[1]

  if (!latest || !previous) return null

  const delta = latest.total_score - previous.total_score

  if (delta === 0) {
    return {
      label: 'Perubahan skrining',
      value: 'Stabil',
      helper: 'Skor total sama dengan skrining sebelumnya. Tetap gunakan catatan harian untuk melihat konteks perilaku.',
      tone: 'slate',
    }
  }

  const direction = delta > 0 ? 'naik' : 'turun'
  const absoluteDelta = Math.abs(delta)

  return {
    label: 'Perubahan skrining',
    value: `${direction} ${absoluteDelta} poin`,
    helper:
      delta > 0
        ? 'Skor terbaru lebih tinggi dari skrining sebelumnya. Ini sinyal untuk memperbanyak observasi dan menyiapkan pertanyaan konsultasi.'
        : 'Skor terbaru lebih rendah dari skrining sebelumnya. Catat konteks harian agar perubahan ini bisa dibahas dengan profesional.',
    tone: delta > 0 ? 'amber' : 'emerald',
  }
}

function buildRecommendationReason(domain: SnapIvDomain, logs: BehaviorLog[], latest: Screening | null) {
  const focusAverage = average(logs.map((log) => log.focus_rating))
  const impulsivityAverage = average(logs.map((log) => log.impulsivity_rating))
  const domainLabel = getDomainLabel(domain)

  if (domain === 'inattention' && focusAverage !== null && focusAverage < 3) {
    return `Rerata fokus dari catatan terakhir masih ${formatAverage(focusAverage)}, jadi aktivitas domain ${domainLabel} diprioritaskan untuk diamati berikutnya.`
  }

  if (domain === 'hyperactivity_impulsivity' && impulsivityAverage !== null && impulsivityAverage >= 3) {
    return `Rerata impulsivitas tercatat ${formatAverage(impulsivityAverage)}, jadi aktivitas domain ${domainLabel} diprioritaskan untuk melatih observasi berhenti, menunggu, dan mengikuti instruksi.`
  }

  if (latest) {
    return `Domain ${domainLabel} paling menonjol pada skrining terbaru, sehingga aktivitas ini menjadi rekomendasi awal untuk diamati di rumah.`
  }

  return `Aktivitas ini menjadi langkah awal yang aman untuk mulai mengamati pola ${domainLabel.toLowerCase()} anak di rumah.`
}

function chooseRecommendedActivity(domain: SnapIvDomain, activities: Activity[], logs: BehaviorLog[], latest: Screening | null): AdaptiveActivityRecommendation | null {
  const attemptedActivityIds = new Set(logs.map((log) => log.activity_id).filter(Boolean))
  const matchingActivities = activities.filter((activity) => activity.domain === domain)
  const ordered = [...matchingActivities, ...activities.filter((activity) => activity.domain !== domain)]
  const selected = ordered.find((activity) => !attemptedActivityIds.has(activity.id)) ?? ordered[0]

  if (!selected) return null

  return {
    id: selected.id,
    title: selected.title,
    href: `/aktivitas/${selected.id}`,
    domainLabel: getDomainLabel(selected.domain),
    durationLabel: `${selected.duration_minutes} menit`,
    objective: selected.objective,
    reason: buildRecommendationReason(domain, logs, latest),
  }
}

function buildReadiness(screenings: Screening[], logs: BehaviorLog[], recommendedActivity: AdaptiveActivityRecommendation | null): ConsultationReadiness {
  const criteria: ConsultationReadinessCriterion[] = [
    {
      label: 'Hasil skrining tersedia',
      complete: screenings.length > 0,
      helper: screenings.length > 0 ? 'Ada ringkasan SNAP-IV sebagai titik awal diskusi.' : 'Lakukan skrining awal untuk membuat titik awal pengamatan.',
    },
    {
      label: 'Minimal 3 catatan observasi',
      complete: logs.length >= 3,
      helper: logs.length >= 3 ? `${logs.length} catatan siap diringkas.` : `${logs.length} dari 3 catatan terkumpul.`,
    },
    {
      label: 'Ada aktivitas yang pernah dicoba',
      complete: logs.some((log) => log.activity_id !== null),
      helper: logs.some((log) => log.activity_id !== null) ? 'Respons anak pada aktivitas sudah mulai tercatat.' : 'Coba satu aktivitas terstruktur lalu catat respons anak.',
    },
    {
      label: 'Rekomendasi langkah berikutnya tersedia',
      complete: recommendedActivity !== null,
      helper: recommendedActivity ? `Rekomendasi berikutnya: ${recommendedActivity.title}.` : 'Tambahkan aktivitas agar rekomendasi bisa muncul.',
    },
  ]

  const completed = criteria.filter((criterion) => criterion.complete).length
  const percent = Math.round((completed / criteria.length) * 100)
  const status: ReadinessStatus = percent >= 100
    ? 'Siap dibawa konsultasi'
    : percent >= 75
      ? 'Hampir siap'
      : percent >= 50
        ? 'Mulai terbentuk'
        : 'Belum lengkap'

  return {
    percent,
    status,
    description:
      percent >= 75
        ? 'Data sudah cukup rapi untuk menjadi bahan awal diskusi dengan psikolog, psikiater anak, atau dokter anak.'
        : 'Lengkapi skrining, catatan, dan aktivitas agar laporan lebih informatif saat dibawa konsultasi.',
    criteria,
  }
}

export function buildBehaviorInsights(input: BehaviorInsightInput): BehaviorInsights {
  const sortedScreenings = sortScreeningsNewestFirst(input.screenings)
  const sortedLogs = sortLogsNewestFirst(input.logs)
  const latest = sortedScreenings[0] ?? null
  const focusAverage = average(sortedLogs.map((log) => log.focus_rating))
  const impulsivityAverage = average(sortedLogs.map((log) => log.impulsivity_rating))
  const cooperationAverage = average(sortedLogs.map((log) => log.cooperation_rating))
  const incidentCount = sortedLogs.filter((log) => log.incident_text && log.incident_text.trim().length > 0).length
  const recommendationDomain = chooseRecommendationDomain(latest, sortedLogs)
  const recommendedActivity = chooseRecommendedActivity(recommendationDomain, input.activities, sortedLogs, latest)
  const readiness = buildReadiness(sortedScreenings, sortedLogs, recommendedActivity)
  const focusDomainLabel = latest ? getDomainLabel(latest.dominant_domain) : getDomainLabel(recommendationDomain)
  const trend = buildTrend(sortedScreenings)

  const metrics: InsightMetric[] = [
    {
      label: 'Catatan terisi',
      value: `${sortedLogs.length}`,
      helper: 'Target awal: minimal 3 catatan agar pola harian mulai terlihat.',
      tone: sortedLogs.length >= 3 ? 'emerald' : 'amber',
    },
    {
      label: 'Rerata fokus',
      value: formatAverage(focusAverage),
      helper: 'Diambil dari rating fokus pada catatan harian, bukan ukuran diagnosis.',
      tone: 'blue',
    },
    {
      label: 'Rerata impulsivitas',
      value: formatAverage(impulsivityAverage),
      helper: 'Membantu orang tua melihat konteks perilaku yang perlu diamati lagi.',
      tone: 'purple',
    },
    {
      label: 'Catatan insiden',
      value: `${incidentCount}`,
      helper: 'Insiden khusus membantu profesional memahami pemicu dan konteks.',
      tone: incidentCount > 0 ? 'amber' : 'slate',
    },
  ]

  if (trend) metrics.unshift(trend)

  const evaluationIndicators: InsightMetric[] = [
    {
      label: 'Indikator 1',
      value: formatAverage(focusAverage),
      helper: 'Rerata fokus dari observasi rumah.',
      tone: 'blue',
    },
    {
      label: 'Indikator 2',
      value: formatAverage(cooperationAverage),
      helper: 'Rerata kerja sama saat aktivitas/catatan harian.',
      tone: 'emerald',
    },
    {
      label: 'Indikator 3',
      value: `${sortedLogs.length} catatan`,
      helper: 'Frekuensi observasi sebagai ukuran konsistensi pendampingan orang tua.',
      tone: 'purple',
    },
  ]

  return {
    headline: `Fokus pengamatan saat ini: ${focusDomainLabel}`,
    summary: latest
      ? `Berdasarkan skrining terbaru dan ${sortedLogs.length} catatan, SINAD+ menyusun prioritas observasi untuk ${input.childName}. Ini adalah insight pendampingan, bukan diagnosis.`
      : `Mulai dari catatan harian, SINAD+ membantu menyusun prioritas observasi untuk ${input.childName}. Lengkapi skrining agar insight lebih terarah.`,
    safetyNote: 'Rekomendasi inti disusun secara rule-based dari data yang dicatat orang tua. Jika narasi AI diaktifkan, hasilnya tetap dibatasi agar tidak menjadi diagnosis dan perlu dibahas dengan profesional.',
    focusDomainLabel,
    trend,
    metrics,
    evaluationIndicators,
    recommendedActivity,
    readiness,
  }
}
