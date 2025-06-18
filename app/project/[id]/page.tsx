"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import {
  ArrowLeft,
  BookOpen,
  Download,
  Edit,
  Headphones,
  ImageIcon,
  Pause,
  Play,
  Settings,
  Share,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react"

export default function ProjectPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentChapter, setCurrentChapter] = useState(0)
  const [progress, setProgress] = useState(23)

  const chapters = [
    { id: 1, title: "Introduction", duration: "12:34", status: "completed" },
    { id: 2, title: "The Beginning", duration: "18:45", status: "completed" },
    { id: 3, title: "Rising Action", duration: "22:15", status: "in-progress" },
    { id: 4, title: "The Climax", duration: "16:30", status: "pending" },
    { id: 5, title: "Resolution", duration: "14:20", status: "pending" },
    { id: 6, title: "Epilogue", duration: "8:45", status: "pending" },
  ]

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
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Project Header */}
        <div className="flex items-start gap-6 mb-8">
          <img
            src="/placeholder.svg?height=200&width=150"
            alt="Book Cover"
            className="w-32 h-40 object-cover rounded-lg shadow-lg bg-gray-200"
          />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">The Digital Revolution</h1>
              <Badge variant="secondary">In Progress</Badge>
            </div>
            <p className="text-gray-600 mb-4">
              A comprehensive guide to understanding how digital technology is transforming our world and what it means
              for the future.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Chapters:</span>
                <div className="font-semibold">6 chapters</div>
              </div>
              <div>
                <span className="text-gray-500">Duration:</span>
                <div className="font-semibold">4h 32m</div>
              </div>
              <div>
                <span className="text-gray-500">Voice:</span>
                <div className="font-semibold">Sarah (Female)</div>
              </div>
              <div>
                <span className="text-gray-500">Progress:</span>
                <div className="font-semibold">65% Complete</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Audio Player */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Audio Player
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <h3 className="font-semibold mb-1">Chapter 3: Rising Action</h3>
                  <p className="text-sm text-gray-600">22:15 total duration</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <Slider
                    value={[progress]}
                    onValueChange={(value) => setProgress(value[0])}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>5:12</span>
                    <span>22:15</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button variant="outline" size="icon">
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>
                  <Button variant="outline" size="icon">
                    <SkipForward className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-2 ml-4">
                    <Volume2 className="w-4 h-4" />
                    <Slider defaultValue={[75]} max={100} step={1} className="w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="chapters" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="chapters">Chapters</TabsTrigger>
                <TabsTrigger value="script">Script</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="chapters" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Chapter Management</CardTitle>
                    <CardDescription>Organize and manage your audiobook chapters</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {chapters.map((chapter, index) => (
                        <div
                          key={chapter.id}
                          className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-colors ${
                            currentChapter === index ? "bg-purple-50 border-purple-200" : "hover:bg-gray-50"
                          }`}
                          onClick={() => setCurrentChapter(index)}
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                            {chapter.id}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{chapter.title}</h4>
                            <p className="text-sm text-gray-600">{chapter.duration}</p>
                          </div>
                          <Badge
                            variant={
                              chapter.status === "completed"
                                ? "default"
                                : chapter.status === "in-progress"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {chapter.status === "completed"
                              ? "Done"
                              : chapter.status === "in-progress"
                                ? "Processing"
                                : "Pending"}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="script">
                <Card>
                  <CardHeader>
                    <CardTitle>Script Editor</CardTitle>
                    <CardDescription>Edit the text content for your audiobook</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg min-h-[400px] font-mono text-sm">
                      <p className="mb-4">
                        <strong>Chapter 3: Rising Action</strong>
                      </p>
                      <p className="mb-4">
                        The digital revolution has fundamentally changed how we interact with information, communicate
                        with each other, and conduct business. In this chapter, we'll explore the key technologies that
                        have driven this transformation and examine their impact on society.
                      </p>
                      <p className="mb-4">
                        From the early days of personal computing to the rise of the internet, mobile devices, and
                        artificial intelligence, each technological leap has brought new opportunities and challenges.
                        Understanding these changes is crucial for anyone looking to navigate the modern digital
                        landscape.
                      </p>
                      <Button className="mt-4">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Content
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Settings</CardTitle>
                    <CardDescription>Configure your audiobook settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Voice Settings</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-600">Current Voice</label>
                          <p className="font-medium">Sarah (Female, American)</p>
                        </div>
                        <div>
                          <Button variant="outline" size="sm">
                            Change Voice
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Audio Quality</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-600">Format</label>
                          <p className="font-medium">MP3, 320kbps</p>
                        </div>
                        <div>
                          <Button variant="outline" size="sm">
                            Change Format
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span>65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Completed:</span>
                    <div className="font-semibold">2 chapters</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Remaining:</span>
                    <div className="font-semibold">4 chapters</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cover Art */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Cover Art
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <img
                    src="/placeholder.svg?height=200&width=150"
                    alt="Book Cover"
                    className="w-full max-w-32 mx-auto h-40 object-cover rounded-lg shadow-md bg-gray-200 mb-4"
                  />
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Cover
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export Audio Files
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share className="w-4 h-4 mr-2" />
                  Share Preview
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Project Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
