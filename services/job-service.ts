"use client"

import { getSupabaseBrowserClient } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

type JobListing = Database["public"]["Tables"]["job_listings"]["Row"]
type JobApplication = Database["public"]["Tables"]["job_applications"]["Row"]
type JobApplicationInsert = Database["public"]["Tables"]["job_applications"]["Insert"]

export const jobService = {
  async getJobListings(filters: { remote?: boolean; search?: string } = {}) {
    const supabase = getSupabaseBrowserClient()

    let query = supabase.from("job_listings").select("*").order("created_at", { ascending: false })

    if (filters.remote !== undefined) {
      query = query.eq("remote", filters.remote)
    }

    if (filters.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,company.ilike.%${filters.search}%,description.ilike.%${filters.search}%`,
      )
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    return data as JobListing[]
  },

  async getJobListingById(jobId: string) {
    const supabase = getSupabaseBrowserClient()

    const { data, error } = await supabase.from("job_listings").select("*").eq("id", jobId).single()

    if (error) {
      throw error
    }

    return data as JobListing
  },

  async getUserApplications(userId: string) {
    const supabase = getSupabaseBrowserClient()

    const { data, error } = await supabase
      .from("job_applications")
      .select("*")
      .eq("user_id", userId)
      .order("applied_date", { ascending: false })

    if (error) {
      throw error
    }

    return data as JobApplication[]
  },

  async createJobApplication(application: JobApplicationInsert) {
    const supabase = getSupabaseBrowserClient()

    const { data, error } = await supabase.from("job_applications").insert(application).select().single()

    if (error) {
      throw error
    }

    return data as JobApplication
  },

  async updateApplicationStatus(applicationId: string, status: string) {
    const supabase = getSupabaseBrowserClient()

    const { data, error } = await supabase
      .from("job_applications")
      .update({ status })
      .eq("id", applicationId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data as JobApplication
  },

  async deleteApplication(applicationId: string) {
    const supabase = getSupabaseBrowserClient()

    const { error } = await supabase.from("job_applications").delete().eq("id", applicationId)

    if (error) {
      throw error
    }

    return true
  },
}
