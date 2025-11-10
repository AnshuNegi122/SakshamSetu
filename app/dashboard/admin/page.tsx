"use client"

import { useState, useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileText, CreditCard, Lock, TrendingUp, CheckCircle2 } from "lucide-react"
import Link from "next/link"
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
}

export default function AdminDashboard() {
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

  const statsCards = analytics
    ? [
        {
          title: "Total PwD Users",
          value: analytics.users.pwd.toString(),
          icon: Users,
          color: "text-blue-600",
          href: "/dashboard/admin/users",
        },
        {
          title: "Active Requests",
          value: analytics.requests.pending.toString(),
          icon: FileText,
          color: "text-green-600",
          href: "/dashboard/admin/requests",
        },
        {
          title: "CSR Donors",
          value: analytics.users.donor.toString(),
          icon: Users,
          color: "text-purple-600",
          href: "/dashboard/admin/users",
        },
        {
          title: "Total Revenue",
          value: `₹${analytics.payments.revenue.toLocaleString()}`,
          icon: CreditCard,
          color: "text-orange-600",
          href: "/dashboard/admin/payments",
        },
        {
          title: "Verified PwDs",
          value: analytics.users.verifiedPwD.toString(),
          icon: Lock,
          color: "text-red-600",
          href: "/dashboard/admin/compliance",
        },
        {
          title: "Verified Devices",
          value: analytics.requests.verified.toString(),
          icon: CheckCircle2,
          color: "text-green-600",
          href: "/dashboard/admin/analytics",
        },
      ]
    : []

  const recentActivities: Array<{ id: number; action: string; desc: string; time: string }> = []

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

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar role="admin" />
      <div className="flex-1 overflow-auto">
        <DashboardHeader userName={user?.name || "Admin"} />

        <main className="p-8 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Monitor and manage all platform activities</p>
          </div>

          {/* Key Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {statsCards.map((stat) => {
              const Icon = stat.icon
              return (
                <Link key={stat.title} href={stat.href}>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">{stat.title}</p>
                          <p className="text-3xl font-bold">{stat.value}</p>
                        </div>
                        <Icon className={`h-8 w-8 ${stat.color}/30`} />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-4 gap-4">
            <Link href="/dashboard/admin/users">
              <Button className="w-full bg-primary hover:bg-primary/90">Manage Users</Button>
            </Link>
            <Link href="/dashboard/admin/requests">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Monitor Requests</Button>
            </Link>
            <Link href="/dashboard/admin/verifications">
              <Button className="w-full bg-green-600 hover:bg-green-700">Verifications</Button>
            </Link>
            <Link href="/dashboard/admin/analytics">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">View Analytics</Button>
            </Link>
          </div>

          {/* System Overview & Recent Activities */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="pb-4 border-b last:border-b-0">
                      <p className="font-semibold text-sm text-primary">{activity.action}</p>
                      <p className="text-sm text-muted-foreground mt-1">{activity.desc}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">System Uptime</p>
                    <p className="text-2xl font-bold text-green-600">-</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Data Violations</p>
                    <p className="text-2xl font-bold text-green-600">-</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
