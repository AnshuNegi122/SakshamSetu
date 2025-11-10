"use client"

import { useState, useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
// import { CheckCircle, Spinner } from "@/components/ui/spinner"
import { Spinner } from "@/components/ui/spinner"
import { CheckCircle } from "lucide-react"
import { apiGet, apiPatch } from "@/lib/api"
import { getUser } from "@/lib/auth"

interface PwDRequest {
  _id: string
  deviceType: string
  aidName: string
  status: string
  description?: string
  priority?: string
  region?: string
  createdAt: string
  deliveredAt?: string
  verifiedAt?: string
}

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Approved: "bg-blue-100 text-blue-800",
  InProgress: "bg-purple-100 text-purple-800",
  Delivered: "bg-purple-100 text-purple-800",
  Verified: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
}

export default function MySupportStatusPage() {
  const { toast } = useToast()
  const [requests, setRequests] = useState<PwDRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [confirming, setConfirming] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = getUser()
    setUser(currentUser)
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const response = await apiGet<{
        success: boolean
        data: { requests: PwDRequest[] }
      }>("/pwd/request")
      if (response.success && response.data.requests) {
        // Filter to show only requests that have been supported by donors
        // A request is considered "supported" if:
        // 1. Status is "Approved" or higher (donor support creates/updates to "Approved")
        // 2. Status is "InProgress", "Delivered", or "Verified" (these indicate active support)
        // Note: "Pending" requests are not shown as they haven't been supported yet
        const supportedRequests = response.data.requests.filter(
          (req) =>
            req.status === "Approved" ||
            req.status === "InProgress" ||
            req.status === "Delivered" ||
            req.status === "Verified"
        )
        setRequests(supportedRequests)
      }
    } catch (error: any) {
      toast({
        title: "Failed to fetch requests",
        description: error.message || "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmDelivery = async (id: string) => {
    setConfirming(id)
    try {
      const response = await apiPatch<{
        success: boolean
        message: string
        data: { request: PwDRequest }
      }>(`/pwd/request/${id}/confirm`, {})

      if (response.success) {
        toast({
          title: "Delivery Confirmed",
          description: "Impact verification is now complete. Thank you!",
        })
        // Refresh requests
        fetchRequests()
      }
    } catch (error: any) {
      toast({
        title: "Confirmation Failed",
        description: error.message || "Failed to confirm delivery. Please try again.",
        variant: "destructive",
      })
    } finally {
      setConfirming(null)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <DashboardSidebar role="pwd" />
        <div className="flex-1 overflow-auto flex items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar role="pwd" />
      <div className="flex-1 overflow-auto">
        <DashboardHeader userName={user?.name || "User"} />

        <main className="p-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">My Support Status</h1>

          <div className="space-y-4">
            {requests.length === 0 ? (
              <Card>
                <CardContent className="pt-12 text-center">
                  <p className="text-muted-foreground">
                    No supported requests found. Once a donor selects your request to help, it will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              requests.map((request) => (
                <Card key={request._id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-semibold text-foreground">{request.aidName}</p>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              statusColors[request.status] || statusColors.Pending
                            }`}
                          >
                            {request.status}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>Device Type: {request.deviceType}</p>
                          <p>Request ID: {request._id.slice(-8)}</p>
                          <p>Submitted: {new Date(request.createdAt).toLocaleDateString()}</p>
                          {request.description && <p className="mt-1">Description: {request.description}</p>}
                        </div>
                      </div>

                      {request.status === "Delivered" && (
                        <Button
                          onClick={() => handleConfirmDelivery(request._id)}
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                          disabled={confirming === request._id}
                        >
                          {confirming === request._id ? (
                            <>
                              <Spinner className="mr-2 h-4 w-4" />
                              Confirming...
                            </>
                          ) : (
                            "Confirm Delivery"
                          )}
                        </Button>
                      )}
                      {(request.status === "Approved" || request.status === "InProgress") && (
                        <div className="text-sm text-muted-foreground">
                          Waiting for delivery confirmation from donor
                        </div>
                      )}
                      {request.status === "Verified" && (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="h-5 w-5" />
                          <span className="text-sm font-medium">Verified</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
