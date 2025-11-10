"use client"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const payments = [
  {
    id: "TXN-2024-001",
    donorName: "ABC Corporation",
    planType: "Impact Plan",
    amount: "₹50,000",
    date: "2024-01-15",
    status: "Success",
  },
  {
    id: "TXN-2024-002",
    donorName: "Tech for Good",
    planType: "Standard Plan",
    amount: "₹25,000",
    date: "2024-01-14",
    status: "Success",
  },
  {
    id: "TXN-2024-003",
    donorName: "Social Impact Ltd",
    planType: "Basic Plan",
    amount: "₹10,000",
    date: "2024-01-13",
    status: "Pending",
  },
  {
    id: "TXN-2024-004",
    donorName: "Community Trust",
    planType: "Monthly Subscription",
    amount: "₹5,000",
    date: "2024-01-12",
    status: "Failed",
  },
]

export default function PaymentsTransactions() {
  const { toast } = useToast()

  const handleExportCSV = () => {
    toast({
      title: "Export Started",
      description: "Payment report will be downloaded as CSV",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Success":
        return "success"
      case "Pending":
        return "secondary"
      case "Failed":
        return "destructive"
      default:
        return "outline"
    }
  }

  const totalRevenue = payments
    .filter((p) => p.status === "Success")
    .reduce((sum, p) => sum + Number.parseInt(p.amount.replace(/[₹,]/g, "")), 0)

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar role="admin" />
      <div className="flex-1 overflow-auto">
        <DashboardHeader userName="User" />

        <main className="p-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Payments & Transactions</h1>
            <p className="text-muted-foreground">Manage CSR donor payments and subscriptions</p>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-primary">₹{(totalRevenue / 100000).toFixed(2)}L</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-1">Successful Transactions</p>
                <p className="text-3xl font-bold text-green-600">
                  {payments.filter((p) => p.status === "Success").length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {payments.filter((p) => p.status === "Pending").length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-1">Failed</p>
                <p className="text-3xl font-bold text-red-600">
                  {payments.filter((p) => p.status === "Failed").length}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <Input placeholder="Filter by donor name or transaction ID..." className="flex-1" />
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              Date Range
            </Button>
            <Button onClick={handleExportCSV} className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Donor Name</TableHead>
                      <TableHead>Plan Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                        <TableCell>{payment.donorName}</TableCell>
                        <TableCell>{payment.planType}</TableCell>
                        <TableCell className="font-semibold">{payment.amount}</TableCell>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(payment.status)}>{payment.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
