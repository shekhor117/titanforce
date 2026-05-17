'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import GalleryDataService from '@/lib/gallery-data-service'
import { useLanguage } from '@/lib/language-context'
import { ArrowRight } from 'lucide-react'

// Default featured items for display when no Supabase data is available
const DEFAULT_FEATURED_ITEMS = [
  {
    id: '1',
    title: 'Champions League Victory',
    description: 'Historic win against rivals in the final match',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop',
    type: 'match',
    isFeatured: true,
    createdAt: new Date()
  },
  {
    id: '2',
    title: 'Team Celebration',
    description: 'Players celebrating after winning the trophy',
    imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&h=600&fit=crop',
    type: 'team-events',
    isFeatured: true,
    createdAt: new Date()
  },
  {
    id: '3',
    title: 'Training Session',
    description: 'Intense tactical training with the coaching staff',
    imageUrl: 'https://images.unsplash.com/photo-1516156064457-6f5bc43e4f73?w=800&h=600&fit=crop',
    type: 'training',
    isFeatured: true,
    createdAt: new Date()
  },
  {
    id: '4',
    title: 'Official Jersey Launch',
    description: 'New season merchandise collection unveiled',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop',
    type: 'merchandise',
    isFeatured: true,
    createdAt: new Date()
  }
]

export function GalleryShowcase() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  
  const [featuredItems, setFeaturedItems] = useState(DEFAULT_FEATURED_ITEMS)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadFeaturedItems = async () => {
      try {
        const featured = await GalleryDataService.getFeaturedItems(4)
        if (featured && featured.length > 0) {
          setFeaturedItems(featured)
        }
      } catch (error) {
        console.error('Error loading featured items:', error)
        // Keep default items on error
      } finally {
        setIsLoading(false)
      }
    }
    loadFeaturedItems()
  }, [])

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
