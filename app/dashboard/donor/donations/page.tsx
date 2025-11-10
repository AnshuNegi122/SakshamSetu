"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Heart } from "lucide-react"

const donationHistory: Array<{
  id: number
  beneficiary: string
  scheme: string
  amount: string
  date: string
  status: string
}> = []

export default function DonationsPage() {
  const totalDonated = 0
  const totalBeneficiaries = 0
  const averageDonation = 0

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar role="donor" />
      <div className="flex-1 overflow-auto">
        <DashboardHeader userName="User" />

        <main className="p-8 space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">My Donations</h2>
            <p className="text-muted-foreground">Track all your contributions and their impact</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="pt-6 space-y-2">
                <p className="text-sm font-semibold text-muted-foreground">Total Donated</p>
                <p className="text-3xl font-bold text-primary">₹{(totalDonated / 100000).toFixed(0)}L</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-100/50 to-green-50/50 border-green-200">
              <CardContent className="pt-6 space-y-2">
                <p className="text-sm font-semibold text-muted-foreground">Total Beneficiaries</p>
                <p className="text-3xl font-bold text-green-600">{totalBeneficiaries}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-100/50 to-blue-50/50 border-blue-200">
              <CardContent className="pt-6 space-y-2">
                <p className="text-sm font-semibold text-muted-foreground">Average Donation</p>
                <p className="text-3xl font-bold text-blue-600">₹{averageDonation.toLocaleString("en-IN")}</p>
              </CardContent>
            </Card>
          </div>

          {/* Make Donation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Make a New Donation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Enter donation amount (₹)" type="number" />
              <div className="grid md:grid-cols-4 gap-2">
                <Button variant="outline">₹5,000</Button>
                <Button variant="outline">₹10,000</Button>
                <Button variant="outline">₹50,000</Button>
                <Button variant="outline">₹1,00,000</Button>
              </div>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                <Heart className="h-4 w-4" />
                Donate Now
              </Button>
            </CardContent>
          </Card>

          {/* Donation History */}
          <Card>
            <CardHeader>
              <CardTitle>Donation History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-sm">Beneficiary</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Scheme</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donationHistory.map((donation) => (
                      <tr key={donation.id} className="border-b hover:bg-muted/50">
                        <td className="py-4 px-4 text-sm">{donation.beneficiary}</td>
                        <td className="py-4 px-4 text-sm text-muted-foreground">{donation.scheme}</td>
                        <td className="py-4 px-4 text-sm font-semibold">{donation.amount}</td>
                        <td className="py-4 px-4 text-sm text-muted-foreground">{donation.date}</td>
                        <td className="py-4 px-4 text-sm">
                          <Badge
                            className={
                              donation.status === "Received"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }
                          >
                            {donation.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
