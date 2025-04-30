"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { FileText, Download, Edit, Trash2, Plus, ExternalLink, CheckCircle, Clock, Briefcase } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { resumeService } from "@/services/resume-service"
import { jobService } from "@/services/job-service"
import { AuthGuard } from "@/components/auth-guard"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const [resumes, setResumes] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        const [resumesData, applicationsData] = await Promise.all([
          resumeService.getUserResumes(user.id),
          jobService.getUserApplications(user.id),
        ])

        setResumes(resumesData)
        setApplications(applicationsData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load your data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user, toast])

  const handleDeleteResume = async (resumeId: string) => {
    try {
      await resumeService.deleteResume(resumeId)
      setResumes(resumes.filter((resume) => resume.id !== resumeId))
      toast({
        title: "Resume deleted",
        description: "Your resume has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting resume:", error)
      toast({
        title: "Error",
        description: "Failed to delete resume. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteApplication = async (applicationId: string) => {
    try {
      await jobService.deleteApplication(applicationId)
      setApplications(applications.filter((app) => app.id !== applicationId))
      toast({
        title: "Application removed",
        description: "The job application has been removed successfully.",
      })
    } catch (error) {
      console.error("Error deleting application:", error)
      toast({
        title: "Error",
        description: "Failed to remove application. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "optimized":
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" />
            Optimized
          </span>
        )
      case "uploaded":
      case "optimizing":
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            <Clock className="mr-1 h-3 w-3" />
            {status === "uploaded" ? "Uploaded" : "Optimizing"}
          </span>
        )
      case "interview":
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            Interview
          </span>
        )
      case "applied":
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            Applied
          </span>
        )
      case "rejected":
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            Rejected
          </span>
        )
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="container py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Manage your resumes and job applications</p>
          </div>
          <div className="flex gap-4">
            <Link href="/upload">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Resume
              </Button>
            </Link>
            <Link href="/jobs">
              <Button variant="outline" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Resumes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resumes.length}</div>
              <p className="text-xs text-muted-foreground">
                {resumes.filter((r) => r.status === "optimized").length} optimized
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
              <p className="text-xs text-muted-foreground">
                {applications.filter((a) => a.status === "interview").length} interviews scheduled
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average ATS Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {resumes.filter((r) => r.status === "optimized").length > 0
                  ? Math.round(
                      resumes
                        .filter((r) => r.status === "optimized")
                        .reduce((acc, curr) => acc + (curr.ats_score || 0), 0) /
                        resumes.filter((r) => r.status === "optimized").length,
                    )
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">+15% from original resumes</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="resumes" className="space-y-4">
          <TabsList>
            <TabsTrigger value="resumes">My Resumes</TabsTrigger>
            <TabsTrigger value="applications">Job Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="resumes" className="space-y-4">
            {resumes.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No resumes yet</h3>
                  <p className="text-sm text-muted-foreground mb-4 text-center">
                    Upload your first resume to get started with optimization
                  </p>
                  <Link href="/upload">
                    <Button>Upload Resume</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {resumes.map((resume) => (
                  <Card key={resume.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="rounded-lg bg-primary/10 p-2">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{resume.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Last updated: {new Date(resume.updated_at).toLocaleDateString()}
                            </p>
                            <div className="mt-1">{getStatusBadge(resume.status)}</div>

                            {resume.status === "optimized" && (
                              <div className="mt-4 space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span>ATS Score</span>
                                  <span className="font-medium">{resume.ats_score}%</span>
                                </div>
                                <Progress value={resume.ats_score} className="h-2" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {resume.status === "optimized" && (
                            <Button variant="outline" size="sm" className="gap-1">
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          )}
                          <Button variant="outline" size="sm" className="gap-1">
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteResume(resume.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>

                      {resume.status === "optimized" && (
                        <div className="mt-6 pt-6 border-t grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium">Applications</p>
                            <p className="text-2xl font-bold">
                              {applications.filter((app) => app.resume_id === resume.id).length}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Interviews</p>
                            <p className="text-2xl font-bold">
                              {
                                applications.filter((app) => app.resume_id === resume.id && app.status === "interview")
                                  .length
                              }
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            {applications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No applications yet</h3>
                  <p className="text-sm text-muted-foreground mb-4 text-center">
                    Browse jobs and apply using your optimized resume
                  </p>
                  <Link href="/jobs">
                    <Button>Browse Jobs</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {applications.map((application) => (
                  <Card key={application.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{application.position}</h3>
                            {getStatusBadge(application.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">{application.company}</p>
                          <p className="text-xs text-muted-foreground">
                            Applied: {new Date(application.applied_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteApplication(application.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AuthGuard>
  )
}
