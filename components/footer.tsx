"use client"

import Image from "next/image"
import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const clubLinks = [
    { label: "About", href: "/about" },
    { label: "History", href: "/about" },
    { label: "Stadium", href: "/about" },
    { label: "Academy", href: "/about" },
  ]

  const teamsLinks = [
    { label: "Fixtures", href: "/fixtures-results" },
    { label: "Players", href: "/team-squad" },
    { label: "Results", href: "/fixtures-results" },
    { label: "Standings", href: "/fixtures-results" },
  ]

  const connectLinks = [
    { label: "Contact", href: "/about" },
    { label: "Tickets", href: "/about" },
    { label: "Shop", href: "/shop" },
    { label: "Newsletter", href: "/about" },
  ]

  return (
    <footer className="bg-white dark:bg-black text-slate-900 dark:text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12 pb-12 border-b border-slate-200 dark:border-white/10">
          
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
            <h3 className="font-bold text-lg tracking-wide mb-2 text-slate-900 dark:text-white">TITAN FORCE</h3>
            <p className="text-xs text-slate-600 dark:text-white/60 mb-1">MULIKANDI</p>
            <p className="text-sm text-slate-700 dark:text-white/70 leading-relaxed mt-4">
              Pride of Mulikandi. Power of the Titans. Join the family and rise with us.
            </p>
          </div>

          {/* Club Links */}
          <div className="md:col-span-1">
            <h4 className="text-red-600 text-xs font-bold tracking-widest mb-6 uppercase">Club</h4>
            <ul className="space-y-3">
              {clubLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-700 dark:text-white/70 text-sm hover:text-red-600 transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Teams Links */}
          <div className="md:col-span-1">
            <h4 className="text-red-600 text-xs font-bold tracking-widest mb-6 uppercase">Teams</h4>
            <ul className="space-y-3">
              {teamsLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-700 dark:text-white/70 text-sm hover:text-red-600 transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Links */}
          <div className="md:col-span-1">
            <h4 className="text-red-600 text-xs font-bold tracking-widest mb-6 uppercase">Connect</h4>
            <ul className="space-y-3">
              {connectLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-700 dark:text-white/70 text-sm hover:text-red-600 transition-colors duration-300"
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
          <p className="text-slate-600 dark:text-white/50 text-xs tracking-wider">
            © {currentYear} TITAN FORCE MULIKANDI · ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </footer>
  )
}
