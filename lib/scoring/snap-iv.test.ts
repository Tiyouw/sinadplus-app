import { describe, expect, it } from 'vitest'
import { SNAP_IV_QUESTIONS, scoreSnapIv } from './snap-iv'

describe('SNAP-IV scoring', () => {
  it('contains 18 MVP questions split into two domains', () => {
    expect(SNAP_IV_QUESTIONS).toHaveLength(18)
    expect(SNAP_IV_QUESTIONS.filter((q) => q.domain === 'inattention')).toHaveLength(9)
    expect(SNAP_IV_QUESTIONS.filter((q) => q.domain === 'hyperactivity_impulsivity')).toHaveLength(9)
  })

  it('scores domain totals and dominant domain', () => {
    const answers = Object.fromEntries(
      SNAP_IV_QUESTIONS.map((question, index) => [question.id, index < 9 ? 3 : 1]),
    )
    const result = scoreSnapIv(answers)
    expect(result.inattentionScore).toBe(27)
    expect(result.hyperactivityImpulsivityScore).toBe(9)
    expect(result.totalScore).toBe(36)
    expect(result.dominantDomain).toBe('inattention')
    expect(result.category).toBe('perlu_diperhatikan')
  })

  it('rejects incomplete answers', () => {
    expect(() => scoreSnapIv({ q1: 1 })).toThrow('Jawaban SNAP-IV belum lengkap')
  })
})
