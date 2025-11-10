"use client"

import { useState, useEffect, useMemo } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Download, TrendingUp } from "lucide-react"
import { apiGet } from "@/lib/api"
import { getUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
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

// Helper function to extract state from location string
const extractState = (location?: string): string => {
  if (!location) return "Unknown"
  const parts = location.split(",").map((p) => p.trim())
  return parts.length > 1 ? parts[parts.length - 1] : parts[0] || "Unknown"
}

// Color palette for charts
const CHART_COLORS = ["#00A15D", "#FF5E4B", "#4F9BED", "#FFB839", "#8B5CF6", "#F59E0B", "#10B981", "#EF4444"]

export default function ImpactTracker() {
  const { toast } = useToast()
  const [supports, setSupports] = useState<Support[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = getUser()
    setUser(currentUser)
    fetchImpactData()
    
    // Refresh data periodically
    const intervalId = setInterval(() => {
      fetchImpactData()
    }, 30000) // 30 seconds
    
    return () => clearInterval(intervalId)
  }, [])

  const fetchImpactData = async () => {
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
        title: "Failed to fetch impact data",
        description: error.message || "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Compute progress data from actual supports
  const progressData = useMemo(() => {
    const supported = supports.length
    const delivered = supports.filter((s) => s.status === "Delivered" || s.requestId?.status === "Delivered").length
    const verified = supports.filter(
      (s) => s.status === "Completed" || s.requestId?.status === "Verified"
    ).length

    return [
      { stage: "Supported", count: supported, color: "#00A15D" },
      { stage: "Delivered", count: delivered, color: "#FF5E4B" },
      { stage: "Verified", count: verified, color: "#4F9BED" },
    ]
  }, [supports])

  // Compute region-wise impact
  const regionImpactData = useMemo(() => {
    const regionMap = new Map<string, { beneficiaries: Set<string>; devices: number; amount: number }>()

    supports.forEach((support) => {
      if (!support.requestId?.requestedBy) return

      const state = extractState(support.requestId.requestedBy.location || support.requestId.region)
      const beneficiaryId = support.requestId.requestedBy._id

      if (!regionMap.has(state)) {
        regionMap.set(state, { beneficiaries: new Set(), devices: 0, amount: 0 })
      }

      const regionData = regionMap.get(state)!
      regionData.beneficiaries.add(beneficiaryId)
      regionData.devices += 1
      regionData.amount += support.amount || 0
    })

    return Array.from(regionMap.entries())
      .map(([region, data]) => ({
        region,
        beneficiaries: data.beneficiaries.size,
        devices: data.devices,
        amount: data.amount,
      }))
      .sort((a, b) => b.beneficiaries - a.beneficiaries)
  }, [supports])

  // Compute disability type distribution
  const disabilityImpactData = useMemo(() => {
    const disabilityMap = new Map<string, number>()

    supports.forEach((support) => {
      const disabilityType = support.requestId?.requestedBy?.disabilityType || "Not Specified"
      disabilityMap.set(disabilityType, (disabilityMap.get(disabilityType) || 0) + 1)
    })

    return Array.from(disabilityMap.entries())
      .map(([name, beneficiaries], index) => ({
        name,
        beneficiaries,
        fill: CHART_COLORS[index % CHART_COLORS.length],
      }))
      .sort((a, b) => b.beneficiaries - a.beneficiaries)
  }, [supports])

  const handleDownloadReport = () => {
    console.log("[v0] Downloading impact report PDF")
    // Mock download
    const element = document.createElement("a")
    element.href = "data:text/plain;charset=utf-8,%23SakshamSetu%20CSR%20Impact%20Report"
    element.download = "impact-report.pdf"
    element.click()
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
        <DashboardHeader userName="Impact Tracker" />

        <main className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Impact Tracker</h1>
              <p className="text-muted-foreground">Visualize your CSR impact across regions</p>
            </div>
            {/* <Button onClick={handleDownloadReport} className="bg-accent hover:bg-accent/90 gap-2">
              <Download className="h-5 w-5" />
              Download Report
            </Button> */}
          </div>

          {/* Progress Stages */}
          <div className="grid md:grid-cols-3 gap-6">
            {progressData.map((stage) => (
              <Card key={stage.stage} className="border-l-4" style={{ borderLeftColor: stage.color }}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stage.stage}</p>
                      <p className="text-3xl font-bold" style={{ color: stage.color }}>
                        {stage.count}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 opacity-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Region-wise Impact</CardTitle>
              </CardHeader>
              <CardContent>
                {regionImpactData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={regionImpactData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="region" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="beneficiaries" stackId="a" fill="#00A15D" />
                      <Bar dataKey="devices" stackId="a" fill="#FF5E4B" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No regional data available yet
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Disability Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {disabilityImpactData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={disabilityImpactData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry: any) => `${entry.name}: ${entry.beneficiaries}`}
                        dataKey="beneficiaries"
                      >
                        {disabilityImpactData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No disability type data available yet
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Detailed Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Regional Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {regionImpactData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">Region</th>
                        <th className="text-right py-3 px-4 font-semibold">Beneficiaries</th>
                        <th className="text-right py-3 px-4 font-semibold">Devices</th>
                        <th className="text-right py-3 px-4 font-semibold">Amount Utilized</th>
                      </tr>
                    </thead>
                    <tbody>
                      {regionImpactData.map((row) => (
                        <tr key={row.region} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{row.region}</td>
                        <td className="text-right py-3 px-4">{row.beneficiaries}</td>
                        <td className="text-right py-3 px-4">{row.devices}</td>
                        <td className="text-right py-3 px-4 font-semibold">₹{row.amount.toLocaleString()}</td>
                      </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No regional breakdown available yet. Start supporting beneficiaries to see your impact.
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
