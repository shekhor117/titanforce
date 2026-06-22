"use client"

import Image from "next/image"
import { useLanguage } from "@/lib/language-context"
import { Users, Trophy, Target, Heart } from "lucide-react"

export function HomeClubStats() {
  const { language } = useLanguage()
  const isBn = language === "bn"

  const stats = [
    {
      icon: "🛡️",
      label: isBn ? "প্রতিষ্ঠিত" : "Founded",
      value: "2024",
    },
    {
      icon: "🏟️",
      label: isBn ? "মাঠ" : "Home Ground",
      value: "Mulikandi",
    },
    {
      icon: "🎨",
      label: isBn ? "রঙ" : "Colors",
      value: "Red & Black",
    },
    {
      icon: "⭐",
      label: isBn ? "মূলমন্ত্র" : "Motto",
      value: "One Team, One Dream",
    },
    {
      icon: "👥",
      label: isBn ? "সম্প্রদায়" : "Community",
      value: "Stronger Together",
    },
  ]

  return (
    <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-gradient-to-b from-black to-black/80">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-6 rounded-lg hover:bg-red-950/20 transition-colors duration-300 group"
            >
              <div className="text-3xl sm:text-4xl md:text-5xl group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <p className={`text-xs sm:text-sm uppercase tracking-wider font-semibold text-foreground/60 text-center ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {stat.label}
              </p>
              <p className={`text-sm sm:text-base md:text-lg font-bold text-foreground text-center ${isBn ? "font-[var(--font-bengali)]" : "font-[var(--font-display)]"}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
