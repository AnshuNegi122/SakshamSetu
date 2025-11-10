import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Accessibility, Shield, ArrowRight, Users, TrendingUp, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/5 via-background to-accent/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                Bridging Empowerment for Persons with Disabilities
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Connecting PWDs, Donors & Suppliers for a brighter future. Access opportunities, funding, and support in
                one unified platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/dashboard/pwd">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-lg">
                    Explore Opportunities
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/dashboard/donor">
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 h-12 px-8 text-lg">
                    Fund & Track
                  </Button>
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl h-96 flex items-center justify-center border border-primary/20">
              <div className="text-center">
                <Accessibility className="h-32 w-32 text-primary/40 mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">Inclusive Community Network</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <p className="text-primary-foreground/80">PWDs Supported</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">₹2Cr+</div>
              <p className="text-primary-foreground/80">Funds Distributed</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <p className="text-primary-foreground/80">Assistive Devices</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">200+</div>
              <p className="text-primary-foreground/80">Jobs Offered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">How We Help</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Empowering individuals with disabilities through comprehensive support and opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <Card className="group hover:shadow-xl transition-shadow duration-300 border-border/50">
              <CardHeader>
                <div className="h-14 w-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Briefcase className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-xl">Find Jobs & Schemes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Access exclusive job opportunities and government schemes designed specifically for persons with
                  disabilities.
                </p>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className="group hover:shadow-xl transition-shadow duration-300 border-border/50">
              <CardHeader>
                <div className="h-14 w-14 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Shield className="h-7 w-7 text-accent" />
                </div>
                <CardTitle className="text-xl">Access Funded Devices</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Get assistive devices through CSR funding and strategic supplier partnerships to enhance independence.
                </p>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className="group hover:shadow-xl transition-shadow duration-300 border-border/50">
              <CardHeader>
                <div className="h-14 w-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Accessibility className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-xl">Learn Your Rights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Comprehensive resources on disability rights, policies, support services, and community networks.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-foreground mb-16 text-center">Why Choose SakshamSetu</h2>

          <div className="space-y-16">
            {/* Feature 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-foreground mb-4">Unified Platform</h3>
                <p className="text-lg text-muted-foreground mb-6">
                  Everything you need in one place. PWDs, donors, and suppliers can connect seamlessly to create
                  meaningful impact.
                </p>
                <Link href="/about">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 bg-transparent">
                    Learn More
                  </Button>
                </Link>
              </div>
              <div className="bg-primary/10 rounded-2xl h-80 flex items-center justify-center border border-primary/20">
                <Users className="h-40 w-40 text-primary/30" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-accent/10 rounded-2xl h-80 flex items-center justify-center border border-accent/20 order-2 md:order-1">
                <TrendingUp className="h-40 w-40 text-accent/30" />
              </div>
              <div className="order-1 md:order-2">
                <h3 className="text-3xl font-bold text-foreground mb-4">Transparent Impact</h3>
                <p className="text-lg text-muted-foreground mb-6">
                  Track every donation and device distribution with real-time transparency. See the direct impact of
                  your contributions.
                </p>
                <Link href="/dashboard/transparency">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 bg-transparent">
                    View Dashboard
                  </Button>
                </Link>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-foreground mb-4">Fully Accessible</h3>
                <p className="text-lg text-muted-foreground mb-6">
                  Built with accessibility at its core. High contrast modes, screen reader support, and keyboard
                  navigation for all users.
                </p>
                <Link href="/faq">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 bg-transparent">
                    FAQ
                  </Button>
                </Link>
              </div>
              <div className="bg-primary/10 rounded-2xl h-80 flex items-center justify-center border border-primary/20">
                <Zap className="h-40 w-40 text-primary/30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Join thousands of people creating opportunities and empowerment for persons with disabilities.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/register">
              <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 h-12 px-8 text-lg">
                Get Started Today
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 h-12 px-8 text-lg bg-transparent"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
