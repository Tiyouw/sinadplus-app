'use server'

import { createClient } from '@/lib/supabase/server'
import { DEMO_CHILD_ID } from '@/lib/supabase/queries'
import { revalidatePath } from 'next/cache'

export async function saveBehaviorLog(formData: FormData) {
  const supabase = await createClient()

  const logData = {
    child_id: DEMO_CHILD_ID,
    activity_id: formData.get('activity_id') as string | null,
    log_date: formData.get('log_date') as string,
    mood: formData.get('mood') as string,
    focus_rating: parseInt(formData.get('focus_rating') as string, 10),
    impulsivity_rating: parseInt(formData.get('impulsivity_rating') as string, 10),
    cooperation_rating: parseInt(formData.get('cooperation_rating') as string, 10),
    notes: formData.get('notes') as string,
    incident_text: formData.get('incident_text') as string | null,
  }

  if (!logData.activity_id) {
    logData.activity_id = null
  }

  if (!logData.incident_text) {
    logData.incident_text = null
  }

  const { error } = await supabase.from('behavior_logs').insert(logData)

  if (error) {
    throw new Error('Gagal menyimpan catatan perilaku. Silakan coba lagi.')
  }

  revalidatePath('/catatan')
}
