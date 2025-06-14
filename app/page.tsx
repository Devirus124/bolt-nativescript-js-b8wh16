"use client"

import { useState, useEffect, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Copy,
  Phone,
  MessageSquare,
  Sparkles,
  FileText,
  Users,
  Mic,
  MicOff,
  Clock,
  User,
  Mail,
  Building,
  Plus,
  Search,
  PhoneCall,
  BarChart3,
  Loader2,
  Play,
  Square,
  Download,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useContacts } from "@/hooks/use-contacts"
import { useCallHistory } from "@/hooks/use-call-history"
import type { Contact } from "@/lib/supabase"

// Speech Recognition Hook
function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        const recognition = recognitionRef.current

        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = "en-US"

        recognition.onresult = (event: any) => {
          let finalTranscript = ""
          let interimTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptPart = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcriptPart + " "
            } else {
              interimTranscript += transcriptPart
            }
          }

          setTranscript((prev) => prev + finalTranscript)
        }

        recognition.onerror = (event: any) => {
          setError(event.error)
          setIsListening(false)
        }

        recognition.onend = () => {
          setIsListening(false)
        }
      } else {
        setError("Speech recognition not supported in this browser")
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setError(null)
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const resetTranscript = () => {
    setTranscript("")
  }

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: !!recognitionRef.current,
  }
}

export default function AIAssistantApp() {
  // Form states
  const [promptForm, setPromptForm] = useState({
    category: "",
    purpose: "",
    context: "",
  })
  const [scriptForm, setScriptForm] = useState({
    callType: "",
    objective: "",
    context: "",
  })

  // Generated content
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [callScript, setCallScript] = useState("")
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false)
  const [isGeneratingScript, setIsGeneratingScript] = useState(false)

  // Call states
  const [isCallActive, setIsCallActive] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [callNotes, setCallNotes] = useState("")
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [currentCallId, setCurrentCallId] = useState<string | null>(null)
  const [selectedCallType, setSelectedCallType] = useState("")

  // Contact form
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddContactOpen, setIsAddContactOpen] = useState(false)
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    tags: "",
  })

  // Speech recognition
  const { isListening, transcript, startListening, stopListening, resetTranscript, isSupported } =
    useSpeechRecognition()

  const { toast } = useToast()
  const { contacts, loading: contactsLoading, searchContacts, addContact, updateContact } = useContacts()
  const { callHistory, stats, loading: historyLoading, startCall, endCall, updateCallNotes } = useCallHistory()

  // Timer ref
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Search contacts when search term changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchContacts(searchTerm)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  // Update call transcript when speech recognition transcript changes
  useEffect(() => {
    if (transcript && isCallActive) {
      // Auto-save transcript updates
      if (currentCallId) {
        updateCallNotes(currentCallId, `${callNotes}\n\nTranscript: ${transcript}`)
      }
    }
  }, [transcript])

  const promptCategories = [
    { id: "creative", name: "Creative Writing", icon: "✨" },
    { id: "business", name: "Business", icon: "💼" },
    { id: "marketing", name: "Marketing", icon: "📢" },
    { id: "technical", name: "Technical", icon: "⚙️" },
    { id: "educational", name: "Educational", icon: "📚" },
    { id: "personal", name: "Personal", icon: "👤" },
  ]

  const callTypes = [
    { id: "sales", name: "Sales Call", icon: "💰" },
    { id: "support", name: "Customer Support", icon: "🛠️" },
    { id: "interview", name: "Job Interview", icon: "👔" },
    { id: "meeting", name: "Business Meeting", icon: "🤝" },
    { id: "follow-up", name: "Follow-up Call", icon: "📞" },
  ]

  const generatePrompt = async () => {
    if (!promptForm.category || !promptForm.purpose || !promptForm.context) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to generate a prompt.",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingPrompt(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const prompts = {
      creative: `Create a ${promptForm.purpose} that ${promptForm.context}. Focus on vivid imagery, emotional depth, and engaging storytelling. Consider the target audience and desired tone. Use descriptive language that paints a clear picture in the reader's mind. Structure your content with a compelling opening, well-developed middle, and satisfying conclusion.`,
      business: `Develop a ${promptForm.purpose} for ${promptForm.context}. Ensure it's professional, actionable, and aligned with business objectives. Include key metrics and success criteria. Focus on ROI, efficiency improvements, and strategic value. Present information in a clear, executive-friendly format with bullet points and concrete recommendations.`,
      marketing: `Design a ${promptForm.purpose} campaign for ${promptForm.context}. Focus on compelling messaging, target audience engagement, and clear call-to-action. Consider brand voice and market positioning. Include emotional triggers, value propositions, and competitive advantages. Optimize for conversion and brand awareness.`,
      technical: `Build a ${promptForm.purpose} solution for ${promptForm.context}. Include technical specifications, implementation details, and best practices. Consider scalability, maintainability, and security. Provide code examples, architecture diagrams, and step-by-step implementation guides. Address potential challenges and solutions.`,
      educational: `Create an educational ${promptForm.purpose} about ${promptForm.context}. Structure it for clear learning outcomes, include examples, and make it accessible to the target learning level. Use progressive disclosure, interactive elements, and assessment opportunities. Provide practical applications and real-world connections.`,
      personal: `Develop a personal ${promptForm.purpose} for ${promptForm.context}. Make it authentic, goal-oriented, and actionable. Consider personal values and long-term objectives. Include reflection questions, milestone tracking, and accountability measures. Focus on sustainable habits and meaningful progress.`,
    }

    const prompt =
      prompts[promptForm.category as keyof typeof prompts] ||
      "Generate content based on the provided context and purpose."
    setGeneratedPrompt(prompt)
    setIsGeneratingPrompt(false)

    toast({
      title: "Prompt Generated",
      description: "Your custom prompt has been generated successfully!",
    })
  }

  const generateCallScript = async () => {
    if (!scriptForm.callType || !scriptForm.objective || !scriptForm.context) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to generate a script.",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingScript(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const scripts = {
      sales: `**Sales Call Script**

**Opening:**
"Hi [Name], this is [Your Name] from [Company]. I hope I'm catching you at a good time. I'm calling because ${scriptForm.context}."

**Objective:** ${scriptForm.objective}

**Discovery Questions:**
1. "What's your current situation with [relevant topic]?"
2. "What challenges are you facing in this area?"
3. "How is this impacting your business/goals?"
4. "What would an ideal solution look like for you?"

**Value Proposition:**
- Highlight specific benefits relevant to their situation
- Share relevant case studies or success stories
- Address potential objections proactively
- Quantify the value (ROI, time savings, etc.)

**Next Steps:**
"Based on what we've discussed, I believe we can help you achieve [specific benefit]. What would be the best next step for you?"

**Closing:**
- Schedule follow-up meeting/demo
- Send relevant materials
- Confirm contact information and timeline`,

      support: `**Customer Support Call Script**

**Opening:**
"Thank you for calling [Company] support. My name is [Your Name], and I'm here to help you today. How can I assist you?"

**Objective:** ${scriptForm.objective}

**Problem Resolution Process:**
1. **Listen Actively:** Let the customer fully explain their issue
2. **Acknowledge:** "I understand how frustrating this must be..."
3. **Clarify:** Ask specific questions about ${scriptForm.context}
4. **Diagnose:** Identify the root cause of the issue
5. **Solve:** Provide step-by-step solution
6. **Verify:** Confirm the issue is resolved
7. **Follow-up:** Offer additional assistance

**Key Phrases:**
- "Let me help you with that right away"
- "I can definitely resolve this for you"
- "Is there anything else I can help you with today?"

**Closing:**
"Is there anything else I can help you with today? Thank you for choosing [Company], and have a great day!"`,

      interview: `**Job Interview Call Script**

**Opening:**
"Hello [Interviewer Name], this is [Your Name]. Thank you for taking the time to speak with me about the ${scriptForm.context} position."

**Objective:** ${scriptForm.objective}

**Key Areas to Cover:**
1. **Background & Experience:**
   - Relevant work experience
   - Key achievements and accomplishments
   - Skills that match the role requirements

2. **Company Knowledge:**
   - Research about the company
   - Understanding of the role
   - How you can contribute

3. **Examples & Stories:**
   - STAR method (Situation, Task, Action, Result)
   - Specific examples of problem-solving
   - Leadership and teamwork experiences

**Questions to Ask:**
- "What does success look like in this role?"
- "What are the biggest challenges facing the team?"
- "What opportunities for growth and development exist?"

**Closing:**
"Thank you for this opportunity to discuss the role. I'm very interested in ${scriptForm.context} and look forward to the next steps. When can I expect to hear back about the process?"`,

      meeting: `**Business Meeting Call Script**

**Opening:**
"Good [morning/afternoon] everyone. Thank you for joining today's call about ${scriptForm.context}."

**Objective:** ${scriptForm.objective}

**Meeting Agenda:**
1. **Welcome & Introductions** (2 minutes)
2. **Review of Current Status** (10 minutes)
3. **Key Discussion Points** (20 minutes)
   - Challenge identification
   - Solution brainstorming
   - Resource requirements
4. **Action Items & Next Steps** (10 minutes)
5. **Q&A** (8 minutes)

**Facilitation Tips:**
- Keep discussions focused and on-time
- Encourage participation from all attendees
- Document key decisions and action items
- Assign owners and deadlines

**Closing:**
"Let's recap our key decisions and action items. I'll send a follow-up email with today's notes and next steps within 24 hours. Thank you all for your time and contributions."`,

      "follow-up": `**Follow-up Call Script**

**Opening:**
"Hi [Name], this is [Your Name] from [Company]. I'm following up on our previous conversation about ${scriptForm.context}."

**Objective:** ${scriptForm.objective}

**Conversation Flow:**
1. **Reference Previous Discussion:**
   - Recap key points from last conversation
   - Acknowledge any commitments made

2. **Status Update:**
   - Share any new developments
   - Provide requested information
   - Address any concerns raised

3. **Next Steps:**
   - Clarify immediate actions needed
   - Set expectations and timelines
   - Schedule next touchpoint

**Key Questions:**
- "Have you had a chance to review the information I sent?"
- "Do you have any questions about our discussion?"
- "What additional information would be helpful?"
- "What are your thoughts on moving forward?"

**Closing:**
"Thank you for your time today. I'll [specific next action] and follow up with you by [specific date]. Please don't hesitate to reach out if you have any questions in the meantime."`,
    }

    const script =
      scripts[scriptForm.callType as keyof typeof scripts] || "Custom call script based on your requirements."
    setCallScript(script)
    setIsGeneratingScript(false)

    toast({
      title: "Script Generated",
      description: "Your custom call script has been generated successfully!",
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The content has been copied to your clipboard.",
    })
  }

  const handleStartCall = async (contact: Contact, callType: string) => {
    try {
      const callRecord = await startCall(contact.id, contact.name, callType, callScript)
      setCurrentCallId(callRecord.id)
      setSelectedContact(contact)
      setIsCallActive(true)
      setCallDuration(0)
      setCallNotes("")
      resetTranscript()

      // Start timer
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)

      toast({
        title: "Call started",
        description: `Started ${callType} call with ${contact.name}`,
      })
    } catch (error) {
      console.error("Failed to start call:", error)
    }
  }

  const handleEndCall = async () => {
    if (!currentCallId) return

    try {
      await endCall(currentCallId, callDuration, callNotes, transcript)

      // Update contact's last call date
      if (selectedContact) {
        await updateContact(selectedContact.id, {
          last_call_date: new Date().toISOString(),
        })
      }

      setIsCallActive(false)
      setIsRecording(false)
      setCurrentCallId(null)
      setSelectedContact(null)

      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      if (isListening) {
        stopListening()
      }

      toast({
        title: "Call ended",
        description: `Call duration: ${Math.floor(callDuration / 60)}:${(callDuration % 60).toString().padStart(2, "0")}`,
      })
    } catch (error) {
      console.error("Failed to end call:", error)
    }
  }

  const toggleRecording = () => {
    if (isRecording) {
      stopListening()
      setIsRecording(false)
      toast({
        title: "Recording stopped",
        description: "Call recording and transcription stopped",
      })
    } else {
      if (isSupported) {
        startListening()
        setIsRecording(true)
        toast({
          title: "Recording started",
          description: "Call recording and transcription started",
        })
      } else {
        toast({
          title: "Not supported",
          description: "Speech recognition is not supported in this browser",
          variant: "destructive",
        })
      }
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "missed":
        return "bg-red-100 text-red-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAddContact = async () => {
    if (!newContact.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a contact name",
        variant: "destructive",
      })
      return
    }

    try {
      const contactData = {
        ...newContact,
        tags: newContact.tags ? newContact.tags.split(",").map((tag) => tag.trim()) : [],
      }
      await addContact(contactData)
      setNewContact({
        name: "",
        email: "",
        phone: "",
        company: "",
        role: "",
        tags: "",
      })
      setIsAddContactOpen(false)
    } catch (error) {
      console.error("Failed to add contact:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const exportData = (type: "contacts" | "history") => {
    const data = type === "contacts" ? contacts : callHistory
    const filename = `${type}-${new Date().toISOString().split("T")[0]}.json`
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Export successful",
      description: `${type} data exported to ${filename}`,
    })
  }

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Assistant Hub</h1>
          <p className="text-lg text-gray-600">Your comprehensive tool for prompts, calls, and productivity</p>
        </div>

        <Tabs defaultValue="prompts" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="prompts" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Prompts
            </TabsTrigger>
            <TabsTrigger value="calls" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Scripts
            </TabsTrigger>
            <TabsTrigger value="live-call" className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4" />
              Live Call
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Contacts
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prompts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  AI Prompt Generator
                </CardTitle>
                <CardDescription>Create customized prompts for various AI applications and use cases</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={promptForm.category}
                      onValueChange={(value) => setPromptForm({ ...promptForm, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {promptCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.icon} {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose</Label>
                    <Input
                      placeholder="e.g., blog post, email, presentation"
                      value={promptForm.purpose}
                      onChange={(e) => setPromptForm({ ...promptForm, purpose: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="context">Context & Requirements</Label>
                  <Textarea
                    placeholder="Describe what you need the AI to help with, target audience, tone, specific requirements..."
                    rows={3}
                    value={promptForm.context}
                    onChange={(e) => setPromptForm({ ...promptForm, context: e.target.value })}
                  />
                </div>
                <Button onClick={generatePrompt} className="w-full" disabled={isGeneratingPrompt}>
                  {isGeneratingPrompt ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Prompt"
                  )}
                </Button>
                {generatedPrompt && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Generated Prompt</Label>
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedPrompt)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <Textarea
                      value={generatedPrompt}
                      onChange={(e) => setGeneratedPrompt(e.target.value)}
                      rows={6}
                      className="font-mono text-sm"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {promptCategories.map((category) => (
                <Card
                  key={category.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setPromptForm({ ...promptForm, category: category.id })}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="text-2xl">{category.icon}</span>
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calls" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Call Script Generator
                </CardTitle>
                <CardDescription>Generate professional call scripts for various business scenarios</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="call-type">Call Type</Label>
                    <Select
                      value={scriptForm.callType}
                      onValueChange={(value) => setScriptForm({ ...scriptForm, callType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select call type" />
                      </SelectTrigger>
                      <SelectContent>
                        {callTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.icon} {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="objective">Call Objective</Label>
                    <Input
                      placeholder="e.g., close deal, resolve issue, schedule meeting"
                      value={scriptForm.objective}
                      onChange={(e) => setScriptForm({ ...scriptForm, objective: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="call-context">Context & Details</Label>
                  <Textarea
                    placeholder="Provide background information, key points to cover, specific requirements..."
                    rows={3}
                    value={scriptForm.context}
                    onChange={(e) => setScriptForm({ ...scriptForm, context: e.target.value })}
                  />
                </div>
                <Button onClick={generateCallScript} className="w-full" disabled={isGeneratingScript}>
                  {isGeneratingScript ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Call Script"
                  )}
                </Button>
                {callScript && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Generated Call Script</Label>
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(callScript)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <Textarea
                      value={callScript}
                      onChange={(e) => setCallScript(e.target.value)}
                      rows={15}
                      className="font-mono text-sm"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {callTypes.map((type) => (
                <Card
                  key={type.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setScriptForm({ ...scriptForm, callType: type.id })}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="text-2xl">{type.icon}</span>
                      {type.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="live-call" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PhoneCall className="w-5 h-5" />
                  Live Call Assistant
                  {isCallActive && (
                    <Badge variant="destructive" className="ml-2">
                      LIVE
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>Real-time assistance during your calls with speech recognition</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Call Controls */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-mono mb-2 text-blue-600">{formatDuration(callDuration)}</div>
                    {selectedContact && <div className="text-lg font-medium mb-1">{selectedContact.name}</div>}
                    {selectedContact && (
                      <div className="text-sm text-gray-600 mb-4">
                        {selectedContact.company} • {selectedCallType}
                      </div>
                    )}
                  </div>

                  {!isCallActive ? (
                    <div className="flex flex-col items-center space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
                        <Select
                          onValueChange={(contactId) => {
                            const contact = contacts.find((c) => c.id === contactId)
                            setSelectedContact(contact || null)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select contact" />
                          </SelectTrigger>
                          <SelectContent>
                            {contacts.map((contact) => (
                              <SelectItem key={contact.id} value={contact.id}>
                                {contact.name} - {contact.company}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select onValueChange={setSelectedCallType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Call type" />
                          </SelectTrigger>
                          <SelectContent>
                            {callTypes.map((type) => (
                              <SelectItem key={type.id} value={type.name}>
                                {type.icon} {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={() =>
                          selectedContact && handleStartCall(selectedContact, selectedCallType || "General")
                        }
                        size="lg"
                        className="bg-green-600 hover:bg-green-700"
                        disabled={!selectedContact || !selectedCallType}
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Start Call
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <Button onClick={handleEndCall} size="lg" variant="destructive">
                        <Square className="w-5 h-5 mr-2" />
                        End Call
                      </Button>
                      <Button onClick={toggleRecording} variant={isRecording ? "destructive" : "outline"} size="lg">
                        {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        {isRecording ? "Stop Recording" : "Start Recording"}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Live Suggestions */}
                {isCallActive && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Live Suggestions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm font-medium text-blue-800">💡 Ask about their current challenges</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-sm font-medium text-green-800">✅ Mention the ROI benefits</p>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-lg">
                          <p className="text-sm font-medium text-yellow-800">⚠️ Address pricing concerns early</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <p className="text-sm font-medium text-purple-800">🎯 Focus on their specific use case</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Call Notes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          placeholder="Take notes during the call..."
                          value={callNotes}
                          onChange={(e) => setCallNotes(e.target.value)}
                          rows={6}
                        />
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Transcript */}
                {isCallActive && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Live Transcript
                        {isRecording && <Badge variant="destructive">Recording</Badge>}
                        {!isSupported && <Badge variant="secondary">Not Supported</Badge>}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 p-4 rounded-lg min-h-[200px] max-h-[300px] overflow-y-auto">
                        {transcript ? (
                          <p className="text-sm whitespace-pre-wrap">{transcript}</p>
                        ) : isRecording ? (
                          <p className="text-gray-500 text-sm">🎤 Listening... Start speaking to see the transcript.</p>
                        ) : (
                          <p className="text-gray-500 text-sm">
                            Click "Start Recording" to begin speech-to-text transcription.
                          </p>
                        )}
                      </div>
                      {transcript && (
                        <div className="flex justify-between items-center mt-2">
                          <Button variant="outline" size="sm" onClick={resetTranscript}>
                            Clear Transcript
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => copyToClipboard(transcript)}>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Transcript
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => exportData("contacts")}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Contact
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Contact</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name *</Label>
                          <Input
                            id="name"
                            value={newContact.name}
                            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Input
                            id="role"
                            value={newContact.role}
                            onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
                            placeholder="CEO, Manager, etc."
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newContact.email}
                          onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                          placeholder="john@company.com"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={newContact.phone}
                            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">Company</Label>
                          <Input
                            id="company"
                            value={newContact.company}
                            onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                            placeholder="Company Inc."
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input
                          id="tags"
                          value={newContact.tags}
                          onChange={(e) => setNewContact({ ...newContact, tags: e.target.value })}
                          placeholder="lead, decision-maker, technical"
                        />
                      </div>
                      <Button onClick={handleAddContact} className="w-full">
                        Add Contact
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {contactsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Loading contacts...
              </div>
            ) : contacts.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts yet</h3>
                  <p className="text-gray-600 text-center mb-4">
                    Add your first contact to start making calls and tracking your conversations.
                  </p>
                  <Button onClick={() => setIsAddContactOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Contact
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contacts.map((contact) => (
                  <Card key={contact.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{contact.name}</h3>
                          <p className="text-sm text-gray-600">{contact.role}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {contact.company && (
                          <div className="flex items-center gap-2 text-sm">
                            <Building className="w-4 h-4 text-gray-400" />
                            <span>{contact.company}</span>
                          </div>
                        )}
                        {contact.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="truncate">{contact.email}</span>
                          </div>
                        )}
                        {contact.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{contact.phone}</span>
                          </div>
                        )}
                      </div>

                      {contact.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {contact.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1" onClick={() => handleStartCall(contact, "Sales Call")}>
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>

                      {contact.last_call_date && (
                        <div className="text-xs text-gray-500 mt-2">
                          Last call: {formatDate(contact.last_call_date)}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{stats.totalCalls}</p>
                      <p className="text-sm text-gray-600">Total Calls</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">{formatDuration(stats.averageDuration)}</p>
                      <p className="text-sm text-gray-600">Avg Duration</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold">{stats.completedCalls}</p>
                      <p className="text-sm text-gray-600">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-2xl font-bold">{stats.successRate}%</p>
                      <p className="text-sm text-gray-600">Success Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Call History
                  </div>
                  <Button variant="outline" onClick={() => exportData("history")}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </CardTitle>
                <CardDescription>Review your past calls and performance</CardDescription>
              </CardHeader>
              <CardContent>
                {historyLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    Loading call history...
                  </div>
                ) : callHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <PhoneCall className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No calls yet</h3>
                    <p className="text-gray-600 text-center">
                      Start making calls to see your call history and analytics here.
                    </p>
                  </div>
                ) : (
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
                                <h3 className="font-semibold">{call.contact_name}</h3>
                                <p className="text-sm text-gray-600">{call.call_type}</p>
                              </div>
                            </div>
                            <Badge className={getStatusColor(call.status)}>{call.status}</Badge>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatDuration(call.duration_seconds)}
                            </div>
                            <div>{formatDate(call.created_at)}</div>
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
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
