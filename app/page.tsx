"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { NextFixtureCard } from "@/components/next-fixture-card"
import { NewsGridSection } from "@/components/news-grid-section"
import { LeagueStandingsTable } from "@/components/league-standings-table"
import { InfoCardsSection } from "@/components/info-cards-section"
import { AboutSection } from "@/components/about-section"
import { GalleryGridSection } from "@/components/gallery-grid-section"
import { JoinCommunityCTA } from "@/components/join-community-cta"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { Users2, Trophy, Target, Heart } from "lucide-react"

export default function Home() {
  // Check if hero animation has been shown this session
  const [hasSeenAnimation, setHasSeenAnimation] = useState(false)
  const [heroLoading, setHeroLoading] = useState(true)

  useEffect(() => {
    // Add JSON-LD BreadcrumbList
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://titanforcemulikandi.vercel.app',
        },
      ],
    }
    
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.innerHTML = JSON.stringify(breadcrumbSchema)
    document.head.appendChild(script)

    // Check sessionStorage after mount
    const alreadyShown = sessionStorage.getItem("hero-shown")
    if (alreadyShown) {
      setHasSeenAnimation(true)
      setHeroLoading(false)
    }

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  const handleLoadingChange = (loading: boolean) => {
    setHeroLoading(loading)
    if (!loading) {
      sessionStorage.setItem("hero-shown", "true")
    }
  }

  // Sample data for new sections
  const infoCards = [
    {
      icon: <Users2 className="w-8 h-8" />,
      label: "Players",
      value: "120+",
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      label: "Wins",
      value: "15+",
    },
    {
      icon: <Target className="w-8 h-8" />,
      label: "Teams",
      value: "8",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      label: "Goal One Vision",
      value: "1",
    },
    {
      icon: <Users2 className="w-8 h-8" />,
      label: "Fans",
      value: "1000+",
    },
  ]

  const newsItems = [
    {
      id: "1",
      title: "Titan Force Mulikandi kick off pre-season training",
      category: "Club News",
      date: "20 May 2024",
      image: "/images/hero-team.png",
    },
    {
      id: "2",
      title: "Dominant win in opening friendly match",
      category: "Match Report",
      date: "18 May 2024",
      image: "/images/team-celebration.png",
    },
    {
      id: "3",
      title: "Youth academy trials announcement",
      category: "Academy",
      date: "15 May 2024",
      image: "/placeholder.jpg",
    },
  ]

  const standings = [
    {
      rank: 1,
      team: "Titan Force Mulikandi",
      logo: "/logos/titanforce-logo.svg",
      played: 6,
      goalDiff: 12,
      points: 16,
      isCurrentTeam: true,
    },
    {
      rank: 2,
      team: "Greenfield FC",
      played: 6,
      goalDiff: 6,
      points: 13,
    },
    {
      rank: 3,
      team: "Riverside United",
      played: 6,
      goalDiff: 3,
      points: 10,
    },
    {
      rank: 4,
      team: "Blue Eagles",
      played: 6,
      goalDiff: 0,
      points: 8,
    },
    {
      rank: 5,
      team: "United Stars",
      played: 6,
      goalDiff: -5,
      points: 6,
    },
  ]

  const galleryImages = [
    {
      id: "1",
      image: "/images/hero-team.png",
      title: "Team Unity",
    },
    {
      id: "2",
      image: "/images/team-celebration.png",
      title: "Victory Celebration",
    },
    {
      id: "3",
      image: "/images/next-fixture.png",
      title: "Match Day",
    },
    {
      id: "4",
      image: "/placeholder.jpg",
      title: "Training Session",
    },
    {
      id: "5",
      image: "/placeholder.jpg",
      title: "Fan Support",
    },
    {
      id: "6",
      image: "/placeholder.jpg",
      title: "Trophy Moment",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero onLoadingChange={handleLoadingChange} skipAnimation={hasSeenAnimation} />
        
        {/* Info Cards */}
        <InfoCardsSection cards={infoCards} />

        {/* Fixtures and News Section */}
        <section className="py-16 md:py-24 border-t border-border/30">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Next Fixture */}
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-6">
                  Next Fixture
                </h2>
                <NextFixtureCard
                  competition="Local Championship"
                  homeTeam="Titan Force Mulikandi"
                  homeImage="/logos/titanforce-logo.svg"
                  awayTeam="Riverside United"
                  date="Sun, 26 May 2024"
                  time="4:00 PM"
                  location="Mulikandi Sports Ground"
                />
              </div>

              {/* Latest News */}
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-6">
                  Latest News
                </h2>
                <div className="space-y-4">
                  {newsItems.slice(0, 2).map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-lg border border-border/40 hover:border-primary/50 transition-all group cursor-pointer"
                    >
                      <span className="text-xs font-bold uppercase tracking-wider text-primary mb-2 block">
                        {item.category}
                      </span>
                      <h3 className="text-sm font-semibold text-white group-hover:text-primary transition-colors mb-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* League Standings */}
        <LeagueStandingsTable title="League Standings" standings={standings} />

        {/* About Section */}
        <AboutSection
          title="About Titan Force Mulikandi"
          description="Titan Force Mulikandi is more than just a football club. We are a family built on passion, discipline, and hard work. Our mission is to develop players, inspire the community, and compete at the highest level."
          imageUrl="/images/team-celebration.png"
        />

        {/* Gallery */}
        <GalleryGridSection title="Gallery" images={galleryImages} />

        {/* Join Community CTA */}
        <JoinCommunityCTA
          title="One Team, One Dream, One Community"
          subtitle="Be a part of something bigger"
          description="Support your local team. Support Titan Force Mulikandi."
        />

        {/* Stats Section */}
        <InfoCardsSection cards={infoCards} />

        <Contact />
      </main>
      {!heroLoading && <Footer />}
    </div>
  )
}
