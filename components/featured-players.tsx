"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import dynamic from "next/dynamic"
import { useLanguage } from "@/lib/language-context"
import { dataStore, Player, useDataStore } from "@/lib/data-store"
import { ChevronLeft, ChevronRight } from "lucide-react"

const Player3DCard = dynamic(() => import("@/components/3d-player-card").then(mod => ({ default: mod.Player3DCard })), {
  ssr: false,
  loading: () => <div className="w-full h-80 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg" />,
})

export function FeaturedPlayers() {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const containerRef = useRef<HTMLElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { language, t } = useLanguage()
  const isBn = language === "bn"

  // Get top players by rating
  const fallbackPlayers = useDataStore(dataStore.getPlayers, "players")
  const players = Array.isArray(fallbackPlayers) ? fallbackPlayers : []
  const topPlayers = (players ?? [])
    .filter((p) => p?.status?.toLowerCase() === "active")
    .slice(0, 6)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320
      const newPosition = direction === "left" 
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount
      
      scrollRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      })
      setScrollPosition(newPosition)
    }
  }

  if (topPlayers.length === 0) {
    return null
  }

  return (
    <section
      ref={containerRef}
      className="py-12 sm:py-16 px-3 sm:px-4 bg-gradient-to-br from-card/50 to-background"
    >
      {/* Header */}
      <div
        className={`text-center mb-8 sm:mb-12 transition-all duration-600 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <p
          className={`text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold mb-2 text-primary ${
            isBn ? "font-[var(--font-bengali)]" : ""
          }`}
        >
          {isBn ? "শীর্ষ খেলোয়াড়" : "Featured Players"}
        </p>
        <h2
          className={`text-3xl sm:text-4xl md:text-5xl tracking-wide text-foreground ${
            isBn ? "font-[var(--font-bengali)] font-bold" : "font-[var(--font-display)]"
          }`}
        >
          {isBn ? "দলের তারকারা" : "Team Stars"}
        </h2>
      </div>

      {/* Scroll Container with Navigation */}
      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-primary/90 text-primary-foreground hover:bg-primary transition-all opacity-0 group-hover:opacity-100 ${
            scrollPosition === 0 ? "opacity-0 pointer-events-none" : ""
          }`}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Players Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollBehavior: "smooth" }}
        >
          {topPlayers.map((player, index) => (
            <Link
              key={player.id}
              href={`/player/${player.num}`}
              className={`flex-shrink-0 w-full sm:w-80 group/card snap-center transition-all duration-600 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="rounded-xl overflow-hidden border-2 border-secondary bg-card hover:border-primary transition-all hover:-translate-y-1 h-80">
                {/* 3D Jersey Model Container */}
                <div className="w-full h-48 bg-gradient-to-br from-slate-900 to-slate-800 relative">
                  <Player3DCard playerNumber={player.num} name={player.name} />
                </div>

                {/* Player Info */}
                <div className="p-4 sm:p-5 bg-gradient-to-br from-card to-card/50">
                  <h3 className="font-[var(--font-display)] text-xl sm:text-2xl tracking-wider text-foreground font-bold mb-1">
                    {player.name.toUpperCase()}
                  </h3>
                  <p className="text-sm uppercase tracking-wider text-foreground/70 mb-3">
                    {player.position}
                  </p>

                  {/* Stats */}
                  <div className="flex gap-3 text-xs">
                    <div className="flex-1 p-2 rounded bg-secondary/50 text-center">
                      <div className="font-bold text-primary">{player.goals || 0}</div>
                      <div className="text-foreground/60 text-[10px]">{isBn ? "গোল" : "Goals"}</div>
                    </div>
                    <div className="flex-1 p-2 rounded bg-secondary/50 text-center">
                      <div className="font-bold text-primary">{player.assists || 0}</div>
                      <div className="text-foreground/60 text-[10px]">{isBn ? "সহায়তা" : "Assists"}</div>
                    </div>
                    <div className="flex-1 p-2 rounded bg-secondary/50 text-center">
                      <div className="font-bold text-primary">{player.appearances || 0}</div>
                      <div className="text-foreground/60 text-[10px]">{isBn ? "ম্যাচ" : "Matches"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-primary/90 text-primary-foreground hover:bg-primary transition-all opacity-0 group-hover:opacity-100"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* View All Link */}
      <div className="flex justify-center mt-8 sm:mt-12">
        <Link
          href="#squad"
          className="px-6 sm:px-8 py-3 text-sm font-bold uppercase tracking-wider rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
        >
          {isBn ? "সমস্ত খেলোয়াড় দেখুন" : "View All Players"}
        </Link>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}
