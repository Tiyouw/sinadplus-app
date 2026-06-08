import { afterEach, describe, expect, it, vi } from 'vitest'
import { buildAiInsightPrompt, generateAiInsightSummary } from './ai-insight'
import type { BehaviorInsights } from './behavior-insights'

const sampleInsights: BehaviorInsights = {
  headline: 'Fokus pengamatan saat ini: Inatensi',
  summary: 'Berdasarkan skrining terbaru dan 3 catatan, SINAD+ menyusun prioritas observasi untuk Alya. Ini adalah insight pendampingan, bukan diagnosis.',
  safetyNote: 'Insight ini bersifat rule-based dari data yang dicatat orang tua dan perlu dibahas dengan profesional untuk evaluasi menyeluruh.',
  focusDomainLabel: 'Inatensi',
  trend: null,
  metrics: [],
  evaluationIndicators: [
    { label: 'Indikator 1', value: '3.0/5', helper: 'Rerata fokus dari observasi rumah.', tone: 'blue' },
    { label: 'Indikator 2', value: '4.0/5', helper: 'Rerata kerja sama saat aktivitas/catatan harian.', tone: 'emerald' },
    { label: 'Indikator 3', value: '3 catatan', helper: 'Frekuensi observasi sebagai ukuran konsistensi pendampingan orang tua.', tone: 'purple' },
  ],
  recommendedActivity: {
    id: 'activity-1',
    title: 'Misi Fokus Berikutnya',
    href: '/aktivitas/activity-1',
    domainLabel: 'Inatensi',
    durationLabel: '10 menit',
    objective: 'Mengamati fokus dengan instruksi bertahap.',
    reason: 'Rerata fokus dari catatan terakhir masih 2.3/5, jadi aktivitas domain Inatensi diprioritaskan untuk diamati berikutnya.',
  },
  readiness: {
    percent: 100,
    status: 'Siap dibawa konsultasi',
    description: 'Data sudah cukup rapi untuk menjadi bahan awal diskusi dengan profesional.',
    criteria: [],
  },
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('AI insight generation', () => {
  it('falls back to rule-based insight when API key is missing', async () => {
    const result = await generateAiInsightSummary(sampleInsights, {
      baseUrl: 'https://example.test/v1',
      model: 'demo-model',
    })

    expect(result.source).toBe('rule_based')
    expect(result.summary).toBeNull()
    expect(result.reason).toContain('belum aktif')
  })

  it('builds a prompt with explicit medical safety boundaries', () => {
    const prompt = buildAiInsightPrompt(sampleInsights)

    expect(prompt).toContain('jangan mendiagnosis')
    expect(prompt).toContain('jangan memberi saran obat')
    expect(prompt).toContain('pola observasi')
    expect(prompt).toContain('Misi Fokus Berikutnya')
  })

  it('accepts a safe OpenAI-compatible response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: 'Dari catatan orang tua, Alya tampak membutuhkan instruksi pendek dan aktivitas fokus bertahap. Gunakan rekomendasi ini sebagai bahan observasi rumah dan bawa ringkasannya saat berdiskusi dengan profesional.',
            },
          },
        ],
      }),
    }))

    const result = await generateAiInsightSummary(sampleInsights, {
      apiKey: 'test-key',
      baseUrl: 'https://example.test/v1',
      model: 'demo-model',
    })

    expect(result.source).toBe('ai')
    expect(result.summary).toContain('catatan orang tua')
  })

  it('explains provider quota or billing failures instead of showing a generic fallback', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      json: async () => ({
        error: {
          code: 'insufficient_quota',
          type: 'insufficient_quota',
          message: 'You exceeded your current quota.',
        },
      }),
    }))

    const result = await generateAiInsightSummary(sampleInsights, {
      apiKey: 'test-key',
      baseUrl: 'https://example.test/v1',
      model: 'demo-model',
    })

    expect(result.source).toBe('rule_based')
    expect(result.summary).toBeNull()
    expect(result.reason).toContain('kuota atau billing')
  })

  it('rejects unsafe AI responses and falls back', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: 'Aplikasi ini dapat mendiagnosis ADHD dan menjamin anak pasti membaik.',
            },
          },
        ],
      }),
    }))

    const result = await generateAiInsightSummary(sampleInsights, {
      apiKey: 'test-key',
      baseUrl: 'https://example.test/v1',
      model: 'demo-model',
    })

    expect(result.source).toBe('rule_based')
    expect(result.summary).toBeNull()
    expect(result.reason).toContain('batas aman medis')
  })
})
