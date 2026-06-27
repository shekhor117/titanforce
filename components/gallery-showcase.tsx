'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useMediaItems } from '@/lib/use-data-store'
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
const DEFAULT_FEATURED_ITEMS: any[] = []

export function GalleryShowcase() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // Use realtime hook for media items - automatically syncs when admin updates
  const { mediaItems, loading: isLoading, error } = useMediaItems()
  
  // Filter to featured items and map to display format
  const featuredItems = mediaItems.length > 0 ? mediaItems.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description || '',
    imageUrl: item.url,
    type: item.category || item.type,
    isFeatured: true,
    createdAt: new Date(item.created_at)
  })) : DEFAULT_FEATURED_ITEMS

  return (
    <section className="py-12 md:py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-accent rounded-full" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground uppercase tracking-wider">
              {isBn ? 'গ্যালারি' : 'Gallery'}
            </h2>
          </div>
          <Link
            href="/gallery"
            className="text-accent hover:text-primary text-sm font-semibold flex items-center gap-2 transition-colors group"
          >
            {isBn ? 'সব দেখুন' : 'View all gallery'}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {featuredItems.slice(0, 4).map((item: any, idx: number) => (
            <div
              key={item.id}
            >
              <div className="group relative overflow-hidden rounded-lg border border-red-500/20 hover:border-red-500/50 transition-all duration-300 cursor-pointer">
                <div className="relative w-full aspect-square bg-gradient-to-br from-red-900/30 to-black/50 overflow-hidden">
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-125 transition-transform duration-700 will-change-transform"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                  <h3 className="text-sm font-bold text-foreground group-hover:text-red-500 transition-colors line-clamp-2">
                    {item.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.type === 'match' && (isBn ? 'ম্যাচ' : 'Match')}
                  {item.type === 'team-events' && (isBn ? 'ইভেন্ট' : 'Events')}
                  {item.type === 'training' && (isBn ? 'প্রশিক্ষণ' : 'Training')}
                  {item.type === 'merchandise' && (isBn ? 'পণ্য' : 'Merchandise')}
                  {item.type === 'news' && (isBn ? 'খবর' : 'News')}
                </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Fallback for Additional Items */}
        {featuredItems.length > 4 && (
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
                <CarouselItem key={item.id} className="pl-2 sm:pl-3 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <Link
                    href="/gallery"
                    className="group/card block"
                  >
                    <div className="relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl h-56 sm:h-72 md:h-96 bg-muted cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300">
                      {/* Background Image */}
                      {item.imageUrl && (
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover group-hover/card:scale-105 transition-transform duration-700 ease-out"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      )}

                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent group-hover/card:from-black/95 transition-all duration-300" />

                      {/* Content */}
                      <div className="absolute inset-0 p-3 sm:p-4 md:p-6 flex flex-col justify-end">
                        <div className="group-hover/card:translate-y-0 transition-transform duration-300">
                          <div className="mb-2">
                            <span className="inline-block bg-primary text-primary-foreground px-2 sm:px-3 py-1 rounded-full text-xs font-bold mb-2">
                              {item.type === 'match' && (isBn ? 'ম্যাচ' : 'Match')}
                              {item.type === 'team-events' && (isBn ? 'ইভেন্ট' : 'Events')}
                              {item.type === 'training' && (isBn ? 'প্রশিক্ষণ' : 'Training')}
                              {item.type === 'merchandise' && (isBn ? 'পণ্য' : 'Merchandise')}
                              {item.type === 'news' && (isBn ? 'খবর' : 'News')}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 sm:mb-2 line-clamp-2">{item.title}</h3>
                          <p className="text-white/80 text-xs sm:text-sm line-clamp-2">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Buttons */}
            <div className="absolute left-0 sm:left-2 md:-left-16 top-1/2 -translate-y-1/2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 z-10">
              <CarouselPrevious className="relative left-0 top-0 translate-y-0 size-8 sm:size-10 bg-primary hover:bg-primary/90 text-primary-foreground border-0" />
            </div>
            <div className="absolute right-0 sm:right-2 md:-right-16 top-1/2 -translate-y-1/2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 z-10">
              <CarouselNext className="relative right-0 top-0 translate-y-0 size-8 sm:size-10 bg-primary hover:bg-primary/90 text-primary-foreground border-0" />
            </div>
          </Carousel>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
            {featuredItems.slice(0, Math.min(8, featuredItems.length)).map((_, index) => (
              <div
                key={index}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-primary w-6 sm:w-8'
                    : 'bg-muted-foreground/30 w-1.5 sm:w-2 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        </div>
        )}
      </div>
    </section>
  )
}
