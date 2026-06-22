"use client"

import Image from "next/image"

export function AboutSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="border-l-4 border-primary pl-6">
              <h3 className="text-white font-[var(--font-display)] text-3xl md:text-4xl tracking-wide uppercase mb-6">
                About Titan Force Mulikandi
              </h3>
              <p className="text-foreground/80 leading-relaxed mb-4">
                Titan Force Mulikandi is more than just a football club. We are a family bound together by passion, discipline, and hard work. Our mission is to develop players, inspire the community, and compete at the highest level.
              </p>
              <button className="text-primary hover:text-accent font-semibold text-sm uppercase tracking-wider transition-colors mt-6">
                Learn More →
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-64 md:h-96 rounded-lg overflow-hidden group">
            <Image
              src="/images/hero-bg-soccer.jpg"
              alt="Titan Force Mulikandi Team"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
