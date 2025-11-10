import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Heart, Target, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">About SakshamSetu</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Bridging the gap between persons with disabilities, donors, and assistive device suppliers to create
              meaningful empowerment opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border-border/50">
              <CardHeader>
                <Target className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground leading-relaxed">
                To empower persons with disabilities by creating a unified platform that connects them with employment
                opportunities, assistive devices, and community support, fostering independence and inclusion in
                society.
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <Heart className="h-8 w-8 text-accent mb-2" />
                <CardTitle>Our Vision</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground leading-relaxed">
                A society where disability is never a barrier to opportunity. Where every person with a disability has
                access to meaningful work, appropriate assistive technology, and supportive community networks.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-foreground mb-12 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CheckCircle className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Inclusion</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                We believe everyone deserves equal opportunities regardless of ability. Our platform is built to be
                accessible to all.
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-8 w-8 text-accent mb-2" />
                <CardTitle>Collaboration</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Success comes from working together. We bring PWDs, donors, and suppliers into one cohesive ecosystem.
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Target className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Transparency</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Every rupee counted, every device tracked. We maintain complete transparency in all our operations and
                impact metrics.
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Heart className="h-8 w-8 text-accent mb-2" />
                <CardTitle>Empowerment</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                We don't just provide; we enable. Our platform empowers individuals to take control of their own
                opportunities and futures.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-foreground mb-12 text-center">Our Impact</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-primary/5 rounded-xl border border-primary/20">
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <p className="text-muted-foreground">PWDs Connected</p>
            </div>
            <div className="text-center p-6 bg-accent/5 rounded-xl border border-accent/20">
              <div className="text-4xl font-bold text-accent mb-2">₹2Cr+</div>
              <p className="text-muted-foreground">Funds Disbursed</p>
            </div>
            <div className="text-center p-6 bg-primary/5 rounded-xl border border-primary/20">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <p className="text-muted-foreground">Devices Distributed</p>
            </div>
            <div className="text-center p-6 bg-accent/5 rounded-xl border border-accent/20">
              <div className="text-4xl font-bold text-accent mb-2">200+</div>
              <p className="text-muted-foreground">Jobs Created</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-foreground mb-12 text-center">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-border/50 overflow-hidden">
                <div className="h-48 bg-primary/10 flex items-center justify-center">
                  <Users className="h-16 w-16 text-primary/30" />
                </div>
                <CardHeader>
                  <CardTitle>Team Member {i}</CardTitle>
                  <p className="text-sm text-muted-foreground">Role & Responsibility</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Dedicated to creating meaningful impact for the disability community through innovative solutions
                    and compassionate service.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
