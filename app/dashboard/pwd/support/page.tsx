"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, Send } from "lucide-react"

export default function ChatSupportPage() {
  const { toast } = useToast()
  const [dataSharing, setDataSharing] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, sender: "support", text: "Hello! How can we help you today?", time: "10:30 AM" },
  ])
  const [inputMessage, setInputMessage] = useState("")

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    if (!dataSharing) {
      toast({
        title: "Data Sharing Required",
        description: "Please enable data sharing in your Privacy settings to use chat support.",
        variant: "destructive",
      })
      return
    }

    const newMessage = {
      id: messages.length + 1,
      sender: "user",
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, newMessage])
    setInputMessage("")

    // Simulate support response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          sender: "support",
          text: "Thank you for your message. Our team will get back to you shortly.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ])
    }, 1000)
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar role="pwd" />
      <div className="flex-1 overflow-auto flex flex-col">
        <DashboardHeader userName="User" />

        <main className="flex-1 p-8 flex flex-col max-w-2xl w-full">
          <h1 className="text-3xl font-bold text-foreground mb-8">Support Chat</h1>

          {/* Warning */}
          {!dataSharing && (
            <Card className="mb-6 border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-yellow-900">Chat Unavailable</p>
                    <p className="text-sm text-yellow-800 mt-1">
                      Chat support is only available when data sharing consent is enabled in your Privacy settings.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Chat Messages */}
          <Card className="flex-1 flex flex-col mb-6">
            <CardHeader className="border-b">
              <CardTitle>SakshamSetu Helpdesk</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground border border-input"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">{message.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Message Input */}
          {dataSharing ? (
            <div className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-input rounded-lg bg-background text-foreground"
                disabled={!dataSharing}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!dataSharing || !inputMessage.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              >
                <Send className="h-4 w-4" />
                Send
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Enable data sharing in Privacy settings to start chatting
            </p>
          )}
        </main>
      </div>
    </div>
  )
}
