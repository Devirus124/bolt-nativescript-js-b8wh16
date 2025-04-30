"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUploader } from "@/components/file-uploader"
import { JobRoleSelector } from "@/components/job-role-selector"
import Link from "next/link"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { resumeService } from "@/services/resume-service"
import { AuthGuard } from "@/components/auth-guard"
import { useRouter } from "next/navigation"

export default function UploadPage() {
  const [uploadStep, setUploadStep] = useState(1)
  const [file, setFile] = useState<File | null>(null)
  const [filePath, setFilePath] = useState<string | null>(null)
  const [jobRole, setJobRole] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [resumeId, setResumeId] = useState<string | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile)
  }

  const handleFileUploadComplete = (path: string) => {
    setFilePath(path)
    setUploadStep(2)
  }

  const handleJobRoleChange = (role: string) => {
    setJobRole(role)
  }

  const handleCreateResume = async () => {
    if (!file || !filePath || !user) return

    setIsUploading(true)
    try {
      const resume = await resumeService.createResume({
        user_id: user.id,
        name: file.name.split(".")[0],
        file_path: filePath,
        status: "uploaded",
      })

      setResumeId(resume.id)
      setIsUploading(false)
      setUploadStep(2)
    } catch (error) {
      console.error("Error creating resume:", error)
      toast({
        title: "Error",
        description: "There was an error creating your resume. Please try again.",
        variant: "destructive",
      })
      setIsUploading(false)
    }
  }

  const handleProcess = async () => {
    if (!resumeId || !jobRole) return

    setIsProcessing(true)
    try {
      await resumeService.optimizeResume(resumeId, jobRole)
      setIsProcessing(false)
      setUploadStep(3)
    } catch (error) {
      console.error("Error optimizing resume:", error)
      toast({
        title: "Error",
        description: "There was an error optimizing your resume. Please try again.",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  return (
    <AuthGuard>
      <div className="container max-w-4xl py-10">
        <Link href="/" className="inline-flex items-center gap-2 mb-6 text-sm font-medium hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Resume Optimization</CardTitle>
            <CardDescription>
              Upload your resume, select your target job role, and get an ATS-optimized version
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-8">
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className={`flex items-center ${uploadStep >= 1 ? "text-primary" : "text-muted-foreground"}`}>
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${uploadStep >= 1 ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"}`}
                    >
                      1
                    </div>
                    <span className="ml-2 font-medium">Upload Resume</span>
                  </div>
                  <div
                    className={`h-0.5 w-full max-w-[100px] ${uploadStep >= 2 ? "bg-primary" : "bg-muted-foreground/30"}`}
                  ></div>
                  <div className={`flex items-center ${uploadStep >= 2 ? "text-primary" : "text-muted-foreground"}`}>
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${uploadStep >= 2 ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"}`}
                    >
                      2
                    </div>
                    <span className="ml-2 font-medium">Select Job Role</span>
                  </div>
                  <div
                    className={`h-0.5 w-full max-w-[100px] ${uploadStep >= 3 ? "bg-primary" : "bg-muted-foreground/30"}`}
                  ></div>
                  <div className={`flex items-center ${uploadStep >= 3 ? "text-primary" : "text-muted-foreground"}`}>
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${uploadStep >= 3 ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"}`}
                    >
                      3
                    </div>
                    <span className="ml-2 font-medium">Get Optimized Resume</span>
                  </div>
                </div>
              </div>
            </div>

            {uploadStep === 1 && (
              <div className="space-y-6">
                <FileUploader onFileChange={handleFileChange} onFileUploadComplete={handleFileUploadComplete} />
              </div>
            )}

            {uploadStep === 2 && (
              <div className="space-y-6">
                <JobRoleSelector onRoleChange={handleJobRoleChange} />

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setUploadStep(1)}>
                    Back
                  </Button>
                  <Button onClick={handleProcess} disabled={!jobRole || isProcessing}>
                    {isProcessing ? "Processing..." : "Optimize Resume"}
                  </Button>
                </div>
              </div>
            )}

            {uploadStep === 3 && (
              <div className="space-y-6">
                <div className="rounded-lg border p-6 bg-muted/50">
                  <div className="flex items-center justify-center mb-4">
                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-center mb-2">Resume Successfully Optimized!</h3>
                  <p className="text-center text-muted-foreground mb-4">
                    Your resume has been optimized for ATS systems and tailored for the {jobRole} role.
                  </p>
                  <div className="flex flex-col gap-4">
                    <Button className="w-full">Download Optimized Resume</Button>
                    <Button variant="outline" className="w-full">
                      View Resume Analysis
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border p-6">
                  <h3 className="text-lg font-bold mb-4">Recommended Job Listings</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start pb-4 border-b">
                      <div>
                        <h4 className="font-medium">Senior Frontend Developer</h4>
                        <p className="text-sm text-muted-foreground">TechCorp Inc. • Remote</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Apply
                      </Button>
                    </div>
                    <div className="flex justify-between items-start pb-4 border-b">
                      <div>
                        <h4 className="font-medium">UX/UI Designer</h4>
                        <p className="text-sm text-muted-foreground">DesignHub • Hybrid</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Apply
                      </Button>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Product Manager</h4>
                        <p className="text-sm text-muted-foreground">InnovateCo • Remote</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Apply
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <Link href="/jobs" className="text-sm text-primary hover:underline">
                      View all matching jobs →
                    </Link>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setUploadStep(2)}>
                    Back
                  </Button>
                  <Link href="/dashboard">
                    <Button>Go to Dashboard</Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
}
