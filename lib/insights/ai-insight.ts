import type { BehaviorInsights } from './behavior-insights'

export interface AiInsightConfig {
  apiKey?: string
  baseUrl?: string
  model?: string
  maxTokens?: number
  timeoutMs?: number
}

export interface AiInsightResult {
  summary: string | null
  source: 'ai' | 'rule_based'
  reason: string
}

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string
    }
  }>
}

interface ProviderErrorResponse {
  error?: {
    code?: string | null
    type?: string | null
    message?: string
  }
}

const MAX_AI_SUMMARY_LENGTH = 520
const DEFAULT_AI_MAX_TOKENS = 768
const DEFAULT_AI_REQUEST_TIMEOUT_MS = 18_000

function parsePositiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value)

  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback
}

export function getAiInsightConfig(): AiInsightConfig {
  return {
    apiKey: process.env.SINAD_AI_API_KEY || process.env.OPENAI_API_KEY,
    baseUrl: process.env.SINAD_AI_BASE_URL || process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    model: process.env.SINAD_AI_MODEL || process.env.OPENAI_MODEL || 'gpt-4o-mini',
    maxTokens: parsePositiveInteger(process.env.SINAD_AI_MAX_TOKENS, DEFAULT_AI_MAX_TOKENS),
    timeoutMs: parsePositiveInteger(process.env.SINAD_AI_TIMEOUT_MS, DEFAULT_AI_REQUEST_TIMEOUT_MS),
  }
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '')
}

function cleanAiSummary(content: string) {
  return content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_AI_SUMMARY_LENGTH)
}

function violatesSafetyRules(content: string) {
  return /\b(mendiagnosis|diagnosis pasti|sembuh|menyembuhkan|terapi klinis|obat|dosis|jaminan|pasti membaik)\b/i.test(content)
}

function buildProviderErrorReason(status: number, errorPayload: ProviderErrorResponse | null) {
  const code = errorPayload?.error?.code
  const type = errorPayload?.error?.type

  if (status === 401) {
    return 'Narasi pendamping belum aktif karena konfigurasi provider belum valid.'
  }

  if (status === 403) {
    return 'Narasi pendamping belum aktif karena provider belum memberi akses ke model yang dipilih.'
  }

  if (status === 404) {
    return 'Narasi pendamping belum aktif karena model atau alamat provider tidak ditemukan.'
  }

  if (status === 429 || code === 'insufficient_quota' || type === 'insufficient_quota') {
    return 'Narasi pendamping belum aktif karena kuota atau billing provider belum tersedia. SINAD+ memakai ringkasan observasi sampai konfigurasi diperbaiki.'
  }

  return 'Narasi pendamping belum tersedia sementara, sehingga SINAD+ memakai ringkasan observasi.'
}

export function buildAiInsightPrompt(insights: BehaviorInsights) {
  return [
    'Kamu membantu aplikasi SINAD+ menyusun narasi insight untuk orang tua anak dengan dugaan ADHD.',
    'Tulis dalam Bahasa Indonesia, hangat, singkat, dan actionable.',
    'BATASAN WAJIB: jangan mendiagnosis, jangan memberi saran obat/dosis, jangan menjanjikan kesembuhan, jangan menyebut terapi klinis.',
    'Sebutkan bahwa ini adalah pola observasi dari catatan orang tua dan sebaiknya dibahas dengan profesional bila diperlukan.',
    '',
    'Data ringkas:',
    `- Headline rule-based: ${insights.headline}`,
    `- Summary rule-based: ${insights.summary}`,
    `- Kesiapan konsultasi: ${insights.readiness.status} (${insights.readiness.percent}%)`,
    `- Rekomendasi aktivitas: ${insights.recommendedActivity?.title ?? 'belum tersedia'}`,
    `- Alasan rekomendasi: ${insights.recommendedActivity?.reason ?? 'belum tersedia'}`,
    `- Indikator: ${insights.evaluationIndicators.map((indicator) => `${indicator.label}=${indicator.value}`).join(', ')}`,
    '',
    'Output hanya 2 kalimat, maksimal 80 kata. Jangan gunakan markdown.',
  ].join('\n')
}

export async function generateAiInsightSummary(
  insights: BehaviorInsights,
  config: AiInsightConfig = getAiInsightConfig(),
): Promise<AiInsightResult> {
  if (!config.apiKey) {
    return {
      summary: null,
      source: 'rule_based',
      reason: 'Narasi pendamping belum aktif pada demo ini, sehingga SINAD+ memakai ringkasan observasi yang tetap dapat dijelaskan.',
    }
  }

  if (!config.baseUrl || !config.model) {
    return {
      summary: null,
      source: 'rule_based',
      reason: 'Narasi pendamping belum lengkap dikonfigurasi, sehingga SINAD+ memakai ringkasan observasi yang aman.',
    }
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), config.timeoutMs ?? DEFAULT_AI_REQUEST_TIMEOUT_MS)

    const response = await fetch(`${trimTrailingSlash(config.baseUrl)}/chat/completions`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'SINADPlus/1.0 (+https://sinadplus.tiyoouw.app)',
      },
      body: JSON.stringify({
        model: config.model,
        temperature: 0.2,
        max_tokens: config.maxTokens ?? DEFAULT_AI_MAX_TOKENS,
        messages: [
          {
            role: 'system',
            content: 'Kamu menulis insight pendampingan non-diagnostik untuk aplikasi orang tua. Patuhi batasan keselamatan medis. Jawab final singkat dalam Bahasa Indonesia.',
          },
          {
            role: 'user',
            content: buildAiInsightPrompt(insights),
          },
        ],
      }),
    })
    clearTimeout(timeout)

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => null) as ProviderErrorResponse | null

      return {
        summary: null,
        source: 'rule_based',
        reason: buildProviderErrorReason(response.status, errorPayload),
      }
    }

    const json = (await response.json()) as ChatCompletionResponse
    const content = cleanAiSummary(json.choices?.[0]?.message?.content ?? '')

    if (!content) {
      return {
        summary: null,
        source: 'rule_based',
        reason: 'Narasi pendamping belum tersedia, sehingga SINAD+ memakai ringkasan observasi.',
      }
    }

    if (violatesSafetyRules(content)) {
      return {
        summary: null,
        source: 'rule_based',
        reason: 'Narasi pendamping tidak dipakai karena tidak memenuhi batas aman medis; SINAD+ kembali ke ringkasan observasi.',
      }
    }

    return {
      summary: content,
      source: 'ai',
      reason: 'Narasi pendamping disusun dari data observasi yang tersedia.',
    }
  } catch (error) {
    const errorName = error instanceof Error ? error.name : ''

    if (errorName === 'AbortError') {
      return {
        summary: null,
        source: 'rule_based',
        reason: 'Narasi pendamping melewati batas waktu, sehingga SINAD+ memakai ringkasan observasi.',
      }
    }

    return {
      summary: null,
      source: 'rule_based',
      reason: 'Narasi pendamping gagal dimuat, sehingga SINAD+ memakai ringkasan observasi.',
    }
  }
}
