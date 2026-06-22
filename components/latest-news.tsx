"use client"

import Image from "next/image"

export function LatestNews() {
  const newsItems = [
    {
      id: 1,
      category: "CLUB NEWS",
      title: "Titan Force Mulikandi kick off pre-season training",
      date: "20 May 2024",
      image: "/images/news-1.png",
    },
    {
      id: 2,
      category: "MATCH REPORT",
      title: "Dominant win in opening friendly match",
      date: "18 May 2024",
      image: "/images/news-2.png",
    },
    {
      id: 3,
      category: "ACADEMY",
      title: "Youth academy trials announcement",
      date: "15 May 2024",
      image: "/images/news-3.png",
    },
  ]

  return (
    <div className="border-l-4 border-primary pl-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-white font-[var(--font-display)] text-2xl md:text-3xl tracking-wide uppercase">
          Latest News
        </h3>
        <a href="#" className="text-primary hover:text-accent text-sm font-semibold uppercase tracking-wider transition-colors">
          View all news →
        </a>
      </div>

      <div className="space-y-6">
        {newsItems.map((news) => (
          <div key={news.id} className="flex gap-4 group cursor-pointer">
            {/* News Image */}
            <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded overflow-hidden">
              <Image
                src={news.image}
                alt={news.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            {/* News Content */}
            <div className="flex-1 min-w-0">
              <p className="text-primary text-xs font-bold uppercase tracking-wider mb-2">
                {news.category}
              </p>
              <h4 className="text-white font-semibold text-sm md:text-base leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {news.title}
              </h4>
              <p className="text-muted-foreground text-xs uppercase tracking-wider">
                {news.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
