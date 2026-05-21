'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Home, ChevronDown } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { useCart } from '@/lib/cart-context'

export function StoreNavbar() {
  const pathname = usePathname()
  const { language } = useLanguage()
  const { items } = useCart()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const isBn = language === 'bn'
  const cartCount = items.reduce((total, item) => total + item.quantity, 0)

  const storeLinks = [
    {
      href: '/store',
      label: isBn ? 'স্টোর হোম' : 'Store Home',
      icon: Home,
    },
    {
      href: '/store/jerseys',
      label: isBn ? 'জার্সি' : 'Jerseys',
      icon: ShoppingBag,
    },
  ]

  const isActive = (href: string) => {
    if (href === '/store') {
      return pathname === '/store'
    }
    return pathname?.startsWith(href)
  }

  return (
    <div className="sticky top-[70px] z-40 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3">
        <div className="flex items-center gap-4 overflow-x-auto">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {storeLinks.map((link) => {
              const Icon = link.icon
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-semibold ${
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground/60 hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Mobile Dropdown */}
          <div className="md:hidden relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-primary/50 text-foreground hover:bg-primary/10 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-semibold">{isBn ? 'কেনাকাটা' : 'Shop'}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-background border-2 border-primary/50 rounded-lg shadow-lg z-50">
                {storeLinks.map((link) => {
                  const Icon = link.icon
                  const active = isActive(link.href)
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setDropdownOpen(false)}
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all ${
                        active
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-muted'
                      } ${link.href !== storeLinks[storeLinks.length - 1].href ? 'border-b border-border/20' : ''}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Cart Badge */}
          <div className="ml-auto flex items-center">
            <Link
              href="/cart"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors relative"
            >
              <ShoppingBag className="w-5 h-5 text-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
