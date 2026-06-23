'use client'

import { useNewsItems } from '@/lib/use-data-store'
import { ChevronRight, Clock } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export function HomeLatestNews() {
  const { newsItems } = useNewsItems()

  // Get top 4 news items
  const topNews = newsItems.slice(0, 4)

  return (
    <div className="group rounded-lg border border-border bg-card/50 backdrop-blur-sm hover:border-accent/30 transition-all duration-300 overflow-hidden h-full flex flex-col shadow-sm hover:shadow-md">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-border/50 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Latest
          </p>
          <h3 className="text-base font-bold text-foreground">
            News
          </h3>
        </div>
        <Link
          href="/news"
          className="text-sm font-semibold text-accent hover:text-primary transition-colors flex items-center gap-0.5"
        >
          View
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* News List */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-border/30">
          {topNews.length > 0 ? (
            topNews.map((item, index) => (
              <Link
                key={item.id}
                href={`/news/${item.id}`}
                className="block px-5 py-4 hover:bg-muted/20 transition-colors group/item"
              >
                <div className="flex items-start gap-3">
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Category Badge */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                        {item.category || 'News'}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>
                          {item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short'
                          }) : 'Recent'}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <p className="text-sm font-semibold text-foreground group-hover/item:text-accent transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </p>
                  </div>

                  {/* Arrow Icon */}
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover/item:text-accent transition-all group-hover/item:translate-x-0.5 flex-shrink-0 mt-0.5" />
                </div>
              </Link>
            ))
          ) : (
            <div className="px-5 py-12 text-center">
              <p className="text-muted-foreground text-sm">No news available</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-5 py-4 border-t border-border/50 bg-muted/10">
        <Link
          href="/news"
          className="w-full text-center text-sm font-semibold text-accent hover:text-primary transition-colors flex items-center justify-center gap-1"
        >
          View All News
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
