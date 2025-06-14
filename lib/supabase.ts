import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Contact {
  id: string
  name: string
  email?: string
  phone?: string
  company?: string
  role?: string
  tags: string[]
  created_at: string
  updated_at: string
  last_call_date?: string
}

export interface CallRecord {
  id: string
  contact_id?: string
  contact_name: string
  call_type: string
  duration_seconds: number
  status: "scheduled" | "in_progress" | "completed" | "missed" | "cancelled"
  notes?: string
  transcript?: string
  call_script?: string
  started_at?: string
  ended_at?: string
  created_at: string
}
