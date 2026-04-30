"use client"

import { useEffect, useRef, useState } from "react"
import { useLanguage } from "@/lib/language-context"

export function About() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { language, t } = useLanguage()
  const isBn = language === "bn"

  const stats = [
    { value: "10+", label: t.about.players },
    { value: "⚡", label: t.about.spirit },
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
          {t.about.title}
        </h2>
        <p className={`text-lg leading-relaxed text-foreground/80 max-w-2xl mx-auto ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {t.about.description}
        </p>
        <div className="grid grid-cols-3 gap-6 mt-12 max-w-lg mx-auto">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="font-[var(--font-display)] text-4xl text-primary">{stat.value}</div>
              <div className={`text-xs uppercase tracking-wider text-foreground/60 mt-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
