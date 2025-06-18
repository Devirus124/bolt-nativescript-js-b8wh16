"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, BookOpen, FileText, Headphones, Upload } from "lucide-react"

export default function CreateProjectPage() {
  const [step, setStep] = useState(1)
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    genre: "",
    language: "en-US",
    voice: "female-1",
  })

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Headphones className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AudioBook Studio
              </span>
            </div>
          </Link>
          <div className="text-sm text-gray-600">Step {step} of 3</div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Create New Project</span>
            <span className="text-sm text-gray-600">{Math.round((step / 3) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Project Details */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Project Details
              </CardTitle>
              <CardDescription>
                Let's start by setting up your audiobook project with basic information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  placeholder="Enter your book title"
                  value={projectData.title}
                  onChange={(e) => setProjectData({ ...projectData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of your book"
                  value={projectData.description}
                  onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="genre">Genre</Label>
                  <Select
                    value={projectData.genre}
                    onValueChange={(value) => setProjectData({ ...projectData, genre: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fiction">Fiction</SelectItem>
                      <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                      <SelectItem value="biography">Biography</SelectItem>
                      <SelectItem value="self-help">Self-Help</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={projectData.language}
                    onValueChange={(value) => setProjectData({ ...projectData, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="en-GB">English (UK)</SelectItem>
                      <SelectItem value="es-ES">Spanish</SelectItem>
                      <SelectItem value="fr-FR">French</SelectItem>
                      <SelectItem value="de-DE">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleNext} disabled={!projectData.title}>
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Upload Content */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Your Content
              </CardTitle>
              <CardDescription>Upload your manuscript or paste your text content to get started.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Drop your files here</h3>
                    <p className="text-sm text-gray-600 mb-4">Supports PDF, DOCX, TXT files up to 50MB</p>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Files
                    </Button>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or paste your text</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Text Content</Label>
                <Textarea
                  id="content"
                  placeholder="Paste your book content here..."
                  rows={10}
                  className="resize-none"
                />
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button onClick={handleNext}>Continue</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Voice Selection */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Headphones className="w-5 h-5" />
                Choose Your Voice
              </CardTitle>
              <CardDescription>Select the AI voice that will narrate your audiobook.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    id: "female-1",
                    name: "Sarah",
                    gender: "Female",
                    accent: "American",
                    sample: "Professional and warm",
                  },
                  { id: "male-1", name: "David", gender: "Male", accent: "British", sample: "Clear and authoritative" },
                  {
                    id: "female-2",
                    name: "Emma",
                    gender: "Female",
                    accent: "Australian",
                    sample: "Friendly and engaging",
                  },
                  { id: "male-2", name: "James", gender: "Male", accent: "American", sample: "Deep and resonant" },
                ].map((voice) => (
                  <Card
                    key={voice.id}
                    className={`cursor-pointer transition-all ${
                      projectData.voice === voice.id ? "ring-2 ring-purple-600 bg-purple-50" : "hover:shadow-md"
                    }`}
                    onClick={() => setProjectData({ ...projectData, voice: voice.id })}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{voice.name}</h3>
                        <Button size="sm" variant="outline">
                          Play Sample
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {voice.gender} • {voice.accent}
                      </p>
                      <p className="text-sm text-gray-500">{voice.sample}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Link href="/project/new">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    Create Project
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
