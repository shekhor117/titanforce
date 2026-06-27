"use client"

import { usePlayers } from "@/lib/use-data-store"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"
import { ScrollAnimatedElement } from "./scroll-animated-element"
import { ScrollProgressAnimation } from "./scroll-progress-animation"

export function PlayersGrid() {
  const { players } = usePlayers()
  const [api, setApi] = useState<any>(null)

  // Get all active players for carousel
  const activePlayers = Array.isArray(players) 
    ? players.filter(p => p.status?.toLowerCase() === "active")
    : []

  return (
    <section className="py-12 md:py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-accent rounded-full" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground uppercase tracking-wider">
              Players
            </h2>
          </div>
          <Link
            href="/team-squad"
            className="text-accent hover:text-primary text-sm font-semibold flex items-center gap-2 transition-colors group"
          >
            View all players
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Players Carousel */}
        <ScrollAnimatedElement variant="fadeInUp">
          {activePlayers.length > 0 ? (
            <div className="relative px-12">
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              setApi={setApi}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {activePlayers.map((player, idx) => (
                  <CarouselItem key={player.id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/6">
                    <ScrollProgressAnimation delay={idx * 0.05} animationType="scale">
                    <Link
                      href={`/player/${player.num}`}
                      className="group relative block h-full pointer-events-auto"
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                    >
                      {/* Player Card */}
                      <div className="relative overflow-hidden rounded-lg border border-red-500/20 hover:border-red-500/50 transition-all duration-300 h-full pointer-events-none">
                        {/* Jersey Number - Top Badge */}
                        <div className="absolute top-2 right-2 z-10 flex gap-2">
                          <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                            <span className="text-xs font-bold text-black">
                              {player.num || idx + 1}
                            </span>
                          </div>
                        </div>

                        {/* Player Image or Placeholder */}
                        <div className="relative w-full aspect-square bg-gradient-to-br from-red-900/40 to-black/60 overflow-hidden">
                          {player.image_url ? (
                            <Image
                              src={player.image_url}
                              alt={player.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-3xl text-red-500/20 font-bold mb-2">👤</div>
                                <p className="text-xs text-white/20">Player</p>
                              </div>
                            </div>
                          )}
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {/* Player Info */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                          <h3 className="text-sm font-bold text-foreground group-hover:text-red-500 transition-colors line-clamp-1">
                            {player.name}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {player.position || "Player"}
                          </p>
                        </div>
                      </div>
                    </Link>
                    </ScrollProgressAnimation>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious 
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-red-600/20 hover:bg-red-600/40 border-red-500/50 text-white h-10 w-10 rounded-full"
              />
              <CarouselNext 
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-red-600/20 hover:bg-red-600/40 border-red-500/50 text-white h-10 w-10 rounded-full"
              />
            </Carousel>
          </div>
        ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-sm">No players available</p>
            </div>
          )}
        </ScrollAnimatedElement>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link
            href="/team-squad"
            className="inline-flex items-center gap-2 px-8 py-3 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-white text-sm uppercase tracking-widest rounded transition-all group"
          >
            View all players
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
