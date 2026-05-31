'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { DEMO_CHILD_ID } from '@/lib/supabase/queries'
import { Database } from '@/lib/supabase/types'

const ALLOWED_MOODS = ['senang', 'netral', 'rewel', 'marah', 'sedih'] as const

function getRequiredText(formData: FormData, field: string, label: string) {
  const value = String(formData.get(field) ?? '').trim()
  if (!value) throw new Error(`${label} wajib diisi.`)
  return value
}

function getRating(formData: FormData, field: string, label: string) {
  const value = Number(formData.get(field))
  if (!Number.isInteger(value) || value < 1 || value > 5) {
    throw new Error(`${label} harus bernilai 1 sampai 5.`)
  }
  return value
}

export async function saveBehaviorLog(formData: FormData) {
  const logDate = getRequiredText(formData, 'log_date', 'Tanggal observasi')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(logDate)) {
    throw new Error('Tanggal observasi tidak valid.')
  }

  const mood = getRequiredText(formData, 'mood', 'Suasana hati')
  if (!ALLOWED_MOODS.includes(mood as (typeof ALLOWED_MOODS)[number])) {
    throw new Error('Suasana hati tidak valid.')
  }

  const notes = getRequiredText(formData, 'notes', 'Catatan observasi')
  if (notes.length > 1000) {
    throw new Error('Catatan observasi maksimal 1000 karakter.')
  }

  const incidentText = String(formData.get('incident_text') ?? '').trim()
  if (incidentText.length > 1000) {
    throw new Error('Insiden khusus maksimal 1000 karakter.')
  }

  const activityId = String(formData.get('activity_id') ?? '').trim()
  const supabase = await createClient()

  const { error } = await supabase.from('behavior_logs').insert({
    child_id: DEMO_CHILD_ID,
    activity_id: activityId || null,
    log_date: logDate,
    mood,
    focus_rating: getRating(formData, 'focus_rating', 'Tingkat fokus'),
    impulsivity_rating: getRating(formData, 'impulsivity_rating', 'Tingkat impulsivitas'),
    cooperation_rating: getRating(formData, 'cooperation_rating', 'Tingkat kerja sama'),
    notes,
    incident_text: incidentText || null,
  } as Database['public']['Tables']['behavior_logs']['Insert'])

  if (error) {
    console.error('Behavior log save error:', error)
    throw new Error('Gagal menyimpan catatan perilaku. Silakan coba lagi.')
  }

  revalidatePath('/catatan')
}
