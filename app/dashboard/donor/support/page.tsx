"use client"

import type React from "react"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Mail, Phone, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const faqs = [
  {
    question: "How do I access verified beneficiary data?",
    answer:
      "You can access verified beneficiary data through our Access Beneficiaries page. Choose a plan (one-time or subscription), agree to our data usage policy, and complete the payment. After that, you'll have immediate access to the database.",
  },
  {
    question: "What is included in my subscription?",
    answer:
      "Your subscription includes unlimited access to verified PwD profiles, region-based filters, disability type insights, direct contact options, monthly impact reports, and priority email support.",
  },
  {
    question: "How can I ensure responsible data usage?",
    answer:
      "We require all donors to agree to our data usage policy before accessing information. This includes commitments to privacy, ethical use, and compliance with regulations. We also provide training resources and conduct regular audits.",
  },
  {
    question: "Can I downgrade my subscription?",
    answer:
      "Yes, you can downgrade anytime from your My Plans & Payments page. Changes take effect at the end of your current billing cycle. Contact our support team for any customization needs.",
  },
  {
    question: "How do I report misuse of data?",
    answer:
      "If you witness any misuse of beneficiary data, please report it immediately to our compliance team at privacy@saksamsetu.org or call our hotline. All reports are investigated promptly and confidentially.",
  },
  {
    question: "What support is available for new donors?",
    answer:
      "We provide onboarding guidance, webinar training, documentation, and dedicated support during your first month. Our support team is available via email, phone, and chat for any questions.",
  },
]

export default function DonorSupport() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Form submitted:", formData)
    toast({
      title: "Message Sent",
      description: "Our support team will get back to you within 24 hours.",
    })
    setFormData({ name: "", email: "", subject: "", message: "" })
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar role="donor" />
      <div className="flex-1 overflow-auto">
        <DashboardHeader userName="Help & Support" />

        <main className="p-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
            <p className="text-muted-foreground">Get answers to common questions and contact our support team</p>
          </div>

          {/* Contact Information */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6 text-center space-y-3">
                <Mail className="h-8 w-8 text-primary mx-auto" />
                <div>
                  <p className="font-semibold">Email Support</p>
                  <p className="text-sm text-muted-foreground">support@saksamsetu.org</p>
                </div>
                <p className="text-xs text-muted-foreground">Response time: 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center space-y-3">
                <Phone className="h-8 w-8 text-primary mx-auto" />
                <div>
                  <p className="font-semibold">Phone Support</p>
                  <p className="text-sm text-muted-foreground">+91-11-XXXX-XXXX</p>
                </div>
                <p className="text-xs text-muted-foreground">Mon-Fri, 9 AM - 6 PM IST</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center space-y-3">
                <MessageSquare className="h-8 w-8 text-primary mx-auto" />
                <div>
                  <p className="font-semibold">Live Chat</p>
                  <p className="text-sm text-muted-foreground">Available on website</p>
                </div>
                <p className="text-xs text-muted-foreground">Mon-Fri, 10 AM - 5 PM IST</p>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Accordion */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, idx) => (
                  <AccordionItem key={idx} value={`item-${idx}`}>
                    <AccordionTrigger className="text-left font-semibold">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold block mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full border rounded px-3 py-2"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold block mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full border rounded px-3 py-2"
                      placeholder="Your email"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold block mb-2">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="w-full border rounded px-3 py-2"
                    placeholder="Subject of your inquiry"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold block mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="w-full border rounded px-3 py-2 min-h-32 resize-none"
                    placeholder="Describe your issue or question..."
                  />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
