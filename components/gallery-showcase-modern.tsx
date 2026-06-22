"use client"

import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { useMediaItems } from "@/lib/use-data-store"
import { ChevronRight, Grid3x3 } from "lucide-react"

export function GalleryShowcaseModern() {
  const { language, t } = useLanguage()
  const { mediaItems } = useMediaItems()

  // Filter images and get first 6
  const displayedImages = Array.isArray(mediaItems) 
    ? mediaItems.filter(item => item.type === 'image').slice(0, 6)
    : []

  const isBn = language === "bn"

  if (!displayedImages || displayedImages.length === 0) {
    return null
  }

  return (
    <section className="relative py-20 sm:py-28 md:py-36 px-3 sm:px-6 overflow-hidden">
      {/* Background gradient elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Grid3x3 className="w-6 h-6 text-white" />
              </div>
              <h2 className={`text-4xl sm:text-5xl font-black ${isBn ? "font-[var(--font-bengali)]" : "font-[var(--font-display)]"}`}>
                {isBn ? "গ্যালারি" : "Gallery"}
              </h2>
            </div>
            <p className={`text-foreground/60 text-lg max-w-2xl ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "টাইটান ফোর্সের সেরা মুহূর্তগুলি উপভোগ করুন" : "Explore the finest moments of Titan Force"}
            </p>
          </div>

          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-primary/50 hover:border-primary text-foreground hover:text-primary hover:bg-primary/5 font-bold uppercase tracking-wide text-sm transition-all duration-300 hover-lift group"
          >
            {isBn ? "সম্পূর্ণ গ্যালারি" : "View All"}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {displayedImages.map((media, index) => (
            <Link
              key={media.id || index}
              href="/gallery"
              className="group relative overflow-hidden rounded-2xl h-72 sm:h-80 border border-border/50 hover:border-primary/50 transition-all duration-300"
            >
              {/* Image */}
              <Image
                src={media.url}
                alt={media.title || `Gallery image ${index + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-between p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="self-end">
                  <div className="w-10 h-10 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                    <ChevronRight className="w-5 h-5 text-primary" />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {media.title || `Moment ${index + 1}`}
                  </h3>
                  <p className="text-white/70 text-sm">
                    {media.description || (isBn ? "একটি অবিস্মরণীয় মুহূর্ত" : "An unforgettable moment")}
                  </p>
                </div>
              </div>

              {/* Border glow on hover */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/50 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-[inset_0_0_20px_rgba(217,30,63,0.1)]" />
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 sm:mt-16 text-center">
          <p className={`text-foreground/60 mb-6 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "আরও ছবি এবং ভিডিও দেখুন" : "View more photos and match highlights"}
          </p>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/30 text-white font-bold uppercase tracking-wide rounded-lg text-sm transition-all duration-300 hover-lift"
          >
            {isBn ? "সম্পূর্ণ গ্যালারি দেখুন" : "Explore Gallery"}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
