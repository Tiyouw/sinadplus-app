import { MEDICAL_DISCLAIMER } from '../constants/copy'
import type { Database } from '../supabase/types'

type Child = Database['public']['Tables']['children']['Row']
type Screening = Database['public']['Tables']['screenings']['Row']
type BehaviorLog = Database['public']['Tables']['behavior_logs']['Row']
type Activity = Database['public']['Tables']['activities']['Row']

export interface BuildReportDataInput {
  child: Child
  screenings: Screening[]
  logs: BehaviorLog[]
  activities: Activity[]
  generatedAt?: string
}

export interface ReportData {
  title: string
  generatedAt: string
  childName: string
  birthDate: string
  gender: 'laki_laki' | 'perempuan'
  latestScreening: Screening | null
  logs: BehaviorLog[]
  activities: Activity[]
  disclaimer: string
}

/**
 * Pure function to build report data from child, screenings, logs, and activities.
 * Sorts screenings by completed_at and selects the latest one.
 * 
 * @param input - Child data, screenings, logs, activities, and optional generatedAt timestamp
 * @returns Structured report data ready for rendering
 */
export function buildReportData(input: BuildReportDataInput): ReportData {
  const { child, screenings, logs, activities, generatedAt } = input

  // Sort screenings by completed_at descending and get the latest
  const sortedScreenings = [...screenings].sort((a, b) => {
    return new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
  })
  const latestScreening = sortedScreenings[0] || null

  // Use provided generatedAt or current timestamp
  const timestamp = generatedAt || new Date().toISOString()

  // Generate title
  const title = `Laporan Konsultasi - ${child.name}`

  return {
    title,
    generatedAt: timestamp,
    childName: child.name,
    birthDate: child.birth_date,
    gender: child.gender,
    latestScreening,
    logs,
    activities,
    disclaimer: MEDICAL_DISCLAIMER,
  }
}
