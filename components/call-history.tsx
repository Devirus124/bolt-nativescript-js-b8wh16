"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, Clock, User, FileText } from "lucide-react"

interface CallRecord {
  id: string
  contact: string
  type: string
  duration: string
  date: string
  status: "completed" | "missed" | "scheduled"
  notes: string
}

export function CallHistory() {
  const [callHistory] = useState<CallRecord[]>([
    {
      id: "1",
      contact: "John Smith",
      type: "Sales Call",
      duration: "15:30",
      date: "2024-01-15 10:30 AM",
      status: "completed",
      notes: "Interested in premium package, follow up next week",
    },
    {
      id: "2",
      contact: "Sarah Johnson",
      type: "Customer Support",
      duration: "08:45",
      date: "2024-01-15 09:15 AM",
      status: "completed",
      notes: "Issue resolved, customer satisfied",
    },
    {
      id: "3",
      contact: "Mike Davis",
      type: "Follow-up Call",
      duration: "12:20",
      date: "2024-01-14 02:00 PM",
      status: "completed",
      notes: "Scheduled demo for next Tuesday",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "missed":
        return "bg-red-100 text-red-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      {callHistory.map((call) => (
        <Card key={call.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{call.contact}</h3>
                  <p className="text-sm text-gray-600">{call.type}</p>
                </div>
              </div>
              <Badge className={getStatusColor(call.status)}>{call.status}</Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {call.duration}
              </div>
              <div>{call.date}</div>
            </div>

            {call.notes && (
              <div className="bg-gray-50 p-3 rounded-lg mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">Notes</span>
                </div>
                <p className="text-sm text-gray-700">{call.notes}</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Phone className="w-4 h-4 mr-2" />
                Call Again
              </Button>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
