"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Clock } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send to a backend
    console.log("Form submitted:", formData)
    setSubmitted(true)
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">Get in Touch</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We'd love to hear from you. Reach out with any questions, feedback, or partnership opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="bg-input border-border"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    className="bg-input border-border"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91-000-0000-000"
                    className="bg-input border-border"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    required
                    className="bg-input border-border"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more..."
                    rows={6}
                    required
                    className="bg-input border-border resize-none"
                  />
                </div>

                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11">
                  Send Message
                </Button>

                {submitted && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
                    Thank you! We've received your message and will get back to you soon.
                  </div>
                )}
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8">Contact Information</h2>

              <div className="space-y-6">
                {/* Email */}
                <Card className="border-border/50 hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-start gap-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Email</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        <a href="mailto:info@saksham.org" className="hover:text-primary transition-colors">
                          info@saksham.org
                        </a>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <a href="mailto:support@saksham.org" className="hover:text-primary transition-colors">
                          support@saksham.org
                        </a>
                      </p>
                    </div>
                  </CardHeader>
                </Card>

                {/* Phone */}
                <Card className="border-border/50 hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-start gap-4">
                    <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Phone</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        <a href="tel:+91-000-0000-000" className="hover:text-primary transition-colors">
                          +91-000-0000-000
                        </a>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Monday - Friday: 9 AM - 6 PM IST</p>
                    </div>
                  </CardHeader>
                </Card>

                {/* Location */}
                <Card className="border-border/50 hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-start gap-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Office Location</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        SakshamSetu Foundation
                        <br />
                        New Delhi, India
                      </p>
                    </div>
                  </CardHeader>
                </Card>

                {/* Hours */}
                <Card className="border-border/50 hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-start gap-4">
                    <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Support Hours</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Monday - Friday: 9:00 AM - 6:00 PM
                        <br />
                        Saturday: 10:00 AM - 4:00 PM
                        <br />
                        Sunday: Closed
                      </p>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="py-16 md:py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Visit Us</h2>
          <div className="w-full h-96 bg-muted rounded-lg border border-border flex items-center justify-center">
            <p className="text-muted-foreground">Map integration placeholder</p>
          </div>
        </div>
      </section>
    </div>
  )
}
