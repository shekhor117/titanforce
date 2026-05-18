'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import GalleryDataService from '@/lib/gallery-data-service'
import { useLanguage } from '@/lib/language-context'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'

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
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const loadFeaturedItems = async () => {
      try {
        const featured = await GalleryDataService.getFeaturedItems(6)
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
      <div className="max-w-7xl mx-auto">
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

        {/* Swipeable Carousel - Real Madrid Style */}
        <div className="relative group">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
              skipSnaps: false,
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {featuredItems.map((item: any) => (
                <CarouselItem key={item.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <Link
                    href="/gallery"
                    className="group/card block"
                  >
                    <div className="relative overflow-hidden rounded-2xl h-96 bg-muted cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300">
                      {/* Background Image */}
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700 ease-out"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=600&fit=crop'
                        }}
                      />

                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent group-hover/card:from-black/95 transition-all duration-300" />

                      {/* Content */}
                      <div className="absolute inset-0 p-6 flex flex-col justify-end">
                        <div className="group-hover/card:translate-y-0 transition-transform duration-300">
                          <div className="mb-2">
                            <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold mb-2">
                              {item.type === 'match' && (isBn ? 'ম্যাচ' : 'Match')}
                              {item.type === 'team-events' && (isBn ? 'ইভেন্ট' : 'Events')}
                              {item.type === 'training' && (isBn ? 'প্রশিক্ষণ' : 'Training')}
                              {item.type === 'merchandise' && (isBn ? 'পণ্য' : 'Merchandise')}
                              {item.type === 'news' && (isBn ? 'খবর' : 'News')}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{item.title}</h3>
                          <p className="text-white/80 text-sm line-clamp-2">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Buttons */}
            <div className="absolute -left-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              <CarouselPrevious className="relative left-0 top-0 translate-y-0 size-10 bg-primary hover:bg-primary/90 text-primary-foreground border-0" />
            </div>
            <div className="absolute -right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              <CarouselNext className="relative right-0 top-0 translate-y-0 size-10 bg-primary hover:bg-primary/90 text-primary-foreground border-0" />
            </div>
          </Carousel>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {featuredItems.slice(0, Math.min(8, featuredItems.length)).map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-primary w-8'
                    : 'bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
