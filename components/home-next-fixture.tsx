"use client"

import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { useMatches } from "@/lib/use-data-store"
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react"

export function HomeNextFixture() {
  const { language, t } = useLanguage()
  const isBn = language === "bn"
  const { matches } = useMatches()

  // Default match if none available
  const defaultMatch = {
    id: "1",
    home: "Titan Force Mulikandi",
    away: "Riverside United",
    date: "Sun, 26 May 2024",
    time: "4:00 PM",
    venue: "Mulikandi Sports Ground",
    competition: "Local Championship",
    status: "upcoming",
    homeLineup: [],
    awayLineup: [],
    homeGoals: [],
    awayGoals: [],
  }

  // Get the next upcoming match
  const nextMatch = matches && matches.length > 0 ? (matches.find((m) => m.status === "upcoming") || matches[0]) : defaultMatch

  // League standings data
  const standings = [
    { rank: 1, team: "Titan Force Mulikandi", played: 6, goalDiff: "+12", points: 16, isHighlighted: true },
    { rank: 2, team: "Greenfield FC", played: 6, goalDiff: "+6", points: 13 },
    { rank: 3, team: "Riverside United", played: 6, goalDiff: "+3", points: 10 },
    { rank: 4, team: "Blue Eagles", played: 6, goalDiff: "0", points: 8 },
    { rank: 5, team: "United Stars", played: 6, goalDiff: "-5", points: 6 },
  ]

  return (
    <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-gradient-to-b from-black to-black/80">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Next Fixture Card - Column 1 */}
          <div className="md:col-span-1 rounded-lg bg-gradient-to-br from-black to-red-950/20 border border-red-500/30 overflow-hidden hover:border-red-500 transition-all duration-300">
            <div className="p-6 sm:p-8">
              <h3 className={`text-lg sm:text-xl font-bold text-foreground mb-6 uppercase tracking-wider flex items-center gap-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                <span className="w-2 h-2 bg-red-500 rounded-full" />
                {isBn ? "পরবর্তী ম্যাচ" : "Next Fixture"}
              </h3>

              <div className="space-y-4">
                {/* Match Type */}
                <div>
                  <p className={`text-xs uppercase tracking-wider text-foreground/60 mb-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "প্রতিযোগিতা" : "Competition"}
                  </p>
                  <p className={`text-base font-semibold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {nextMatch.competition || "Local Championship"}
                  </p>
                </div>

                {/* Teams */}
                <div className="my-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center">
                        <span className="text-xs font-bold text-red-500">TF</span>
                      </div>
                      <p className={`text-xs font-semibold text-foreground text-center ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {nextMatch.home}
                      </p>
                    </div>
                    <div className="text-foreground/40 text-sm font-semibold">VS</div>
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-500">
                          {nextMatch.away.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <p className={`text-xs font-semibold text-foreground text-center ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {nextMatch.away}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-red-500" />
                  <div>
                    <p className={`text-xs uppercase tracking-wider text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                      {isBn ? "তারিখ" : "Date"}
                    </p>
                    <p className={`text-sm font-semibold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                      {nextMatch.date}
                    </p>
                  </div>
                </div>

                {/* Time */}
                {nextMatch.time && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-red-500" />
                    <div>
                      <p className={`text-xs uppercase tracking-wider text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "সময়" : "Time"}
                      </p>
                      <p className={`text-sm font-semibold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {nextMatch.time}
                      </p>
                    </div>
                  </div>
                )}

                {/* Venue */}
                {nextMatch.venue && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <div>
                      <p className={`text-xs uppercase tracking-wider text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "স্থান" : "Venue"}
                      </p>
                      <p className={`text-sm font-semibold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {nextMatch.venue}
                      </p>
                    </div>
                  </div>
                )}

                {/* Button */}
                <Link
                  href="/fixtures-results"
                  className="w-full mt-6 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-colors duration-300"
                >
                  {isBn ? "ম্যাচ সেন্টার" : "Match Centre"}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Latest News - Column 2 */}
          <div className="md:col-span-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg sm:text-xl font-bold text-foreground uppercase tracking-wider flex items-center gap-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                <span className="w-2 h-2 bg-red-500 rounded-full" />
                {isBn ? "সর্বশেষ খবর" : "Latest News"}
              </h3>
            </div>

            {/* News Items */}
            <div className="space-y-3">
              {[
                {
                  category: "Club News",
                  title: "Titan Force Mulikandi kick off pre-season training",
                  date: "20 May 2024",
                },
                {
                  category: "Match Report",
                  title: "Dominant win in opening friendly match",
                  date: "18 May 2024",
                },
                {
                  category: "Academy",
                  title: "Youth academy trials announcement",
                  date: "15 May 2024",
                },
              ].map((news, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-foreground/10 hover:border-red-500/30 bg-card/30 p-4 transition-all duration-300 hover:bg-card/50"
                >
                  <div className="flex gap-3">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-lg bg-red-500/10 flex-shrink-0 border border-red-500/20 overflow-hidden">
                      <Image
                        src={`https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=80&h=80&fit=crop`}
                        alt={news.title}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs uppercase tracking-wider font-bold text-red-500 mb-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {news.category}
                      </p>
                      <h4 className={`text-xs font-semibold text-foreground mb-1 line-clamp-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {news.title}
                      </h4>
                      <p className={`text-xs text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {news.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/gallery"
              className="text-red-500 hover:text-red-400 text-xs font-semibold flex items-center gap-1 transition-colors duration-300 mt-4"
            >
              {isBn ? "সব খবর দেখুন" : "View All News"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* League Standings - Column 3 */}
          <div className="md:col-span-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg sm:text-xl font-bold text-foreground uppercase tracking-wider flex items-center gap-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                <span className="w-2 h-2 bg-red-500 rounded-full" />
                {isBn ? "লীগ স্ট্যান্ডিংস" : "League Standings"}
              </h3>
            </div>

            {/* Standings Table */}
            <div className="rounded-lg overflow-hidden border border-foreground/10 bg-card/30 backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-foreground/10 bg-red-500/10">
                      <th className={`px-3 py-2 text-left text-xs uppercase tracking-wider font-semibold text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        #
                      </th>
                      <th className={`px-3 py-2 text-left text-xs uppercase tracking-wider font-semibold text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        Team
                      </th>
                      <th className={`px-3 py-2 text-center text-xs uppercase tracking-wider font-semibold text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        P
                      </th>
                      <th className={`px-3 py-2 text-center text-xs uppercase tracking-wider font-semibold text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        GD
                      </th>
                      <th className={`px-3 py-2 text-center text-xs uppercase tracking-wider font-semibold text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        PTS
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-foreground/10">
                    {standings.map((row, index) => (
                      <tr
                        key={index}
                        className={`transition-colors duration-300 hover:bg-red-500/5 ${
                          row.isHighlighted ? "bg-red-500/10 border-l-4 border-red-500" : ""
                        }`}
                      >
                        <td className={`px-3 py-2 font-bold text-foreground text-xs ${row.isHighlighted ? "text-red-500" : ""}`}>
                          {row.rank}
                        </td>
                        <td className={`px-3 py-2 font-semibold text-foreground text-xs ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                          {row.team}
                        </td>
                        <td className="px-3 py-2 text-center text-xs text-foreground/70">{row.played}</td>
                        <td className="px-3 py-2 text-center text-xs text-foreground/70">{row.goalDiff}</td>
                        <td className={`px-3 py-2 text-center font-bold text-xs ${row.isHighlighted ? "text-red-500 text-sm" : "text-foreground"}`}>
                          {row.points}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Link
              href="/fixtures-results"
              className="text-red-500 hover:text-red-400 text-xs font-semibold flex items-center gap-1 transition-colors duration-300 mt-4"
            >
              {isBn ? "সম্পূর্ণ টেবিল" : "View Full Table"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
