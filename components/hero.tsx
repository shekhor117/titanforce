"use client"

import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"

export function Hero() {
  const { language, t } = useLanguage()
  const isBn = language === "bn"

  return (
    <section id="home" className="hero-gradient relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: "radial-gradient(circle at 70% 30%, var(--primary) 0%, transparent 60%)",
        }}
      />
      <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-36 text-center">
        <div className="animate-fade-up flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="Titan Force FC Logo"
            width={180}
            height={180}
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
        <div className="animate-fade-up">
          <p className={`text-sm uppercase tracking-[0.3em] mb-4 font-semibold text-primary ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {t.hero.subtitle}
          </p>
        </div>
        <h2 className={`text-5xl md:text-7xl lg:text-8xl leading-none tracking-wide text-foreground animate-fade-up animation-delay-100 ${isBn ? "font-[var(--font-bengali)] font-bold" : "font-[var(--font-display)]"}`}>
          {t.hero.welcome}
          <br />
          <span className="text-primary">{t.hero.clubName}</span>
        </h2>
        <p className={`mt-6 text-lg text-foreground/70 max-w-xl mx-auto animate-fade-up animation-delay-200 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {t.hero.tagline}
        </p>
        <div className="mt-8 flex justify-center gap-4 animate-fade-up animation-delay-300">
          <Link
            href="#squad"
            className={`px-6 py-3 font-bold text-sm uppercase tracking-wider rounded bg-primary text-primary-foreground hover:opacity-90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
          >
            {t.hero.viewSquad}
          </Link>
          <Link
            href="#matches"
            className={`px-6 py-3 font-bold text-sm uppercase tracking-wider rounded border-2 border-primary text-primary hover:bg-primary/10 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
          >
            {t.hero.matches}
          </Link>
        </div>
      </div>
    </section>
  )
}
