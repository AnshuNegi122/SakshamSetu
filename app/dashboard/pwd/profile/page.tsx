"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { apiGet, apiPost } from "@/lib/api"
import { getUser } from "@/lib/auth"
import { Spinner } from "@/components/ui/spinner"
import { CheckCircle, XCircle, Clock, Upload, FileText } from "lucide-react"

export default function ProfilePage() {
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const userData = getUser()
    setCurrentUser(userData)
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    setLoading(true)
    try {
      const response = await apiGet<{
        success: boolean
        data: { user: any }
      }>("/auth/me")
      if (response.success && response.data.user) {
        setUser(response.data.user)
      }
    } catch (error: any) {
      toast({
        title: "Failed to load profile",
        description: error.message || "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a JPG, PNG, or PDF file.",
          variant: "destructive",
        })
        return
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "File size must be less than 5MB.",
          variant: "destructive",
        })
        return
      }
      setSelectedFile(file)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await apiPost<{
        success: boolean
        message: string
        data: any
      }>("/pwd/upload-doc", formData)

      if (response.success) {
        toast({
          title: "Document Uploaded Successfully!",
          description: "Awaiting admin verification.",
        })
        setSelectedFile(null)
        // Reset file input
        const fileInput = document.getElementById('file-input') as HTMLInputElement
        if (fileInput) fileInput.value = ''
        // Refresh user profile
        fetchUserProfile()
      }
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
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
            Pending Verification
          </Badge>
        )
      default:
        return null
    }
  }

  const getDocumentUrl = (filename: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
    const baseUrl = apiUrl.replace('/api', '')
    return `${baseUrl}/uploads/${filename}`
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <DashboardSidebar role="pwd" />
        <div className="flex-1 overflow-auto flex items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar role="pwd" />
      <div className="flex-1 overflow-auto">
        <DashboardHeader userName={user?.name || currentUser?.name || "User"} />

        <main className="p-8 max-w-4xl">
          <h1 className="text-3xl font-bold text-foreground mb-8">My Profile</h1>

          {/* Profile Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Name</label>
                  <p className="text-lg font-semibold">{user?.name || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                  <p className="text-lg">{user?.email || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Location</label>
                  <p className="text-lg">{user?.location || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Disability Type</label>
                  <p className="text-lg">{user?.disabilityType || "Not specified"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">UDID Number</label>
                  <p className="text-lg">{user?.udidNumber || "Not provided"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">UDID Verified</label>
                  <div className="flex items-center gap-2">
                    {user?.udidVerified ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Not Verified</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Verification Document</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status Display */}
              {user?.verificationStatus && (
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Verification Status</p>
                    <div>{getStatusBadge(user.verificationStatus)}</div>
                  </div>
                  {user.verificationDoc && (
                    <a
                      href={getDocumentUrl(user.verificationDoc)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <FileText className="h-4 w-4" />
                      View Document
                    </a>
                  )}
                </div>
              )}

              {/* Upload Form */}
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Upload Verification Document
                  </label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Upload UDID card, medical certificate, or other proof (JPG, PNG, PDF - Max 5MB)
                  </p>
                  <input
                    id="file-input"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
                    disabled={uploading}
                  />
                  {selectedFile && (
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={uploading || !selectedFile}
                >
                  {uploading ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Document
                    </>
                  )}
                </Button>
              </form>

              {/* Help Text */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>Note:</strong> After uploading your document, it will be reviewed by an admin. You'll be
                  notified once the verification is complete.
                </p>
              </div>

              {!user?.udidNumber && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                  <p className="text-sm text-yellow-900 dark:text-yellow-100 mb-2">
                    <strong>Don't have a UDID?</strong>
                  </p>
                  <Link href="/knowledge-hub">
                    <Button variant="link" className="text-primary p-0 h-auto">
                      Apply for UDID →
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
