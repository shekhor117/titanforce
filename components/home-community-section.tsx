'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Shield } from 'lucide-react'

export function HomeCommunitySection() {
  return (
    <section className="py-12 md:py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Logo & Text */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-accent" />
              <h3 className="text-3xl md:text-4xl font-bold text-foreground uppercase tracking-wider">
                ONE TEAM.<br />
                ONE DREAM.<br />
                ONE COMMUNITY.
              </h3>
            </div>
            <p className="text-muted-foreground text-base leading-relaxed mb-2">
              Be a part of something bigger.
            </p>
            <p className="text-muted-foreground text-base leading-relaxed mb-8">
              Support your local team. <br />
              Support Titan Force Mulikandi.
            </p>
            <Link
              href="/join"
              className="w-fit px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider rounded-lg transition-all duration-300 flex items-center gap-2 group"
            >
              JOIN THE CLUB
              <span className="text-lg">👥</span>
            </Link>
          </div>

          {/* Right Side - Image */}
          <div className="relative h-96 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20" />
            <Image
              src="/images/hero-bg-soccer.jpg"
              alt="Community"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
