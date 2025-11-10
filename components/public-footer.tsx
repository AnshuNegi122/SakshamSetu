import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export function PublicFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-foreground font-bold">
                S
              </div>
              <span className="text-lg font-bold">SakshamSetu</span>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Bridging empowerment for persons with disabilities through inclusive solutions.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <Link href="/" className="hover:text-primary-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary-foreground transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/knowledge-hub" className="hover:text-primary-foreground transition-colors">
                  Knowledge Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <Link href="/faq" className="hover:text-primary-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/dashboard/transparency" className="hover:text-primary-foreground transition-colors">
                  Transparency
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors">
                  Community
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-1 flex-shrink-0" />
                <a href="mailto:info@saksham.org" className="hover:text-primary-foreground transition-colors">
                  info@saksham.org
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-1 flex-shrink-0" />
                <a href="tel:+91-000-0000-000" className="hover:text-primary-foreground transition-colors">
                  +91-000-0000-000
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <span>New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-primary-foreground/80">© {currentYear} SakshamSetu. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0 text-sm">
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
