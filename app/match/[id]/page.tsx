"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MatchDetails } from "@/components/match-details"
import { ArrowLeft, Loader } from "lucide-react"
import { useMatches } from "@/lib/use-data-store"
import type { Match } from "@/lib/data-service"

// Demo matches for showcase
const demoMatches: Match[] = [
  {
    id: 'demo-1',
    home: 'Titan Force',
    away: 'City United',
    date: '2024-07-15',
    time: '19:45',
    venue: 'Mulikandi Stadium',
    home_score: 3,
    away_score: 1,
    status: 'completed',
    result: 'W',
    homeGoals: [
      { player: 'Md. Hasan', minute: 12, assist: 'Rahman' },
      { player: 'Karim Ahmed', minute: 45, assist: undefined },
      { player: 'Md. Hasan', minute: 67, assist: 'Sakib' }
    ],
    awayGoals: [
      { player: 'Marcus Johnson', minute: 55, assist: undefined }
    ],
    home_lineup: [
      { player: 'Md. Hasan', number: 10, position: 'FW' },
      { player: 'Karim Ahmed', number: 9, position: 'FW' },
      { player: 'Rahman', number: 7, position: 'MF' },
      { player: 'Sakib', number: 8, position: 'MF' },
      { player: 'Rashid', number: 5, position: 'DEF' },
      { player: 'Hassan Ali', number: 4, position: 'DEF' },
      { player: 'Jahid', number: 3, position: 'DEF' },
      { player: 'Imran', number: 2, position: 'DEF' },
      { player: 'Rahim', number: 1, position: 'GK' }
    ],
    away_lineup: [
      { player: 'Marcus Johnson', number: 9, position: 'FW' },
      { player: 'Tom Wilson', number: 10, position: 'FW' },
      { player: 'David Smith', number: 7, position: 'MF' },
      { player: 'Chris Brown', number: 8, position: 'MF' },
      { player: 'John Davis', number: 5, position: 'DEF' },
      { player: 'Peter Miller', number: 4, position: 'DEF' },
      { player: 'Robert Taylor', number: 3, position: 'DEF' },
      { player: 'James Anderson', number: 2, position: 'DEF' },
      { player: 'Jack Wilson', number: 1, position: 'GK' }
    ],
    created_at: '2024-07-15T10:00:00Z',
    updated_at: '2024-07-15T21:30:00Z'
  },
  {
    id: 'demo-2',
    home: 'Titan Force',
    away: 'Diamond FC',
    date: '2024-07-22',
    time: '18:00',
    venue: 'Mulikandi Stadium',
    home_score: 2,
    away_score: 2,
    status: 'completed',
    result: 'D',
    homeGoals: [
      { player: 'Karim Ahmed', minute: 20, assist: undefined },
      { player: 'Md. Hasan', minute: 88, assist: 'Rahman' }
    ],
    awayGoals: [
      { player: 'Alex Turner', minute: 35, assist: 'Carlos' },
      { player: 'Oscar Mendez', minute: 76, assist: undefined }
    ],
    created_at: '2024-07-22T10:00:00Z',
    updated_at: '2024-07-22T19:30:00Z'
  }
]

export default function MatchPage() {
  const router = useRouter()
  const params = useParams()
  const matchId = params.id as string
  const { matches: realMatches, loading } = useMatches()
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)

  useEffect(() => {
    if (!loading) {
      // First try real matches, then fall back to demo matches
      let match = realMatches.find(m => m.id === matchId)
      if (!match) {
        match = demoMatches.find(m => m.id === matchId)
      }
      if (match) {
        setSelectedMatch(match)
      }
    }
  }, [matchId, realMatches, loading])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-foreground/60">Loading match details...</p>
        </div>
      </div>
    )
  }

  if (!selectedMatch) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-foreground/60 mb-6">Match not found</p>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded neo-btn text-primary hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded neo-btn text-primary hover:bg-secondary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        
        <MatchDetails match={selectedMatch} isModal={false} />
      </main>
      <Footer />
    </div>
  )
}
