'use client'

import { useState } from 'react'
import { WebsiteSidebar } from '@/components/website-sidebar'
import { Footer } from '@/components/footer'
import { BackButton } from '@/components/back-button'
import { useNewsItems } from '@/lib/use-data-store'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'
import { EntranceReveal } from '@/components/entrance-reveal'
import { ScrollStaggerContainer } from '@/components/scroll-stagger-container'

export default function NewsPage() {
  const { newsItems = [] } = useNewsItems()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Get unique categories
  const categories = ['All', ...new Set(newsItems.map(item => item.category || 'Club News'))]

  // Filter news items
  const filteredNews = newsItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      <WebsiteSidebar />
      <main className="lg:ml-64">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 px-4 text-center hero-gradient">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden z-1">
            <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-[-150px] right-[-100px] w-[450px] h-[450px] bg-accent/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-primary/10 rounded-full blur-3xl animate-blob" />
          </div>

          <div
            className="absolute inset-0 opacity-10 z-1"
            style={{
              background: "radial-gradient(circle at 70% 30%, var(--primary) 0%, transparent 60%)",
            }}
          />

          <div className="max-w-6xl mx-auto relative z-10">
            <BackButton className="mb-6" />
            <p className="text-sm uppercase tracking-[0.2em] font-semibold mb-2 text-primary">
              LATEST UPDATES
            </p>
            <h1 className="font-[var(--font-display)] text-5xl md:text-7xl tracking-wide text-foreground mb-4">
              NEWS & UPDATES
            </h1>
            <p className="text-foreground/70 max-w-xl mx-auto">
              Stay informed with the latest news, match reports, transfers, and exclusive interviews from Titan Force Mulikandi.
            </p>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-12 px-4 bg-background border-b border-border">
          <div className="max-w-6xl mx-auto">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search news articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="neo-input w-full pl-12 pr-4 py-3 bg-card rounded-lg text-foreground placeholder-muted-foreground focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`neo-btn px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                    selectedCategory === category
                      ? 'neo-btn-primary bg-primary text-primary-foreground'
                      : 'neo-soft text-foreground'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* News Grid */}
        <EntranceReveal delay={0.2} duration={0.6} variant="fadeInUp">
          <section className="py-16 px-4 bg-background">
            <div className="max-w-6xl mx-auto">
              {filteredNews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNews.map((item) => (
                  <Link
                    key={item.id}
                    href={`/news/${item.id}`}
                    className="group relative overflow-hidden rounded-xl neo-soft border-border/50 transition-all duration-300 bg-card hover:shadow-lg hover:shadow-primary/20"
                  >
                    {/* Image Container */}
                    <div className="relative w-full aspect-video bg-gradient-to-br from-primary/20 to-background overflow-hidden">
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
                            <div className="text-5xl mb-2">📰</div>
                            <p className="text-xs text-muted-foreground">No image</p>
                          </div>
                        </div>
                      )}
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      {/* Category Badge */}
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded">
                          {item.category || 'NEWS'}
                        </span>
                        {item.views && (
                          <span className="text-xs text-muted-foreground">
                            {item.views} views
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                        {item.title}
                      </h3>

                      {/* Excerpt */}
                      {item.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {item.excerpt}
                        </p>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="text-xs text-muted-foreground">
                          {item.created_at
                            ? new Date(item.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                            : 'Recently'}
                        </span>
                        <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">📭</div>
                <h3 className="text-xl font-bold text-foreground mb-2">No news found</h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? 'Try adjusting your search query'
                    : 'Check back soon for updates'}
                </p>
              </div>
              )}
            </div>
          </section>
        </EntranceReveal>

        {/* Newsletter CTA Section */}
        <section className="py-16 px-4 bg-card border-y border-border">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Never miss a headline
            </h2>
            <p className="text-muted-foreground mb-8">
              Subscribe to our newsletter to get the latest news and updates delivered directly to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="neo-input flex-1 px-4 py-3 bg-background rounded-lg text-foreground placeholder-muted-foreground focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="neo-btn neo-btn-primary neo-btn neo-btn-primary px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-colors duration-300 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
