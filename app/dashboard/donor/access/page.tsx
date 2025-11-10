"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Zap, Package, Gem, Calendar, Check } from "lucide-react"

const oneTimePlans = [
  {
    id: "basic",
    name: "Basic",
    price: 499,
    profiles: 10,
    icon: Zap,
    description: "Perfect for getting started",
    features: ["View 10 verified profiles", "24-hour access", "Basic filters"],
  },
  {
    id: "standard",
    name: "Standard",
    price: 999,
    profiles: 25,
    icon: Package,
    description: "Most popular choice",
    features: ["View 25 verified profiles", "7-day access", "Advanced filters", "Export data"],
  },
  {
    id: "impact",
    name: "Impact",
    price: 1999,
    profiles: 50,
    icon: Gem,
    description: "Maximum reach",
    features: ["View 50 verified profiles", "30-day access", "All features", "Direct contact"],
  },
]

const subscriptionPlans = [
  { period: "Monthly", price: 4999, duration: "30 days", profiles: "Unlimited" },
  { period: "Quarterly", price: 12999, duration: "90 days", profiles: "Unlimited" },
  { period: "Annual", price: 60000, duration: "365 days", profiles: "Unlimited" },
]

export default function AccessBeneficiaries() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showAgreement, setShowAgreement] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
    setShowAgreement(true)
  }

  const handleAgree = () => {
    if (agreed && selectedPlan) {
      // Simulate Razorpay redirect
      console.log("[v0] Processing payment for plan:", selectedPlan)
      setShowAgreement(false)
      // Redirect to beneficiaries page
      router.push("/dashboard/donor/beneficiaries")
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar role="donor" />
      <div className="flex-1 overflow-auto">
        <DashboardHeader userName="Access Beneficiaries" />

        <main className="p-8 space-y-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">Access Verified Beneficiaries</h1>
            <p className="text-muted-foreground">Choose your plan to view and support PwDs in need</p>
          </div>

          {/* One-Time Access Plans */}
          <div>
            <h2 className="text-2xl font-bold mb-6">One-Time Access</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {oneTimePlans.map((plan) => {
                const Icon = plan.icon
                return (
                  <Card
                    key={plan.id}
                    className={`relative overflow-hidden transition-all hover:shadow-lg ${
                      plan.id === "standard" ? "ring-2 ring-accent" : ""
                    }`}
                  >
                    {plan.id === "standard" && (
                      <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-3 py-1 text-xs font-semibold">
                        POPULAR
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <Icon className="h-8 w-8 text-primary" />
                        <span className="text-3xl font-bold text-primary">₹{plan.price}</span>
                      </div>
                      <CardTitle>{plan.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-primary/10 rounded p-3">
                        <p className="font-bold text-primary">{plan.profiles} Profiles</p>
                      </div>
                      <ul className="space-y-2">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        onClick={() => handleSelectPlan(plan.id)}
                        className={`w-full mt-4 ${
                          plan.id === "standard" ? "bg-accent hover:bg-accent/90" : "bg-primary hover:bg-primary/90"
                        }`}
                      >
                        Select Plan
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Subscription Plans */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Subscription Plans</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {subscriptionPlans.map((plan, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="h-6 w-6 text-primary" />
                      <span className="text-2xl font-bold text-primary">₹{plan.price}</span>
                    </div>
                    <CardTitle>{plan.period}</CardTitle>
                    <p className="text-sm text-muted-foreground">{plan.duration}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-primary/10 rounded p-3">
                      <p className="font-bold text-primary">{plan.profiles} Profiles</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary" />
                        <span>Full access to database</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary" />
                        <span>Priority support</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary" />
                        <span>Monthly reports</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleSelectPlan(`subscription-${idx}`)}
                      className="w-full mt-4 bg-primary hover:bg-primary/90"
                    >
                      Subscribe
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>

        {/* Agreement Modal */}
        <Dialog open={showAgreement} onOpenChange={setShowAgreement}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Data Access Agreement</DialogTitle>
              <DialogDescription>Please review and accept our responsible data usage policy</DialogDescription>
            </DialogHeader>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 max-h-48 overflow-y-auto">
              <p className="text-sm text-foreground">By accessing verified PwD data, you agree to:</p>
              <ul className="text-sm text-foreground mt-3 space-y-2 list-disc list-inside">
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
      </div>
    </div>
  )
}
