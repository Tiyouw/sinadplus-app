import type { BehaviorInsights } from './behavior-insights'

export interface AiInsightConfig {
  apiKey?: string
  baseUrl?: string
  model?: string
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

const MAX_AI_SUMMARY_LENGTH = 520
const AI_REQUEST_TIMEOUT_MS = 3500

export function getAiInsightConfig(): AiInsightConfig {
  return {
    apiKey: process.env.SINAD_AI_API_KEY || process.env.OPENAI_API_KEY,
    baseUrl: process.env.SINAD_AI_BASE_URL || process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    model: process.env.SINAD_AI_MODEL || process.env.OPENAI_MODEL || 'gpt-4o-mini',
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
      reason: 'Narasi AI belum aktif pada demo ini, sehingga SINAD+ memakai narasi rule-based yang tetap dapat dijelaskan.',
    }
  }

  if (!config.baseUrl || !config.model) {
    return {
      summary: null,
      source: 'rule_based',
      reason: 'Narasi AI belum lengkap dikonfigurasi, sehingga SINAD+ memakai narasi rule-based yang aman.',
    }
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), AI_REQUEST_TIMEOUT_MS)

    const response = await fetch(`${trimTrailingSlash(config.baseUrl)}/chat/completions`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        temperature: 0.2,
        max_tokens: 180,
        messages: [
          {
            role: 'system',
            content: 'Kamu menulis insight pendampingan non-diagnostik untuk aplikasi orang tua. Patuhi batasan keselamatan medis.',
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
      return {
        summary: null,
        source: 'rule_based',
        reason: 'Narasi AI tidak tersedia sementara, sehingga SINAD+ memakai narasi rule-based.',
      }
    }

    const json = (await response.json()) as ChatCompletionResponse
    const content = cleanAiSummary(json.choices?.[0]?.message?.content ?? '')

    if (!content) {
      return {
        summary: null,
        source: 'rule_based',
        reason: 'Narasi AI kosong, sehingga SINAD+ memakai narasi rule-based.',
      }
    }

    if (violatesSafetyRules(content)) {
      return {
        summary: null,
        source: 'rule_based',
        reason: 'Narasi AI tidak dipakai karena tidak memenuhi batas aman medis; SINAD+ kembali ke narasi rule-based.',
      }
    }

    return {
      summary: content,
      source: 'ai',
      reason: 'AI insight dibuat dari OpenAI-compatible chat completion yang dikonfigurasi.',
    }
  } catch {
    return {
      summary: null,
      source: 'rule_based',
      reason: 'Narasi AI gagal dimuat, sehingga SINAD+ memakai narasi rule-based.',
    }
  }
}
