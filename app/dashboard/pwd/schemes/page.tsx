"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText } from "lucide-react"
import { SCHEMES_DATA } from "@/lib/constants"

const getStatusColor = (status: string) => {
  switch (status) {
    case "Eligible":
      return "bg-green-100 text-green-800"
    case "Applied":
      return "bg-blue-100 text-blue-800"
    case "In Progress":
    case "Ongoing":
      return "bg-yellow-100 text-yellow-800"
    case "Implemented":
      return "bg-purple-100 text-purple-800"
    case "Open":
      return "bg-sky-100 text-sky-800"
    case "Active":
      return "bg-emerald-100 text-emerald-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function SchemesPage() {
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar role="pwd" />
      <div className="flex-1 overflow-auto">
        <DashboardHeader userName="User" />

        <main className="p-8 space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Government Schemes & Programs for Persons with Disabilities (PwDs)
            </h2>
            <p className="text-muted-foreground">
              Explore official initiatives, financial aids, and support programs available for PwDs in India.
            </p>
          </div>

          <div className="grid gap-6">
            {SCHEMES_DATA.map((scheme) => (
              <Card key={scheme.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{scheme.name}</h3>
                      <p className="text-sm text-muted-foreground">{scheme.provider}</p>
                    </div>
                    <Badge className={getStatusColor(scheme.status)}>{scheme.status}</Badge>
                  </div>

                  <p className="text-sm text-foreground">{scheme.description}</p>

                  <div className="grid md:grid-cols-2 gap-4 py-4 bg-muted/50 p-4 rounded-lg">
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-1">Benefit Amount / Type</p>
                      <p className="text-lg font-bold text-primary">{scheme.amount}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-1">Eligibility</p>
                      <p className="text-sm text-muted-foreground">{scheme.eligibility}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-2">
                      <FileText className="h-3 w-3" />
                      Required Documents
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {scheme.documents.map((doc, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {doc}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => window.open(scheme.link, "_blank")}
                    >
                      Visit Official Page
                    </Button>
                    {/* <Button variant="outline" className="flex-1 bg-transparent">
                      Learn More
                    </Button> */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
