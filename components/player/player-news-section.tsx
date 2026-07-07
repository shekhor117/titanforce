'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/lib/language-context'
import { useNewsItems } from '@/lib/use-data-store'
import { ArrowRight } from 'lucide-react'

interface PlayerNewsSectionProps {
  playerName: string
  limit?: number
}

export function PlayerNewsSection({ playerName, limit = 3 }: PlayerNewsSectionProps) {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const { newsItems } = useNewsItems()

  // Filter news related to the player
  const playerNews = newsItems
    .filter(item => 
      item.title.toLowerCase().includes(playerName.toLowerCase()) ||
      item.description?.toLowerCase().includes(playerName.toLowerCase())
    )
    .slice(0, limit)

  if (playerNews.length === 0) {
    return null
  }

  return (
    <div className="neo-card p-6 md:p-8 rounded-2xl border border-secondary/40">
      <h3 className={`text-xl md:text-2xl font-bold mb-6 text-foreground uppercase tracking-wider ${isBn ? 'font-[var(--font-bengali)]' : ''}`}>
        {isBn ? 'সর্বশেষ সংবাদ' : 'Latest News'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {playerNews.map((item) => (
          <Link
            key={item.id}
            href={`/news/${item.id}`}
            className="group relative overflow-hidden rounded-xl neo-card hover:shadow-lg transition-all duration-300"
          >
            <div className="relative w-full aspect-video bg-gradient-to-br from-red-900/30 to-black/50 overflow-hidden">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary/30">
                  <div className="text-center">
                    <div className="text-3xl text-foreground/30 font-bold mb-1">📰</div>
                    <p className="text-xs text-foreground/40">{isBn ? 'ছবি' : 'Image'}</p>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>

            <div className="p-4 bg-secondary/30 backdrop-blur-sm">
              <p className="text-xs text-foreground/60 uppercase tracking-wide mb-2">
                {item.category || (isBn ? 'সংবাদ' : 'News')}
              </p>
              <h4 className="text-sm font-bold text-foreground line-clamp-2 group-hover:text-primary transition">
                {item.title}
              </h4>
              <p className="text-xs text-foreground/60 mt-2">
                {new Date(item.date).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US')}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {playerNews.length > limit && (
        <Link
          href={`/news?player=${encodeURIComponent(playerName)}`}
          className="mt-6 flex items-center justify-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
        >
          <span>{isBn ? 'সব সংবাদ দেখুন' : 'View All News'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  )
}
