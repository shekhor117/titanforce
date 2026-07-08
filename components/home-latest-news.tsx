'use client'

import { motion } from 'framer-motion'
import { useNewsItems } from '@/lib/use-data-store'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { ScrollStaggerContainer } from './scroll-stagger-container'
import { ScrollProgressAnimation } from './scroll-progress-animation'

export function HomeLatestNews() {
  const { newsItems } = useNewsItems()

  // Get top 4 news items for grid layout
  const topNews = newsItems.slice(0, 4)

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="flex items-center justify-between mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-1 h-7 md:h-8 bg-accent rounded-full" />
            <h2 className="text-3xl md:text-5xl font-black text-foreground uppercase tracking-wider">
              Latest News
            </h2>
          </div>
          <Link
            href="/news"
            className="text-accent hover:text-primary text-xs md:text-sm font-bold flex items-center gap-2 transition-colors group"
          >
            View all news
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* News Grid */}
        <ScrollStaggerContainer 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          staggerDelay={0.1}
          variant="fadeInUp"
        >
          {topNews.length > 0 ? (
            topNews.map((item, idx) => (
              <ScrollProgressAnimation key={item.id} delay={idx * 0.05}>
              <Link
                key={item.id}
                href={`/news/${item.id}`}
                className="neo-soft group relative overflow-hidden"
              >
                {/* Background Image or Placeholder */}
                <div className="relative w-full aspect-video bg-gradient-to-br from-red-900/30 to-black/50 overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl text-red-500/20 font-bold mb-2">📰</div>
                        <p className="text-xs text-white/30">News Image</p>
                      </div>
                    </div>
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-4 bg-black/60 backdrop-blur-sm">
                  {/* Category Badge */}
                  <div className="mb-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-red-500 bg-red-500/10 px-2 py-1 rounded">
                      {item.category || 'NEWS'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-foreground group-hover:text-red-500 transition-colors line-clamp-2 mb-3">
                    {item.title}
                  </h3>

                  {/* Date */}
                  <p className="text-xs text-muted-foreground">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    }) : 'Recent'}
                  </p>
                </div>
              </Link>
              </ScrollProgressAnimation>
            ))  
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-sm">No news available</p>
            </div>
          )}
        </ScrollStaggerContainer>
      </div>
    </section>
  )
}
