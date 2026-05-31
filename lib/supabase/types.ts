export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      children: {
        Row: {
          id: string
          user_id: string
          name: string
          gender: 'laki_laki' | 'perempuan'
          birth_date: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          gender: 'laki_laki' | 'perempuan'
          birth_date: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          gender?: 'laki_laki' | 'perempuan'
          birth_date?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      screenings: {
        Row: {
          id: string
          child_id: string
          completed_at: string
          inattention_score: number
          hyperactivity_impulsivity_score: number
          total_score: number
          category: string
          dominant_domain: string
          answers_json: Json
          disclaimer_version: string
          created_at: string
        }
        Insert: {
          id?: string
          child_id: string
          completed_at?: string
          inattention_score: number
          hyperactivity_impulsivity_score: number
          total_score: number
          category: string
          dominant_domain: string
          answers_json: Json
          disclaimer_version?: string
          created_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          completed_at?: string
          inattention_score?: number
          hyperactivity_impulsivity_score?: number
          total_score?: number
          category?: string
          dominant_domain?: string
          answers_json?: Json
          disclaimer_version?: string
          created_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          title: string
          domain: string
          age_min: number
          age_max: number
          duration_minutes: number
          objective: string
          tools: string
          steps_json: Json
          observed_behaviors: string
          safety_notes: string
          stop_conditions: string
          rationale: string
          source_label: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          domain: string
          age_min: number
          age_max: number
          duration_minutes: number
          objective: string
          tools: string
          steps_json: Json
          observed_behaviors: string
          safety_notes: string
          stop_conditions: string
          rationale: string
          source_label: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          domain?: string
          age_min?: number
          age_max?: number
          duration_minutes?: number
          objective?: string
          tools?: string
          steps_json?: Json
          observed_behaviors?: string
          safety_notes?: string
          stop_conditions?: string
          rationale?: string
          source_label?: string
          created_at?: string
        }
      }
      behavior_logs: {
        Row: {
          id: string
          child_id: string
          activity_id: string | null
          log_date: string
          mood: string
          focus_rating: number
          impulsivity_rating: number
          cooperation_rating: number
          notes: string
          incident_text: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          child_id: string
          activity_id?: string | null
          log_date: string
          mood: string
          focus_rating: number
          impulsivity_rating: number
          cooperation_rating: number
          notes: string
          incident_text?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          activity_id?: string | null
          log_date?: string
          mood?: string
          focus_rating?: number
          impulsivity_rating?: number
          cooperation_rating?: number
          notes?: string
          incident_text?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      education_articles: {
        Row: {
          id: string
          title: string
          slug: string
          category: string
          summary: string
          body: string
          source_label: string
          reviewer_status: string
          read_time_minutes: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          category: string
          summary: string
          body: string
          source_label: string
          reviewer_status: string
          read_time_minutes: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          category?: string
          summary?: string
          body?: string
          source_label?: string
          reviewer_status?: string
          read_time_minutes?: number
          created_at?: string
        }
      }
      report_snapshots: {
        Row: {
          id: string
          child_id: string
          generated_at: string
          title: string
          snapshot_json: Json
          pdf_storage_path: string | null
          version: string
          created_at: string
        }
        Insert: {
          id?: string
          child_id: string
          generated_at?: string
          title: string
          snapshot_json: Json
          pdf_storage_path?: string | null
          version?: string
          created_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          generated_at?: string
          title?: string
          snapshot_json?: Json
          pdf_storage_path?: string | null
          version?: string
          created_at?: string
        }
      }
    }
  }
}
