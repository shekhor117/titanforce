import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Squad } from "@/components/squad"
import { Matches } from "@/components/matches"
import { MatchScoreboard } from "@/components/match-scoreboard"
import { JoinTitanForce } from "@/components/join-titan-force"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background stripe-bg">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Squad />
        <Matches />
        <MatchScoreboard />
        <JoinTitanForce />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
