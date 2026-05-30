import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { LineupBuilder } from "@/components/lineup-builder"
import { TacticalBoard } from "@/components/tactical-board"
import { MatchVoting } from "@/components/match-voting"
import { PlayerRanking } from "@/components/player-ranking"
import { TrainingChart } from "@/components/training-chart"
import { InjuryTracking } from "@/components/injury-tracking"
import { BackButton } from "@/components/back-button"
import { TeamStatsOverview } from "@/components/team-stats-overview"

export const metadata = {
  title: "Advanced Features | Titan Force FC",
  description: "Explore advanced features including lineup builder, tactical board, match voting, player rankings, training performance, and injury tracking.",
}

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden py-20 px-4 text-center hero-gradient">
          {/* Video Background */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-50"
          >
            <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hf_20260422_112520_ee819691-f2e8-4c54-bb77-3fb72c84eaa5-LVCrNS2l5ZBP2HgZJecZ81pM0cyMRZ.mp4" type="video/mp4" />
          </video>

          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden z-1">
            <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-[-150px] right-[-100px] w-[450px] h-[450px] bg-accent/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-primary/10 rounded-full blur-3xl animate-blob" />
          </div>

          <div
            className="absolute inset-0 opacity-10 z-1"
            style={{
              background: "radial-gradient(circle at 70% 30%, var(--primary) 0%, transparent 60%)",
            }}
          />

          <div className="max-w-6xl mx-auto relative z-10">
            <BackButton className="mb-6" />
          </div>
          <p className="text-sm uppercase tracking-[0.2em] font-semibold mb-2 text-primary relative z-10">
            ADVANCED TOOLS
          </p>
          <h1 className="font-[var(--font-display)] text-5xl md:text-7xl tracking-wide text-foreground mb-4 relative z-10">
            TEAM FEATURES
          </h1>
          <p className="text-foreground/70 max-w-xl mx-auto relative z-10">
            Explore our comprehensive suite of tools for lineup building, tactical planning, player analytics, and more.
          </p>
        </section>

        {/* Team Stats Overview - Client Component */}
        <TeamStatsOverview />

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
