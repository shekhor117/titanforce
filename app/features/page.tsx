"use client"

import { Canvas } from "@react-three/fiber"
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
import { useScene3D } from "@/lib/3d/scene-config"
import { ParticleSystem } from "@/components/3d/particle-system"

export default function FeaturesPage() {
  const sceneConfig = useScene3D()

  return (
    <div className="min-h-screen bg-background stripe-bg relative w-full">
      {/* 3D Background Scene */}
      <div className="fixed inset-0 w-full h-screen z-0">
        <Canvas
          camera={{
            position: sceneConfig.camera.position,
            fov: sceneConfig.camera.fov,
            near: sceneConfig.camera.near,
            far: sceneConfig.camera.far,
          }}
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <color attach="background" args={[sceneConfig.background]} />
          {sceneConfig.fog && <fog attach="fog" args={[sceneConfig.fogColor, sceneConfig.fogNear, sceneConfig.fogFar]} />}
          <ambientLight intensity={0.6} color="#ffffff" />
          <directionalLight intensity={0.8} color="#ffffff" position={[10, 10, 10]} />
          <pointLight intensity={0.5} color="#60a5fa" position={[0, 5, 0]} />
          <ParticleSystem />
        </Canvas>
      </div>

      {/* 2D Content Overlay */}
      <div className="relative z-10 min-h-screen bg-background stripe-bg">
        <Navbar />
        <main>
          {/* Hero */}
          <section className="py-20 px-4 text-center hero-gradient">
            <div className="max-w-6xl mx-auto">
              <BackButton className="mb-6" />
            </div>
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
    </div>
  )
}
}
