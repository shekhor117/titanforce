'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import GalleryDataService from '@/lib/gallery-data-service'
import { useLanguage } from '@/lib/language-context'
import { ArrowRight } from 'lucide-react'

export function GalleryShowcase() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  
  const [featuredItems, setFeaturedItems] = useState([])

  useEffect(() => {
    const featured = GalleryDataService.getFeaturedItems(4)
    setFeaturedItems(featured)
  }, [])

  if (featuredItems.length === 0) return null

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-card/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-2">
              {isBn ? 'গ্যালারি' : 'Gallery'}
            </h2>
            <p className="text-muted-foreground">
              {isBn ? 'টাইটান ফোর্সের হাইলাইট এবং স্মৃতি' : 'Highlights and memories from Titan Force'}
            </p>
          </div>
          <Link
            href="/gallery"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            {isBn ? 'সব দেখুন' : 'View All'}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Featured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((item: any, index: number) => (
            <Link
              key={item.id}
              href="/gallery"
              className="group relative overflow-hidden rounded-lg h-80 cursor-pointer"
            >
              {/* Background Image */}
              <div className="absolute inset-0 bg-muted">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=600&fit=crop'
                  }}
                />
              </div>

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent group-hover:from-black/90 transition-all duration-300" />

              {/* Content */}
              <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/90 text-sm line-clamp-2">{item.description}</p>
              </div>

              {/* Category Badge */}
              <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.type === 'match' && (isBn ? 'ম্যাচ' : 'Match')}
                {item.type === 'team-events' && (isBn ? 'ইভেন্ট' : 'Events')}
                {item.type === 'training' && (isBn ? 'প্রশিক্ষণ' : 'Training')}
                {item.type === 'merchandise' && (isBn ? 'পণ্য' : 'Merchandise')}
                {item.type === 'news' && (isBn ? 'খবর' : 'News')}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
