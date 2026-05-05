import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { LineupBuilder } from "@/components/lineup-builder"
import { TacticalBoard } from "@/components/tactical-board"
import { MatchVoting } from "@/components/match-voting"
import { PlayerRanking } from "@/components/player-ranking"
import { TrainingChart } from "@/components/training-chart"
import { InjuryTracking } from "@/components/injury-tracking"

export const metadata = {
  title: "Advanced Features | Titan Force FC",
  description: "Explore advanced features including lineup builder, tactical board, match voting, player rankings, training performance, and injury tracking.",
}

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background stripe-bg">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="py-20 px-4 text-center hero-gradient">
          <p className="text-sm uppercase tracking-[0.2em] font-semibold mb-2 text-primary">
            ADVANCED TOOLS
          </p>
          <h1 className="font-[var(--font-display)] text-5xl md:text-7xl tracking-wide text-foreground mb-4">
            TEAM FEATURES
          </h1>
          <p className="text-foreground/70 max-w-xl mx-auto">
            Explore our comprehensive suite of tools for lineup building, tactical planning, player analytics, and more.
          </p>
        </section>

        <LineupBuilder />
        <TacticalBoard />
        <MatchVoting />
        <PlayerRanking />
        <TrainingChart />
        <InjuryTracking />
      </main>
      <Footer />
    </div>
  )
}
