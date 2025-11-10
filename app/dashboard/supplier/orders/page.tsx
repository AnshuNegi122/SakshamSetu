"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Truck, CheckCircle } from "lucide-react"

const ordersData = [
  {
    id: "ORD-2024-001",
    customer: "Healthcare Hub",
    device: "Electric Wheelchair",
    quantity: 5,
    amount: "₹12,50,000",
    orderDate: "2024-11-15",
    deliveryDate: "2024-11-20",
    status: "Delivered",
  },
  {
    id: "ORD-2024-002",
    customer: "Accessibility Center",
    device: "Hearing Aid",
    quantity: 10,
    amount: "₹15,00,000",
    orderDate: "2024-11-12",
    deliveryDate: "2024-11-22",
    status: "In Transit",
  },
  {
    id: "ORD-2024-003",
    customer: "Rehabilitation Institute",
    device: "Walking Stick",
    quantity: 20,
    amount: "₹7,00,000",
    orderDate: "2024-11-10",
    deliveryDate: "2024-11-18",
    status: "Processing",
  },
  {
    id: "ORD-2024-004",
    customer: "Government Health",
    device: "Orthopaedic Walker",
    quantity: 30,
    amount: "₹25,50,000",
    orderDate: "2024-11-08",
    deliveryDate: "2024-11-25",
    status: "Pending",
  },
  {
    id: "ORD-2024-005",
    customer: "Special Education",
    device: "Communication Board",
    quantity: 8,
    amount: "₹3,60,000",
    orderDate: "2024-11-05",
    deliveryDate: "2024-11-17",
    status: "Delivered",
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Delivered":
      return <CheckCircle className="h-5 w-5 text-green-600" />
    case "In Transit":
      return <Truck className="h-5 w-5 text-blue-600" />
    case "Processing":
      return <Package className="h-5 w-5 text-yellow-600" />
    default:
      return <Package className="h-5 w-5 text-gray-600" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-800"
    case "In Transit":
      return "bg-blue-100 text-blue-800"
    case "Processing":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function OrdersPage() {
  const totalOrders = 5
  const totalRevenue = 63600000
  const deliveredOrders = 2

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar role="supplier" />
      <div className="flex-1 overflow-auto">
        <DashboardHeader userName="User" />

        <main className="p-8 space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Orders Management</h2>
            <p className="text-muted-foreground">Track and manage all customer orders</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="pt-6 space-y-2">
                <p className="text-sm font-semibold text-muted-foreground">Total Orders</p>
                <p className="text-3xl font-bold text-primary">{totalOrders}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-100/50 to-green-50/50 border-green-200">
              <CardContent className="pt-6 space-y-2">
                <p className="text-sm font-semibold text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600">₹{(totalRevenue / 100000).toFixed(0)}L</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-100/50 to-blue-50/50 border-blue-200">
              <CardContent className="pt-6 space-y-2">
                <p className="text-sm font-semibold text-muted-foreground">Delivered</p>
                <p className="text-3xl font-bold text-blue-600">{deliveredOrders}</p>
              </CardContent>
            </Card>
          </div>

          {/* Orders List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ordersData.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-lg text-foreground">{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.customer}</p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        <span className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 py-3 border-y">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">Device</p>
                        <p className="font-semibold text-foreground">{order.device}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">Quantity</p>
                        <p className="font-semibold text-foreground">{order.quantity} units</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">Amount</p>
                        <p className="font-bold text-primary">{order.amount}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">Delivery</p>
                        <p className="font-semibold text-foreground">{order.deliveryDate}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                        Update Status
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
