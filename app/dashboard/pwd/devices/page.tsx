"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, CheckCircle } from "lucide-react"

interface Device {
  id: number
  name: string
  category: string
  supplier: string
  price: string
  fundingScheme: string
  fundingAmount: string
  description: string
  features: string[]
  status: string
  image: string
}

const devicesData = [
  {
    id: 1,
    name: "Electric Wheelchair",
    category: "Mobility",
    supplier: "Mobility Solutions Ltd",
    price: "₹2,50,000",
    fundingScheme: "ADIP Scheme",
    fundingAmount: "₹15,000",
    description: "Fully automatic electric wheelchair with joystick control",
    features: ["USB Charging", "40km Range", "Lightweight (45kg)", "Terrain Adaptive"],
    status: "Available",
    image: "🦽",
  },
  {
    id: 2,
    name: "Smart Hearing Aid",
    category: "Hearing",
    supplier: "AudioTech India",
    price: "₹1,50,000",
    fundingScheme: "Government Hearing Loss Program",
    fundingAmount: "Partial Subsidy",
    description: "AI-powered hearing aid with noise cancellation",
    features: ["AI Noise Cancellation", "Bluetooth Connected", "12-Hour Battery", "Water Resistant"],
    status: "Available",
    image: "🎧",
  },
  {
    id: 3,
    name: "Smart Walking Stick",
    category: "Vision",
    supplier: "Tech Accessibility",
    price: "₹35,000",
    fundingScheme: "Smart Stick Rehabilitation",
    fundingAmount: "Free",
    description: "AI-powered walking stick for visually impaired individuals",
    features: ["Object Detection", "Voice Guidance", "GPS Navigation", "Emergency Alert"],
    status: "Out of Stock",
    image: "🦯",
  },
  {
    id: 4,
    name: "Orthopaedic Walker",
    category: "Mobility",
    supplier: "Care Devices",
    price: "₹8,500",
    fundingScheme: "ADIP Scheme",
    fundingAmount: "₹8,500",
    description: "Lightweight aluminum walker with adjustable height",
    features: ["Foldable Design", "Anti-slip Feet", "Height Adjustable", "Lightweight"],
    status: "Available",
    image: "🚶",
  },
  {
    id: 5,
    name: "Communication Board",
    category: "Communication",
    supplier: "Speech Tech Solutions",
    price: "₹45,000",
    fundingScheme: "Special Education Fund",
    fundingAmount: "₹30,000",
    description: "AAC (Augmentative and Alternative Communication) device",
    features: ["1000+ Phrases", "Voice Output", "Touch Screen", "Customizable Vocabulary"],
    status: "Available",
    image: "💬",
  },
]

export default function DevicesPage() {
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar role="pwd" />
      <div className="flex-1 overflow-auto">
        <DashboardHeader userName="User" />

        <main className="p-8 space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Available Assistive Devices</h2>
            <p className="text-muted-foreground">Browse and purchase assistive devices with funding support</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {devicesData.map((device) => (
              <Card key={device.id} className="hover:shadow-lg transition-shadow flex flex-col">
                <CardContent className="pt-6 space-y-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-4xl mb-2">{device.image}</div>
                      <h3 className="text-lg font-bold text-foreground">{device.name}</h3>
                      <p className="text-sm text-muted-foreground">{device.supplier}</p>
                    </div>
                    <Badge
                      className={
                        device.status === "Available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }
                    >
                      {device.status}
                    </Badge>
                  </div>

                  <p className="text-sm text-foreground flex-1">{device.description}</p>

                  <div className="space-y-2 py-3 border-y">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-foreground">Price:</span>
                      <span className="text-lg font-bold text-primary">{device.price}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-foreground">Funding:</span>
                      <span className="text-sm font-semibold text-green-600">{device.fundingAmount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">via {device.fundingScheme}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-foreground mb-2">Features:</p>
                    <div className="flex flex-wrap gap-2">
                      {device.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    disabled={device.status === "Out of Stock"}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {device.status === "Available" ? "Purchase Now" : "Out of Stock"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
