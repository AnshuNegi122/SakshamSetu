"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun, Contrast as Contrast2 } from "lucide-react"
import { useState, useEffect } from "react"

export function ThemeToggle() {
  const [mode, setMode] = useState<"light" | "dark" | "high-contrast">("light")

  useEffect(() => {
    const saved = localStorage.getItem("theme-mode") as "light" | "dark" | "high-contrast" | null
    if (saved) setMode(saved)
  }, [])

  const toggleMode = () => {
    const modes: ("light" | "dark" | "high-contrast")[] = ["light", "dark", "high-contrast"]
    const current = modes.indexOf(mode)
    const next = modes[(current + 1) % modes.length]
    setMode(next)
    localStorage.setItem("theme-mode", next)

    document.documentElement.classList.toggle("dark", next !== "light")
    document.documentElement.classList.toggle("high-contrast", next === "high-contrast")
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleMode}
      className="rounded-full bg-transparent"
      aria-label="Toggle theme"
    >
      {mode === "light" && <Sun className="h-4 w-4" />}
      {mode === "dark" && <Moon className="h-4 w-4" />}
      {mode === "high-contrast" && <Contrast2 className="h-4 w-4" />}
    </Button>
  )
}
