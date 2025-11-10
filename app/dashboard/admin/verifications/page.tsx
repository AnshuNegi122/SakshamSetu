"use client"

import { useState, useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { apiGet, apiPatch } from "@/lib/api"
import { getUser } from "@/lib/auth"
import { Spinner } from "@/components/ui/spinner"
import { CheckCircle, XCircle, Clock, FileText, Eye } from "lucide-react"

interface VerificationUser {
  _id: string
  name: string
  email: string
  location: string
  disabilityType?: string
  udidNumber?: string
  verificationDoc?: string
  verificationStatus: string
  createdAt: string
}

export default function VerificationsPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState<VerificationUser[]>([])
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const userData = getUser()
    setCurrentUser(userData)
    fetchVerifications()
  }, [])

  const fetchVerifications = async () => {
    setLoading(true)
    try {
      const response = await apiGet<{
        success: boolean
        data: { users: VerificationUser[] }
      }>("/admin/verifications")
      if (response.success && response.data.users) {
        setUsers(response.data.users)
      }
    } catch (error: any) {
      toast({
        title: "Failed to fetch verifications",
        description: error.message || "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (userId: string, userName: string) => {
    setProcessing(userId)
    try {
      const response = await apiPatch<{
        success: boolean
        message: string
        data: { user: VerificationUser }
      }>(`/admin/verifications/${userId}/approve`, {})

      if (response.success) {
        toast({
          title: "Verification Approved",
          description: `${userName}'s verification has been approved.`,
        })
        // Refresh list
        fetchVerifications()
      }
    } catch (error: any) {
      toast({
        title: "Approval Failed",
        description: error.message || "Failed to approve verification. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (userId: string, userName: string) => {
    setProcessing(userId)
    try {
      const response = await apiPatch<{
        success: boolean
        message: string
        data: { user: VerificationUser }
      }>(`/admin/verifications/${userId}/reject`, {})

      if (response.success) {
        toast({
          title: "Verification Rejected",
          description: `${userName}'s verification has been rejected.`,
        })
        // Refresh list
        fetchVerifications()
      }
    } catch (error: any) {
      toast({
        title: "Rejection Failed",
        description: error.message || "Failed to reject verification. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessing(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case 'Rejected':
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      case 'Pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getDocumentUrl = (filename: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
    const baseUrl = apiUrl.replace('/api', '')
    return `${baseUrl}/uploads/${filename}`
  }

  // Filter users by status
  const pendingUsers = users.filter((u) => u.verificationStatus === 'Pending')
  const approvedUsers = users.filter((u) => u.verificationStatus === 'Approved')
  const rejectedUsers = users.filter((u) => u.verificationStatus === 'Rejected')

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
        <DashboardHeader userName={currentUser?.name || "Admin"} />

        <main className="p-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold">PwD Verifications</h1>
            <p className="text-muted-foreground">Review and approve verification documents</p>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Pending</p>
                    <p className="text-3xl font-bold text-yellow-600">{pendingUsers.length}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600/30" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Approved</p>
                    <p className="text-3xl font-bold text-green-600">{approvedUsers.length}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600/30" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Rejected</p>
                    <p className="text-3xl font-bold text-red-600">{rejectedUsers.length}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-600/30" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Verifications Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Verifications</CardTitle>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No verification documents found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Disability Type</TableHead>
                        <TableHead>UDID Number</TableHead>
                        <TableHead>Document</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.location}</TableCell>
                          <TableCell>{user.disabilityType || "N/A"}</TableCell>
                          <TableCell>{user.udidNumber || "N/A"}</TableCell>
                          <TableCell>
                            {user.verificationDoc ? (
                              <a
                                href={getDocumentUrl(user.verificationDoc)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-primary hover:underline"
                              >
                                <FileText className="h-4 w-4" />
                                <Eye className="h-4 w-4" />
                                View
                              </a>
                            ) : (
                              <span className="text-muted-foreground">No document</span>
                            )}
                          </TableCell>
                          <TableCell>{getStatusBadge(user.verificationStatus)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {user.verificationStatus === 'Pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleApprove(user._id, user.name)}
                                    disabled={processing === user._id}
                                  >
                                    {processing === user._id ? (
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
                                    onClick={() => handleReject(user._id, user.name)}
                                    disabled={processing === user._id}
                                  >
                                    {processing === user._id ? (
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
                              {user.verificationStatus !== 'Pending' && (
                                <span className="text-xs text-muted-foreground">
                                  {user.verificationStatus === 'Approved' ? 'Verified' : 'Rejected'}
                                </span>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

