"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/language-context"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface NewsItem {
  id: string
  title: string
  description?: string
  category?: string
  image?: string
  date?: string
}

export function HomepageNewsSection() {
  const { language, t } = useLanguage()
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock news data - replace with actual API call
    const mockNews: NewsItem[] = [
      {
        id: "1",
        title: "Titan Force Crowned Champions!",
        description: "A historic season comes to an unforgettable end as we lift the trophy.",
        category: "CLUB NEWS",
        image: "/images/news-placeholder-1.jpg",
        date: "15 MAY 2024"
      },
      {
        id: "2",
        title: "New Home Kit 2024/25 Revealed",
        description: "Introducing our stunning new home kit for the upcoming season.",
        category: "CLUB NEWS",
        image: "/images/news-placeholder-2.jpg",
        date: "15 MAY 2024"
      },
      {
        id: "3",
        title: "Academy Stars Shine in Youth Cup Victory",
        description: "Our academy players deliver impressive performance in the youth tournament.",
        category: "ACADEMY",
        image: "/images/news-placeholder-3.jpg",
        date: "12 MAY 2024"
      }
    ]
    
    setNews(mockNews)
    setLoading(false)
  }, [])

  return (
    <section className="py-16 md:py-24 bg-background relative">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-xs md:text-sm uppercase tracking-[0.2em] font-semibold text-primary mb-3">
              {language === "bn" ? "সর্বশেষ খবর" : "LATEST NEWS"}
            </p>
            <h2 className="font-[var(--font-display)] text-3xl md:text-5xl uppercase tracking-wider text-foreground">
              {language === "bn" ? "সর্বশেষ আপডেট" : "LATEST UPDATE"}
            </h2>
          </div>
          <Link
            href="/news"
            className="hidden md:flex items-center gap-2 text-sm uppercase tracking-wide font-semibold text-foreground hover:text-primary transition-colors"
          >
            {language === "bn" ? "সব খবর দেখুন" : "VIEW ALL NEWS"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item, index) => (
            <Link
              key={item.id}
              href={`/news/${item.id}`}
              className="group glass-card rounded-lg overflow-hidden hover-lift transition-all duration-300"
            >
              {/* News Image */}
              <div className="relative w-full aspect-video overflow-hidden bg-muted">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-muted-foreground">Image</span>
                  </div>
                )}
              </div>

              {/* News Content */}
              <div className="p-5 md:p-6">
                {item.category && (
                  <p className="text-xs uppercase tracking-widest font-semibold text-primary mb-3">
                    {item.category}
                  </p>
                )}
                <h3 className="font-[var(--font-display)] text-lg md:text-xl tracking-wide text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {item.description}
                </p>
                {item.date && (
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {item.date}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="md:hidden mt-8 text-center">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-6 py-3 glass-btn-primary rounded font-bold text-sm uppercase tracking-wider text-foreground hover-lift transition-all"
          >
            {language === "bn" ? "সব খবর দেখুন" : "VIEW ALL NEWS"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
