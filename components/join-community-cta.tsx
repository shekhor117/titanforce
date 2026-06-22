"use client"

import Link from "next/link"
import { Users2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface JoinCommunityCTAProps {
  title: string
  subtitle: string
  description: string
  ctaText?: string
  ctaLink?: string
}

export function JoinCommunityCTA({
  title,
  subtitle,
  description,
  ctaText = "Join the club",
  ctaLink = "/join",
}: JoinCommunityCTAProps) {
  return (
    <section className="py-16 md:py-24 relative">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Logo and text */}
          <div>
            <div className="inline-block mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 1c-6.338 0-12 4.226-12 10.007 0 2.05.738 4.063 2.047 5.625.055 3.215 1.308 4.368 6.953 5.368v-2c2.201 0 4.44.504 6-2h2v2.066c3.941-.969 6-2.248 6-5.368 1.309-1.562 2.047-3.575 2.047-5.625 0-5.781-5.662-10.007-12-10.007m8 9c-1.104 0-2-1.119-2-2.5s.896-2.5 2-2.5 2 1.119 2 2.5-.896 2.5-2 2.5m-16 0c-1.104 0-2-1.119-2-2.5s.896-2.5 2-2.5 2 1.119 2 2.5-.896 2.5-2 2.5" />
                </svg>
              </div>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white uppercase tracking-wider mb-4">
              {title}
            </h2>
            <p className="text-muted-foreground text-sm font-semibold uppercase tracking-wider mb-6">
              {subtitle}
            </p>
            <p className="text-foreground/80 text-lg leading-relaxed mb-8 max-w-md">
              {description}
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex md:justify-end">
            <Link href={ctaLink}>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider gap-2 h-12 px-8 text-base">
                <Users2 className="w-5 h-5" />
                {ctaText}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
