'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function HomeShopLatest() {
  return (
    <section className="py-12 md:py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Product Details */}
          <div className="order-2 md:order-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-accent rounded-full" />
              <h3 className="text-sm uppercase tracking-[0.2em] font-bold text-accent">
                SHOP THE LATEST
              </h3>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              NEW HOME KIT
              <br />
              2024/25
            </h2>

            <p className="text-foreground leading-relaxed mb-6 text-lg">
              Get your official Titan Force Mulikandi home kit. Premium quality jersey featuring the iconic red and black stripes with cutting-edge performance technology.
            </p>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent/90 text-white font-bold uppercase tracking-wider rounded transition-all duration-300 group text-sm"
            >
              SHOP NOW
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right Side - Product Image */}
          <div className="order-1 md:order-2">
            <div className="relative h-96 md:h-full min-h-96 rounded-lg overflow-hidden group bg-gradient-to-br from-accent/20 to-accent/5">
              <div className="w-full h-full flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-accent/60 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-white mb-2">TF</div>
                    <p className="text-white/80 uppercase tracking-wider">Home Kit 2024/25</p>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
