"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Squad } from "@/components/squad"
import { Matches } from "@/components/matches"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function Home() {
  const [heroLoading, setHeroLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setHeroLoading(false)
    }, 3500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-background stripe-bg">
      <Navbar />
      <main>
        <Hero onLoadingChange={setHeroLoading} />
        <About />
        <Squad />
        <Matches />
        <Contact />
      </main>
      {!heroLoading && <Footer />}
    </div>
  )
}
