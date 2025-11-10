"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Bell, Settings, ShoppingCart, User, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { clearTokens, getUser } from "@/lib/auth"
import { apiPost } from "@/lib/api"
import { useEffect, useState } from "react"

interface DashboardHeaderProps {
  userName?: string
  userAvatar?: string
}

export function DashboardHeader({ userName = "User", userAvatar }: DashboardHeaderProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const user = getUser()
    setCurrentUser(user)
  }, [])

  const handleLogout = async () => {
    try {
      // Optionally call logout endpoint
      await apiPost("/auth/logout").catch(() => {
        // Ignore errors from logout endpoint
      })
    } catch (error) {
      // Ignore errors
    } finally {
      // Clear tokens and redirect
      clearTokens()
      toast({
        title: "Logged out successfully",
        description: "You have been logged out.",
      })
      router.push("/login")
    }
  }

  return (
    <header className="bg-primary text-primary-foreground px-8 py-4 flex items-center justify-between">
      <div className="flex-1">
        <h2 className="text-lg font-semibold">
          Welcome, {currentUser?.name || userName}
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
          <ShoppingCart className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
          <Settings className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
          <User className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-primary-foreground hover:bg-primary-foreground/10"
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </Button>
        <ThemeToggle />
      </div>
    </header>
  )
}
