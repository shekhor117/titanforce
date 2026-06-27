'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useMediaItems } from '@/lib/use-data-store'
import { EntranceReveal } from '@/components/entrance-reveal'

export function HomeAboutGallery() {
  const { mediaItems } = useMediaItems()
  const galleryImages = mediaItems.slice(0, 4)

  return (
    <EntranceReveal delay={0.2} duration={0.6} variant="fadeInUp">
    <section className="py-12 md:py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Side - About */}
          <div className="order-2 md:order-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-accent rounded-full" />
              <h3 className="text-sm uppercase tracking-[0.2em] font-bold text-accent">
                ABOUT TITAN FORCE MULIKANDI
              </h3>
            </div>

            <p className="text-foreground leading-relaxed mb-4">
              Titan Force Mulikandi is more than just a football club. We are a family built on passion, discipline, and hard work. Our mission is to develop players, inspire the community, and compete at the highest level.
            </p>

            <Link
              href="/about"
              className="neo-btn inline-flex items-center gap-2 group"
            >
              LEARN MORE
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right Side - Gallery Grid */}
          <div className="order-1 md:order-2">
            <div className="grid grid-cols-2 gap-4">
              {galleryImages.length > 0 ? (
                galleryImages.map((item, index) => (
                  <div
                    key={item.id}
                    className={`relative rounded-lg overflow-hidden ${
                      index === 0 ? 'col-span-2 h-48' : 'h-32'
                    } bg-muted group`}
                  >
                    <Image
                      src={item.url}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors" />
                  </div>
                ))
              ) : (
                <div className="col-span-2 h-48 rounded-lg bg-muted/30 flex items-center justify-center">
                  <p className="text-muted-foreground">No gallery images available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
    </EntranceReveal>
  )
}
