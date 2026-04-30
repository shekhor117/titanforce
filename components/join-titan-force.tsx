"use client"

import { useLanguage } from "@/lib/language-context"
import Link from "next/link"

export function JoinTitanForce() {
  const { language, t } = useLanguage()
  const isBn = language === "bn"

  return (
    <section id="join" className="bg-primary/10 border-t-2 border-b-2 border-primary py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <p className={`text-sm uppercase tracking-[0.2em] font-semibold mb-3 text-primary ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {t.join.subtitle}
        </p>
        <h2 className={`text-4xl md:text-6xl tracking-wide mb-6 text-foreground ${isBn ? "font-[var(--font-bengali)] font-bold" : "font-[var(--font-display)]"}`}>
          {t.join.title}
        </h2>
        <p className={`text-lg text-foreground/80 max-w-2xl mx-auto mb-8 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {t.join.description}
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="p-6 rounded-lg border-2 border-primary/30 bg-black/30 hover:border-primary hover:bg-primary/10 transition-all">
            <div className={`text-3xl mb-3 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>⚽</div>
            <h3 className={`font-bold text-lg mb-2 text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {t.join.card1Title}
            </h3>
            <p className={`text-sm text-foreground/70 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {t.join.card1Desc}
            </p>
          </div>

          <div className="p-6 rounded-lg border-2 border-primary/30 bg-black/30 hover:border-primary hover:bg-primary/10 transition-all">
            <div className={`text-3xl mb-3 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>🏆</div>
            <h3 className={`font-bold text-lg mb-2 text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {t.join.card2Title}
            </h3>
            <p className={`text-sm text-foreground/70 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {t.join.card2Desc}
            </p>
          </div>

          <div className="p-6 rounded-lg border-2 border-primary/30 bg-black/30 hover:border-primary hover:bg-primary/10 transition-all">
            <div className={`text-3xl mb-3 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>🤝</div>
            <h3 className={`font-bold text-lg mb-2 text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {t.join.card3Title}
            </h3>
            <p className={`text-sm text-foreground/70 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {t.join.card3Desc}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="#contact"
            className={`px-8 py-4 font-bold text-sm uppercase tracking-wider rounded bg-primary text-primary-foreground hover:opacity-90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
          >
            {t.join.contactBtn}
          </Link>
          <a
            href="mailto:titanforcefc@gmail.com"
            className={`px-8 py-4 font-bold text-sm uppercase tracking-wider rounded border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
          >
            {t.join.emailBtn}
          </a>
        </div>
      </div>
    </section>
  )
}
