"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface NewsItem {
  id: string
  title: string
  category: string
  date: string
  image: string
  excerpt?: string
  slug?: string
}

interface NewsGridSectionProps {
  title: string
  newsItems: NewsItem[]
  viewAllLink?: string
}

export function NewsGridSection({
  title,
  newsItems,
  viewAllLink = "/news",
}: NewsGridSectionProps) {
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

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsItems.map((item, index) => (
            <Link
              key={item.id}
              href={item.slug || `/news/${item.id}`}
              className="group relative overflow-hidden rounded-lg"
            >
              {/* Image container */}
              <div className="relative h-48 md:h-56 overflow-hidden bg-muted">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Category badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-bold uppercase tracking-wider rounded">
                    {item.category}
                  </span>
                </div>

                {/* Content at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-display text-lg font-bold text-white uppercase tracking-wide mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-foreground/70">{item.date}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
