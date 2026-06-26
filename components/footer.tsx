"use client"

import Image from "next/image"
import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const clubLinks = [
    { id: "about", label: "About", href: "/about" },
    { id: "history", label: "History", href: "/about" },
    { id: "stadium", label: "Stadium", href: "/about" },
    { id: "academy", label: "Academy", href: "/about" },
  ]

  const teamsLinks = [
    { id: "fixtures", label: "Fixtures", href: "/fixtures-results" },
    { id: "players", label: "Players", href: "/team-squad" },
    { id: "results", label: "Results", href: "/fixtures-results" },
    { id: "standings", label: "Standings", href: "/fixtures-results" },
  ]

  const connectLinks = [
    { id: "contact", label: "Contact", href: "/about" },
    { id: "tickets", label: "Tickets", href: "/about" },
    { id: "shop", label: "Shop", href: "/shop" },
    { id: "newsletter", label: "Newsletter", href: "/about" },
  ]

  return (
    <footer className="bg-background text-foreground py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12 pb-12 border-b border-border">
          
          {/* Brand Section */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4 hover:opacity-80 transition-opacity">
              <Image
                src="/logos/titanforce-logo.svg"
                alt="Titan Force Mulikandi Logo"
                width={80}
                height={80}
                className="object-contain"
              />
            </Link>
            <h3 className="font-bold text-lg tracking-wide mb-2 text-foreground">TITAN FORCE</h3>
            <p className="text-xs text-muted-foreground mb-1">MULIKANDI</p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-4">
              Pride of Mulikandi. Power of the Titans. Join the family and rise with us.
            </p>
          </div>

          {/* Club Links */}
          <div className="md:col-span-1">
            <h4 className="text-primary text-xs font-bold tracking-widest mb-6 uppercase">Club</h4>
            <ul className="space-y-3">
              {clubLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground text-sm hover:text-primary transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Teams Links */}
          <div className="md:col-span-1">
            <h4 className="text-primary text-xs font-bold tracking-widest mb-6 uppercase">Teams</h4>
            <ul className="space-y-3">
              {teamsLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground text-sm hover:text-primary transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Links */}
          <div className="md:col-span-1">
            <h4 className="text-primary text-xs font-bold tracking-widest mb-6 uppercase">Connect</h4>
            <ul className="space-y-3">
              {connectLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground text-sm hover:text-primary transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-muted-foreground text-xs tracking-wider">
            © {currentYear} TITAN FORCE MULIKANDI · ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </footer>
  )
}
