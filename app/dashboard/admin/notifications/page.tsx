"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Bell, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const notifications: Array<{
  id: string
  type: string
  message: string
  recipient: string
  date: string
  status: string
}> = []

export default function Notifications() {
  const [message, setMessage] = useState("")
  const [recipientType, setRecipientType] = useState("all")
  const { toast } = useToast()

  const handleSendNotification = () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Notification Sent",
      description: `Message sent to ${recipientType === "all" ? "all users" : "selected recipients"}`,
    })
    setMessage("")
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar role="admin" />
      <div className="flex-1 overflow-auto">
        <DashboardHeader userName="User" />

        <main className="p-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">View and send platform notifications</p>
          </div>

          {/* Send Notification Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Send Global Alert
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Recipient Type</label>
                <select
                  value={recipientType}
                  onChange={(e) => setRecipientType(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                >
                  <option value="all">All Users</option>
                  <option value="pwd">PwD Users Only</option>
                  <option value="donors">Donors Only</option>
                  <option value="suppliers">Suppliers Only</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Enter notification message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button onClick={handleSendNotification} className="gap-2 w-full">
                <Bell className="h-4 w-4" />
                Send Notification
              </Button>
            </CardContent>
          </Card>

          {/* Notification History */}
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notifications.map((notif) => (
                      <TableRow key={notif.id}>
                        <TableCell className="font-mono text-sm">{notif.id}</TableCell>
                        <TableCell>{notif.type}</TableCell>
                        <TableCell className="max-w-xs truncate">{notif.message}</TableCell>
                        <TableCell>{notif.recipient}</TableCell>
                        <TableCell>{notif.date}</TableCell>
                        <TableCell>
                          <Badge variant="default">{notif.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
