'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signInDemo() {
  const supabase = await createClient()

  const email = process.env.DEMO_EMAIL!
  const password = process.env.DEMO_PASSWORD!

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(`Demo login gagal: ${error.message}`)
  }

  redirect('/dashboard')
}
