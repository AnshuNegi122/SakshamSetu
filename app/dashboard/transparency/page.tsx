"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, TrendingUp, Package, Briefcase } from "lucide-react"

export default function TransparencyDashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-primary text-primary-foreground px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-foreground rounded-lg flex items-center justify-center text-primary font-bold">
              S
            </div>
            <h1 className="text-xl font-bold">SakshamSetu</h1>
          </Link>
          <span className="text-sm">2L</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8 space-y-8">
        <h1 className="text-4xl font-bold">Transparency Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="bg-primary/10">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 text-primary mb-2" />
              <p className="text-3xl font-bold text-primary">0</p>
              <p className="text-sm text-muted-foreground">Beneficiaries Helped</p>
            </CardContent>
          </Card>

          <Card className="bg-primary/10">
            <CardContent className="pt-6">
              <TrendingUp className="h-8 w-8 text-primary mb-2" />
              <p className="text-3xl font-bold text-primary">₹0</p>
              <p className="text-sm text-muted-foreground">CSR Funds Utilized</p>
            </CardContent>
          </Card>

          <Card className="bg-primary/10">
            <CardContent className="pt-6">
              <Package className="h-8 w-8 text-primary mb-2" />
              <p className="text-3xl font-bold text-primary">0</p>
              <p className="text-sm text-muted-foreground">Devices Distributed</p>
            </CardContent>
          </Card>

          <Card className="bg-primary/10">
            <CardContent className="pt-6">
              <Briefcase className="h-8 w-8 text-primary mb-2" />
              <p className="text-3xl font-bold text-primary">0</p>
              <p className="text-sm text-muted-foreground">Jobs Offered</p>
            </CardContent>
          </Card>
        </div>

        {/* Success Stories */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Our Impact in Action</h2>
          <div className="text-center py-12">
            <p className="text-muted-foreground">No success stories available yet</p>
          </div>
        </div>
      </div>
    </div>
  )
}
