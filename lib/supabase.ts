import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for the browser
const createBrowserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

  return createClient(supabaseUrl, supabaseAnonKey)
}

// Singleton pattern for client-side Supabase client
let browserClient: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createBrowserClient()
  }
  return browserClient
}

// Server-side client (for server components and API routes)
export function getSupabaseServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL as string
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

  return createClient(supabaseUrl, supabaseServiceKey)
}

// For backward compatibility and local storage version
export const supabase = getSupabaseBrowserClient()

export type Contact = {
  id: string
  name: string
  email?: string
  phone?: string
  company?: string
  role?: string
  tags: string[]
  last_call_date?: string
  created_at: string
  updated_at: string
}

export type CallHistory = {
  id: string
  contact_id: string
  contact_name: string
  call_type: string
  duration_seconds: number
  status: "in_progress" | "completed" | "missed" | "scheduled"
  notes?: string
  transcript?: string
  script_used?: string
  created_at: string
  updated_at: string
}

// Database types for compatibility
export type Database = {
  public: {
    Tables: {
      contacts: {
        Row: Contact
        Insert: Omit<Contact, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Contact, "id" | "created_at" | "updated_at">>
      }
      call_history: {
        Row: CallHistory
        Insert: Omit<CallHistory, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<CallHistory, "id" | "created_at" | "updated_at">>
      }
    }
  }
}
