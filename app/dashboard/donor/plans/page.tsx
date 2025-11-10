"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Calendar, CreditCard, AlertCircle } from "lucide-react"
import { apiGet } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Spinner } from "@/components/ui/spinner"

interface Plan {
  name?: string
  plan?: string
  startDate?: string
  expiryDate?: string
  daysRemaining?: number
  profilesAccessed?: number
  totalProfiles?: string | number
  status?: string
  price?: number
  amount?: number
  period?: string
  duration?: string
}

const paymentHistory = [
  { id: 1, date: "2024-01-15", amount: 60000, plan: "Annual Subscription", status: "Success" },
  { id: 2, date: "2023-01-15", amount: 60000, plan: "Annual Subscription", status: "Success" },
  { id: 3, date: "2022-01-15", amount: 60000, plan: "Annual Subscription", status: "Success" },
  { id: 4, date: "2024-04-10", amount: 4999, plan: "Monthly Add-on", status: "Success" },
]

export default function PlansPayments() {
  const { toast } = useToast()
  const [showRenewalDialog, setShowRenewalDialog] = useState(false)
  const [renewalType, setRenewalType] = useState("same")
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserPlan()
  }, [])

  const fetchUserPlan = async () => {
    setLoading(true)
    try {
      const response = await apiGet<{
        success: boolean
        data: { user: any }
      }>("/auth/me")
      
      if (response.success && response.data.user) {
        const user = response.data.user
        // Check for plan in various possible fields (backend may store it differently)
        const plan = user.plan || user.subscription?.plan || user.currentPlan || user.subscription
        
        if (plan) {
          // If plan is a string, create a basic plan object
          if (typeof plan === 'string') {
            setCurrentPlan({
              name: plan,
              plan: plan,
              status: "Active",
            })
          } else if (typeof plan === 'object' && plan !== null) {
            // If plan is an object, use it directly
            setCurrentPlan(plan)
          } else {
            setCurrentPlan(null)
          }
        } else {
          setCurrentPlan(null)
        }
      } else {
        setCurrentPlan(null)
      }
    } catch (error: any) {
      console.error("Failed to fetch user plan:", error)
      setCurrentPlan(null)
    } finally {
      setLoading(false)
    }
  }

  const handleRenewal = () => {
    console.log("[v0] Processing renewal:", renewalType)
    setShowRenewalDialog(false)
  }

  // Calculate days remaining if expiryDate is provided
  const calculateDaysRemaining = (expiryDate?: string): number | undefined => {
    if (!expiryDate) return undefined
    const expiry = new Date(expiryDate)
    const today = new Date()
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar role="donor" />
      <div className="flex-1 overflow-auto">
        <DashboardHeader userName="My Plans & Payments" />

        <main className="p-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Plans & Payments</h1>
            <p className="text-muted-foreground">Manage your subscription and view payment history</p>
          </div>

          {/* Current Plan */}
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Current Plan</span>
                {currentPlan && currentPlan.status && (
                  <span className="bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full">
                    {currentPlan.status}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Spinner className="h-6 w-6" />
                </div>
              ) : !currentPlan ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground text-lg">No active plan selected</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Visit <a href="/dashboard/donor/access" className="text-primary hover:underline">Access Plans</a> to select a subscription plan.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Plan Name</p>
                      <p className="font-bold text-lg">{currentPlan.name || currentPlan.plan || "N/A"}</p>
                    </div>
                    {(currentPlan.expiryDate || currentPlan.daysRemaining !== undefined) && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                          <Calendar className="h-4 w-4" /> Expires In
                        </p>
                        <p className="font-bold text-lg text-accent">
                          {currentPlan.daysRemaining !== undefined
                            ? `${currentPlan.daysRemaining} days`
                            : currentPlan.expiryDate
                            ? `${calculateDaysRemaining(currentPlan.expiryDate)} days`
                            : "N/A"}
                        </p>
                      </div>
                    )}
                    {(currentPlan.profilesAccessed !== undefined || currentPlan.totalProfiles) && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Profiles Accessed</p>
                        <p className="font-bold text-lg">
                          {currentPlan.profilesAccessed !== undefined
                            ? `${currentPlan.profilesAccessed}/${currentPlan.totalProfiles || "Unlimited"}`
                            : currentPlan.totalProfiles
                            ? `0/${currentPlan.totalProfiles}`
                            : "N/A"}
                        </p>
                      </div>
                    )}
                    {(currentPlan.price || currentPlan.amount) && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                          <CreditCard className="h-4 w-4" /> Plan Cost
                        </p>
                        <p className="font-bold text-lg">
                          ₹{((currentPlan.price || currentPlan.amount) || 0).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {currentPlan.expiryDate && (
                    <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-lg flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Expiry Notice</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Your plan expires on {currentPlan.expiryDate}. Renew before expiry to avoid service interruption.
                        </p>
                      </div>
                    </div>
                  )}

                  {currentPlan && (
                    <div className="mt-6">
                      <Button onClick={() => setShowRenewalDialog(true)} className="bg-accent hover:bg-accent/90">
                        Renew Plan
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle>Payment History & Receipts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Date</th>
                      <th className="text-left py-3 px-4 font-semibold">Plan</th>
                      <th className="text-right py-3 px-4 font-semibold">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-right py-3 px-4 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentHistory.map((payment) => (
                      <tr key={payment.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{payment.date}</td>
                        <td className="py-3 px-4">{payment.plan}</td>
                        <td className="text-right py-3 px-4 font-semibold">₹{payment.amount.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">
                            {payment.status}
                          </span>
                        </td>
                        <td className="text-right py-3 px-4">
                          <Button variant="outline" size="sm">
                            View Receipt
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Renewal Dialog */}
        <Dialog open={showRenewalDialog} onOpenChange={setShowRenewalDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Renew Your Plan</DialogTitle>
              <DialogDescription>Choose how you'd like to renew your subscription</DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted">
                <input
                  type="radio"
                  checked={renewalType === "same"}
                  onChange={() => setRenewalType("same")}
                  className="h-4 w-4"
                />
                <div>
                  <p className="font-semibold text-sm">Renew Same Plan</p>
                  <p className="text-xs text-muted-foreground">Annual Subscription - ₹60,000</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted">
                <input
                  type="radio"
                  checked={renewalType === "upgrade"}
                  onChange={() => setRenewalType("upgrade")}
                  className="h-4 w-4"
                />
                <div>
                  <p className="font-semibold text-sm">Upgrade Plan</p>
                  <p className="text-xs text-muted-foreground">Get more features and priority support</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted">
                <input
                  type="radio"
                  checked={renewalType === "downgrade"}
                  onChange={() => setRenewalType("downgrade")}
                  className="h-4 w-4"
                />
                <div>
                  <p className="font-semibold text-sm">Switch to Monthly</p>
                  <p className="text-xs text-muted-foreground">Monthly Subscription - ₹4,999/month</p>
                </div>
              </label>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRenewalDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleRenewal} className="bg-primary hover:bg-primary/90">
                Confirm Renewal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
