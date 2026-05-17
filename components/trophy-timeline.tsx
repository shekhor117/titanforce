'use client'

import { useMemo } from 'react'
import TrophyDataService from '@/lib/trophy-data-service'
import { useLanguage } from '@/lib/language-context'
import Link from 'next/link'

export function TrophyTimeline() {
  const { language } = useLanguage()
  const isBn = language === 'bn'

  const trophies = useMemo(() => {
    const all = TrophyDataService.getTrophies()
    return all.sort((a, b) => b.year - a.year)
  }, [])

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

  return (
    <section className="py-16 bg-background relative">
      <div className="max-w-4xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            {isBn ? 'ট্রফি রেকর্ড' : 'Trophy Record'}
          </h2>
          <p className="text-lg text-muted-foreground">
            {isBn ? 'টাইটান ফোর্সের গৌরবময় ইতিহাস' : 'Glorious history of Titan Force'}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-accent to-transparent transform -translate-x-1/2" />

          {/* Trophies */}
          <div className="space-y-12">
            {trophies.map((trophy, index) => (
              <div key={trophy.id} className={`flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Content */}
                <div className="w-1/2 px-6">
                  <div className="p-6 rounded-xl bg-card border-2 border-border hover:border-primary/50 transition-all group hover:shadow-lg hover:shadow-primary/20">
                    {/* Year Badge */}
                    <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                      <span className="text-sm font-bold text-primary">{trophy.year}</span>
                    </div>

                    {/* Content */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="text-3xl flex-shrink-0">{trophy.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                          {trophy.name}
                        </h3>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
                          {categoryLabels[trophy.category]}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-foreground/70 mb-3">{trophy.description}</p>

                    {/* Runners Up */}
                    {trophy.runners_up && (
                      <div className="text-xs text-muted-foreground mb-3 pb-3 border-b border-border">
                        <span className="font-medium">{isBn ? 'রানার আপ' : 'Runners up'}:</span> {trophy.runners_up}
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className={`inline-block px-3 py-1 rounded-lg text-xs font-medium text-white bg-gradient-to-r ${categoryColors[trophy.category]}`}>
                      {categoryLabels[trophy.category]}
                    </div>
                  </div>
                </div>

                {/* Timeline Dot */}
                <div className="w-0 flex justify-center">
                  <div className="relative z-10">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-accent border-4 border-background shadow-lg" />
                    <div className="absolute inset-0 w-6 h-6 rounded-full bg-primary/20 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* End Marker */}
          <div className="flex justify-center mt-12">
            <div className="text-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">✓</span>
              </div>
              <p className="text-sm text-muted-foreground">{isBn ? 'চলমান সাফল্য' : 'Ongoing Success'}</p>
            </div>
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/admin/trophies"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-medium"
          >
            {isBn ? 'সম্পূর্ণ ইতিহাস দেখুন' : 'View Full History'}
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
