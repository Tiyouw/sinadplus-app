import { describe, expect, it } from 'vitest'
import { buildBehaviorInsights } from './behavior-insights'
import type { Database } from '@/lib/supabase/types'

type Screening = Database['public']['Tables']['screenings']['Row']
type BehaviorLog = Database['public']['Tables']['behavior_logs']['Row']
type Activity = Database['public']['Tables']['activities']['Row']

const baseScreening: Screening = {
  id: 'screening-latest',
  child_id: 'child-1',
  completed_at: '2026-06-07T10:00:00Z',
  inattention_score: 20,
  hyperactivity_impulsivity_score: 12,
  total_score: 32,
  category: 'perlu_diperhatikan',
  dominant_domain: 'inattention',
  answers_json: {},
  disclaimer_version: '1.0',
  created_at: '2026-06-07T10:00:00Z',
}

const previousScreening: Screening = {
  ...baseScreening,
  id: 'screening-previous',
  completed_at: '2026-05-24T10:00:00Z',
  total_score: 36,
  inattention_score: 22,
}

const logs: BehaviorLog[] = [
  {
    id: 'log-1',
    child_id: 'child-1',
    activity_id: 'activity-focus-used',
    log_date: '2026-06-07',
    mood: 'Kooperatif',
    focus_rating: 2,
    impulsivity_rating: 2,
    cooperation_rating: 4,
    notes: 'Butuh pengingat pendek.',
    incident_text: null,
    created_at: '2026-06-07T10:00:00Z',
    updated_at: '2026-06-07T10:00:00Z',
  },
  {
    id: 'log-2',
    child_id: 'child-1',
    activity_id: null,
    log_date: '2026-06-06',
    mood: 'Aktif',
    focus_rating: 3,
    impulsivity_rating: 3,
    cooperation_rating: 3,
    notes: 'Mudah terdistraksi saat suara ramai.',
    incident_text: 'Menolak berhenti ketika diarahkan.',
    created_at: '2026-06-06T10:00:00Z',
    updated_at: '2026-06-06T10:00:00Z',
  },
  {
    id: 'log-3',
    child_id: 'child-1',
    activity_id: null,
    log_date: '2026-06-05',
    mood: 'Tenang',
    focus_rating: 2,
    impulsivity_rating: 2,
    cooperation_rating: 4,
    notes: 'Lebih fokus setelah instruksi dipecah kecil.',
    incident_text: null,
    created_at: '2026-06-05T10:00:00Z',
    updated_at: '2026-06-05T10:00:00Z',
  },
]

const activities: Activity[] = [
  {
    id: 'activity-focus-used',
    title: 'Misi Fokus Lama',
    domain: 'inattention',
    age_min: 5,
    age_max: 12,
    duration_minutes: 5,
    objective: 'Melatih fokus awal.',
    tools: 'Timer',
    steps_json: [],
    observed_behaviors: 'Fokus',
    safety_notes: 'Aman',
    stop_conditions: 'Berhenti saat frustrasi',
    rationale: 'Observasi fokus',
    source_label: 'Adaptasi edukasi pengasuhan',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'activity-focus-next',
    title: 'Misi Fokus Berikutnya',
    domain: 'inattention',
    age_min: 5,
    age_max: 12,
    duration_minutes: 10,
    objective: 'Mengamati fokus dengan instruksi bertahap.',
    tools: 'Kertas',
    steps_json: [],
    observed_behaviors: 'Fokus',
    safety_notes: 'Aman',
    stop_conditions: 'Berhenti saat frustrasi',
    rationale: 'Observasi fokus',
    source_label: 'Adaptasi edukasi pengasuhan',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'activity-impulse',
    title: 'Lampu Merah Lampu Hijau',
    domain: 'hyperactivity_impulsivity',
    age_min: 5,
    age_max: 10,
    duration_minutes: 10,
    objective: 'Mengamati kemampuan berhenti dan menunggu.',
    tools: 'Ruang aman',
    steps_json: [],
    observed_behaviors: 'Kontrol impuls',
    safety_notes: 'Pastikan lantai aman',
    stop_conditions: 'Berhenti saat terlalu cepat',
    rationale: 'Observasi kontrol impuls',
    source_label: 'Adaptasi aktivitas bermain anak',
    created_at: '2026-01-01T00:00:00Z',
  },
]

describe('buildBehaviorInsights', () => {
  it('builds an explainable recommendation from screening domain and unused activity', () => {
    const result = buildBehaviorInsights({
      childName: 'Alya',
      screenings: [previousScreening, baseScreening],
      logs,
      activities,
    })

    expect(result.headline).toContain('Inatensi')
    expect(result.recommendedActivity?.id).toBe('activity-focus-next')
    expect(result.recommendedActivity?.reason).toContain('Rerata fokus')
    expect(result.safetyNote).toContain('rule-based')
    expect(result.safetyNote).toContain('tidak menjadi diagnosis')
  })

  it('computes measurable indicators and consultation readiness', () => {
    const result = buildBehaviorInsights({
      childName: 'Alya',
      screenings: [baseScreening],
      logs,
      activities,
    })

    expect(result.metrics.some((metric) => metric.label === 'Catatan terisi' && metric.value === '3')).toBe(true)
    expect(result.evaluationIndicators).toHaveLength(3)
    expect(result.readiness.percent).toBe(100)
    expect(result.readiness.status).toBe('Siap dibawa konsultasi')
  })

  it('describes screening trend without claiming diagnosis or clinical improvement', () => {
    const result = buildBehaviorInsights({
      childName: 'Alya',
      screenings: [previousScreening, baseScreening],
      logs,
      activities,
    })

    expect(result.trend?.value).toBe('turun 4 poin')
    expect(result.trend?.helper).toContain('dibahas dengan profesional')
    expect(`${result.trend?.helper} ${result.summary}`).not.toMatch(/sembuh|mendiagnosis|terapi klinis/i)
  })

  it('falls back to log patterns when screening is unavailable', () => {
    const result = buildBehaviorInsights({
      childName: 'Alya',
      screenings: [],
      logs,
      activities,
    })

    expect(result.focusDomainLabel).toBe('Inatensi')
    expect(result.readiness.percent).toBe(75)
    expect(result.summary).toContain('Lengkapi skrining')
  })
})
