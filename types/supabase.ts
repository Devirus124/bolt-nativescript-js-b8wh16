export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      resumes: {
        Row: {
          id: string
          user_id: string
          name: string
          original_content: string | null
          optimized_content: string | null
          job_role: string | null
          ats_score: number | null
          status: string
          file_path: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          original_content?: string | null
          optimized_content?: string | null
          job_role?: string | null
          ats_score?: number | null
          status?: string
          file_path?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          original_content?: string | null
          optimized_content?: string | null
          job_role?: string | null
          ats_score?: number | null
          status?: string
          file_path?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      job_applications: {
        Row: {
          id: string
          user_id: string
          resume_id: string | null
          company: string
          position: string
          job_description: string | null
          status: string
          applied_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          resume_id?: string | null
          company: string
          position: string
          job_description?: string | null
          status?: string
          applied_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          resume_id?: string | null
          company?: string
          position?: string
          job_description?: string | null
          status?: string
          applied_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      job_listings: {
        Row: {
          id: string
          title: string
          company: string
          location: string
          description: string
          salary_range: string | null
          job_type: string | null
          remote: boolean
          url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          company: string
          location: string
          description: string
          salary_range?: string | null
          job_type?: string | null
          remote?: boolean
          url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          company?: string
          location?: string
          description?: string
          salary_range?: string | null
          job_type?: string | null
          remote?: boolean
          url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          name: string
          category: string | null
        }
        Insert: {
          id?: string
          name: string
          category?: string | null
        }
        Update: {
          id?: string
          name?: string
          category?: string | null
        }
      }
      resume_skills: {
        Row: {
          resume_id: string
          skill_id: string
        }
        Insert: {
          resume_id: string
          skill_id: string
        }
        Update: {
          resume_id?: string
          skill_id?: string
        }
      }
      job_skills: {
        Row: {
          job_id: string
          skill_id: string
        }
        Insert: {
          job_id: string
          skill_id: string
        }
        Update: {
          job_id?: string
          skill_id?: string
        }
      }
    }
  }
}
