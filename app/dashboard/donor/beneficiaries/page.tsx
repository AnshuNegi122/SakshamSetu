"use client"

import { useState, useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiGet, apiPost, apiPatch } from "@/lib/api"
import { getUser } from "@/lib/auth"
import { Spinner } from "@/components/ui/spinner"
import Link from "next/link"

interface Beneficiary {
  _id: string
  name: string
  location: string
  disabilityType?: string
  udidVerified: boolean
  aid?: string
  requestId?: string
  supportId?: string
  status?: string
  amount?: number
  deliveredAt?: Date | string
  createdAt?: Date | string
}

export default function BeneficiariesList() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("All")
  const [selectedAid, setSelectedAid] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([])
  const [loading, setLoading] = useState(false)
  const [supporting, setSupporting] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = getUser()
    setUser(currentUser)
    fetchSupportedBeneficiaries()
  }, [])

  const fetchSupportedBeneficiaries = async () => {
    setLoading(true)
    try {
      // Fetch supported beneficiaries (PwDs the donor is helping)
      const supportedResponse = await apiGet<{
        success: boolean
        data: { beneficiaries: any[] }
      }>("/donor/beneficiaries/supported")

      if (supportedResponse.success && supportedResponse.data.beneficiaries) {
        // Format supported beneficiaries
        const formatted = supportedResponse.data.beneficiaries.map((b: any) => ({
          _id: b._id || b.supportId,
          name: b.name,
          location: b.location,
          disabilityType: b.disabilityType,
          udidVerified: b.udidVerified || false,
          aid: b.aid || "Not specified",
          requestId: b.requestId,
          supportId: b.supportId,
          status: b.status,
          amount: b.amount,
          deliveredAt: b.deliveredAt,
          createdAt: b.createdAt,
        }))
        setBeneficiaries(formatted)
      } else {
        // If no supported beneficiaries, try to fetch all verified (for initial state)
        const allResponse = await apiGet<{
          success: boolean
          data: { beneficiaries: Beneficiary[] }
        }>("/donor/beneficiaries")
        if (allResponse.success && allResponse.data.beneficiaries) {
          setBeneficiaries(allResponse.data.beneficiaries)
        }
      }
    } catch (error: any) {
      toast({
        title: "Failed to fetch beneficiaries",
        description: error.message || "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const regions = ["All", ...new Set(beneficiaries.map((b) => b.location))]
  const aidTypes = ["All", ...new Set(beneficiaries.map((b) => b.aid).filter(Boolean))]
  const itemsPerPage = 6

  const filteredBeneficiaries = beneficiaries.filter((b) => {
    const regionMatch = selectedRegion === "All" || b.location === selectedRegion
    const aidMatch = selectedAid === "All" || b.aid === selectedAid
    const searchMatch = b.name.toLowerCase().includes(searchTerm.toLowerCase())
    return regionMatch && aidMatch && searchMatch
  })

  const paginatedBeneficiaries = filteredBeneficiaries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const totalPages = Math.ceil(filteredBeneficiaries.length / itemsPerPage)

  const handleApproveDelivery = async (supportId: string, beneficiaryName: string) => {
    setSupporting(supportId)
    try {
      const response = await apiPatch<{
        success: boolean
        message: string
        data: any
      }>(`/donor/support/${supportId}/approve`, {})

      if (response.success) {
        toast({
          title: "Delivery Approved",
          description: `Delivery marked as Approved for beneficiary ${beneficiaryName}`,
        })
        // Refresh data
        fetchSupportedBeneficiaries()
      }
    } catch (error: any) {
      toast({
        title: "Approval Failed",
        description: error.message || "Failed to approve delivery. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSupporting(null)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <DashboardSidebar role="donor" />
        <div className="flex-1 overflow-auto flex items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar role="donor" />
      <div className="flex-1 overflow-auto">
        <DashboardHeader userName={user?.name || "Verified Beneficiaries"} />

        <main className="p-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Verified Beneficiaries</h1>
            <p className="text-muted-foreground">Support PwDs who need assistance</p>
          </div>

          {/* Search & Filters */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-semibold block mb-2">Region</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => {
                    setSelectedRegion(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  {regions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="text-sm font-semibold block mb-2">Aid Type</label>
                <select
                  value={selectedAid}
                  onChange={(e) => {
                    setSelectedAid(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  {aidTypes.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Beneficiaries Grid */}
          {paginatedBeneficiaries.length === 0 ? (
            <Card>
              <CardContent className="pt-12 text-center">
                <p className="text-muted-foreground">
                  You haven't helped anyone yet. Visit Explore Needs to find PwDs who need assistance and purchase a plan to access verified beneficiaries.
                </p>
                <Link href="/dashboard/donor/explore">
                  <Button className="mt-4">Explore Needs</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedBeneficiaries.map((beneficiary: any) => {
                  const initials = beneficiary.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                    .substring(0, 2)
                  const isDelivered = beneficiary.status === "Delivered" || beneficiary.deliveredAt
                  return (
                    <Card key={beneficiary._id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-2xl font-bold text-primary">{initials}</span>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            {beneficiary.udidVerified && (
                              <div className="flex items-center gap-1 text-primary">
                                <CheckCircle className="h-5 w-5" />
                                <span className="text-xs font-semibold">Verified</span>
                              </div>
                            )}
                            {isDelivered && (
                              <div className="flex items-center gap-1 text-green-600">
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-xs font-semibold">Delivered</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Name</p>
                            <p className="font-semibold">{beneficiary.name}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Region</p>
                            <p className="font-semibold">{beneficiary.location}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Aid Needed</p>
                            <p className="font-semibold">{beneficiary.aid}</p>
                          </div>
                          {beneficiary.disabilityType && (
                            <div>
                              <p className="text-xs text-muted-foreground">Disability Type</p>
                              <p className="font-semibold">{beneficiary.disabilityType}</p>
                            </div>
                          )}
                          {beneficiary.status && (
                            <div>
                              <p className="text-xs text-muted-foreground">Status</p>
                              <p className="font-semibold capitalize">{beneficiary.status}</p>
                            </div>
                          )}
                        </div>

                        {isDelivered ? (
                          <Button className="w-full bg-green-600 hover:bg-green-700" disabled>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Delivered
                          </Button>
                        ) : beneficiary.supportId ? (
                          <Button
                            onClick={() => handleApproveDelivery(beneficiary.supportId, beneficiary.name)}
                            className="w-full bg-[#FF5E4B] hover:bg-[#FF5E4B]/90 text-white"
                            disabled={supporting === beneficiary.supportId}
                          >
                            {supporting === beneficiary.supportId ? (
                              <>
                                <Spinner className="mr-2 h-4 w-4" />
                                Approving...
                              </>
                            ) : (
                              "Approve Delivery"
                            )}
                          </Button>
                        ) : (
                          <Button className="w-full bg-muted" disabled>
                            No Action Available
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <Button
                        key={i + 1}
                        variant={currentPage === i + 1 ? "default" : "outline"}
                        onClick={() => setCurrentPage(i + 1)}
                        className={currentPage === i + 1 ? "bg-primary" : ""}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
