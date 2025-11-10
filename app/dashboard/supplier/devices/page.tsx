"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const deviceInventory = [
  { name: "Electric Wheelchair", stock: 45, sold: 230, revenue: "₹57,50,000" },
  { name: "Hearing Aid", stock: 28, sold: 95, revenue: "₹14,25,000" },
  { name: "Walking Stick", stock: 62, sold: 180, revenue: "₹6,30,000" },
  { name: "Orthopaedic Walker", stock: 85, sold: 340, revenue: "₹28,90,000" },
  { name: "Communication Board", stock: 15, sold: 42, revenue: "₹18,90,000" },
]

const chartData = deviceInventory.map((item) => ({
  name: item.name.split(" ")[0],
  stock: item.stock,
  sold: item.sold,
}))

export default function DevicesPage() {
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar role="supplier" />
      <div className="flex-1 overflow-auto">
        <DashboardHeader userName="User" />

        <main className="p-8 space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Device Inventory</h2>
            <p className="text-muted-foreground">Monitor your device stock and sales performance</p>
          </div>

          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Stock vs Sales Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="stock" fill="#00A15D" />
                  <Bar dataKey="sold" fill="#FF5E4B" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Inventory Table */}
          <Card>
            <CardHeader>
              <CardTitle>Device Inventory Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Device Name</th>
                      <th className="text-left py-3 px-4 font-semibold">Current Stock</th>
                      <th className="text-left py-3 px-4 font-semibold">Units Sold</th>
                      <th className="text-left py-3 px-4 font-semibold">Revenue</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deviceInventory.map((device, idx) => (
                      <tr key={idx} className="border-b hover:bg-muted/50">
                        <td className="py-4 px-4 font-semibold">{device.name}</td>
                        <td className="py-4 px-4">{device.stock} units</td>
                        <td className="py-4 px-4">{device.sold} units</td>
                        <td className="py-4 px-4 font-semibold">{device.revenue}</td>
                        <td className="py-4 px-4">
                          <Badge
                            className={
                              device.stock > 50
                                ? "bg-green-100 text-green-800"
                                : device.stock > 20
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {device.stock > 50 ? "In Stock" : device.stock > 20 ? "Low Stock" : "Critical"}
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
