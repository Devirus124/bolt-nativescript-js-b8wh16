import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Search, MapPin, Briefcase, Clock } from "lucide-react"

export default function JobsPage() {
  return (
    <div className="container py-10">
      <Link href="/" className="inline-flex items-center gap-2 mb-6 text-sm font-medium hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Job Listings</h1>
          <p className="text-muted-foreground">Find and apply to jobs that match your skills and experience</p>
        </div>
        <Link href="/upload">
          <Button>Optimize Your Resume</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Search</h3>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Job title or keyword" className="pl-9" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Location</h3>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="City, state, or remote" className="pl-9" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Job Type</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="justify-start">
                      Full-time
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      Part-time
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      Contract
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      Internship
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Experience Level</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="justify-start">
                      Entry Level
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      Mid Level
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      Senior Level
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      Executive
                    </Button>
                  </div>
                </div>

                <Button className="w-full">Apply Filters</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Tabs defaultValue="all">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="all">All Jobs</TabsTrigger>
                <TabsTrigger value="remote">Remote</TabsTrigger>
                <TabsTrigger value="recommended">Recommended</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <select className="text-sm border rounded p-1">
                  <option>Most Recent</option>
                  <option>Relevance</option>
                  <option>Salary</option>
                </select>
              </div>
            </div>

            <TabsContent value="all" className="space-y-4 mt-4">
              {[...Array(10)].map((_, i) => (
                <JobCard key={i} />
              ))}
              <div className="flex justify-center mt-8">
                <Button variant="outline">Load More Jobs</Button>
              </div>
            </TabsContent>

            <TabsContent value="remote" className="space-y-4 mt-4">
              {[...Array(5)].map((_, i) => (
                <JobCard key={i} remote={true} />
              ))}
              <div className="flex justify-center mt-8">
                <Button variant="outline">Load More Jobs</Button>
              </div>
            </TabsContent>

            <TabsContent value="recommended" className="space-y-4 mt-4">
              {[...Array(3)].map((_, i) => (
                <JobCard key={i} recommended={true} />
              ))}
              <div className="flex justify-center mt-8">
                <Button variant="outline">Load More Jobs</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function JobCard({ remote = false, recommended = false }: { remote?: boolean; recommended?: boolean }) {
  const jobTitles = [
    "Senior Frontend Developer",
    "UX/UI Designer",
    "Product Manager",
    "Data Scientist",
    "Full Stack Engineer",
    "Marketing Specialist",
    "DevOps Engineer",
    "Content Writer",
  ]

  const companies = [
    "TechCorp Inc.",
    "InnovateCo",
    "DataDriven LLC",
    "DesignHub",
    "CloudSystems",
    "MarketingPro",
    "ContentCreators",
  ]

  const locations = remote ? ["Remote"] : ["New York, NY", "San Francisco, CA", "Austin, TX", "Remote", "Chicago, IL"]

  const randomTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)]
  const randomCompany = companies[Math.floor(Math.random() * companies.length)]
  const randomLocation = locations[Math.floor(Math.random() * locations.length)]
  const randomSalary = `$${Math.floor(Math.random() * 100) + 80}k - $${Math.floor(Math.random() * 50) + 120}k`
  const randomPosted = `${Math.floor(Math.random() * 14) + 1}d ago`

  return (
    <Card className={recommended ? "border-primary/50 bg-primary/5" : ""}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">{randomTitle}</h3>
              {recommended && (
                <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">Recommended</span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                <span>{randomCompany}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{randomLocation}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{randomPosted}</span>
              </div>
            </div>
            <p className="text-sm">Salary: {randomSalary}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-muted text-xs px-2 py-1 rounded-full">React</span>
              <span className="bg-muted text-xs px-2 py-1 rounded-full">TypeScript</span>
              <span className="bg-muted text-xs px-2 py-1 rounded-full">Next.js</span>
              <span className="bg-muted text-xs px-2 py-1 rounded-full">UI/UX</span>
            </div>
          </div>
          <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0">
            <Button>Apply Now</Button>
            <Button variant="outline">Save Job</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
