"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Edit, Plus } from "lucide-react"
import { useState } from "react"

const initialProducts: Array<{
  id: number
  name: string
  category: string
  stock: number
  price: string
  supplier: string
}> = []

export default function SupplierDashboard() {
  const [products, setProducts] = useState(initialProducts)
  const [showForm, setShowForm] = useState(false)

  const handleDelete = (id: number) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar role="supplier" />
      <div className="flex-1 overflow-auto">
        <DashboardHeader userName="User" />

        <main className="p-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">My Products</h2>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              onClick={() => setShowForm(!showForm)}
            >
              <Plus className="h-4 w-4" />
              Add New Product
            </Button>
          </div>

          {/* Products Table */}
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Image</th>
                      <th className="text-left py-3 px-4 font-semibold">Products Table</th>
                      <th className="text-left py-3 px-4 font-semibold">Category</th>
                      <th className="text-left py-3 px-4 font-semibold">Stock</th>
                      <th className="text-left py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-muted/50">
                        <td className="py-4 px-4">
                          <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">📦</div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-semibold text-foreground">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.supplier}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">{product.category}</td>
                        <td className="py-4 px-4 font-semibold">{product.price}</td>
                        <td className="py-4 px-4 flex gap-2">
                          <Button variant="outline" size="sm" className="text-primary bg-transparent">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive bg-transparent"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Add Product Form */}
          {showForm && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Product</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input placeholder="Product Name" />
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wheelchair">Wheelchair</SelectItem>
                      <SelectItem value="hearing-aid">Hearing Aid</SelectItem>
                      <SelectItem value="walker">Walker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Input placeholder="Description" />

                <div className="grid md:grid-cols-2 gap-4">
                  <Input placeholder="Stock" type="number" />
                  <Input placeholder="Price" type="number" />
                </div>

                <Input placeholder="Upload Image" type="file" />

                <div className="flex gap-4 justify-end">
                  <Button variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Submit Product</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
