'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SNAP_IV_QUESTIONS, scoreSnapIv } from '@/lib/scoring/snap-iv'
import { DEMO_CHILD_ID } from '@/lib/supabase/queries'

export async function saveScreening(formData: FormData) {
  try {
    // Build answers object from formData
    const answers: Record<string, number> = {}

    for (const question of SNAP_IV_QUESTIONS) {
      const value = formData.get(question.id)

      if (value === null) {
        throw new Error(`Pertanyaan "${question.text}" belum dijawab`)
      }

      const numValue = parseInt(value as string, 10)

      if (isNaN(numValue) || numValue < 0 || numValue > 3) {
        throw new Error(`Nilai jawaban untuk "${question.text}" tidak valid`)
      }

      answers[question.id] = numValue
    }

    // Score the answers
    const result = scoreSnapIv(answers)

    // Get Supabase client
    const supabase = await createClient()

    // Insert screening into database
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

    if (error) {
      console.error('Supabase error:', error)
      throw new Error(`Gagal menyimpan hasil skrining: ${error.message}`)
    }

    if (!data) {
      throw new Error('Gagal menyimpan hasil skrining: tidak ada data yang dikembalikan')
    }

    // Redirect to results page
    redirect(`/hasil/${data.id}`)
  } catch (error) {
    // If it's a redirect, let it through
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error
    }

    // Otherwise, log and rethrow with user-friendly message
    console.error('Error saving screening:', error)
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Terjadi kesalahan saat menyimpan hasil skrining. Silakan coba lagi.'
    )
  }
}
