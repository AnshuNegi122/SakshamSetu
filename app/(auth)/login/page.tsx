"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Accessibility } from "lucide-react"
import { useRouter } from "next/navigation"
import { apiPost } from "@/lib/api"
import { saveTokens, saveUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { Spinner } from "@/components/ui/spinner"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await apiPost<{
        success: boolean
        message: string
        data: {
          user: any
          accessToken: string
          refreshToken: string
        }
      }>("/auth/login", {
        email,
        password,
      })

      if (response.success && response.data) {
        // Save tokens and user data
        saveTokens(response.data.accessToken, response.data.refreshToken)
        saveUser(response.data.user)

        toast({
          title: "Login Successful",
          description: "Welcome back!",
        })

        // Redirect based on user role from backend
        const userRole = response.data.user.role?.toLowerCase()
        if (userRole === "pwd") router.push("/dashboard/pwd")
        else if (userRole === "donor") router.push("/dashboard/donor")
        else if (userRole === "admin") router.push("/dashboard/admin")
        else router.push("/dashboard/pwd")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      
      // Handle specific error cases
      const status = error.response?.status || error.status
      
      if (status === 401 || status === 404) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Login Failed",
          description: error.message || "Something went wrong. Please try again.",
          variant: "destructive",
        })
      }
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

      <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl w-full mt-20">
        {/* Illustration */}
        <div className="hidden md:flex flex-col gap-6">
          <div className="bg-primary/10 rounded-2xl h-80 flex flex-col items-center justify-center gap-4">
            <Accessibility className="h-24 w-24 text-primary" />
            <p className="text-primary font-semibold text-center">Join the movement</p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-6">
            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome Back!</h2>
            <p className="text-muted-foreground">Please enter your details to get started</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="text-sm font-medium mb-2 block">Email Address</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="text-sm font-medium mb-2 block">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* Login Button */}
              <Button 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-6" 
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Logging in...
                  </>
                ) : (
                  "Log In"
                )}
              </Button>

              {/* Register Link */}
              <p className="text-center text-sm">
                Don't have an account?{" "}
                <Link href="/register" className="text-accent font-semibold hover:underline">
                  Register Now
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
