"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { KNOWLEDGE_HUB_ARTICLES } from "@/lib/constants"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Scale, Briefcase, Search, Building2, Users, Phone } from "lucide-react"

const iconMap: Record<string, React.ReactNode> = {
  scale: <Scale className="h-8 w-8 text-primary" />,
  briefcase: <Briefcase className="h-8 w-8 text-primary" />,
  search: <Search className="h-8 w-8 text-primary" />,
  building2: <Building2 className="h-8 w-8 text-primary" />,
  users: <Users className="h-8 w-8 text-primary" />,
  phone: <Phone className="h-8 w-8 text-primary" />,
}

export default function KnowledgeHub() {
  const [activeTab, setActiveTab] = useState("All")

  const tabs = ["All", "Rights", "Employment", "Support", "Helplines"]

  const filteredArticles =
    activeTab === "All" ? KNOWLEDGE_HUB_ARTICLES : KNOWLEDGE_HUB_ARTICLES.filter((a) => a.category === activeTab)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">S</div>
            <h1 className="text-xl font-bold text-primary">SakshamSetu</h1>
          </Link>
          <span className="text-sm text-muted-foreground">Knowledge Hub</span>
          <ThemeToggle />
        </div>
      </nav>

      {/* UDID Information Section */}
<div className="space-y-6 p-6 bg-primary/5 rounded-2xl border border-primary/20">
  <h2 className="text-2xl font-bold text-primary">UDID Card – Complete Guide</h2>

  {/* 1️⃣ What is UDID Card */}
  <div>
    <h3 className="text-xl font-semibold mb-2">1️⃣ What Is a UDID Card?</h3>
    <p className="text-muted-foreground">
      The UDID (Unique Disability ID) Card is issued by the Department of Empowerment of Persons with Disabilities
      (DEPwD), Ministry of Social Justice & Empowerment, Govt. of India. It helps persons with disabilities (PwDs)
      access government schemes, subsidies, and disability-friendly services.
    </p>
    <a
      href="https://www.swavlambancard.gov.in"
      target="_blank"
      className="text-primary underline text-sm"
    >
      ✅ Official Source: https://www.swavlambancard.gov.in
    </a>
  </div>

  {/* 2️⃣ Who Can Apply */}
  <div>
    <h3 className="text-xl font-semibold mb-2">2️⃣ Who Can Apply?</h3>
    <p className="text-muted-foreground">
      Any Indian citizen with <strong>40% or more disability</strong> certified by a government medical board.
      It covers all major disabilities such as:
    </p>
    <ul className="list-disc ml-6 text-muted-foreground">
      <li>Hearing disability</li>
      <li>Visual disability</li>
      <li>Locomotor disability</li>
      <li>Autism spectrum disorder</li>
      <li>Multiple disabilities</li>
    </ul>
  </div>

  {/* 3️⃣ How to Apply */}
  <div>
    <h3 className="text-xl font-semibold mb-2">3️⃣ Step-by-Step Guide to Apply for UDID</h3>

    {/* Online Steps */}
    <p className="font-medium">🧾 Online Process (Simple 5 Steps):</p>
    <ol className="list-decimal ml-6 text-muted-foreground">
      <li>Visit <a href="https://www.swavlambancard.gov.in" target="_blank" className="underline text-primary">https://www.swavlambancard.gov.in</a></li>
      <li>Click on <strong>“Apply for Disability Certificate and UDID Card.”</strong></li>
      <li>Fill your details and upload documents:
        <ul className="list-disc ml-6 mt-1">
          <li>Aadhaar Card</li>
          <li>Disability medical certificate (if available)</li>
          <li>Passport-size photo</li>
        </ul>
      </li>
      <li>Submit and wait for district medical authority verification.</li>
      <li>After approval, download the e-UDID or receive it by post.</li>
    </ol>

    <p className="text-muted-foreground mt-2">
      ✅ <strong>Average processing time:</strong> 2–4 weeks.
    </p>

    {/* Offline Option */}
    <p className="font-medium mt-4">🕵️‍♀️ Offline Option:</p>
    <p className="text-muted-foreground">
      If the applicant has no internet access, visit the nearest:
    </p>
    <ul className="list-disc ml-6 text-muted-foreground">
      <li>District Disability Rehabilitation Centre (DDRC)</li>
      <li>Chief Medical Officer (CMO) office</li>
    </ul>
  </div>
</div>
    </div>
  )
}
