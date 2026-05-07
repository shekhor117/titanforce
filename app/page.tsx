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
  // Check if hero animation has been shown this session
  const [heroLoading, setHeroLoading] = useState(() => {
    if (typeof window !== "undefined") {
      return !sessionStorage.getItem("hero-shown")
    }
    return true
  })

  useEffect(() => {
    // Skip animation if already shown this session
    if (sessionStorage.getItem("hero-shown")) {
      setHeroLoading(false)
      return
    }

    const timer = setTimeout(() => {
      setHeroLoading(false)
      sessionStorage.setItem("hero-shown", "true")
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
