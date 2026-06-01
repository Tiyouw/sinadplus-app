import { createClient } from './server'
import { Database } from './types'
import type { SnapIvDomain } from '@/lib/scoring/snap-iv'

export const DEMO_CHILD_ID = '11111111-1111-1111-1111-111111111111'

export async function getDemoChild(): Promise<Database['public']['Tables']['children']['Row']> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('children')
    .select('*')
    .eq('id', DEMO_CHILD_ID)
    .single()

  if (error) throw error
  if (!data) {
    throw new Error('Child not found')
  }
  return data
}

export async function getLatestScreening(childId = DEMO_CHILD_ID): Promise<Database['public']['Tables']['screenings']['Row'] | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('screenings')
    .select('*')
    .eq('child_id', childId)
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function getScreeningById(screeningId: string): Promise<Database['public']['Tables']['screenings']['Row']> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('screenings')
    .select('*')
    .eq('id', screeningId)
    .single()

  if (error) throw error
  if (!data) {
    throw new Error('Screening not found')
  }
  return data
}

export async function getActivities(domain?: SnapIvDomain): Promise<Database['public']['Tables']['activities']['Row'][]> {
  const supabase = await createClient()
  let query = supabase
    .from('activities')
    .select('*')
    .order('title', { ascending: true })

  if (domain) {
    query = query.eq('domain', domain)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

export async function getActivityById(activityId: string): Promise<Database['public']['Tables']['activities']['Row']> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('id', activityId)
    .single()

  if (error) throw error
  if (!data) {
    throw new Error('Activity not found')
  }
  return data
}

export async function getBehaviorLogs(childId = DEMO_CHILD_ID): Promise<Database['public']['Tables']['behavior_logs']['Row'][]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('behavior_logs')
    .select('*')
    .eq('child_id', childId)
    .order('log_date', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getArticles(): Promise<Database['public']['Tables']['education_articles']['Row'][]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('education_articles')
    .select('*')
    .eq('reviewer_status', 'approved')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getArticleBySlug(slug: string): Promise<Database['public']['Tables']['education_articles']['Row']> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('education_articles')
    .select('*')
    .eq('slug', slug)
    .eq('reviewer_status', 'approved')
    .single()

  if (error) throw error
  if (!data) {
    throw new Error('Article not found')
  }
  return data
}
