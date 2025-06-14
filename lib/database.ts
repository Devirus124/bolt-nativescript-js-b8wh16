import { supabase } from "./supabase"
import type { Contact, CallHistory } from "./supabase"

// Fallback database functions that use localStorage when Supabase is not available
const isBrowser = typeof window !== "undefined"
const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Local storage keys
const CONTACTS_KEY = "ai-assistant-contacts-v2"
const CALL_HISTORY_KEY = "ai-assistant-call-history-v2"

// Helper functions for localStorage
function getFromStorage<T>(key: string): T[] {
  if (!isBrowser) return []
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error(`Error reading from localStorage key ${key}:`, error)
    return []
  }
}

function saveToStorage<T>(key: string, data: T[]): void {
  if (!isBrowser) return
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Error saving to localStorage key ${key}:`, error)
  }
}

// Contact operations
export async function getContacts(): Promise<Contact[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from("contacts").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching contacts:", error)
      return []
    }

    return data || []
  }

  return getFromStorage<Contact>(CONTACTS_KEY)
}

export async function searchContacts(searchTerm: string): Promise<Contact[]> {
  const contacts = await getContacts()

  if (!searchTerm.trim()) {
    return contacts
  }

  return contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase())),
  )
}

export async function addContact(contactData: Omit<Contact, "id" | "created_at" | "updated_at">): Promise<Contact> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from("contacts").insert([contactData]).select().single()

    if (error) {
      console.error("Error adding contact:", error)
      throw error
    }

    return data
  }

  const contacts = getFromStorage<Contact>(CONTACTS_KEY)

  const newContact: Contact = {
    ...contactData,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const updatedContacts = [newContact, ...contacts]
  saveToStorage(CONTACTS_KEY, updatedContacts)

  return newContact
}

export async function updateContact(id: string, updates: Partial<Contact>): Promise<Contact> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from("contacts").update(updates).eq("id", id).select().single()

    if (error) {
      console.error("Error updating contact:", error)
      throw error
    }

    return data
  }

  const contacts = getFromStorage<Contact>(CONTACTS_KEY)
  const contactIndex = contacts.findIndex((c) => c.id === id)

  if (contactIndex === -1) {
    throw new Error("Contact not found")
  }

  const updatedContact = {
    ...contacts[contactIndex],
    ...updates,
    updated_at: new Date().toISOString(),
  }

  contacts[contactIndex] = updatedContact
  saveToStorage(CONTACTS_KEY, contacts)

  return updatedContact
}

export async function deleteContact(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from("contacts").delete().eq("id", id)

    if (error) {
      console.error("Error deleting contact:", error)
      throw error
    }
  } else {
    const contacts = getFromStorage<Contact>(CONTACTS_KEY)
    const filteredContacts = contacts.filter((c) => c.id !== id)
    saveToStorage(CONTACTS_KEY, filteredContacts)
  }
}

// Call history operations
export async function getCallHistory(): Promise<CallHistory[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from("call_history").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching call history:", error)
      return []
    }

    return data || []
  }

  return getFromStorage<CallHistory>(CALL_HISTORY_KEY)
}

export async function startCall(
  contactId: string,
  contactName: string,
  callType: string,
  script?: string,
): Promise<CallHistory> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("call_history")
      .insert([
        {
          contact_id: contactId,
          contact_name: contactName,
          call_type: callType,
          status: "in_progress",
          duration_seconds: 0,
          script_used: script,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error starting call:", error)
      throw error
    }

    return data
  }

  const callHistory = getFromStorage<CallHistory>(CALL_HISTORY_KEY)

  const newCall: CallHistory = {
    id: Date.now().toString(),
    contact_id: contactId,
    contact_name: contactName,
    call_type: callType,
    status: "in_progress",
    duration_seconds: 0,
    script_used: script,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const updatedHistory = [newCall, ...callHistory]
  saveToStorage(CALL_HISTORY_KEY, updatedHistory)

  return newCall
}

export async function endCall(
  callId: string,
  durationSeconds: number,
  notes?: string,
  transcript?: string,
): Promise<CallHistory> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("call_history")
      .update({
        duration_seconds: durationSeconds,
        status: "completed",
        notes,
        transcript,
      })
      .eq("id", callId)
      .select()
      .single()

    if (error) {
      console.error("Error ending call:", error)
      throw error
    }

    return data
  }

  const callHistory = getFromStorage<CallHistory>(CALL_HISTORY_KEY)
  const callIndex = callHistory.findIndex((c) => c.id === callId)

  if (callIndex === -1) {
    throw new Error("Call not found")
  }

  const updatedCall = {
    ...callHistory[callIndex],
    duration_seconds: durationSeconds,
    status: "completed" as const,
    notes,
    transcript,
    updated_at: new Date().toISOString(),
  }

  callHistory[callIndex] = updatedCall
  saveToStorage(CALL_HISTORY_KEY, callHistory)

  return updatedCall
}

export async function updateCallNotes(callId: string, notes: string): Promise<void> {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from("call_history").update({ notes }).eq("id", callId)

    if (error) {
      console.error("Error updating call notes:", error)
      throw error
    }
  } else {
    const callHistory = getFromStorage<CallHistory>(CALL_HISTORY_KEY)
    const callIndex = callHistory.findIndex((c) => c.id === callId)

    if (callIndex !== -1) {
      callHistory[callIndex] = {
        ...callHistory[callIndex],
        notes,
        updated_at: new Date().toISOString(),
      }
      saveToStorage(CALL_HISTORY_KEY, callHistory)
    }
  }
}

export async function getCallStats() {
  const calls = await getCallHistory()

  const totalCalls = calls.length
  const completedCalls = calls.filter((call) => call.status === "completed").length
  const totalDuration = calls.reduce((sum, call) => sum + call.duration_seconds, 0)
  const averageDuration = totalCalls > 0 ? Math.round(totalDuration / totalCalls) : 0
  const successRate = totalCalls > 0 ? Math.round((completedCalls / totalCalls) * 100) : 0

  return {
    totalCalls,
    completedCalls,
    averageDuration,
    successRate,
  }
}
