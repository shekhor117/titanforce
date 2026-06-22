"use client"

import { ReactNode } from "react"

interface InfoCard {
  icon: ReactNode
  label: string
  value: string
}

interface InfoCardsSectionProps {
  cards: InfoCard[]
}

export function InfoCardsSection({ cards }: InfoCardsSectionProps) {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-transparent to-primary/5">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {cards.map((card, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-muted/50 transition-colors"
            >
              {/* Icon */}
              <div className="mb-3 text-primary">
                {card.icon}
              </div>

              {/* Value */}
              <p className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
                {card.value}
              </p>

              {/* Label */}
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {card.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
