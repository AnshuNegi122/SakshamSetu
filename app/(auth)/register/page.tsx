"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ROLES, DISABILITY_TYPES } from "@/lib/constants"
import { useRouter } from "next/navigation"
import { apiPost } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Spinner } from "@/components/ui/spinner"

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [role, setRole] = useState("pwd")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    disabilityType: "",
    udidNumber: "",
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Client-side validation
    if (!formData.name || formData.name.trim().length < 2) {
      toast({
        title: "Invalid Name",
        description: "Name must be at least 2 characters long.",
        variant: "destructive",
      })
      return
    }

    if (!formData.email || !formData.email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      })
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    if (!formData.location || formData.location.trim().length < 2) {
      toast({
        title: "Location Required",
        description: "Please enter your location.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Map frontend role to backend role
      const backendRole = role === "pwd" ? "PwD" : role === "donor" ? "Donor" : "Admin"
      
      // Prepare registration data
      const registerData: any = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: backendRole,
        location: formData.location.trim(),
        consent: true,
      }

      // Add PwD specific fields (optional)
      if (role === "pwd") {
        // Only include disabilityType if a value is selected (not empty string)
        if (formData.disabilityType && formData.disabilityType.trim() && formData.disabilityType !== "") {
          registerData.disabilityType = formData.disabilityType.trim()
        }
        if (formData.udidNumber && formData.udidNumber.trim()) {
          registerData.udidNumber = formData.udidNumber.trim()
        }
      }

      console.log("Registering user with data:", { ...registerData, password: "***" })

      // Call API
      const response = await apiPost<{
        success: boolean
        message: string
        data?: {
          user: any
          accessToken?: string
          refreshToken?: string
        }
      }>("/auth/register", registerData)

      if (response.success) {
        toast({
          title: "Registration Successful!",
          description: "Your account has been created. Please log in.",
        })
        
        // Redirect to login after a short delay
        setTimeout(() => {
          router.push("/login")
        }, 1500)
      } else {
        throw new Error(response.message || "Registration failed")
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      
      // Extract error message
      let errorMessage = "Failed to create account. Please try again."
      
      if (error.message) {
        errorMessage = error.message
      } else if (error.data?.message) {
        errorMessage = error.data.message
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const validationErrors = error.response.data.errors
        if (Array.isArray(validationErrors) && validationErrors.length > 0) {
          errorMessage = validationErrors.map((e: any) => `${e.path?.join('.')}: ${e.message}`).join(', ')
        }
      }

      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center p-4">
      {/* Navigation */}
      <div className="absolute top-0 left-0 right-0 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">S</div>
            <h1 className="text-2xl font-bold text-primary">SakshamSetu</h1>
          </Link>
          <Link href="/">
            <Button variant="ghost">Back Home</Button>
          </Link>
        </div>
      </div>

      <Card className="shadow-xl max-w-md w-full mt-20">
        <CardHeader className="text-center pb-6">
          <h2 className="text-3xl font-bold text-foreground mb-2">Create Account</h2>
          <p className="text-muted-foreground">Join us today</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Role Selector */}
            <div>
              <label className="text-sm font-medium mb-2 block">Select Role</label>
              <Select value={role} onValueChange={setRole} disabled={loading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Input
              type="text"
              placeholder="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              minLength={2}
            />

            <Input
              type="email"
              placeholder="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <Input
              type="text"
              placeholder="Location (City, State)"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              disabled={loading}
              minLength={2}
            />

            {role === "pwd" && (
              <>
                <div>
                  <label className="text-sm font-medium mb-2 block">Disability Type (optional)</label>
                  <Select
                    value={formData.disabilityType || undefined}
                    onValueChange={(value) => handleSelectChange("disabilityType", value === "none" ? "" : value)}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select disability type (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None / Prefer not to say</SelectItem>
                      {DISABILITY_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  type="text"
                  placeholder="UDID Number (optional)"
                  name="udidNumber"
                  value={formData.udidNumber}
                  onChange={handleChange}
                  disabled={loading}
                />
              </>
            )}

            <Input
              type="password"
              placeholder="Password (min. 6 characters)"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              minLength={6}
            />

            <Input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
              minLength={6}
            />

            <Button 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90" 
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </Button>

            <p className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-accent font-semibold hover:underline">
                Log In
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
