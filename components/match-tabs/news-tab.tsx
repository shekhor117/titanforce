'use client'

import { ArrowRight, Calendar, User } from 'lucide-react'
import type { Match } from '@/lib/data-service'
import { useLanguage } from '@/lib/language-context'

interface NewsTabProps {
  match: Match
}

interface NewsArticle {
  id: string
  title: string
  excerpt: string
  date: string
  author: string
  category: string
  image?: string
}

export function NewsTab({ match }: NewsTabProps) {
  const { isBn } = useLanguage()

  // Mock news articles
  const articles: NewsArticle[] = [
    {
      id: '1',
      title: 'Salah Shines as Liverpool Dominates Manchester City',
      excerpt: 'Mohamed Salah delivered a match-winning performance with 2 goals and 1 assist, leading Liverpool to a commanding 3-1 victory over Manchester City.',
      date: '2024-01-14',
      author: 'John Smith',
      category: 'Match Report',
    },
    {
      id: '2',
      title: 'Liverpool\'s Title Push Strengthens with Crucial Win',
      excerpt: 'The Merseyside club\'s third consecutive victory puts them 2 points clear at the top of the Premier League table.',
      date: '2024-01-14',
      author: 'Emma Wilson',
      category: 'News',
    },
    {
      id: '3',
      title: 'Manchester City Suffer Setback in Title Race',
      excerpt: 'Pep Guardiola\'s side fell to their second defeat in three games, dimming their hopes of catching Liverpool.',
      date: '2024-01-14',
      author: 'Michael Brown',
      category: 'Analysis',
    },
    {
      id: '4',
      title: 'Luis Díaz Continues Impressive Form',
      excerpt: 'The Colombian winger netted his fourth goal in five games, announcing himself as one of the season\'s standout performers.',
      date: '2024-01-14',
      author: 'Sarah Johnson',
      category: 'Player Feature',
    },
    {
      id: '5',
      title: 'Key Tactical Decisions Prove Decisive',
      excerpt: 'Arne Slot\'s substitution strategy and pressing intensity were crucial factors in Liverpool\'s commanding performance.',
      date: '2024-01-14',
      author: 'David Lee',
      category: 'Tactics',
    },
    {
      id: '6',
      title: 'Post-Match Reaction from the Camps',
      excerpt: 'Both managers discuss the match, key moments, and what lies ahead in the title race.',
      date: '2024-01-14',
      author: 'Tom White',
      category: 'Interview',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Featured Article */}
      {articles.length > 0 && (
        <div className="neo-panel overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/20 text-primary">
                {articles[0].category}
              </span>
              <span className="text-xs text-foreground/60 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {articles[0].date}
              </span>
            </div>
            <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
              {articles[0].title}
            </h2>
            <p className="text-foreground/70 mb-4">{articles[0].excerpt}</p>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-foreground/60">
                <User className="w-4 h-4" />
                <span>{articles[0].author}</span>
              </div>
              <div className="flex items-center gap-2 text-primary group-hover:translate-x-1 transition-transform">
                <span className="text-sm font-semibold">{isBn ? 'পড়ুন' : 'Read More'}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Article Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {articles.slice(1).map((article) => (
          <div
            key={article.id}
            className="neo-panel p-6 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-secondary/30 text-foreground/70 text-white">
                {article.category}
              </span>
              <span className="text-xs text-foreground/60">{article.date}</span>
            </div>
            <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h3>
            <p className="text-sm text-foreground/70 mb-4 line-clamp-2">{article.excerpt}</p>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-foreground/60">
                <User className="w-3 h-3" />
                <span>{article.author}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
