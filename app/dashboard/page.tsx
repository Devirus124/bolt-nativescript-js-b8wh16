import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Headphones, Plus, Play, Settings, Upload } from "lucide-react"

export default function DashboardPage() {
  const projects = [
    {
      id: 1,
      title: "The Digital Revolution",
      chapters: 12,
      duration: "4h 32m",
      status: "completed",
      progress: 100,
      coverUrl: "/placeholder.svg?height=120&width=80",
    },
    {
      id: 2,
      title: "Cooking Mastery Guide",
      chapters: 8,
      duration: "2h 15m",
      status: "in-progress",
      progress: 65,
      coverUrl: "/placeholder.svg?height=120&width=80",
    },
    {
      id: 3,
      title: "Space Exploration",
      chapters: 15,
      duration: "6h 45m",
      status: "draft",
      progress: 25,
      coverUrl: "/placeholder.svg?height=120&width=80",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AudioBook Studio
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              JD
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, John!</h2>
          <p className="text-gray-600">Continue working on your audiobook projects or start a new one.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/create">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-dashed border-2 border-purple-200 hover:border-purple-400">
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Plus className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">New Project</h3>
                <p className="text-sm text-gray-600">Start creating a new audiobook from scratch</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Import Text</h3>
              <p className="text-sm text-gray-600">Upload your manuscript or document</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Templates</h3>
              <p className="text-sm text-gray-600">Choose from pre-made audiobook templates</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Projects */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Your Projects</h3>
            <Button variant="outline">View All</Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={project.coverUrl || "/placeholder.svg"}
                      alt={project.title}
                      className="w-16 h-20 object-cover rounded-lg bg-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{project.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {project.chapters} chapters • {project.duration}
                      </CardDescription>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant={
                            project.status === "completed"
                              ? "default"
                              : project.status === "in-progress"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {project.status === "completed"
                            ? "Completed"
                            : project.status === "in-progress"
                              ? "In Progress"
                              : "Draft"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/project/${project.id}`} className="flex-1">
                        <Button className="w-full" size="sm">
                          <Play className="w-4 h-4 mr-2" />
                          Continue
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
