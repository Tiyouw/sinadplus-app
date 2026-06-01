'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signInDemo() {
  const email = process.env.DEMO_EMAIL
  const password = process.env.DEMO_PASSWORD

  if (!email || !password) {
    throw new Error('Demo login gagal: konfigurasi demo belum lengkap.')
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error('Demo login gagal: kredensial demo belum dapat digunakan.')
  }

  redirect('/dashboard')
}
