'use client'

import { useEffect, useState } from 'react'
import { useTrophies } from '@/lib/use-data-store'
import { useLanguage } from '@/lib/language-context'
import Link from 'next/link'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'
import { ArrowRight, Trophy } from 'lucide-react'
import { EntranceReveal } from '@/components/entrance-reveal'

export function TrophyTimeline() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  
  // Use realtime hook - automatically syncs when admin updates
  const { trophies, loading: isLoading } = useTrophies()

  const categoryColors = {
    league: 'from-primary to-red-600',
    cup: 'from-blue-500 to-purple-600',
    championship: 'from-yellow-500 to-orange-600',
    tournament: 'from-green-500 to-emerald-600',
  }

  const categoryLabels = {
    league: isBn ? 'লিগ' : 'League',
    cup: isBn ? 'কাপ' : 'Cup',
    championship: isBn ? 'চ্যাম্পিয়নশিপ' : 'Championship',
    tournament: isBn ? 'টুর্নামেন্ট' : 'Tournament',
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-muted-foreground">{isBn ? 'লোড হচ্ছে...' : 'Loading...'}</p>
        </div>
      </section>
    )
  }

  return (
    <EntranceReveal delay={0.2} duration={0.6} variant="fadeInUp">
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-2">
              {isBn ? 'ট্রফি রেকর্ড' : 'Trophy Record'}
            </h2>
            <p className="text-muted-foreground">
              {isBn ? 'টাইটান ফোর্সের গৌরবময় ইতিহাস' : 'Glorious history of Titan Force'}
            </p>
          </div>
          <Link
            href="/admin/trophies"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            {isBn ? 'সম্পূর্ণ ইতিহাস' : 'Full History'}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Swipeable Trophy Carousel */}
        <div className="relative group">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
              skipSnaps: false,
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {trophies.map((trophy) => (
                <CarouselItem key={trophy.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <div className="h-full">
                    <div className="relative p-8 rounded-2xl bg-gradient-to-br from-card to-card/50 border-2 border-border hover:border-primary/50 transition-all group/card hover:shadow-xl hover:shadow-primary/20 h-full flex flex-col">
                      {/* Year Badge */}
                      <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit">
                        <span className="text-sm font-bold text-primary">{trophy.year}</span>
                      </div>

                      {/* Trophy Icon */}
                      <div className="flex justify-center items-center w-24 h-24 mb-4 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 group-hover/card:from-primary/30 group-hover/card:to-accent/30 transition-colors">
                        <Trophy className="w-12 h-12 text-primary drop-shadow-lg" />
                      </div>

                      {/* Trophy Name */}
                      <h3 className="font-bold text-2xl text-foreground mb-2 group-hover/card:text-primary transition-colors line-clamp-2">
                        {trophy.name}
                      </h3>

                      {/* Category */}
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
                        {categoryLabels[trophy.category]}
                      </p>

                      {/* Description */}
                      <p className="text-sm text-foreground/70 mb-4 line-clamp-3 flex-grow">
                        {trophy.description}
                      </p>

                      {/* Runners Up */}
                      {trophy.runners_up && (
                        <div className="text-xs text-muted-foreground mb-4 pb-4 border-b border-border/50">
                          <span className="font-medium text-foreground">{isBn ? 'রানার আপ' : 'Runners up'}:</span>
                          <p className="mt-1">{trophy.runners_up}</p>
                        </div>
                      )}

                      {/* Category Badge */}
                      <div className={`inline-block px-4 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r ${categoryColors[trophy.category]} w-fit`}>
                        {categoryLabels[trophy.category]}
                      </div>
                    </div>
                  </div>
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
          <div className="flex justify-center gap-2 mt-8 flex-wrap">
            {trophies.slice(0, Math.min(10, trophies.length)).map((_, index) => (
              <div
                key={index}
                className="h-2 rounded-full transition-all duration-300 bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
    </EntranceReveal>
  )
}
