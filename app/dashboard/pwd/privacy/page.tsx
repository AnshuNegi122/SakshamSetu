"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { Lock, User } from "lucide-react"
import { apiGet } from "@/lib/api"
import { getUser } from "@/lib/auth"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"

interface DonorAccessLog {
  id: string
  donorName: string
  timestamp: string
  purpose: string
  requestAid?: string
}

export default function PrivacyDataSettingsPage() {
  const { toast } = useToast()
  const [dataSharing, setDataSharing] = useState(false)
  const [accessLogs, setAccessLogs] = useState<DonorAccessLog[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  // Fetch donor access logs
  const fetchAccessLogs = async () => {
    try {
      const response = await apiGet<{
        success: boolean
        count: number
        data: { accessLogs: DonorAccessLog[] }
      }>("/pwd/access-logs")

      if (response.success && response.data.accessLogs) {
        setAccessLogs(response.data.accessLogs)
      }
    } catch (error: any) {
      console.error("Failed to fetch access logs:", error)
      // Don't show toast on initial load to avoid noise
      if (accessLogs.length > 0) {
        toast({
          title: "Failed to update access logs",
          description: error.message || "Please refresh the page.",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch and setup real-time polling
  useEffect(() => {
    const currentUser = getUser()
    setUser(currentUser)
    fetchAccessLogs()

    // Set up real-time polling - fetch every 10 seconds
    const intervalId = setInterval(() => {
      fetchAccessLogs()
    }, 10000) // 10 seconds

    // Cleanup interval on unmount
    return () => clearInterval(intervalId)
  }, [])

  // Format timestamp to readable date/time
  const formatTimestamp = (timestamp: string | Date): string => {
    const date = new Date(timestamp)
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

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar role="pwd" />
      <div className="flex-1 overflow-auto">
        <DashboardHeader userName="User" />

        <main className="p-8 max-w-3xl">
          <h1 className="text-3xl font-bold text-foreground mb-8">Donor Access Log</h1>

          {/* Data Sharing Toggle */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Data Sharing Consent
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Allow data sharing with verified donors</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your data will help donors better understand impact and allocate resources effectively.
                  </p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dataSharing}
                    onChange={(e) => setDataSharing(e.target.checked)}
                    className="w-6 h-6 rounded accent-primary"
                    aria-label="Allow data sharing with verified donors"
                  />
                </label>
              </div>
              {dataSharing && (
                <p className="text-sm text-green-600 font-medium">
                  ✓ Data sharing is enabled. Your information helps improve the platform.
                </p>
              )}
              {!dataSharing && (
                <p className="text-sm text-muted-foreground">
                  Data sharing is currently disabled. You can enable it anytime to help donors understand impact.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Donor Access Log */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Donor Access Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Donors who have accessed your data with your consent (updates in real-time):
              </p>
              {loading && accessLogs.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <Spinner className="h-6 w-6" />
                </div>
              ) : accessLogs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">
                    No donor access records yet. When donors support your requests, their access will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {accessLogs.map((log) => (
                    <div key={log.id} className="p-4 border border-input rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{log.donorName}</p>
                          {log.purpose && (
                            <p className="text-sm text-muted-foreground mt-1">Purpose: {log.purpose}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Accessed: {formatTimestamp(log.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
