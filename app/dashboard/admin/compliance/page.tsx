"use client"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle2, XCircle, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const complianceLogs: Array<{
  id: string
  userId: string
  donorAccessed: string
  date: string
  consentGiven: boolean
}> = []

export default function PrivacyCompliance() {
  const { toast } = useToast()

  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: "Compliance report is being downloaded as PDF",
    })
  }

  const totalLogs = complianceLogs.length
  const activeConsents = complianceLogs.filter((log) => log.consentGiven).length
  const violations = complianceLogs.filter((log) => !log.consentGiven).length

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar role="admin" />
      <div className="flex-1 overflow-auto">
        <DashboardHeader userName="User" />

        <main className="p-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Privacy & Compliance Logs</h1>
            <p className="text-muted-foreground">Monitor consent and data access records</p>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-1">Total Access Logs</p>
                <p className="text-3xl font-bold text-primary">{totalLogs}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-1">Active Consents</p>
                <p className="text-3xl font-bold text-green-600">{activeConsents}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-1">Violations Detected</p>
                <p className={`text-3xl font-bold ${violations > 0 ? "text-red-600" : "text-green-600"}`}>
                  {violations}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Generate Report Button */}
          <div>
            <Button onClick={handleGenerateReport} className="gap-2">
              <FileText className="h-4 w-4" />
              Generate Compliance Report (PDF)
            </Button>
          </div>

          {/* Compliance Logs Table */}
          <Card>
            <CardHeader>
              <CardTitle>Data Access Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Log ID</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Donor/Organization</TableHead>
                      <TableHead>Access Date</TableHead>
                      <TableHead>Consent Given</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complianceLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">{log.id}</TableCell>
                        <TableCell>{log.userId}</TableCell>
                        <TableCell>{log.donorAccessed}</TableCell>
                        <TableCell>{log.date}</TableCell>
                        <TableCell>
                          {log.consentGiven ? (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle2 className="h-4 w-4" />
                              <span>Yes</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-red-600">
                              <XCircle className="h-4 w-4" />
                              <span>No</span>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Policy Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="pb-4 border-b">
                <p className="font-semibold text-sm">Data Protection</p>
                <p className="text-sm text-muted-foreground mt-1">All user data is encrypted and stored securely</p>
              </div>
              <div className="pb-4 border-b">
                <p className="font-semibold text-sm">User Rights</p>
                <p className="text-sm text-muted-foreground mt-1">Users can request data access or deletion anytime</p>
              </div>
              <div>
                <p className="font-semibold text-sm">Audit Trail</p>
                <p className="text-sm text-muted-foreground mt-1">
                  All data access is logged and monitored for compliance
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
