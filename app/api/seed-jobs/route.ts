import { getSupabaseServerClient } from "@/lib/supabase"

export async function GET() {
  const supabase = getSupabaseServerClient()

  const jobListings = [
    {
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      description:
        "We're looking for an experienced frontend developer with React expertise to join our growing team. You'll be responsible for building user interfaces for our SaaS platform.",
      salary_range: "$120,000 - $150,000",
      job_type: "full-time",
      remote: true,
      url: "https://example.com/jobs/frontend-dev",
    },
    {
      title: "UX/UI Designer",
      company: "DesignHub",
      location: "New York, NY",
      description:
        "Join our design team to create beautiful and intuitive user experiences for our clients. You should have a strong portfolio and experience with Figma and Adobe Creative Suite.",
      salary_range: "$90,000 - $120,000",
      job_type: "full-time",
      remote: true,
      url: "https://example.com/jobs/ux-designer",
    },
    {
      title: "Data Scientist",
      company: "DataDriven LLC",
      location: "Remote",
      description:
        "We're seeking a data scientist to help us build machine learning models and analyze large datasets. Experience with Python, SQL, and machine learning frameworks required.",
      salary_range: "$110,000 - $140,000",
      job_type: "full-time",
      remote: true,
      url: "https://example.com/jobs/data-scientist",
    },
    {
      title: "Product Manager",
      company: "InnovateCo",
      location: "Austin, TX",
      description:
        "Lead our product development efforts for our SaaS platform. You'll work with cross-functional teams to define product roadmaps and deliver features.",
      salary_range: "$130,000 - $160,000",
      job_type: "full-time",
      remote: false,
      url: "https://example.com/jobs/product-manager",
    },
    {
      title: "DevOps Engineer",
      company: "CloudSystems",
      location: "Seattle, WA",
      description:
        "Help us build and maintain our cloud infrastructure. Experience with AWS, Kubernetes, and CI/CD pipelines is required.",
      salary_range: "$115,000 - $145,000",
      job_type: "full-time",
      remote: true,
      url: "https://example.com/jobs/devops-engineer",
    },
    {
      title: "Content Writer",
      company: "ContentCreators",
      location: "Chicago, IL",
      description:
        "Create engaging content for our clients' websites and social media. Strong writing skills and SEO knowledge required.",
      salary_range: "$60,000 - $80,000",
      job_type: "part-time",
      remote: true,
      url: "https://example.com/jobs/content-writer",
    },
    {
      title: "Marketing Specialist",
      company: "MarketingPro",
      location: "Remote",
      description:
        "Develop and execute marketing campaigns for our B2B clients. Experience with digital marketing and analytics tools required.",
      salary_range: "$70,000 - $90,000",
      job_type: "full-time",
      remote: true,
      url: "https://example.com/jobs/marketing-specialist",
    },
    {
      title: "Full Stack Engineer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      description:
        "Build and maintain our web applications using React, Node.js, and PostgreSQL. You'll work on both frontend and backend components.",
      salary_range: "$130,000 - $160,000",
      job_type: "full-time",
      remote: false,
      url: "https://example.com/jobs/full-stack-engineer",
    },
  ]

  // Clear existing job listings
  await supabase.from("job_listings").delete().neq("id", "00000000-0000-0000-0000-000000000000")

  // Insert new job listings
  const { data, error } = await supabase.from("job_listings").insert(jobListings)

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  return new Response(JSON.stringify({ success: true, message: "Job listings seeded successfully" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}
