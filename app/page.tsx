"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { FeaturedPlayers } from "@/components/featured-players"
import { Squad } from "@/components/squad"
import { Matches } from "@/components/matches"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function Home() {
  // Check if hero animation has been shown this session
  const [hasSeenAnimation, setHasSeenAnimation] = useState(false)
  const [heroLoading, setHeroLoading] = useState(true)

  useEffect(() => {
    // Check sessionStorage after mount
    const alreadyShown = sessionStorage.getItem("hero-shown")
    if (alreadyShown) {
      setHasSeenAnimation(true)
      setHeroLoading(false)
    }
  }, [])

  const handleLoadingChange = (loading: boolean) => {
    setHeroLoading(loading)
    if (!loading) {
      sessionStorage.setItem("hero-shown", "true")
    }
  }

  return (
    <div className="min-h-screen bg-background stripe-bg">
      <Navbar />
      <main>
        <Hero onLoadingChange={handleLoadingChange} skipAnimation={hasSeenAnimation} />
        <About />
        <FeaturedPlayers />
        <Squad />
        <Matches />
        <Contact />
      </main>
      {!heroLoading && <Footer />}
    </div>
  )
}
