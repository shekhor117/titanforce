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
    <footer className="bg-background text-foreground py-12 md:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Brand Section - Mobile */}
        <div className="md:hidden mb-8 pb-8 border-b border-primary/10">
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

        {/* Main Footer Content */}
        <div className="grid grid-cols-3 md:grid-cols-4 gap-6 md:gap-12 mb-8 md:mb-12">
          
          {/* Brand Section - Desktop Only */}
          <div className="hidden md:block">
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
          <div>
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
          <div>
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
          <div>
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

        {/* Social Media Links */}
        <div className="flex flex-col items-center gap-6 mb-8">
          <h3 className="text-foreground font-semibold">Follow Us</h3>
          <div className="flex gap-4">
            <a
              href="https://facebook.com/titanforce"
              target="_blank"
              rel="noopener noreferrer"
              className="neo-btn neo-soft w-12 h-12 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors flex items-center justify-center hover:scale-110 transition-transform"
              aria-label="Facebook"
            >
              <svg className="w-5 h-5 fill-primary" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="currentColor"/>
              </svg>
            </a>
            <a
              href="https://tiktok.com/@titanforce"
              target="_blank"
              rel="noopener noreferrer"
              className="neo-btn neo-soft w-12 h-12 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors flex items-center justify-center hover:scale-110 transition-transform"
              aria-label="TikTok"
            >
              <svg className="w-5 h-5 fill-primary" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.08 1.61 2.88 2.88 0 0 1 4.07-4.09v-3.45a6.47 6.47 0 0 0-5.79 10.221 6.648 6.648 0 0 0 10.86-5.48v-5.6a8.552 8.552 0 0 0 3.79-1.75v-3.54z" fill="currentColor"/>
              </svg>
            </a>
            <a
              href="https://instagram.com/titanforce"
              target="_blank"
              rel="noopener noreferrer"
              className="neo-btn neo-soft w-12 h-12 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors flex items-center justify-center hover:scale-110 transition-transform"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5 fill-primary" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.217.6c-.688.267-1.228.648-1.769 1.19-.541.54-.923 1.079-1.19 1.766-.266.688-.467 1.557-.527 2.834C.039 8.333.024 8.74 0 12c0 3.26.015 3.667.072 4.947.06 1.277.261 2.148.528 2.834.267.688.648 1.228 1.19 1.769.541.541 1.08.923 1.767 1.19.686.266 1.556.467 2.833.527C8.333 23.961 8.74 23.976 12 23.976s3.667-.015 4.947-.072c1.277-.06 2.148-.261 2.834-.528.688-.267 1.228-.648 1.769-1.19.541-.541.923-1.08 1.19-1.767.266-.686.467-1.556.527-2.833.048-1.28.063-1.687.063-4.947 0-3.26-.015-3.667-.072-4.947-.06-1.277-.261-2.148-.528-2.834-.267-.688-.648-1.228-1.19-1.769-.541-.541-1.08-.923-1.767-1.19-.686-.266-1.556-.467-2.833-.527C15.667.048 15.26.033 12 .033Z" fill="currentColor"/>
              </svg>
            </a>
            <a
              href="https://youtube.com/@titanforce"
              target="_blank"
              rel="noopener noreferrer"
              className="neo-btn neo-soft w-12 h-12 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors flex items-center justify-center hover:scale-110 transition-transform"
              aria-label="YouTube"
            >
              <svg className="w-5 h-5 fill-primary" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="currentColor"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary/10 pt-6 md:pt-8 text-center">
          <p className="text-muted-foreground text-xs tracking-wider">
            © {currentYear} TITAN FORCE MULIKANDI · ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </footer>
  )
}
