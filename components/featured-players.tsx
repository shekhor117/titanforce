"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { usePlayers } from "@/lib/use-data-store"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { EntranceReveal } from "@/components/entrance-reveal"
import { ScrollStaggerContainer } from "@/components/scroll-stagger-container"

export function FeaturedPlayers() {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const containerRef = useRef<HTMLElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { language, t } = useLanguage()
  const isBn = language === "bn"

  // Get top players by rating using the realtime hook
  const { players } = usePlayers()
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
    <EntranceReveal delay={0.2} duration={0.6} variant="fadeInUp">
      <section
        ref={containerRef}
        className="py-12 md:py-16 px-3 md:px-4 bg-gradient-to-br from-card/50 to-background"
      >
      {/* Header */}
      <div
        className={`text-center mb-8 md:mb-12 transition-all duration-600 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <p
          className={`text-xs md:text-sm uppercase tracking-[0.2em] font-semibold mb-2 text-primary ${
            isBn ? "font-[var(--font-bengali)]" : ""
          }`}
        >
          {isBn ? "শীর্ষ খেলোয়াড়" : "Featured Players"}
        </p>
        <h2
          className={`text-3xl md:text-4xl lg:text-5xl tracking-wide text-foreground ${
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
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full glass-btn-primary text-foreground hover-lift transition-all duration-300 opacity-0 group-hover:opacity-100 ${
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
              className={`flex-shrink-0 w-full md:w-80 group/card snap-center transition-all duration-600 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="neo-floating overflow-hidden">
                {/* Player Image */}
                <div className="relative w-full aspect-square overflow-hidden bg-secondary/30">
                  {player.image_url ? (
                    <Image
                      src={player.image_url}
                      alt={player.name}
                      fill
                      className="object-cover object-top group-hover/card:scale-110 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, 320px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                      <span className="text-6xl font-[var(--font-display)] text-primary font-bold">
                        {player.num}
                      </span>
                    </div>
                  )}
                  
                  {/* Jersey Number Badge */}
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-[var(--font-display)] text-lg font-bold shadow-lg">
                    {player.num}
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                </div>

                {/* Player Info */}
                <div className="p-4 md:p-5">
                  <h3 className="font-[var(--font-display)] text-xl md:text-2xl tracking-wider text-foreground font-bold mb-1">
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
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full glass-btn-primary text-foreground hover-lift transition-all duration-300 opacity-0 group-hover:opacity-100"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* View All Link */}
      <div className="flex justify-center mt-8 md:mt-12">
        <Link
          href="#squad"
          className="neo-btn px-6 md:px-8 py-3"
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
    </EntranceReveal>
  )
}
