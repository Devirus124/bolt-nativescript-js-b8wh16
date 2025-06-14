"use client"

import { useState, useEffect } from "react"
import {
  getCallHistory,
  startCall as startCallDB,
  endCall as endCallDB,
  updateCallNotes as updateCallNotesDB,
  getCallStats,
} from "@/lib/database"
import type { CallHistory } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export function useCallHistory() {
  const [callHistory, setCallHistory] = useState<CallHistory[]>([])
  const [stats, setStats] = useState({
    totalCalls: 0,
    completedCalls: 0,
    averageDuration: 0,
    successRate: 0,
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Load call history on mount
  useEffect(() => {
    loadCallHistory()
    loadStats()
  }, [])

  const loadCallHistory = async () => {
    try {
      setLoading(true)
      const data = await getCallHistory()
      setCallHistory(data)
    } catch (error) {
      console.error("Failed to load call history:", error)
      toast({
        title: "Error",
        description: "Failed to load call history",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const statsData = await getCallStats()
      setStats(statsData)
    } catch (error) {
      console.error("Failed to load stats:", error)
    }
  }

  const startCall = async (contactId: string, contactName: string, callType: string, script?: string) => {
    try {
      const newCall = await startCallDB(contactId, contactName, callType, script)
      setCallHistory((prev) => [newCall, ...prev])
      return newCall
    } catch (error) {
      console.error("Failed to start call:", error)
      toast({
        title: "Error",
        description: "Failed to start call",
        variant: "destructive",
      })
      throw error
    }
  }

  const endCall = async (callId: string, durationSeconds: number, notes?: string, transcript?: string) => {
    try {
      const updatedCall = await endCallDB(callId, durationSeconds, notes, transcript)
      setCallHistory((prev) => prev.map((call) => (call.id === callId ? updatedCall : call)))
      // Refresh stats after ending call
      loadStats()
      return updatedCall
    } catch (error) {
      console.error("Failed to end call:", error)
      toast({
        title: "Error",
        description: "Failed to end call",
        variant: "destructive",
      })
      throw error
    }
  }

  const updateCallNotes = async (callId: string, notes: string) => {
    try {
      await updateCallNotesDB(callId, notes)
      setCallHistory((prev) => prev.map((call) => (call.id === callId ? { ...call, notes } : call)))
    } catch (error) {
      console.error("Failed to update call notes:", error)
    }
  }

  return {
    callHistory,
    stats,
    loading,
    startCall,
    endCall,
    updateCallNotes,
    refreshHistory: loadCallHistory,
    refreshStats: loadStats,
  }
}
