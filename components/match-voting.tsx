"use client"

import { useState, useEffect, useRef } from "react"
import { ThumbsUp, Trophy, Star, Users, ChevronDown, ChevronUp } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface Player {
  id: number
  name: string
  number: number
  position: string
  votes: number
}

interface MatchVote {
  matchId: string
  homeTeam: string
  awayTeam: string
  date: string
  players: Player[]
  motmVotes: Record<number, number>
  hasVoted: boolean
}

const initialPlayers: Player[] = [
  { id: 1, name: "Shuronjit", number: 1, position: "GK", votes: 0 },
  { id: 2, name: "Srijon", number: 3, position: "DEF", votes: 0 },
  { id: 3, name: "Akash", number: 4, position: "DEF", votes: 0 },
  { id: 4, name: "Sujon", number: 6, position: "MID", votes: 0 },
  { id: 5, name: "Shuvo", number: 7, position: "FWD", votes: 0 },
  { id: 6, name: "Sojib", number: 8, position: "MID", votes: 0 },
  { id: 7, name: "Sajon", number: 9, position: "FWD", votes: 0 },
  { id: 8, name: "Kourov", number: 11, position: "FWD", votes: 0 },
  { id: 9, name: "Shekhor", number: 17, position: "DEF", votes: 0 },
]

export function MatchVoting() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [players, setPlayers] = useState(initialPlayers)
  const [showResults, setShowResults] = useState(false)
  const [matchRating, setMatchRating] = useState<number>(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const handleVote = () => {
    if (selectedPlayer === null) return

    setPlayers(prev =>
      prev.map(p =>
        p.id === selectedPlayer ? { ...p, votes: p.votes + 1 } : p
      )
    )
    setHasVoted(true)
    setShowResults(true)
  }

  const totalVotes = players.reduce((sum, p) => sum + p.votes, 0)
  const sortedPlayers = [...players].sort((a, b) => b.votes - a.votes)
  const topPlayer = sortedPlayers[0]

  return (
    <section ref={sectionRef} className="py-16 px-4 bg-card/50">
      <div className="max-w-4xl mx-auto">
        <div className={`text-center mb-10 transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className={`text-sm uppercase tracking-[0.2em] font-semibold mb-2 text-primary ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "ভোট দিন" : "CAST YOUR VOTE"}
          </p>
          <h2 className={`text-4xl md:text-5xl tracking-wide text-foreground ${isBn ? "font-[var(--font-bengali)] font-bold" : "font-[var(--font-display)]"}`}>
            {isBn ? "ম্যাচের সেরা" : "MAN OF THE MATCH"}
          </h2>
        </div>

        {/* Match Info */}
        <div className={`text-center mb-8 p-4 rounded-xl bg-card border-2 border-secondary transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="font-[var(--font-display)] text-2xl tracking-wider text-foreground mb-1">
            TITAN FORCE <span className="text-primary">3 - 1</span> RIVAL FC
          </div>
          <p className="text-sm text-foreground/60">{isBn ? "সর্বশেষ ম্যাচ" : "Latest Match"} • 28 Apr 2025</p>
        </div>

        {/* Match Rating */}
        <div className={`mb-8 p-4 rounded-xl bg-card border-2 border-secondary transition-all duration-600 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h3 className={`text-xs uppercase tracking-wider font-semibold text-primary mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "ম্যাচ রেটিং" : "Rate This Match"}
          </h3>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setMatchRating(star)}
                className={`p-2 transition ${matchRating >= star ? "text-yellow-400" : "text-foreground/30 hover:text-yellow-400/50"}`}
              >
                <Star className={`w-8 h-8 ${matchRating >= star ? "fill-current" : ""}`} />
              </button>
            ))}
          </div>
          {matchRating > 0 && (
            <p className={`text-center text-sm text-foreground/60 mt-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? `আপনি ${matchRating}/5 দিয়েছেন` : `You rated ${matchRating}/5`}
            </p>
          )}
        </div>

        {!hasVoted ? (
          <>
            {/* Player Selection */}
            <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 transition-all duration-600 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              {players.map(player => (
                <button
                  key={player.id}
                  onClick={() => setSelectedPlayer(player.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedPlayer === player.id
                      ? "border-primary bg-primary/10 scale-105"
                      : "border-secondary bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-[var(--font-display)] text-lg ${
                      selectedPlayer === player.id ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                    }`}>
                      {player.number}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-foreground">{player.name}</div>
                      <div className="text-xs text-foreground/60">{player.position}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Vote Button */}
            <button
              onClick={handleVote}
              disabled={selectedPlayer === null}
              className={`w-full py-4 rounded-xl font-bold uppercase tracking-wider transition ${
                selectedPlayer !== null
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "bg-secondary/50 text-foreground/50 cursor-not-allowed"
              } ${isBn ? "font-[var(--font-bengali)]" : ""}`}
            >
              <ThumbsUp className="w-5 h-5 inline mr-2" />
              {isBn ? "ভোট জমা দিন" : "Submit Vote"}
            </button>
          </>
        ) : (
          <>
            {/* Results */}
            <div className={`mb-6 transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              {/* Winner Card */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary mb-6 text-center">
                <Trophy className="w-12 h-12 text-primary mx-auto mb-3" />
                <p className={`text-xs uppercase tracking-wider text-primary mb-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "বর্তমান নেতৃত্বে" : "Currently Leading"}
                </p>
                <h3 className="font-[var(--font-display)] text-3xl tracking-wider text-foreground">
                  {topPlayer.name.toUpperCase()}
                </h3>
                <div className="flex items-center justify-center gap-1 mt-2 text-foreground/60">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{topPlayer.votes} {isBn ? "ভোট" : "votes"}</span>
                </div>
              </div>

              {/* Toggle Results */}
              <button
                onClick={() => setShowResults(!showResults)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-secondary/50 text-foreground hover:bg-secondary transition mb-4"
              >
                {showResults ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                <span className={`text-sm font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {showResults ? (isBn ? "ফলাফল লুকান" : "Hide Results") : (isBn ? "ফলাফল দেখুন" : "Show Results")}
                </span>
              </button>

              {showResults && (
                <div className="space-y-3">
                  {sortedPlayers.map((player, index) => {
                    const percentage = totalVotes > 0 ? (player.votes / totalVotes) * 100 : 0
                    return (
                      <div
                        key={player.id}
                        className={`p-3 rounded-xl bg-card border-2 ${index === 0 ? "border-primary" : "border-secondary"}`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-[var(--font-display)] text-sm ${
                            index === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                          }`}>
                            {player.number}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-foreground">{player.name}</span>
                              <span className="text-sm text-foreground/60">{player.votes} {isBn ? "ভোট" : "votes"}</span>
                            </div>
                          </div>
                        </div>
                        <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <p className={`text-center text-sm text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "ভোট দেওয়ার জন্য ধন্যবাদ!" : "Thank you for voting!"}
            </p>
          </>
        )}
      </div>
    </section>
  )
}
