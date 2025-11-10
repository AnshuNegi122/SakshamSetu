"use client"
import { useState, useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Search } from "lucide-react"
import { CheckCircle } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import Link from "next/link"
import { apiGet, apiPost } from "@/lib/api"
import { getUser, getUserRole } from "@/lib/auth"

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

interface PwDRequest {
  _id: string
  deviceType: string
  aidName: string
  status: string
  description?: string
  priority?: string
  region?: string
  createdAt: string
}

const devicesData: Device[] = [
  {
    id: 1,
    name: "Electric Wheelchair",
    category: "Mobility",
    supplier: "Mobility Solutions Ltd",
    price: "₹2,50,000",
    fundingScheme: "ADIP Scheme",
    fundingAmount: "₹1,50,000",
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
    fundingAmount: "₹75,000",
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
    fundingAmount: "Full Coverage",
    description: "AI-powered walking stick for visually impaired individuals",
    features: ["Object Detection", "Voice Guidance", "GPS Navigation", "Emergency Alert"],
    status: "Available",
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

export default function RequestAssistancePage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [priceFilter, setPriceFilter] = useState("All")
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [submittedRequests, setSubmittedRequests] = useState<string[]>([])
  const [myRequests, setMyRequests] = useState<PwDRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingRequests, setLoadingRequests] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = getUser()
    setUser(currentUser)
    
    // Only fetch requests if user has PwD role
    const userRole = getUserRole()
    if (userRole === "PwD") {
      fetchMyRequests()
    } else {
      // If user doesn't have PwD role, don't make the API call
      // This prevents "Access denied" errors
      setLoadingRequests(false)
    }
  }, [])

  const fetchMyRequests = async () => {
    // Double-check role before making API call
    const userRole = getUserRole()
    if (userRole !== "PwD") {
      console.warn("User does not have PwD role, skipping request fetch")
      setLoadingRequests(false)
      return
    }
    
    setLoadingRequests(true)
    try {
      const response = await apiGet<{
        success: boolean
        data: { requests: PwDRequest[] }
      }>("/pwd/request")
      if (response.success && response.data.requests) {
        setMyRequests(response.data.requests)
        // Mark devices as submitted if they match existing requests
        const requestedAids = response.data.requests.map((r) => r.aidName)
        setSubmittedRequests(requestedAids)
      }
    } catch (error: any) {
      // Handle error gracefully - don't show toast for role-based errors
      // as they're expected if user doesn't have the right role
      if (error.message && error.message.includes("Access denied")) {
        console.warn("Access denied: User does not have PwD role")
      } else {
        console.error("Failed to fetch requests:", error)
      }
    } finally {
      setLoadingRequests(false)
    }
  }

  const filteredDevices = devicesData.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.supplier.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "All" || device.category === categoryFilter

    let matchesPrice = true
    if (priceFilter === "Budget") matchesPrice = Number.parseInt(device.price.replace(/₹|,/g, "")) < 50000
    else if (priceFilter === "Mid-range")
      matchesPrice =
        Number.parseInt(device.price.replace(/₹|,/g, "")) >= 50000 &&
        Number.parseInt(device.price.replace(/₹|,/g, "")) < 200000
    else if (priceFilter === "Premium") matchesPrice = Number.parseInt(device.price.replace(/₹|,/g, "")) >= 200000

    return matchesSearch && matchesCategory && matchesPrice
  })

  const handleRequestDevice = (device: Device) => {
    setSelectedDevice(device)
    setShowConfirmModal(true)
  }

  const confirmRequest = async () => {
    if (!selectedDevice) return

    setLoading(true)
    try {
      const response = await apiPost<{
        success: boolean
        message: string
        data: { request: PwDRequest }
      }>("/pwd/request", {
        deviceType: selectedDevice.category,
        aidName: selectedDevice.name,
        description: selectedDevice.description,
        priority: "Medium",
        region: user?.location || "Not specified",
      })

      if (response.success) {
        toast({
          title: "Request Submitted",
          description: `Request for ${selectedDevice.name} has been submitted for admin verification.`,
        })
        setSubmittedRequests([...submittedRequests, selectedDevice.name])
        setShowConfirmModal(false)
        setSelectedDevice(null)
        // Refresh requests list
        fetchMyRequests()
      }
    } catch (error: any) {
      toast({
        title: "Request Failed",
        description: error.message || "Failed to submit request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar role="pwd" />
      <div className="flex-1 overflow-auto">
        <DashboardHeader userName={user?.name || "User"} />

        <main className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Request Assistance</h1>
              <p className="text-muted-foreground mt-2">Browse assistive devices and submit your request</p>
            </div>
            <Link href="/dashboard/pwd/status">
              <Button variant="outline">View My Requests</Button>
            </Link>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search devices by name or supplier..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Device Type</label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
                    >
                      <option>All</option>
                      <option>Mobility</option>
                      <option>Hearing</option>
                      <option>Vision</option>
                      <option>Communication</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Price Range</label>
                    <select
                      value={priceFilter}
                      onChange={(e) => setPriceFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
                    >
                      <option>All</option>
                      <option>Budget (Under ₹50,000)</option>
                      <option>Mid-range (₹50,000 - ₹2,00,000)</option>
                      <option>Premium (Over ₹2,00,000)</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredDevices.map((device) => (
              <Card key={device.id} className="hover:shadow-lg transition-shadow flex flex-col">
                <CardContent className="pt-6 space-y-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-4xl mb-2">{device.image}</div>
                      <h3 className="text-lg font-bold text-foreground">{device.name}</h3>
                      <p className="text-sm text-muted-foreground">{device.supplier}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">{device.status}</Badge>
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
                      <span className="text-xs text-muted-foreground">via {device.fundingScheme}</span>
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
                    onClick={() => handleRequestDevice(device)}
                    disabled={submittedRequests.includes(device.name) || loading}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {submittedRequests.includes(device.name) ? "Request Submitted" : "Request Now"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDevices.length === 0 && (
            <Card>
              <CardContent className="pt-12 text-center">
                <p className="text-muted-foreground">No devices found matching your criteria</p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {showConfirmModal && selectedDevice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardContent className="pt-6 space-y-4">
              <h2 className="text-lg font-bold text-foreground">Confirm Request</h2>
              <p className="text-foreground">
                Are you sure you want to request <strong>{selectedDevice.name}</strong> for device assistance?
              </p>
              <div className="bg-primary/10 p-3 rounded-lg">
                <p className="text-sm text-foreground">
                  Your request will be submitted for admin verification. You'll be notified once it's reviewed.
                </p>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => setShowConfirmModal(false)} variant="outline" className="flex-1" disabled={loading}>
                  Cancel
                </Button>
                <Button
                  onClick={confirmRequest}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Submitting...
                    </>
                  ) : (
                    "Confirm Request"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
