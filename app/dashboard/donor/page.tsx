"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useMemo } from "react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, Users, MapPin, Activity, CheckCircle, Zap, Package, Gem, Calendar, Check } from "lucide-react"

const needsData: Array<{ region: string; count: number; disability: string; aid: string }> = []

const oneTimePlans: Array<{
  id: string
  name: string
  price: number
  profiles: number
  icon: typeof Zap
  description: string
  features: string[]
}> = []

const subscriptionPlans: Array<{ period: string; price: number; duration: string; profiles: string }> = []

const verifiedBeneficiaries: Array<{ id: number; initials: string; region: string; aid: string; verified: boolean }> = []

const impactData: Array<{ name: string; value: number; fill: string }> = []

const donationHistory: Array<{ month: string; donations: number }> = []

const recentActivities: Array<{ id: number; type: string; desc: string; time: string }> = []

// Helper function to format time ago
function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`

  // For older dates, show formatted date
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function DonorDashboard() {
  const { toast } = useToast()
  const [selectedNeed, setSelectedNeed] = useState<(typeof needsData)[0] | null>(null)
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [showAgreement, setShowAgreement] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showPaymentAnimation, setShowPaymentAnimation] = useState(false)
  const [accessGranted, setAccessGranted] = useState(false)

  const handleSupportClick = (need: (typeof needsData)[0]) => {
    setSelectedNeed(need)
    setShowPlanModal(true)
  }

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
    setShowAgreement(true)
    setShowPlanModal(false)
  }

  const handleAgree = () => {
    if (agreed && selectedPlan) {
      console.log("[v0] Processing payment for plan:", selectedPlan)
      setShowAgreement(false)
      setShowPaymentAnimation(true)

      // Simulate payment processing
      setTimeout(() => {
        setShowPaymentAnimation(false)
        setAccessGranted(true)
        toast({
          title: "Access Granted Successfully",
          description: "You can now view verified beneficiaries",
        })
        setAgreed(false)
        setSelectedPlan(null)
        setSelectedNeed(null)
      }, 2000)
    }
  }

  const handleSupportBeneficiary = (initials: string) => {
    toast({
      title: "Support Initiated",
      description: `Support request sent for beneficiary ${initials}`,
    })
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar role="donor" />
      <div className="flex-1 overflow-auto">
        <DashboardHeader userName="User" />

        <main className="p-8 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Donor Dashboard</h1>
            <p className="text-muted-foreground">Here's your support summary for today</p>
          </div>
          {/* Summary KPI Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-primary">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Beneficiaries Supported</p>
                    <p className="text-3xl font-bold text-primary">0</p>
                  </div>
                  <Users className="h-8 w-8 text-primary/30" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-accent">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Verified Deliveries</p>
                    <p className="text-3xl font-bold text-accent">0</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-accent/30" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-600">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Regions Covered</p>
                    <p className="text-3xl font-bold text-green-600">0</p>
                  </div>
                  <MapPin className="h-8 w-8 text-green-600/30" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Explore Needs by Region</h2>
              <p className="text-muted-foreground">
                Click "Support" to access verified beneficiary data with payment plans
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {needsData.map((need, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 space-y-4">
                    <div className="bg-primary/10 rounded-lg p-4">
                      <p className="text-3xl font-bold text-primary">{need.count}</p>
                      <p className="text-sm text-muted-foreground">PwDs in need</p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-lg">{need.region}</p>
                      <p className="text-sm text-muted-foreground">{need.disability}</p>
                      <p className="text-sm text-muted-foreground font-medium">{need.aid}</p>
                    </div>
                    <Button onClick={() => handleSupportClick(need)} className="w-full bg-accent hover:bg-accent/90">
                      Support
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {accessGranted && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Verified Beneficiaries</h2>
                <p className="text-muted-foreground">Support PwDs directly through your active access plan</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {verifiedBeneficiaries.map((beneficiary) => (
                  <Card key={beneficiary.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xl font-bold text-primary">{beneficiary.initials}</span>
                        </div>
                        {beneficiary.verified && (
                          <div className="flex items-center gap-1 text-primary">
                            <CheckCircle className="h-5 w-5" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Region</p>
                          <p className="font-semibold">{beneficiary.region}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Aid Needed</p>
                          <p className="font-semibold">{beneficiary.aid}</p>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleSupportBeneficiary(beneficiary.initials)}
                        className="w-full bg-accent hover:bg-accent/90 text-sm"
                      >
                        Support Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Donation Impact by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={impactData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
                      {impactData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Donation History</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={donationHistory} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="donations" stroke="#00A15D" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* CSR Impact Stats & Recent Activities */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  CSR Impact Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-sm text-muted-foreground">Total Funds Utilized</span>
                  <span className="font-bold text-lg text-primary">₹0</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-sm text-muted-foreground">Avg Impact per Rupee</span>
                  <span className="font-bold text-lg">-</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Program Efficiency</span>
                  <span className="font-bold text-lg text-green-600">-</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Latest Activities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="pb-3 border-b last:border-b-0">
                    <p className="font-semibold text-sm">{activity.type}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.desc}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <Dialog open={showPlanModal} onOpenChange={setShowPlanModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Access Plans for {selectedNeed?.region}</DialogTitle>
            <DialogDescription>
              {selectedNeed?.count} PwDs in {selectedNeed?.region} need {selectedNeed?.aid}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="onetime" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="onetime">One-Time Access</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
            </TabsList>

            <TabsContent value="onetime" className="space-y-4 mt-4">
              <div className="grid md:grid-cols-3 gap-4">
                {oneTimePlans.map((plan) => {
                  const Icon = plan.icon
                  return (
                    <Card key={plan.id} className={`${plan.id === "standard" ? "ring-2 ring-accent" : ""}`}>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-3">
                          <Icon className="h-6 w-6 text-primary" />
                          <span className="text-2xl font-bold text-primary">₹{plan.price}</span>
                        </div>
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{plan.description}</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="bg-primary/10 rounded p-2">
                          <p className="font-semibold text-sm text-primary">{plan.profiles} Profiles</p>
                        </div>
                        <ul className="space-y-1">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs">
                              <Check className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button
                          onClick={() => handleSelectPlan(plan.id)}
                          className="w-full text-sm"
                          variant={plan.id === "standard" ? "default" : "outline"}
                        >
                          Select Plan
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="subscription" className="space-y-4 mt-4">
              <div className="grid md:grid-cols-3 gap-4">
                {subscriptionPlans.map((plan, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="h-5 w-5 text-primary" />
                        <span className="text-xl font-bold text-primary">₹{plan.price}</span>
                      </div>
                      <CardTitle className="text-lg">{plan.period}</CardTitle>
                      <p className="text-xs text-muted-foreground">{plan.duration}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-primary/10 rounded p-2">
                        <p className="font-semibold text-sm text-primary">{plan.profiles} Profiles</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <Check className="h-3 w-3 text-primary" />
                          <span>Full access to database</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Check className="h-3 w-3 text-primary" />
                          <span>Priority support</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Check className="h-3 w-3 text-primary" />
                          <span>Monthly reports</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleSelectPlan(`subscription-${idx}`)}
                        className="w-full text-sm"
                        variant="outline"
                      >
                        Subscribe
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Dialog open={showAgreement} onOpenChange={setShowAgreement}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Data Access Agreement</DialogTitle>
            <DialogDescription>Please review and accept our responsible data usage policy</DialogDescription>
          </DialogHeader>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 max-h-48 overflow-y-auto">
            <p className="text-sm text-foreground font-semibold mb-3">By accessing verified PwD data, you agree to:</p>
            <ul className="text-sm text-foreground space-y-2 list-disc list-inside">
              <li>Use data only for charitable purposes</li>
              <li>Maintain confidentiality and privacy</li>
              <li>Not share data with unauthorized parties</li>
              <li>Comply with applicable laws and regulations</li>
              <li>Report any misuse immediately</li>
            </ul>
          </div>

          <label className="flex items-center gap-3 py-4 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="h-4 w-4 rounded"
            />
            <span className="text-sm">I agree to the data access terms</span>
          </label>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAgreement(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAgree}
              disabled={!agreed}
              className="bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              Proceed to Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showPaymentAnimation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-80">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="animate-spin">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <div className="w-12 h-12 bg-primary/10 rounded-full" />
                </div>
              </div>
              <p className="font-semibold">Processing Payment...</p>
              <p className="text-xs text-muted-foreground">Please wait while we process your request</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
