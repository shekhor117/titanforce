"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"

const tabs = [
  {
    id: "players",
    labelEn: "Players",
    labelBn: "খেলোয়াড়",
    contentEn: "Explore our squad roster with detailed player profiles, statistics, and achievements.",
    contentBn: "আমাদের দলের খেলোয়াড়দের বিস্তারিত তথ্য, পরিসংখ্যান এবং কৃতিত্ব দেখুন।",
    link: "#squad"
  },
  {
    id: "matches",
    labelEn: "Matches",
    labelBn: "ম্যাচ",
    contentEn: "View upcoming fixtures and latest match results with detailed statistics.",
    contentBn: "আসন্ন ম্যাচ এবং সর্বশেষ ফলাফল বিস্তারিত তথ্য সহ দেখুন।",
    link: "#matches"
  },
  {
    id: "about",
    labelEn: "About",
    labelBn: "সম্পর্কে",
    contentEn: "Learn about Titan Force FC's history, mission, and legacy in football.",
    contentBn: "টাইটান ফোর্স FC এর ইতিহাস, মিশন এবং ফুটবল ঐতিহ্য সম্পর্কে জানুন।",
    link: "#about"
  },
  {
    id: "contact",
    labelEn: "Contact",
    labelBn: "যোগাযোগ",
    contentEn: "Get in touch with us for partnerships, sponsorships, and inquiries.",
    contentBn: "অংশীদারিত্ব, স্পন্সরশিপ এবং অনুসন্ধানের জন্য আমাদের সাথে যোগাযোগ করুন।",
    link: "#contact"
  },
]

export function AnimatedTabs() {
  const [activeTab, setActiveTab] = useState("players")
  const { language } = useLanguage()
  const isBn = language === "bn"

  const activeContent = tabs.find((tab) => tab.id === activeTab)

  return (
    <section className="py-12 md:py-16 px-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 md:gap-3 bg-secondary/30 p-2 md:p-3 rounded-2xl border-2 border-secondary mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative px-4 md:px-5 py-2 md:py-3 rounded-xl text-xs md:text-sm font-semibold text-foreground"
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-primary rounded-xl"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}

              <span
                className={`relative z-10 transition-colors ${
                  activeTab === tab.id
                    ? "text-primary-foreground"
                    : "text-foreground/70 group-hover:text-foreground"
                } ${isBn ? "font-[var(--font-bengali)]" : ""}`}
              >
                {isBn ? tab.labelBn : tab.labelEn}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-card border-2 border-secondary rounded-2xl p-6 md:p-8 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.3,
              }}
            >
              <h2 className={`text-2xl md:text-3xl font-[var(--font-display)] tracking-wider text-primary mb-3 md:mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? activeContent?.labelBn : activeContent?.labelEn}
              </h2>

              <p className={`text-foreground/80 leading-relaxed mb-6 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? activeContent?.contentBn : activeContent?.contentEn}
              </p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <a
                  href={activeContent?.link}
                  className="inline-block px-6 py-2 bg-primary text-primary-foreground font-bold text-xs md:text-sm uppercase tracking-wider rounded-lg hover:opacity-90 transition-opacity"
                >
                  {isBn ? "আরও জানুন" : "Learn More"}
                </a>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
