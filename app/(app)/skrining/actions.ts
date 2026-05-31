'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SNAP_IV_QUESTIONS, scoreSnapIv } from '@/lib/scoring/snap-iv'
import { DEMO_CHILD_ID } from '@/lib/supabase/queries'

export type ScreeningFormState = {
  error?: string
}

export async function saveScreening(
  _prevState: ScreeningFormState,
  formData: FormData,
): Promise<ScreeningFormState> {
  try {
    const answers: Record<string, number> = {}

    for (const question of SNAP_IV_QUESTIONS) {
      const value = formData.get(question.id)

      if (value === null) {
        return { error: `Pertanyaan nomor ${SNAP_IV_QUESTIONS.indexOf(question) + 1} belum dijawab.` }
      }

      const numValue = Number(value)

      if (!Number.isInteger(numValue) || numValue < 0 || numValue > 3) {
        return { error: 'Ada nilai jawaban yang tidak valid. Silakan periksa kembali formulir.' }
      }

      answers[question.id] = numValue
    }

    const result = scoreSnapIv(answers)
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('screenings')
      .insert({
        child_id: DEMO_CHILD_ID,
        inattention_score: result.inattentionScore,
        hyperactivity_impulsivity_score: result.hyperactivityImpulsivityScore,
        total_score: result.totalScore,
        category: result.category,
        dominant_domain: result.dominantDomain,
        answers_json: answers,
        disclaimer_version: 'v1',
      })
      .select('id')
      .single()

    if (error || !data) {
      console.error('Supabase screening save error:', error)
      return { error: 'Hasil skrining belum dapat disimpan. Silakan coba lagi.' }
    }

    redirect(`/hasil/${data.id}`)
  } catch (error) {
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error
    }

    console.error('Error saving screening:', error)
    return { error: 'Terjadi kesalahan saat menyimpan hasil skrining. Silakan coba lagi.' }
  }
}
