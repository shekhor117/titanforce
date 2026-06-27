'use client'

import { useNewsItems } from '@/lib/use-data-store'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export function HomeLatestNews() {
  const { newsItems } = useNewsItems()

  // Get top 4 news items for grid layout
  const topNews = newsItems.slice(0, 4)

  return (
    <section className="py-12 md:py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-accent rounded-full" />
            <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-wider">
              Latest News
            </h2>
          </div>
          <Link
            href="/news"
            className="text-accent hover:text-primary text-sm font-semibold flex items-center gap-2 transition-colors group"
          >
            View all news
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {topNews.length > 0 ? (
            topNews.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.id}`}
                className="group relative overflow-hidden rounded-lg border border-red-500/20 hover:border-red-500/50 transition-all duration-300"
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
                  <h3 className="text-sm font-bold text-white group-hover:text-red-500 transition-colors line-clamp-2 mb-3">
                    {item.title}
                  </h3>

                  {/* Date */}
                  <p className="text-xs text-slate-400">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    }) : 'Recent'}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-400 text-sm">No news available</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
