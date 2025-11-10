import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
  const faqs = [
    {
      id: "pwd",
      category: "For Persons with Disabilities",
      questions: [
        {
          q: "How do I register on SakshamSetu?",
          a: "Click the 'Get Started' button on the homepage, select 'Person with Disability' as your role, fill in your details, and verify your email. Your account will be ready to use within minutes.",
        },
        {
          q: "What types of jobs are available?",
          a: "We curate job listings from companies actively seeking to hire persons with disabilities. Jobs range from entry-level to senior positions across various industries including tech, finance, retail, and more.",
        },
        {
          q: "How can I apply for government schemes?",
          a: "Visit the Schemes section in your dashboard, browse available schemes matching your eligibility, and submit your application directly. Our support team can help guide you through the process.",
        },
        {
          q: "How do I request an assistive device?",
          a: "Browse the device marketplace, select devices you need, and submit a request. Our support team will help match you with available funding or suppliers who can assist.",
        },
        {
          q: "Is the platform accessible for all disabilities?",
          a: "Yes! Our platform is built with accessibility at its core. We support screen readers, high contrast modes, keyboard navigation, and multiple language options.",
        },
      ],
    },
    {
      id: "donor",
      category: "For Donors & Organizations",
      questions: [
        {
          q: "How can we contribute funds?",
          a: "Register as a donor, complete your organization profile, and set up your CSR initiatives. You can then create campaigns and allocate funds to specific beneficiaries or causes.",
        },
        {
          q: "How is our impact tracked?",
          a: "Our transparency dashboard provides real-time tracking of how your funds are being utilized. You'll see reports on beneficiaries helped, devices distributed, and jobs created.",
        },
        {
          q: "Can we target specific causes?",
          a: "You can choose to focus on employment, devices, education, or community support. We help match your CSR goals with relevant beneficiaries and impact areas.",
        },
        {
          q: "What compliance documentation do you provide?",
          a: "We provide detailed impact reports, beneficiary testimonials, photographs, and compliance documentation for your CSR reporting and audit requirements.",
        },
      ],
    },
    {
      id: "supplier",
      category: "For Assistive Device Suppliers",
      questions: [
        {
          q: "How do I list my products?",
          a: "Create a supplier account, complete your organization profile, and start listing your assistive devices with descriptions, pricing, and inventory details.",
        },
        {
          q: "How do I manage orders?",
          a: "Your dashboard shows all incoming orders. You can update status, arrange delivery, and communicate directly with buyers through our messaging system.",
        },
        {
          q: "What commission does SakshamSetu charge?",
          a: "We operate on a transparent commission model. Details are available in your supplier agreement. We aim to keep costs minimal to ensure maximum benefit reaches the disability community.",
        },
        {
          q: "How are payments processed?",
          a: "Payments are processed within 7 business days of order delivery. You can track payment status in your financial dashboard.",
        },
      ],
    },
    {
      id: "general",
      category: "General Questions",
      questions: [
        {
          q: "Is SakshamSetu free to use?",
          a: "Yes! Registration and most features are completely free. We're committed to making our platform accessible to all without financial barriers.",
        },
        {
          q: "How is my data protected?",
          a: "We use industry-standard encryption and security practices. Your data is never shared without consent. Read our Privacy Policy for complete details.",
        },
        {
          q: "What languages are supported?",
          a: "Currently, we support English and Hindi. More language support is coming soon. Let us know which languages would be most helpful for you.",
        },
        {
          q: "How can I contact support?",
          a: "Visit our Contact page, email us at support@saksham.org, or call our helpline. We're here to help 24/7!",
        },
        {
          q: "Can I delete my account?",
          a: "Yes, you can request account deletion anytime from your account settings. We'll securely delete all your personal data within 30 days.",
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">Frequently Asked Questions</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Find answers to common questions about SakshamSetu. Can't find what you're looking for? Contact our
              support team.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqs.map((section) => (
            <div key={section.id} className="mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-8">{section.category}</h2>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {section.questions.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`${section.id}-${index}`}
                    className="border border-border/50 rounded-lg px-6 py-4"
                  >
                    <AccordionTrigger className="hover:text-primary transition-colors py-0">
                      <span className="text-lg font-semibold text-foreground text-left">{item.q}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pt-4">{item.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 md:py-20 bg-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Still have questions?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Our dedicated support team is here to help. Reach out to us anytime.
          </p>
          <a href="/contact">
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-lg font-semibold transition-colors">
              Contact Support
            </button>
          </a>
        </div>
      </section>
    </div>
  )
}
