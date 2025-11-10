"use client"

import { useState, useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, XCircle, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiGet, apiPatch } from "@/lib/api"
import { getUser } from "@/lib/auth"
import { Spinner } from "@/components/ui/spinner"

interface User {
  _id: string
  name: string
  email: string
  role: string
  location: string
  disabilityType?: string
  udidNumber?: string
  udidVerified: boolean
  isActive: boolean
  createdAt: string
}

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [pwdUsers, setPwdUsers] = useState<User[]>([])
  const [donorUsers, setDonorUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [approving, setApproving] = useState<string | null>(null)
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = getUser()
    setUser(currentUser)
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const [pwdResponse, donorResponse] = await Promise.all([
        apiGet<{
          success: boolean
          data: { users: User[] }
        }>("/admin/users?role=PwD"),
        apiGet<{
          success: boolean
          data: { users: User[] }
        }>("/admin/users?role=Donor"),
      ])

      if (pwdResponse.success && pwdResponse.data.users) {
        setPwdUsers(pwdResponse.data.users)
      }
      if (donorResponse.success && donorResponse.data.users) {
        setDonorUsers(donorResponse.data.users)
      }
    } catch (error: any) {
      toast({
        title: "Failed to fetch users",
        description: error.message || "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyUDID = async (userId: string, userName: string) => {
    setApproving(userId)
    try {
      const response = await apiPatch<{
        success: boolean
        message: string
        data: { user: User }
      }>(`/admin/users/${userId}/approve`, {})

      if (response.success) {
        toast({
          title: "Success",
          description: `UDID Verified Successfully for ${userName}`,
        })
        // Refresh users
        fetchUsers()
      }
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Failed to verify UDID. Please try again.",
        variant: "destructive",
      })
    } finally {
      setApproving(null)
    }
  }

  const filterUsers = (users: User[]) =>
    users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )

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
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Manage and verify all platform users</p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="pwd" className="space-y-6">
            <TabsList>
              <TabsTrigger value="pwd">PwD Users</TabsTrigger>
              <TabsTrigger value="csr">CSR/Donor Users</TabsTrigger>
            </TabsList>

            {/* PwD Users Tab */}
            <TabsContent value="pwd">
              <Card>
                <CardHeader>
                  <CardTitle>Persons with Disabilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>UDID Verified</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filterUsers(pwdUsers).map((user) => (
                          <TableRow key={user._id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.location}</TableCell>
                            <TableCell>
                              {user.udidVerified ? (
                                <div className="flex items-center gap-1">
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                  <span>Verified</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <XCircle className="h-4 w-4 text-red-600" />
                                  <span>Not Verified</span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.isActive ? "default" : "secondary"}>
                                {user.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell className="space-x-2">
                              {!user.udidVerified && user.udidNumber && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleVerifyUDID(user._id, user.name)}
                                  disabled={approving === user._id}
                                >
                                  {approving === user._id ? (
                                    <>
                                      <Spinner className="mr-2 h-4 w-4" />
                                      Verifying...
                                    </>
                                  ) : (
                                    "Verify UDID"
                                  )}
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* CSR Donors Tab */}
            <TabsContent value="csr">
              <Card>
                <CardHeader>
                  <CardTitle>CSR/Donor Organizations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Organization Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filterUsers(donorUsers).map((user) => (
                          <TableRow key={user._id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.location}</TableCell>
                            <TableCell>
                              <Badge variant={user.isActive ? "default" : "secondary"}>
                                {user.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
