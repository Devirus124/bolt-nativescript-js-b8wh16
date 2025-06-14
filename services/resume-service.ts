"use client"

import { getSupabaseBrowserClient } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

type Resume = Database["public"]["Tables"]["resumes"]["Row"]
type ResumeInsert = Database["public"]["Tables"]["resumes"]["Insert"]
type ResumeUpdate = Database["public"]["Tables"]["resumes"]["Update"]

export const resumeService = {
  async getUserResumes(userId: string) {
    const supabase = getSupabaseBrowserClient()

    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return data as Resume[]
  },

  async getResumeById(resumeId: string) {
    const supabase = getSupabaseBrowserClient()

    const { data, error } = await supabase.from("resumes").select("*").eq("id", resumeId).single()

    if (error) {
      throw error
    }

    return data as Resume
  },

  async createResume(resume: ResumeInsert) {
    const supabase = getSupabaseBrowserClient()

    const { data, error } = await supabase.from("resumes").insert(resume).select().single()

    if (error) {
      throw error
    }

    return data as Resume
  },

  async updateResume(resumeId: string, updates: ResumeUpdate) {
    const supabase = getSupabaseBrowserClient()

    const { data, error } = await supabase.from("resumes").update(updates).eq("id", resumeId).select().single()

    if (error) {
      throw error
    }

    return data as Resume
  },

  async deleteResume(resumeId: string) {
    const supabase = getSupabaseBrowserClient()

    const { error } = await supabase.from("resumes").delete().eq("id", resumeId)

    if (error) {
      throw error
    }

    return true
  },

  async uploadResumeFile(file: File, userId: string) {
    const supabase = getSupabaseBrowserClient()
    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`
    const filePath = `resumes/${fileName}`

    const { data, error } = await supabase.storage.from("resume-files").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      throw error
    }

    return data.path
  },

  async optimizeResume(resumeId: string, jobRole: string) {
    const supabase = getSupabaseBrowserClient()

    // First, update the status to optimizing
    await supabase.from("resumes").update({ status: "optimizing", job_role: jobRole }).eq("id", resumeId)

    // In a real application, you would call an AI service here to optimize the resume
    // For now, we'll simulate the optimization with a delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate a random ATS score between 80 and 100
    const atsScore = Math.floor(Math.random() * 21) + 80

    // Update the resume with the optimized content and score
    const { data, error } = await supabase
      .from("resumes")
      .update({
        status: "optimized",
        ats_score: atsScore,
        // In a real app, this would be the actual optimized content
        optimized_content: "This is the optimized resume content tailored for the role.",
      })
      .eq("id", resumeId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data as Resume
  },
}
