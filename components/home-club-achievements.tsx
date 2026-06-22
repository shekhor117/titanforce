"use client"

import { useLanguage } from "@/lib/language-context"

export function HomeClubAchievements() {
  const { language } = useLanguage()
  const isBn = language === "bn"

  const achievements = [
    {
      icon: "👥",
      value: "120+",
      label: isBn ? "খেলোয়াড়" : "Players",
    },
    {
      icon: "🏆",
      value: "15+",
      label: isBn ? "বিজয়" : "Wins",
    },
    {
      icon: "🎯",
      value: "8",
      label: isBn ? "দল" : "Teams",
    },
    {
      icon: "⚽",
      value: "1",
      label: isBn ? "অপলাল ওয়ান ভিশন" : "Opal One Vision",
    },
    {
      icon: "❤️",
      value: "1000+",
      label: isBn ? "ভক্ত" : "Fans",
    },
  ]

  return (
    <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
          {achievements.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-3 p-4 sm:p-6 rounded-lg hover:bg-red-500/10 transition-colors duration-300"
            >
              <div className="text-3xl sm:text-4xl md:text-5xl">{item.icon}</div>
              <p className={`text-base sm:text-lg md:text-2xl font-bold text-red-500 text-center ${isBn ? "font-[var(--font-bengali)]" : "font-[var(--font-display)]"}`}>
                {item.value}
              </p>
              <p className={`text-xs sm:text-sm uppercase tracking-wider text-foreground/60 text-center ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
