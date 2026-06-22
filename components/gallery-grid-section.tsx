"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface GalleryImage {
  id: string
  image: string
  title?: string
}

interface GalleryGridSectionProps {
  title: string
  images: GalleryImage[]
  viewAllLink?: string
}

export function GalleryGridSection({
  title,
  images,
  viewAllLink = "/gallery",
}: GalleryGridSectionProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white uppercase tracking-wider">
            {title}
          </h2>
          <Link
            href={viewAllLink}
            className="flex items-center gap-2 text-primary hover:text-accent transition-colors"
          >
            <span className="text-sm font-bold uppercase tracking-wider">View all</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((item) => (
            <div
              key={item.id}
              className="group relative h-64 overflow-hidden rounded-lg"
            >
              <Image
                src={item.image}
                alt={item.title || "Gallery image"}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              {item.title && (
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-semibold text-sm group-hover:text-primary transition-colors">
                    {item.title}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
