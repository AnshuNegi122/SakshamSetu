"use client"

import { useState, useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import { apiGet } from "@/lib/api"
import { getUser } from "@/lib/auth"
import { Spinner } from "@/components/ui/spinner"

interface Analytics {
  users: {
    total: number
    pwd: number
    donor: number
    verifiedPwD: number
  }
  requests: {
    total: number
    pending: number
    approved: number
    delivered: number
    verified: number
  }
  supports: {
    total: number
    active: number
    completed: number
  }
  payments: {
    total: number
    revenue: number
  }
  distribution: {
    byRegion: Array<{ _id: string; count: number }>
    byDeviceType: Array<{ _id: string; count: number }>
  }
  recentActivity: {
    requests: number
    supports: number
    users: number
  }
}

const colors = ["#00A15D", "#FF5E4B", "#3B82F6", "#8B5CF6"]

export default function Analytics() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = getUser()
    setUser(currentUser)
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await apiGet<{
        success: boolean
        data: Analytics
      }>("/admin/analytics")
      if (response.success && response.data) {
        setAnalytics(response.data)
      }
    } catch (error: any) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <DashboardSidebar role="admin" />
        <div className="flex-1 overflow-auto flex items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="flex h-screen bg-background">
        <DashboardSidebar role="admin" />
        <div className="flex-1 overflow-auto flex items-center justify-center">
          <p className="text-muted-foreground">No analytics data available</p>
        </div>
      </div>
    )
  }

  const usersByRole = [
    { role: "PwD Users", count: analytics.users.pwd },
    { role: "CSR Donors", count: analytics.users.donor },
  ]

  const supportDistribution = analytics.distribution.byDeviceType.map((item) => ({
    category: item._id || "Other",
    value: item.count,
  }))

  const requestsData = [
    {
      month: "Total",
      requests: analytics.requests.total,
      approved: analytics.requests.approved,
      delivered: analytics.requests.delivered,
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar role="admin" />
      <div className="flex-1 overflow-auto">
        <DashboardHeader userName={user?.name || "Admin"} />

        <main className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Platform performance and user insights</p>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-1">Total PwDs</p>
                <p className="text-3xl font-bold text-primary">{analytics.users.pwd}</p>
                <p className="text-xs text-green-600 mt-2">Verified: {analytics.users.verifiedPwD}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-1">Total Donors</p>
                <p className="text-3xl font-bold text-blue-600">{analytics.users.donor}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-1">Total Requests</p>
                <p className="text-3xl font-bold text-purple-600">{analytics.requests.total}</p>
                <p className="text-xs text-muted-foreground mt-2">Pending: {analytics.requests.pending}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-1">Verified Deliveries</p>
                <p className="text-3xl font-bold text-green-600">{analytics.requests.verified}</p>
                <p className="text-xs text-green-600 mt-2">
                  {analytics.requests.total > 0
                    ? Math.round((analytics.requests.verified / analytics.requests.total) * 100)
                    : 0}
                  % fulfillment rate
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Users by Role */}
            <Card>
              <CardHeader>
                <CardTitle>Active Users by Role</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={usersByRole} cx="50%" cy="50%" dataKey="count" label>
                      {usersByRole.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Support Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Support Distribution by Device Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={supportDistribution} cx="50%" cy="50%" dataKey="value" label>
                      {supportDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Request Status Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Request Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={requestsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="requests" fill="#00A15D" name="Total" />
                  <Bar dataKey="approved" fill="#3B82F6" name="Approved" />
                  <Bar dataKey="delivered" fill="#FF5E4B" name="Delivered" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue Card */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold text-green-600">₹{analytics.payments.revenue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Payments</p>
                  <p className="text-2xl font-bold">{analytics.payments.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
