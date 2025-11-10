"use client"

import { useState, useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiGet, apiPatch } from "@/lib/api"
import { getUser } from "@/lib/auth"
import { Spinner } from "@/components/ui/spinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PwDRequest {
  _id: string
  requestedBy: {
    _id: string
    name: string
    email: string
    location: string
    disabilityType?: string
    udidNumber?: string
    udidVerified: boolean
  }
  deviceType: string
  aidName: string
  status: string
  description?: string
  priority?: string
  region?: string
  createdAt: string
  deliveredAt?: string
  verifiedAt?: string
}

export default function RequestMonitoring() {
  const [selectedRequest, setSelectedRequest] = useState<PwDRequest | null>(null)
  const [requests, setRequests] = useState<PwDRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState<string | null>(null)
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [statusFilter, setStatusFilter] = useState<string>("Pending") // Default to show only Pending

  useEffect(() => {
    const currentUser = getUser()
    setUser(currentUser)
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const response = await apiGet<{
        success: boolean
        data: { requests: PwDRequest[] }
      }>("/admin/requests")
      if (response.success && response.data.requests) {
        setRequests(response.data.requests)
      }
    } catch (error: any) {
      toast({
        title: "Failed to fetch requests",
        description: error.message || "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (requestId: string, newStatus: string) => {
    setUpdating(requestId)
    try {
      const response = await apiPatch<{
        success: boolean
        message: string
        data: { request: PwDRequest }
      }>(`/admin/requests/${requestId}/status`, {
        status: newStatus,
      })

      if (response.success) {
        toast({
          title: "Status Updated",
          description: `Request ${requestId.slice(-8)} status changed to ${newStatus}`,
        })
        setSelectedRequest(null)
        // Refresh requests
        fetchRequests()
      }
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUpdating(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "secondary"
      case "Approved":
        return "default"
      case "Delivered":
        return "default"
      case "Verified":
        return "default"
      case "Rejected":
        return "destructive"
      default:
        return "outline"
    }
  }

  // Filter requests by status - default to show only Pending
  const filteredRequests = statusFilter === "All" 
    ? requests 
    : requests.filter((req) => req.status === statusFilter)

  // Quick approve handler
  const handleApprove = async (requestId: string) => {
    await handleStatusUpdate(requestId, "Approved")
  }

  // Quick reject handler
  const handleReject = async (requestId: string) => {
    await handleStatusUpdate(requestId, "Rejected")
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <DashboardSidebar role="admin" />
        <div className="flex-1 overflow-auto flex items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar role="admin" />
      <div className="flex-1 overflow-auto">
        <DashboardHeader userName={user?.name || "Admin"} />

        <main className="p-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Request Monitoring</h1>
            <p className="text-muted-foreground">Track and manage PwD assistance requests</p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {statusFilter === "All" ? "All Requests" : `${statusFilter} Requests`}
                </CardTitle>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="InProgress">In Progress</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Verified">Verified</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="All">All Requests</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>PwD Name</TableHead>
                      <TableHead>Device Type</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          No {statusFilter === "All" ? "" : statusFilter.toLowerCase()} requests found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRequests.map((request) => (
                        <TableRow key={request._id}>
                          <TableCell className="font-mono text-sm">{request._id.slice(-8)}</TableCell>
                          <TableCell>{request.requestedBy.name}</TableCell>
                          <TableCell>{request.aidName}</TableCell>
                          <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(request.status)}>{request.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {request.status === "Pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleApprove(request._id)}
                                    disabled={updating === request._id}
                                  >
                                    {updating === request._id ? (
                                      <Spinner className="h-4 w-4" />
                                    ) : (
                                      <>
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        Approve
                                      </>
                                    )}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleReject(request._id)}
                                    disabled={updating === request._id}
                                  >
                                    {updating === request._id ? (
                                      <Spinner className="h-4 w-4" />
                                    ) : (
                                      <>
                                        <XCircle className="h-4 w-4 mr-1" />
                                        Reject
                                      </>
                                    )}
                                  </Button>
                                </>
                              )}
                              <Button size="sm" variant="outline" onClick={() => setSelectedRequest(request)}>
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Details Dialog */}
          <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Request Details - {selectedRequest?._id.slice(-8)}</DialogTitle>
              </DialogHeader>
              {selectedRequest && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">PwD Name</p>
                    <p className="font-semibold">{selectedRequest.requestedBy.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold">{selectedRequest.requestedBy.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold">{selectedRequest.requestedBy.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Device Type</p>
                    <p className="font-semibold">{selectedRequest.aidName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Request Date</p>
                    <p className="font-semibold">{new Date(selectedRequest.createdAt).toLocaleDateString()}</p>
                  </div>
                  {selectedRequest.description && (
                    <div>
                      <p className="text-sm text-muted-foreground">Description</p>
                      <p className="font-semibold">{selectedRequest.description}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Current Status</p>
                    <Badge className="mt-1" variant={getStatusColor(selectedRequest.status)}>
                      {selectedRequest.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Update Status</p>
                    <Select
                      value={selectedRequest.status}
                      onValueChange={(value) => handleStatusUpdate(selectedRequest._id, value)}
                      disabled={updating === selectedRequest._id}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="InProgress">In Progress</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Verified">Verified</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    {updating === selectedRequest._id && (
                      <div className="flex items-center gap-2 mt-2">
                        <Spinner className="h-4 w-4" />
                        <span className="text-sm text-muted-foreground">Updating...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}
