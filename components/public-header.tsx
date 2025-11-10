"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
              S
            </div>
            <span className="text-xl font-bold text-primary hidden sm:inline">SakshamSetu</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/services" className="text-foreground hover:text-primary transition-colors">
              Services
            </Link>
            <Link href="/faq" className="text-foreground hover:text-primary transition-colors">
              FAQ
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button
                variant="outline"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
              >
                Login
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-muted"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <Link href="/" className="block px-3 py-2 rounded-md text-foreground hover:bg-muted">
              Home
            </Link>
            <Link href="/about" className="block px-3 py-2 rounded-md text-foreground hover:bg-muted">
              About
            </Link>
            <Link href="/services" className="block px-3 py-2 rounded-md text-foreground hover:bg-muted">
              Services
            </Link>
            <Link href="/faq" className="block px-3 py-2 rounded-md text-foreground hover:bg-muted">
              FAQ
            </Link>
            <Link href="/contact" className="block px-3 py-2 rounded-md text-foreground hover:bg-muted">
              Contact
            </Link>
            <div className="flex gap-2 pt-4">
              <Link href="/login" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  Login
                </Button>
              </Link>
              <Link href="/login" className="flex-1">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
