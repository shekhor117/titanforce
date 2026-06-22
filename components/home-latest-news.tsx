'use client'

import { useNewsItems } from '@/lib/use-data-store'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export function HomeLatestNews() {
  const { newsItems } = useNewsItems()

  // Get top 3 news items
  const topNews = newsItems.slice(0, 3)

  return (
    <div className="rounded-xl border border-accent/20 bg-card hover:bg-card/80 transition-all duration-300 overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-accent/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-accent rounded-full" />
          <h3 className="text-lg font-bold text-foreground uppercase tracking-wider">
            LATEST NEWS
          </h3>
        </div>
        <Link
          href="/news"
          className="text-accent hover:text-primary text-sm font-semibold flex items-center gap-1 transition-colors"
        >
          View all
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* News List */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 p-6">
          {topNews.length > 0 ? (
            topNews.map((item, index) => (
              <Link
                key={item.id}
                href={`/news/${item.id}`}
                className="block p-3 rounded-lg hover:bg-muted transition-colors group"
              >
                {/* Category Badge */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">
                    {item.category || 'NEWS'}
                  </span>
                </div>

                {/* Title */}
                <p className="text-sm font-bold text-foreground group-hover:text-accent transition-colors line-clamp-2 mb-2">
                  {item.title}
                </p>

                {/* Date */}
                <p className="text-xs text-muted-foreground">
                  {item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  }) : 'Recent'}
                </p>
              </Link>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">No news available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
