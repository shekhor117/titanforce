"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MatchDetails } from "@/components/match-details"
import { ArrowLeft, Loader } from "lucide-react"
import { useMatches } from "@/lib/use-data-store"
import type { Match } from "@/lib/data-service"

export default function MatchPage() {
  const router = useRouter()
  const params = useParams()
  const matchId = params.id as string
  const { matches: realMatches, loading } = useMatches()
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)

  useEffect(() => {
    if (!loading) {
      const match = realMatches.find(m => m.id === matchId)
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
