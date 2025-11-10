"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/types"
import { NAVIGATION_ITEMS } from "@/lib/constants"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

interface DashboardSidebarProps {
  role: UserRole
}

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const items = NAVIGATION_ITEMS[role]

  return (
    <aside
      className={cn(
        "bg-primary text-primary-foreground flex flex-col transition-all duration-300",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && <h2 className="font-bold text-lg">SakshamSetu</h2>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-primary-foreground/10 rounded"
          aria-label={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "px-4 py-3 rounded-lg transition-colors flex items-center gap-3",
              pathname === item.href ? "bg-primary-foreground/20" : "hover:bg-primary-foreground/10",
            )}
          >
            <span className="w-5 h-5" />
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
