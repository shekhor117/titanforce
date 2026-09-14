"use client"

import { useEffect, useRef, useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { usePlayers } from "@/lib/use-data-store"
import { Zap } from "lucide-react"

export function About() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { language, t } = useLanguage()
  const isBn = language === "bn"

  // Get players from realtime hook
  const { players } = usePlayers()
  const activePlayers = Array.isArray(players) ? players.filter(p => p.status?.toLowerCase() === "active") : []
  const aboutTitle = t.about.title
  const aboutDescription = t.about.description

  const stats = [
    { value: activePlayers.length.toString(), label: t.about.players },
    { value: "icon", label: t.about.spirit, isIcon: true },
    { value: "1", label: t.about.team },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="py-16 px-4">
      <div
        className={`max-w-4xl mx-auto text-center transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
      >
        <p className={`text-sm uppercase tracking-[0.2em] font-semibold mb-2 text-primary ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {t.about.location}
        </p>
        <h2 className={`text-4xl md:text-5xl tracking-wide mb-6 text-foreground ${isBn ? "font-[var(--font-bengali)] font-bold" : "font-[var(--font-display)]"}`}>
          {aboutTitle}
        </h2>
        <p className={`text-lg leading-relaxed text-foreground/80 max-w-2xl mx-auto ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {aboutDescription}
        </p>
        <div className="grid grid-cols-3 gap-6 mt-12 max-w-lg mx-auto">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="font-[var(--font-display)] text-4xl text-primary">
                {stat.isIcon ? (
                  <div className="flex justify-center">
                    <Zap className="w-12 h-12 text-accent animate-pulse drop-shadow-[0_0_8px_rgba(217,30,63,0.6)]" />
                  </div>
                ) : (
                  stat.value
                )}
              </div>
              <div className={`text-xs uppercase tracking-wider text-foreground/60 mt-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-6 text-left md:grid-cols-2">
          <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Our story</p>
            <h3 className="mt-3 text-2xl font-bold text-foreground">Built in Mulikandi, driven by belief.</h3>
            <p className="mt-4 leading-7 text-foreground/70">
              Titan Force Mulikandi FC was created to give local footballers a platform to grow, compete, and represent their community with pride. We are building more than a match-day squad: we are building a culture where discipline, respect, and ambition belong to everyone.
            </p>
          </article>
          <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Our mission</p>
            <h3 className="mt-3 text-2xl font-bold text-foreground">Make every player better.</h3>
            <p className="mt-4 leading-7 text-foreground/70">
              From grassroots development to competitive football, we create an environment where players can improve their game and character. Every training session, fixture, and supporter helps move the club forward.
            </p>
          </article>
        </div>

        <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-left md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">What we stand for</p>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <div><h3 className="font-bold text-foreground">Passion</h3><p className="mt-2 text-sm leading-6 text-foreground/70">We play with energy and purpose, no matter the opponent.</p></div>
            <div><h3 className="font-bold text-foreground">Unity</h3><p className="mt-2 text-sm leading-6 text-foreground/70">Players, coaches, families, and supporters move as one.</p></div>
            <div><h3 className="font-bold text-foreground">Progress</h3><p className="mt-2 text-sm leading-6 text-foreground/70">We learn from every match and keep raising our standards.</p></div>
          </div>
        </div>
      </div>
    </section>
  )
}
