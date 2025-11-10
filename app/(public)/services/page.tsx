import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Briefcase, Gift, ShoppingCart, BookOpen, Users, MessageSquare } from "lucide-react"

export default function ServicesPage() {
  const services = [
    {
      icon: Briefcase,
      title: "Job Marketplace",
      description:
        "Connect with employers looking to hire talented individuals with disabilities. Browse curated job opportunities and apply with your profile.",
      features: ["Tailored Job Listings", "Employer Network", "Application Tracking", "Interview Support"],
      link: "/dashboard/pwd",
    },
    {
      icon: Gift,
      title: "CSR Funding Platform",
      description:
        "For donors: Manage your CSR initiatives with full transparency. Track impact, support causes, and make a difference in the disability community.",
      features: ["Fund Management", "Real-time Tracking", "Impact Reports", "Donor Network"],
      link: "/dashboard/donor",
    },
    {
      icon: ShoppingCart,
      title: "Device Marketplace",
      description:
        "Suppliers can list assistive devices, manage inventory, and connect with organizations seeking quality solutions for persons with disabilities.",
      features: ["Product Listing", "Inventory Management", "Order Tracking", "Supplier Analytics"],
      link: "/dashboard/supplier",
    },
    {
      icon: BookOpen,
      title: "Knowledge Hub",
      description:
        "Comprehensive resources on disability rights, employment schemes, community support, and personal empowerment strategies.",
      features: ["Educational Articles", "Resource Library", "Expert Guides", "Community Tips"],
      link: "/knowledge-hub",
    },
    {
      icon: Users,
      title: "Community Support",
      description:
        "Connect with others, share experiences, access mentorship, and build networks for mutual support and growth.",
      features: ["Support Groups", "Mentorship", "Networking Events", "Peer Support"],
      link: "#",
    },
    {
      icon: MessageSquare,
      title: "Helpline & Support",
      description:
        "24/7 support from our dedicated team. Get answers to questions, assistance with applications, and guidance on available resources.",
      features: ["Live Chat Support", "Email Support", "FAQ Database", "Multilingual Support"],
      link: "/contact",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">Our Services</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Comprehensive solutions designed to empower persons with disabilities, support donors, and connect
              suppliers.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-300 border-border/50 flex flex-col"
                >
                  <CardHeader>
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-muted-foreground mb-6 leading-relaxed flex-1">{service.description}</p>
                    <div className="mb-6">
                      <p className="text-sm font-semibold text-foreground mb-3">Key Features:</p>
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Link href={service.link}>
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        Learn More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-foreground mb-12 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Sign Up</h3>
              <p className="text-muted-foreground">
                Create your account in minutes by selecting your role: PWD, Donor, or Supplier.
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Connect</h3>
              <p className="text-muted-foreground">
                Browse opportunities and connect with the community. Start exploring what's available for you.
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Grow</h3>
              <p className="text-muted-foreground">
                Track your progress, build relationships, and create meaningful impact together.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
