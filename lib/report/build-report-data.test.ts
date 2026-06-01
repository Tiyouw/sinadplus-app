import { describe, it, expect } from 'vitest'
import { buildReportData } from './build-report-data'
import { MEDICAL_DISCLAIMER } from '../constants/copy'
import type { Database } from '../supabase/types'

type Child = Database['public']['Tables']['children']['Row']
type Screening = Database['public']['Tables']['screenings']['Row']
type BehaviorLog = Database['public']['Tables']['behavior_logs']['Row']
type Activity = Database['public']['Tables']['activities']['Row']

describe('buildReportData', () => {
  const mockChild: Child = {
    id: 'child-1',
    user_id: 'user-1',
    name: 'Budi Santoso',
    gender: 'laki_laki',
    birth_date: '2018-03-15',
    notes: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  }

  const mockScreening1: Screening = {
    id: 'screening-1',
    child_id: 'child-1',
    completed_at: '2024-05-01T10:00:00Z',
    inattention_score: 12,
    hyperactivity_impulsivity_score: 8,
    total_score: 20,
    category: 'Indikasi Sedang',
    dominant_domain: 'Inatensi',
    answers_json: {},
    disclaimer_version: '1.0',
    created_at: '2024-05-01T10:00:00Z',
  }

  const mockScreening2: Screening = {
    id: 'screening-2',
    child_id: 'child-1',
    completed_at: '2024-06-01T10:00:00Z',
    inattention_score: 10,
    hyperactivity_impulsivity_score: 6,
    total_score: 16,
    category: 'Indikasi Ringan',
    dominant_domain: 'Inatensi',
    answers_json: {},
    disclaimer_version: '1.0',
    created_at: '2024-06-01T10:00:00Z',
  }

  const mockLog: BehaviorLog = {
    id: 'log-1',
    child_id: 'child-1',
    activity_id: null,
    log_date: '2024-05-15',
    mood: 'senang',
    focus_rating: 3,
    impulsivity_rating: 2,
    cooperation_rating: 4,
    notes: 'Hari ini fokus lebih baik',
    incident_text: null,
    created_at: '2024-05-15T10:00:00Z',
    updated_at: '2024-05-15T10:00:00Z',
  }

  const mockActivity: Activity = {
    id: 'activity-1',
    title: 'Permainan Konsentrasi',
    domain: 'inatensi',
    age_min: 6,
    age_max: 12,
    duration_minutes: 15,
    objective: 'Melatih fokus',
    tools: 'Kartu gambar',
    steps_json: ['Langkah 1', 'Langkah 2'],
    observed_behaviors: 'Perhatikan fokus anak',
    safety_notes: 'Pastikan ruangan tenang',
    stop_conditions: 'Jika anak menunjukkan frustrasi',
    rationale: 'Meningkatkan kemampuan fokus',
    source_label: 'Sumber: Penelitian ABC',
    created_at: '2024-01-01T00:00:00Z',
  }

  it('should include child name in report', () => {
    const result = buildReportData({
      child: mockChild,
      screenings: [mockScreening1],
      logs: [],
      activities: [],
      generatedAt: '2024-06-15T12:00:00Z',
    })

    expect(result.childName).toBe('Budi Santoso')
  })

  it('should include latest screening by completed_at', () => {
    const result = buildReportData({
      child: mockChild,
      screenings: [mockScreening1, mockScreening2],
      logs: [],
      activities: [],
      generatedAt: '2024-06-15T12:00:00Z',
    })

    expect(result.latestScreening).toBeDefined()
    expect(result.latestScreening?.id).toBe('screening-2')
    expect(result.latestScreening?.completed_at).toBe('2024-06-01T10:00:00Z')
  })

  it('should include disclaimer containing "bukan alat diagnosis"', () => {
    const result = buildReportData({
      child: mockChild,
      screenings: [mockScreening1],
      logs: [],
      activities: [],
      generatedAt: '2024-06-15T12:00:00Z',
    })

    expect(result.disclaimer).toContain('bukan alat diagnosis')
    expect(result.disclaimer).toBe(MEDICAL_DISCLAIMER)
  })

  it('should handle empty screenings array', () => {
    const result = buildReportData({
      child: mockChild,
      screenings: [],
      logs: [],
      activities: [],
      generatedAt: '2024-06-15T12:00:00Z',
    })

    expect(result.latestScreening).toBeNull()
  })

  it('should use provided generatedAt for deterministic testing', () => {
    const fixedDate = '2024-06-15T12:00:00Z'
    const result = buildReportData({
      child: mockChild,
      screenings: [mockScreening1],
      logs: [],
      activities: [],
      generatedAt: fixedDate,
    })

    expect(result.generatedAt).toBe(fixedDate)
  })

  it('should include all required fields', () => {
    const result = buildReportData({
      child: mockChild,
      screenings: [mockScreening1],
      logs: [mockLog],
      activities: [mockActivity],
      generatedAt: '2024-06-15T12:00:00Z',
    })

    expect(result).toHaveProperty('title')
    expect(result).toHaveProperty('generatedAt')
    expect(result).toHaveProperty('childName')
    expect(result).toHaveProperty('birthDate')
    expect(result).toHaveProperty('gender')
    expect(result).toHaveProperty('latestScreening')
    expect(result).toHaveProperty('logs')
    expect(result).toHaveProperty('activities')
    expect(result).toHaveProperty('disclaimer')
  })

  it('should include child birth date and gender', () => {
    const result = buildReportData({
      child: mockChild,
      screenings: [mockScreening1],
      logs: [],
      activities: [],
      generatedAt: '2024-06-15T12:00:00Z',
    })

    expect(result.birthDate).toBe('2018-03-15')
    expect(result.gender).toBe('laki_laki')
  })

  it('should include logs and activities', () => {
    const result = buildReportData({
      child: mockChild,
      screenings: [mockScreening1],
      logs: [mockLog],
      activities: [mockActivity],
      generatedAt: '2024-06-15T12:00:00Z',
    })

    expect(result.logs).toHaveLength(1)
    expect(result.logs[0].id).toBe('log-1')
    expect(result.activities).toHaveLength(1)
    expect(result.activities[0].id).toBe('activity-1')
  })

  it('should generate appropriate title', () => {
    const result = buildReportData({
      child: mockChild,
      screenings: [mockScreening1],
      logs: [],
      activities: [],
      generatedAt: '2024-06-15T12:00:00Z',
    })

    expect(result.title).toContain('Laporan')
    expect(result.title).toContain('Budi Santoso')
  })
})
