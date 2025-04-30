import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, CheckCircle, Search, Upload, ArrowRight } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <FileText className="h-6 w-6" />
            <span className="text-primary">GETITDONE</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
              How It Works
            </Link>
            <Link href="#jobs" className="text-sm font-medium hover:underline underline-offset-4">
              Job Listings
            </Link>
          </nav>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted/50 to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Get Your Resume Noticed & Land Your Dream Job
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Upload your resume, get it optimized for ATS, and find the perfect job opportunities - all in one
                    place.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/upload">
                    <Button size="lg" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Upload Your Resume
                    </Button>
                  </Link>
                  <Link href="/jobs">
                    <Button size="lg" variant="outline" className="gap-2">
                      <Search className="h-4 w-4" />
                      Browse Jobs
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <Image
                  src="/placeholder.svg?height=400&width=500"
                  width={500}
                  height={400}
                  alt="Resume optimization illustration"
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Why Choose GETITDONE?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform offers everything you need to optimize your job search process
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">ATS Optimization</h3>
                <p className="text-center text-muted-foreground">
                  Get your resume optimized for Applicant Tracking Systems to ensure it passes through automated
                  filters.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Role-Specific Tailoring</h3>
                <p className="text-center text-muted-foreground">
                  We rewrite your resume to match specific job roles, highlighting relevant skills and experience.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Job Matching</h3>
                <p className="text-center text-muted-foreground">
                  Access curated job listings for both remote and local opportunities that match your profile.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Simple steps to optimize your resume and find your dream job
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 md:grid-cols-4">
              <div className="flex flex-col items-center space-y-2 border-r border-muted-foreground/20 pr-4 last:border-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="text-xl font-bold">Upload</h3>
                <p className="text-center text-sm text-muted-foreground">
                  Upload your current resume or CV to our platform
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-r border-muted-foreground/20 pr-4 last:border-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="text-xl font-bold">Review</h3>
                <p className="text-center text-sm text-muted-foreground">
                  Our system reviews your resume and identifies areas for improvement
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-r border-muted-foreground/20 pr-4 last:border-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="text-xl font-bold">Optimize</h3>
                <p className="text-center text-sm text-muted-foreground">
                  We rewrite and optimize your resume for ATS and specific job roles
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  4
                </div>
                <h3 className="text-xl font-bold">Apply</h3>
                <p className="text-center text-sm text-muted-foreground">
                  Use your optimized resume to apply for jobs through our platform
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <Link href="/upload">
                <Button size="lg" className="gap-2">
                  Get Started Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="jobs" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Featured Job Opportunities
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Browse through our curated list of remote and local job opportunities
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
              <div className="rounded-lg border p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Senior Frontend Developer</h3>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">Remote</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">TechCorp Inc.</p>
                <p className="mt-4 text-sm">
                  Looking for an experienced frontend developer with React expertise to join our growing team.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-muted px-2 py-1 text-xs">React</span>
                  <span className="rounded-full bg-muted px-2 py-1 text-xs">TypeScript</span>
                  <span className="rounded-full bg-muted px-2 py-1 text-xs">Next.js</span>
                </div>
                <div className="mt-6">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </div>
              </div>
              <div className="rounded-lg border p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Product Manager</h3>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">Hybrid</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">InnovateCo</p>
                <p className="mt-4 text-sm">
                  Seeking a product manager to lead our SaaS product development and work with cross-functional teams.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-muted px-2 py-1 text-xs">Product</span>
                  <span className="rounded-full bg-muted px-2 py-1 text-xs">SaaS</span>
                  <span className="rounded-full bg-muted px-2 py-1 text-xs">Agile</span>
                </div>
                <div className="mt-6">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </div>
              </div>
              <div className="rounded-lg border p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Data Scientist</h3>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">Remote</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">DataDriven LLC</p>
                <p className="mt-4 text-sm">
                  Join our data science team to build machine learning models and analyze large datasets.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-muted px-2 py-1 text-xs">Python</span>
                  <span className="rounded-full bg-muted px-2 py-1 text-xs">ML</span>
                  <span className="rounded-full bg-muted px-2 py-1 text-xs">SQL</span>
                </div>
                <div className="mt-6">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Link href="/jobs">
                <Button variant="outline" size="lg" className="gap-2">
                  View All Job Listings
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Ready to Land Your Dream Job?
                  </h2>
                  <p className="max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Join thousands of job seekers who have successfully optimized their resumes and found their perfect
                    job match.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg" variant="secondary" className="gap-2">
                      Create Free Account
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="rounded-lg bg-primary-foreground/10 p-8 text-primary-foreground">
                  <blockquote className="text-lg font-medium italic">
                    "GETITDONE helped me optimize my resume for ATS systems and I landed three interviews in my first
                    week. I'm now working at my dream company!"
                  </blockquote>
                  <div className="mt-4 flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary-foreground/20"></div>
                    <div className="ml-4">
                      <p className="font-medium">Sarah Johnson</p>
                      <p className="text-sm opacity-80">Software Engineer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-muted/50">
        <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <FileText className="h-6 w-6" />
              <span>GETITDONE</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Optimizing resumes and connecting job seekers with opportunities.
            </p>
          </div>
          <nav className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <h3 className="font-medium">Platform</h3>
              <Link href="#" className="text-sm text-muted-foreground hover:underline">
                Features
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:underline">
                How It Works
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:underline">
                Pricing
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-medium">Resources</h3>
              <Link href="#" className="text-sm text-muted-foreground hover:underline">
                Resume Tips
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:underline">
                Career Advice
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:underline">
                Job Search Guide
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-medium">Company</h3>
              <Link href="#" className="text-sm text-muted-foreground hover:underline">
                About Us
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:underline">
                Contact
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:underline">
                Privacy Policy
              </Link>
            </div>
          </nav>
        </div>
        <div className="border-t py-6">
          <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-muted-foreground md:text-left">
              © {new Date().getFullYear()} GETITDONE. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
