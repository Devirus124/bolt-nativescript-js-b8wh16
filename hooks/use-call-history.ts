"use client"

import { useState, useEffect } from "react"
import { callHistoryService, type CallRecord } from "@/lib/database"
import { useToast } from "@/hooks/use-toast"

export function useCallHistory() {
  const [callHistory, setCallHistory] = useState<CallRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalCalls: 0,
    completedCalls: 0,
    averageDuration: 0,
    successRate: 0,
  })
  const { toast } = useToast()

  // Load call history
  const loadCallHistory = async () => {
    try {
      setLoading(true)
      const [historyData, statsData] = await Promise.all([callHistoryService.getAll(), callHistoryService.getStats()])
      setCallHistory(historyData)
      setStats(statsData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load call history")
      toast({
        title: "Error",
        description: "Failed to load call history",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Start a call
  const startCall = async (contactId: string, contactName: string, callType: string, script?: string) => {
    try {
      const callRecord = await callHistoryService.startCall(contactId, contactName, callType, script)
      setCallHistory((prev) => [callRecord, ...prev])
      return callRecord
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to start call",
        variant: "destructive",
      })
      throw err
    }
  }

  // End a call
  const endCall = async (callId: string, durationSeconds: number, notes?: string, transcript?: string) => {
    try {
      const updatedCall = await callHistoryService.endCall(callId, durationSeconds, notes, transcript)
      setCallHistory((prev) => prev.map((call) => (call.id === callId ? updatedCall : call)))
      // Reload stats
      const newStats = await callHistoryService.getStats()
      setStats(newStats)
      return updatedCall
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to end call",
        variant: "destructive",
      })
      throw err
    }
  }

  // Update call notes
  const updateCallNotes = async (callId: string, notes: string) => {
    try {
      const updatedCall = await callHistoryService.update(callId, { notes })
      setCallHistory((prev) => prev.map((call) => (call.id === callId ? updatedCall : call)))
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update notes",
        variant: "destructive",
      })
      throw err
    }
  }

  useEffect(() => {
    loadCallHistory()
  }, [])

  return {
    callHistory,
    stats,
    loading,
    error,
    loadCallHistory,
    startCall,
    endCall,
    updateCallNotes,
  }
}
