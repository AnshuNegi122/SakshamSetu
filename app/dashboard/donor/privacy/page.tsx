"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Shield, Lock, Eye } from "lucide-react"

export default function DonorPrivacy() {
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar role="donor" />
      <div className="flex-1 overflow-auto">
        <DashboardHeader userName="Privacy & Policy" />

        <main className="p-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Privacy & Policy</h1>
            <p className="text-muted-foreground">
              Understanding our commitment to data protection and ethical practices
            </p>
          </div>

          {/* Privacy Principles */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <Shield className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-bold mb-2">Data Protection</h3>
                  <p className="text-sm text-muted-foreground">
                    All beneficiary data is encrypted and stored securely. We comply with GDPR and India's Digital
                    Personal Data Protection Act.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <Lock className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-bold mb-2">Consent-Based Sharing</h3>
                  <p className="text-sm text-muted-foreground">
                    We only share PwD data with donors who have explicitly agreed to our data usage terms.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <Eye className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-bold mb-2">Ethical Use</h3>
                  <p className="text-sm text-muted-foreground">
                    Data must be used only for charitable purposes. Misuse is monitored and reported to authorities.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Privacy Policy Summary */}
          <Card>
            <CardHeader>
              <CardTitle>SakshamSetu Privacy Policy Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-bold mb-2">1. Data Collection</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  We collect verified information about PwDs only with their explicit consent. This includes:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Basic demographics (age, location, disability type)</li>
                  <li>Specific assistance needs</li>
                  <li>Preferred contact methods</li>
                  <li>Verification status</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-2">2. Data Usage by Donors</h3>
                <p className="text-sm text-muted-foreground mb-2">Donors accessing our platform agree to:</p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Use data only for charitable assistance</li>
                  <li>Maintain strict confidentiality</li>
                  <li>Not share data with unauthorized third parties</li>
                  <li>Comply with all applicable laws</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-2">3. Data Security</h3>
                <p className="text-sm text-muted-foreground">
                  All data is encrypted using AES-256 encryption, stored in secure databases, and protected by
                  multi-factor authentication. Regular security audits and penetration testing ensure compliance with
                  international standards.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">4. Retention & Deletion</h3>
                <p className="text-sm text-muted-foreground">
                  Beneficiaries can request data deletion anytime. We retain data only as long as the user's request is
                  active. After resolution, data is securely deleted within 30 days.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">5. Your Rights</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  As a donor using our platform, you have the right to:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Access and review your own account data</li>
                  <li>Request corrections or updates</li>
                  <li>Withdraw consent at any time</li>
                  <li>Report privacy concerns</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Full Policy Link */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center space-y-4">
            <h3 className="text-xl font-bold">Need Complete Details?</h3>
            <p className="text-muted-foreground">Review our full privacy policy and terms of service</p>
            <div className="flex gap-4 justify-center">
              <Link href="/privacy">
                <Button variant="outline">Full Privacy Policy</Button>
              </Link>
              <Button className="bg-primary hover:bg-primary/90">Terms of Service</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
