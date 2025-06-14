import { supabase, type Contact, type CallRecord } from "./supabase"

// Contact operations
export const contactService = {
  // Get all contacts
  async getAll(): Promise<Contact[]> {
    const { data, error } = await supabase.from("contacts").select("*").order("name")

    if (error) throw error
    return data || []
  },

  // Search contacts
  async search(query: string): Promise<Contact[]> {
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .or(`name.ilike.%${query}%,company.ilike.%${query}%,email.ilike.%${query}%`)
      .order("name")

    if (error) throw error
    return data || []
  },

  // Get contact by ID
  async getById(id: string): Promise<Contact | null> {
    const { data, error } = await supabase.from("contacts").select("*").eq("id", id).single()

    if (error) throw error
    return data
  },

  // Create new contact
  async create(contact: Omit<Contact, "id" | "created_at" | "updated_at">): Promise<Contact> {
    const { data, error } = await supabase.from("contacts").insert([contact]).select().single()

    if (error) throw error
    return data
  },

  // Update contact
  async update(id: string, updates: Partial<Contact>): Promise<Contact> {
    const { data, error } = await supabase.from("contacts").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data
  },

  // Delete contact
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("contacts").delete().eq("id", id)

    if (error) throw error
  },

  // Update last call date
  async updateLastCallDate(id: string): Promise<void> {
    const { error } = await supabase.from("contacts").update({ last_call_date: new Date().toISOString() }).eq("id", id)

    if (error) throw error
  },
}

// Call history operations
export const callHistoryService = {
  // Get all call records
  async getAll(): Promise<CallRecord[]> {
    const { data, error } = await supabase.from("call_history").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get call records for a specific contact
  async getByContactId(contactId: string): Promise<CallRecord[]> {
    const { data, error } = await supabase
      .from("call_history")
      .select("*")
      .eq("contact_id", contactId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  },

  // Create new call record
  async create(callRecord: Omit<CallRecord, "id" | "created_at">): Promise<CallRecord> {
    const { data, error } = await supabase.from("call_history").insert([callRecord]).select().single()

    if (error) throw error
    return data
  },

  // Update call record
  async update(id: string, updates: Partial<CallRecord>): Promise<CallRecord> {
    const { data, error } = await supabase.from("call_history").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data
  },

  // Start a call (create record with in_progress status)
  async startCall(contactId: string, contactName: string, callType: string, script?: string): Promise<CallRecord> {
    const callRecord = {
      contact_id: contactId,
      contact_name: contactName,
      call_type: callType,
      status: "in_progress" as const,
      started_at: new Date().toISOString(),
      call_script: script,
      duration_seconds: 0,
    }

    return await this.create(callRecord)
  },

  // End a call
  async endCall(id: string, durationSeconds: number, notes?: string, transcript?: string): Promise<CallRecord> {
    return await this.update(id, {
      status: "completed",
      ended_at: new Date().toISOString(),
      duration_seconds: durationSeconds,
      notes,
      transcript,
    })
  },

  // Get call statistics
  async getStats(): Promise<{
    totalCalls: number
    completedCalls: number
    averageDuration: number
    successRate: number
  }> {
    const { data, error } = await supabase.from("call_history").select("status, duration_seconds")

    if (error) throw error

    const totalCalls = data?.length || 0
    const completedCalls = data?.filter((call) => call.status === "completed").length || 0
    const totalDuration = data?.reduce((sum, call) => sum + (call.duration_seconds || 0), 0) || 0
    const averageDuration = completedCalls > 0 ? Math.round(totalDuration / completedCalls) : 0
    const successRate = totalCalls > 0 ? Math.round((completedCalls / totalCalls) * 100) : 0

    return {
      totalCalls,
      completedCalls,
      averageDuration,
      successRate,
    }
  },
}
