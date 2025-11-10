"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, Package, Briefcase, CheckCircle, Clock, Truck, Shield, Bell, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function PwDDashboard() {
  const requests: Array<{ status: string; count: number; icon: typeof Clock; color: string }> = []

  const notifications: Array<{ id: number; message: string; time: string; type: string }> = []

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar role="pwd" />
      <div className="flex-1 overflow-auto">
        <DashboardHeader userName="User" />

        <main className="p-8 space-y-8">
          {/* Personalized Welcome */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
              <p className="text-muted-foreground mt-2">Here's your support summary for today</p>
            </div>
            <Link href="/knowledge-hub">
              <Button variant="outline" className="gap-2 bg-transparent">
                Learn About UDID & Rights
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Request Status Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {requests.map((req) => {
              const Icon = req.icon
              return (
                <Card key={req.status}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{req.status}</p>
                        <p className="text-3xl font-bold text-foreground">{req.count}</p>
                      </div>
                      <Icon className={`h-8 w-8 ${req.color}`} />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* KPI Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Devices Purchased</p>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-xs text-muted-foreground mt-1">No devices yet</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Jobs Available</p>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-xs text-muted-foreground mt-1">No jobs available</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Notifications */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Updates
            </h2>
            <div className="space-y-3">
              {notifications.map((notif) => (
                <Card key={notif.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <p className="text-foreground flex-1">{notif.message}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{notif.time}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
