"use client"

import { usePlayers } from "@/lib/use-data-store"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function PlayersGrid() {
  const { players } = usePlayers()

  // Get active players for display
  const activePlayers = Array.isArray(players) 
    ? players.filter(p => p.status?.toLowerCase() === "active").slice(0, 6)
    : []

  return (
    <section className="py-12 md:py-16 px-4 bg-black/40">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-accent rounded-full" />
            <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-wider">
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

        {/* Players Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {activePlayers.length > 0 ? (
            activePlayers.map((player, idx) => (
              <Link
                key={player.id}
                href={`/team-squad/${player.id}`}
                className="group relative"
              >
                {/* Player Card */}
                <div className="relative overflow-hidden rounded-lg border border-red-500/20 hover:border-red-500/50 transition-all duration-300">
                  {/* Jersey Number - Top Badge */}
                  <div className="absolute top-2 right-2 z-10 flex gap-2">
                    <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                      <span className="text-xs font-bold text-black">
                        {player.jersey_number || idx + 1}
                      </span>
                    </div>
                  </div>

                  {/* Player Image or Placeholder */}
                  <div className="relative w-full aspect-square bg-gradient-to-br from-red-900/40 to-black/60 overflow-hidden">
                    {player.image ? (
                      <Image
                        src={player.image}
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
                    <h3 className="text-sm font-bold text-white group-hover:text-red-500 transition-colors line-clamp-1">
                      {player.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {player.position || "Player"}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-400 text-sm">No players available</p>
            </div>
          )}
        </div>

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
