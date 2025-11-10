"use client"

import { useState, useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, Clock, Gift } from "lucide-react"
import { apiGet, apiPatch } from "@/lib/api"
import { getUser } from "@/lib/auth"
import { Spinner } from "@/components/ui/spinner"

interface Support {
  _id: string
  requestId: {
    _id: string
    deviceType: string
    aidName: string
    status: string
    priority?: string
    region?: string
    requestedBy: {
      _id: string
      name: string
      location: string
      disabilityType?: string
    }
  }
  status: string
  amount: number
  notes?: string
  deliveredAt?: string
  completedAt?: string
  createdAt: string
}

export default function DonorSupportStatus() {
  const { toast } = useToast()
  const [supports, setSupports] = useState<Support[]>([])
  const [loading, setLoading] = useState(false)
  const [approving, setApproving] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = getUser()
    setUser(currentUser)
    fetchSupports()
    
    // Refresh supports periodically to catch updates when PWD confirms delivery
    // Poll every 15 seconds to see verified status updates
    const intervalId = setInterval(() => {
      fetchSupports()
    }, 15000) // 15 seconds
    
    // Also refresh when page comes into focus
    const handleFocus = () => {
      fetchSupports()
    }
    window.addEventListener('focus', handleFocus)
    
    return () => {
      clearInterval(intervalId)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const fetchSupports = async () => {
    setLoading(true)
    try {
      const response = await apiGet<{
        success: boolean
        data: { supports: Support[] }
      }>("/donor/status")
      if (response.success && response.data.supports) {
        setSupports(response.data.supports)
      }
    } catch (error: any) {
      toast({
        title: "Failed to fetch supports",
        description: error.message || "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmDelivery = async (supportId: string, beneficiaryName: string) => {
    setApproving(supportId)
    try {
      const response = await apiPatch<{
        success: boolean
        message: string
        data: { support: Support }
      }>(`/donor/support/${supportId}/approve`, {})

      if (response.success) {
        toast({
          title: "Delivery Confirmed",
          description: `Delivery marked as Approved for ${beneficiaryName}`,
        })
        // Refresh supports
        fetchSupports()
      }
    } catch (error: any) {
      toast({
        title: "Confirmation Failed",
        description: error.message || "Failed to confirm delivery. Please try again.",
        variant: "destructive",
      })
    } finally {
      setApproving(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Verified":
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Delivered":
        return "bg-purple-100 text-purple-800"
      case "Approved":
      case "InProgress":
        return "bg-blue-100 text-blue-800"
      case "Initiated":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Verified":
      case "Completed":
        return CheckCircle
      case "Delivered":
        return Gift
      default:
        return Clock
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <DashboardSidebar role="donor" />
        <div className="flex-1 overflow-auto flex items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar role="donor" />
      <div className="flex-1 overflow-auto">
        <DashboardHeader userName={user?.name || "Support Status"} />

        <main className="p-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Support Status</h1>
            <p className="text-muted-foreground">Track all supported requests and delivery confirmations</p>
          </div>

          {/* Status Overview Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    {supports.filter((r) => r.status === "Completed" || r.requestId?.status === "Verified").length}
                  </p>
                  <p className="text-xs text-muted-foreground">Verified</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Gift className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{supports.filter((r) => r.status === "Delivered").length}</p>
                  <p className="text-xs text-muted-foreground">Delivered</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Gift className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    {supports.filter((r) => r.status === "Approved" || r.status === "InProgress").length}
                  </p>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{supports.filter((r) => r.status === "Initiated").length}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Support Requests */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold">All Support Requests</h2>

            {supports.length === 0 ? (
              <Card>
                <CardContent className="pt-12 text-center">
                  <p className="text-muted-foreground">No support requests found. Start supporting beneficiaries to see your impact.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {supports.map((support) => {
                  const Icon = getStatusIcon(support.status)
                  const canConfirm = support.status === "Delivered"
                  return (
                    <Card key={support._id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between gap-6">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold">
                                {support.requestId?.aidName || "Unknown Device"}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {support.requestId?.requestedBy?.name || "Unknown"} •{" "}
                                {support.requestId?.requestedBy?.location || "Unknown"}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Started: {new Date(support.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 flex-shrink-0">
                            <div className="flex flex-col items-end gap-1">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(support.status)}`}>
                                {support.status}
                              </span>
                              {support.requestId?.status && support.requestId.status !== support.status && (
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(support.requestId.status)}`}>
                                  Request: {support.requestId.status}
                                </span>
                              )}
                            </div>

                            {canConfirm && (
                              <Button
                                onClick={() =>
                                  handleConfirmDelivery(
                                    support._id,
                                    support.requestId?.requestedBy?.name || "beneficiary",
                                  )
                                }
                                className="bg-accent hover:bg-accent/90 text-sm"
                                disabled={approving === support._id}
                              >
                                {approving === support._id ? (
                                  <>
                                    <Spinner className="mr-2 h-4 w-4" />
                                    Confirming...
                                  </>
                                ) : (
                                  "Confirm Delivery"
                                )}
                              </Button>
                            )}
                            {(support.status === "Completed" || support.requestId?.status === "Verified") && (
                              <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle className="h-5 w-5" />
                                <span className="text-sm font-medium">Verified</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
