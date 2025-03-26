"use client"

import { useState, useEffect } from "react"
import { useUser } from "../../lib/context/UserContext"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/features/Header"
import OnboardingProgressBar from "@/components/onboarding/OnboardingProgressBar"
import Sidebar from "@/components/onboarding/Sidebar"
import Footer from "@/components/features/Footer"
import {
  CheckCircle,
  Target,
  Clock,
  BookOpen,
  ArrowRight,
  AlertCircle,
  BarChart,
  GraduationCap,
  Users,
  Star,
  Printer,
  Download,
  Share2,
  Sun,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

// Define the analysis result type
interface AnalysisResult {
  currentStatus: string
  collegeRecommendations: {
    target: {
      name: string
      description: string
      averageGpa: string
    }
    reach: {
      name: string
      description: string
      averageGpa: string
    }
    safety: {
      name: string
      description: string
      averageGpa: string
    }
  }
  actionItems: {
    highPriority: {
      title: string
      description: string
    }[]
    mediumPriority: {
      title: string
      description: string
    }[]
    lowPriority: {
      title: string
      description: string
    }[]
  }
  programs: {
    academic: {
      name: string
      description: string
    }[]
    research: {
      name: string
      description: string
    }[]
    socialImpact: {
      name: string
      description: string
    }[]
    summer: {
      name: string
      description: string
    }[]
    industry: {
      name: string
      description: string
    }[]
  }
}

export default function OnboardingAnalysisPage() {
  const { userProfile } = useUser()
  const router = useRouter()
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  // Function to switch tabs that can be passed to child components
  const switchToTab = (tabValue: string) => {
    setActiveTab(tabValue);
  };

  useEffect(() => {
    // If no user profile, redirect to form
    if (!userProfile) {
      router.push("/onboarding/form")
      return
    }

    // Fetch analysis from API
    const fetchAnalysis = async () => {
      try {
        setLoading(true)

        // Create an AbortController for timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

        try {
          const response = await fetch("/api/student-analysis", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userProfile }),
            signal: controller.signal,
          })

          if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Failed to fetch analysis: ${response.status} ${errorText}`)
          }

          const data = await response.json()

          if (!data.analysis) {
            throw new Error("Invalid response format: missing analysis data")
          }

          setAnalysis(data.analysis)
        } finally {
          clearTimeout(timeoutId)
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          setError("Request timed out. The server took too long to respond.")
        } else {
          setError(err instanceof Error ? err.message : "Failed to generate analysis. Please try again.")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [userProfile, router])

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="space-y-4 text-center">
              <Skeleton className="h-8 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
              <Button variant="outline" onClick={() => router.push("/onboarding/form")} className="mt-4">
                Return to Form
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header currentPage="analysis" />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        <OnboardingProgressBar currentStep="analysis" />

        <div className="mx-auto">
          <h1 className="text-2xl font-display font-bold mb-6 text-center">Your College Readiness Analysis</h1>

          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState error={error} onRetry={() => window.location.reload()} />
          ) : analysis ? (
            <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6">
              <div className="bg-white rounded-lg shadow-sm">
                <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full grid grid-cols-4 h-auto bg-gray-50 p-1 rounded-t-lg">
                    <TabsTrigger
                      value="overview"
                      className="flex items-center justify-center gap-2 py-2.5 data-[state=active]:bg-white"
                    >
                      <BarChart className="h-4 w-4" />
                      <span>Overview</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="colleges"
                      className="flex items-center justify-center gap-2 py-2.5 data-[state=active]:bg-white"
                    >
                      <GraduationCap className="h-4 w-4" />
                      <span>Colleges</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="action-plan"
                      className="flex items-center justify-center gap-2 py-2.5 data-[state=active]:bg-white"
                    >
                      <Target className="h-4 w-4" />
                      <span>Action Plan</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="programs"
                      className="flex items-center justify-center gap-2 py-2.5 data-[state=active]:bg-white"
                    >
                      <Star className="h-4 w-4" />
                      <span>Programs</span>
                    </TabsTrigger>
                  </TabsList>

                  <div className="p-6">
                    <TabsContent value="overview" className="mt-0 space-y-6">
                      <AcademicAnalysis analysis={analysis} onViewActionPlan={() => switchToTab("action-plan")} />
                    </TabsContent>

                    <TabsContent value="colleges" className="mt-0 space-y-6">
                      <CollegeRecommendations userProfile={userProfile} analysis={analysis} />
                    </TabsContent>

                    <TabsContent value="action-plan" className="mt-0 space-y-6">
                      <ActionPlan analysis={analysis} />
                    </TabsContent>

                    <TabsContent value="programs" className="mt-0 space-y-6">
                      <Programs analysis={analysis} />
                    </TabsContent>
                  </div>
                </Tabs>
              </div>

              <Sidebar userProfile={userProfile} activeTab={activeTab} />
            </div>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  )
}

function LoadingState() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
      </div>
      <p className="text-gray-600">Generating your personalized analysis...</p>
    </div>
  )
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
      <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
      <p className="text-red-500 mb-4">{error}</p>
      <Button onClick={onRetry} className="bg-green-600 hover:bg-green-700">
        Try Again
      </Button>
    </div>
  )
}

function AcademicAnalysis({ analysis, onViewActionPlan }: { analysis: AnalysisResult; onViewActionPlan: () => void }) {
  return (
    <div className="bg-white rounded-lg">
      <h2 className="text-lg font-bold mb-4 flex items-center">
        <GraduationCap className="mr-2 h-5 w-5 text-green-600" />
        Academic Overview
      </h2>

      {/* Current Status */}
      <div className="p-4 bg-gray-50 rounded-lg mb-6">
        <p className="text-gray-700 leading-relaxed">{analysis.currentStatus}</p>
      </div>

      <div className="space-y-6">
        {/* Strengths */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-base font-semibold mb-3 flex items-center">
            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
            Strengths
          </h3>
          <div className="space-y-2">
            {analysis.actionItems.lowPriority.map((item, index) => (
              <div key={`strength-${index}`} className="bg-white p-3 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-medium">{item.title}</p>
                  <Badge className="bg-green-100 text-green-800">Strength</Badge>
                </div>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weaknesses */}
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-base font-semibold mb-3 flex items-center">
            <AlertCircle className="mr-2 h-4 w-4 text-red-600" />
            Areas for Improvement
          </h3>
          <div className="space-y-2">
            {analysis.actionItems.highPriority.map((item, index) => (
              <div key={`weakness-${index}`} className="bg-white p-3 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-medium">{item.title}</p>
                  <Badge className="bg-red-100 text-red-800">Focus Area</Badge>
                </div>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <Button 
              variant="outline" 
              className="text-sm border-red-600 text-red-600 hover:bg-red-50 flex items-center gap-2"
              onClick={onViewActionPlan}
            >
              <Target className="h-4 w-4" />
              View Detailed Action Plan
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-base font-semibold mb-3">Next Steps</h3>
        <p className="text-sm text-gray-700 mb-4">
          Based on your academic profile, we recommend scheduling a consultation to discuss your college readiness and develop a personalized action plan.
        </p>
        <div className="flex justify-center">
          <Button className="bg-green-600 hover:bg-green-700">
            Schedule Academic Consultation
          </Button>
        </div>
      </div>
    </div>
  )
}

function CollegeRecommendations({ userProfile, analysis }: { userProfile: any; analysis: AnalysisResult }) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold mb-4 flex items-center">
        <GraduationCap className="mr-2 h-5 w-5 text-green-600" />
        College Recommendations
      </h2>

      {/* Target School */}
      <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
        <div className="bg-green-50 px-4 py-2 border-l-4 border-green-500 flex items-center">
          <h3 className="text-base font-bold">{analysis.collegeRecommendations.target.name}</h3>
          <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">Target</Badge>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-3">{analysis.collegeRecommendations.target.description}</p>
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-sm">Avg. GPA: {analysis.collegeRecommendations.target.averageGpa}</span>
          </div>
        </div>
      </div>

      {/* Reach School */}
      <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
        <div className="bg-purple-50 px-4 py-2 border-l-4 border-purple-500 flex items-center">
          <h3 className="text-base font-bold">{analysis.collegeRecommendations.reach.name}</h3>
          <Badge className="ml-2 bg-purple-100 text-purple-800 hover:bg-purple-100">Reach</Badge>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-3">{analysis.collegeRecommendations.reach.description}</p>
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 text-purple-600 mr-2" />
            <span className="text-sm">Avg. GPA: {analysis.collegeRecommendations.reach.averageGpa}</span>
          </div>
        </div>
      </div>

      {/* Safety School */}
      <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
        <div className="bg-blue-50 px-4 py-2 border-l-4 border-blue-500 flex items-center">
          <h3 className="text-base font-bold">{analysis.collegeRecommendations.safety.name}</h3>
          <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100">Safety</Badge>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-3">{analysis.collegeRecommendations.safety.description}</p>
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm">Avg. GPA: {analysis.collegeRecommendations.safety.averageGpa}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ActionPlan({ analysis }: { analysis: AnalysisResult }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold mb-4 flex items-center">
        <Target className="mr-2 h-5 w-5 text-green-600" />
        Action Plan
      </h2>

      <p className="text-gray-700 mb-4">
        This personalized action plan outlines the steps you can take to improve your college readiness and strengthen your application.
      </p>

      {/* High Priority */}
      <div className="bg-red-50 p-4 rounded-lg">
        <h3 className="text-base font-semibold mb-3 flex items-center">
          <Clock className="h-4 w-4 text-red-500 mr-2" />
          High Priority Tasks
        </h3>
        <div className="space-y-3">
          {analysis.actionItems.highPriority.map((item, index) => (
            <div key={`high-${index}`} className="bg-white p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium">{item.title}</p>
                <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Urgent</Badge>
              </div>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Medium Priority */}
      <div className="bg-orange-50 p-4 rounded-lg">
        <h3 className="text-base font-semibold mb-3 flex items-center">
          <Target className="h-4 w-4 text-orange-500 mr-2" />
          Medium Priority Tasks
        </h3>
        <div className="space-y-3">
          {analysis.actionItems.mediumPriority.map((item, index) => (
            <div key={`medium-${index}`} className="bg-white p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium">{item.title}</p>
                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Important</Badge>
              </div>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Low Priority */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-base font-semibold mb-3 flex items-center">
          <BookOpen className="h-4 w-4 text-green-500 mr-2" />
          Long-term Goals
        </h3>
        <div className="space-y-3">
          {analysis.actionItems.lowPriority.map((item, index) => (
            <div key={`low-${index}`} className="bg-white p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium">{item.title}</p>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Planning</Badge>
              </div>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Button className="bg-green-600 hover:bg-green-700">
          Schedule Action Plan Review
        </Button>
      </div>
    </div>
  )
}

function Programs({ analysis }: { analysis: AnalysisResult }) {
  // Ensure programs exists, if not, provide a default empty structure
  const programs = analysis.programs 

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold mb-4 flex items-center">
        <Star className="mr-2 h-5 w-5 text-green-600" />
        Recommended Programs
      </h2>
      
      <p className="text-gray-700 mb-6">
        Based on your profile, we've identified specific programs that can help address your needs and strengthen your college application. These include both 7Edu offerings and recommended public/external programs tailored to your interests and academic goals.
      </p>

      {/* Academic Programs */}
      <div className="bg-blue-50 p-5 rounded-lg">
        <h3 className="text-base font-semibold mb-4 flex items-center">
          <GraduationCap className="h-4 w-4 text-blue-600 mr-2" />
          Academic Excellence Programs
        </h3>
        
        <div className="mb-3">
          <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
            <Badge className="mr-2 bg-blue-100 text-blue-800 hover:bg-blue-100">7Edu Programs</Badge>
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            {programs.academic.map((program, index) => (
              <div key={`academic-${index}`} className="bg-white p-4 rounded-lg border border-blue-100">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-bold text-blue-800">{program.name}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {program.description}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Duration: Varies</span>
                  <span>Format: In-person/Virtual</span>
                </div>
              </div>
            ))}
            {programs.academic.length === 0 && (
              <div className="bg-white p-4 rounded-lg border border-blue-100">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-bold text-blue-800">SAT/ACT Test Prep</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Comprehensive test preparation with practice tests, targeted review sessions, and personalized strategies to maximize your scores.
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Duration: 8-12 weeks</span>
                  <span>Format: In-person/Virtual</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5">
          <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
            <Badge className="mr-2 bg-gray-100 text-gray-800 hover:bg-gray-100">Public/External Programs</Badge>
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-bold text-gray-800">Khan Academy</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Free online courses, lessons and practice in math, sciences, and humanities. Includes official SAT practice in partnership with College Board.
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Self-paced</span>
                <span>Format: Online</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-bold text-gray-800">edX/Coursera Courses</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                College-level courses from top universities. Many can be audited for free, with certificates available for a fee. Great for exploring potential majors.
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Duration: Varies</span>
                <span>Format: Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Impact & Leadership */}
      <div className="bg-green-50 p-5 rounded-lg">
        <h3 className="text-base font-semibold mb-4 flex items-center">
          <Users className="h-4 w-4 text-green-600 mr-2" />
          Social Impact & Leadership Programs
        </h3>
        
        <div className="mb-3">
          <h4 className="text-sm font-medium text-green-800 mb-2 flex items-center">
            <Badge className="mr-2 bg-green-100 text-green-800 hover:bg-green-100">7Edu Programs</Badge>
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            {programs.socialImpact.map((program, index) => (
              <div key={`social-${index}`} className="bg-white p-4 rounded-lg border border-green-100">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-bold text-green-800">{program.name}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {program.description}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Duration: Semester/Year</span>
                  <span>Format: Hybrid</span>
                </div>
              </div>
            ))}
            {programs.socialImpact.length === 0 && (
              <div className="bg-white p-4 rounded-lg border border-green-100">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-bold text-green-800">Education4Impact (E4I)</h4>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Recommended</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Our flagship social impact program where you'll develop and implement educational initiatives that address real community needs while building leadership skills.
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Duration: Semester/Year</span>
                  <span>Format: Hybrid</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5">
          <h4 className="text-sm font-medium text-green-800 mb-2 flex items-center">
            <Badge className="mr-2 bg-gray-100 text-gray-800 hover:bg-gray-100">Public/External Programs</Badge>
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-bold text-gray-800">Key Club International</h4>
                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">School-based</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Student-led organization that provides its members with opportunities to perform service, build character and develop leadership skills.
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>School Year</span>
                <span>Format: In-person</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-bold text-gray-800">Volunteer Match</h4>
                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Community</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Platform connecting volunteers with nonprofit organizations. Find local opportunities aligned with your interests and schedule.
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Flexible</span>
                <span>Format: Varies</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Research & Portfolio Building */}
      <div className="bg-purple-50 p-5 rounded-lg">
        <h3 className="text-base font-semibold mb-4 flex items-center">
          <BookOpen className="h-4 w-4 text-purple-600 mr-2" />
          Research & Portfolio Building
        </h3>
        
        <div className="mb-3">
          <h4 className="text-sm font-medium text-purple-800 mb-2 flex items-center">
            <Badge className="mr-2 bg-purple-100 text-purple-800 hover:bg-purple-100">7Edu Programs</Badge>
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            {analysis.programs.research.map((program, index) => (
              <div key={`research-${index}`} className="bg-white p-4 rounded-lg border border-purple-100">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-bold text-purple-800">{program.name}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {program.description}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Duration: 20-50 hours</span>
                  <span>Format: Mentored</span>
                </div>
              </div>
            ))}
            {analysis.programs.research.length === 0 && (
              <div className="bg-white p-4 rounded-lg border border-purple-100">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-bold text-purple-800">1on1 Research Program</h4>
                  <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Recommended</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Work with a mentor to develop a research project in your field of interest, building valuable skills and creating a standout portfolio piece for college applications.
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Duration: 20-50 hours</span>
                  <span>Format: Mentored</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5">
          <h4 className="text-sm font-medium text-purple-800 mb-2 flex items-center">
            <Badge className="mr-2 bg-gray-100 text-gray-800 hover:bg-gray-100">Public/External Programs</Badge>
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-bold text-gray-800">Science Fairs & Competitions</h4>
                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Competitive</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Participate in competitions like Intel ISEF, Regeneron Science Talent Search, or Google Science Fair to showcase research and compete for scholarships.
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Annual cycles</span>
                <span>Format: Varies</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-bold text-gray-800">GitHub Student Developer Pack</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Free access to developer tools and platforms for students. Build coding projects, create a portfolio, and learn industry-standard tools.
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Ongoing</span>
                <span>Format: Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summer Programs */}
      <div className="bg-amber-50 p-5 rounded-lg">
        <h3 className="text-base font-semibold mb-4 flex items-center">
          <Sun className="h-4 w-4 text-amber-600 mr-2" />
          Summer Enrichment Programs
        </h3>
        
        <div className="mb-3">
          <h4 className="text-sm font-medium text-amber-800 mb-2 flex items-center">
            <Badge className="mr-2 bg-amber-100 text-amber-800 hover:bg-amber-100">7Edu Programs</Badge>
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            {analysis.programs.summer.map((program, index) => (
              <div key={`summer-${index}`} className="bg-white p-4 rounded-lg border border-amber-100">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-bold text-amber-800">{program.name}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {program.description}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Duration: 1-4 weeks</span>
                  <span>Format: Immersive</span>
                </div>
              </div>
            ))}
            {analysis.programs.summer.length === 0 && (
              <div className="bg-white p-4 rounded-lg border border-amber-100">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-bold text-amber-800">College Campus Tour</h4>
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Recommended</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Visit top colleges to experience campus life, meet admissions officers, and refine your college list with firsthand knowledge of each school.
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Duration: 1-2 weeks</span>
                  <span>Format: Travel</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5">
          <h4 className="text-sm font-medium text-amber-800 mb-2 flex items-center">
            <Badge className="mr-2 bg-gray-100 text-gray-800 hover:bg-gray-100">Public/External Programs</Badge>
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-bold text-gray-800">University Summer Programs</h4>
                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Academic</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Pre-college programs at universities like Stanford, Harvard, Yale, and MIT. Experience college life while taking courses in your field of interest.
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>2-8 weeks (summer)</span>
                <span>Format: Residential</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-bold text-gray-800">National Youth Leadership Forum</h4>
                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Career-focused</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Career-focused programs in medicine, engineering, business, and other fields. Gain hands-on experience and network with professionals.
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>1-3 weeks (summer)</span>
                <span>Format: Residential</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Industry Experience */}
      <div className="bg-indigo-50 p-5 rounded-lg">
        <h3 className="text-base font-semibold mb-4 flex items-center">
          <BarChart className="h-4 w-4 text-indigo-600 mr-2" />
          Industry Experience
        </h3>
        
        <div className="mb-3">
          <h4 className="text-sm font-medium text-indigo-800 mb-2 flex items-center">
            <Badge className="mr-2 bg-indigo-100 text-indigo-800 hover:bg-indigo-100">7Edu Programs</Badge>
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            {analysis.programs.industry.map((program, index) => (
              <div key={`industry-${index}`} className="bg-white p-4 rounded-lg border border-indigo-100">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-bold text-indigo-800">{program.name}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {program.description}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Duration: Varies</span>
                  <span>Format: Professional</span>
                </div>
              </div>
            ))}
            {analysis.programs.industry.length === 0 && (
              <div className="bg-white p-4 rounded-lg border border-indigo-100">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-bold text-indigo-800">Industry Shadowing Program</h4>
                  <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">Recommended</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Gain real-world experience by shadowing professionals in your field of interest, learning industry practices and building professional connections.
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Duration: 1-4 weeks</span>
                  <span>Format: Professional</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5">
          <h4 className="text-sm font-medium text-indigo-800 mb-2 flex items-center">
            <Badge className="mr-2 bg-gray-100 text-gray-800 hover:bg-gray-100">Public/External Programs</Badge>
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-bold text-gray-800">LinkedIn Learning</h4>
                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Skill-building</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Online courses in business, creative, and technology skills. Build professional capabilities and earn certificates to showcase on your profile.
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Self-paced</span>
                <span>Format: Online</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-bold text-gray-800">Virtual Internships</h4>
                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Experience</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Remote internship opportunities with companies across various industries. Gain work experience while maintaining flexibility with your academic schedule.
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Part-time/Full-time</span>
                <span>Format: Remote</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

