import { describe, expect, it } from 'vitest'
import { SNAP_IV_QUESTIONS, scoreSnapIv } from './snap-iv'

// Helper function to create complete answer sets
function createAnswers(value: number): Record<string, number> {
  return Object.fromEntries(SNAP_IV_QUESTIONS.map((q) => [q.id, value]))
}

// Helper function to create answers with specific total score
function createAnswersWithScore(targetScore: number): Record<string, number> {
  const answers: Record<string, number> = {}
  let remainingScore = targetScore

  for (const question of SNAP_IV_QUESTIONS) {
    const value = Math.min(3, remainingScore)
    answers[question.id] = value
    remainingScore -= value
  }

  return answers
}

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

  describe('category boundaries', () => {
    it('categorizes all zeros as rendah', () => {
      const answers = createAnswers(0)
      const result = scoreSnapIv(answers)

      expect(result.totalScore).toBe(0)
      expect(result.inattentionScore).toBe(0)
      expect(result.hyperactivityImpulsivityScore).toBe(0)
      expect(result.category).toBe('rendah')
      expect(result.summary).toContain('rendah')
    })

    it('categorizes all threes as tinggi', () => {
      const answers = createAnswers(3)
      const result = scoreSnapIv(answers)

      expect(result.totalScore).toBe(54)
      expect(result.inattentionScore).toBe(27)
      expect(result.hyperactivityImpulsivityScore).toBe(27)
      expect(result.category).toBe('tinggi')
      expect(result.summary).toContain('tinggi')
    })

    it('categorizes score 17 as rendah (upper boundary)', () => {
      const answers = createAnswersWithScore(17)
      const result = scoreSnapIv(answers)

      expect(result.totalScore).toBe(17)
      expect(result.category).toBe('rendah')
    })

    it('categorizes score 18 as perlu_diperhatikan (lower boundary)', () => {
      const answers = createAnswersWithScore(18)
      const result = scoreSnapIv(answers)

      expect(result.totalScore).toBe(18)
      expect(result.category).toBe('perlu_diperhatikan')
    })

    it('categorizes score 36 as perlu_diperhatikan (upper boundary)', () => {
      const answers = createAnswersWithScore(36)
      const result = scoreSnapIv(answers)

      expect(result.totalScore).toBe(36)
      expect(result.category).toBe('perlu_diperhatikan')
    })

    it('categorizes score 37 as tinggi (lower boundary)', () => {
      const answers = createAnswersWithScore(37)
      const result = scoreSnapIv(answers)

      expect(result.totalScore).toBe(37)
      expect(result.category).toBe('tinggi')
    })
  })

  describe('input validation', () => {
    it('rejects negative values', () => {
      const answers = createAnswers(0)
      answers.snap_iv_1 = -1

      expect(() => scoreSnapIv(answers)).toThrow(
        'Nilai jawaban untuk snap_iv_1 harus berupa bilangan bulat antara 0 dan 3',
      )
    })

    it('rejects values greater than 3', () => {
      const answers = createAnswers(0)
      answers.snap_iv_5 = 4

      expect(() => scoreSnapIv(answers)).toThrow(
        'Nilai jawaban untuk snap_iv_5 harus berupa bilangan bulat antara 0 dan 3',
      )
    })

    it('rejects non-integer values', () => {
      const answers = createAnswers(1)
      answers.snap_iv_10 = 1.5

      expect(() => scoreSnapIv(answers)).toThrow(
        'Nilai jawaban untuk snap_iv_10 harus berupa bilangan bulat antara 0 dan 3',
      )
    })

    it('rejects floating point values that look like integers', () => {
      const answers = createAnswers(2)
      answers.snap_iv_15 = 2.7

      expect(() => scoreSnapIv(answers)).toThrow(
        'Nilai jawaban untuk snap_iv_15 harus berupa bilangan bulat antara 0 dan 3',
      )
    })
  })
})
