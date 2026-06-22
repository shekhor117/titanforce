"use client"

import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"

export function HomeCommunitySection() {
  const { language } = useLanguage()
  const isBn = language === "bn"

  return (
    <section className="py-16 sm:py-20 md:py-24 px-3 sm:px-4 bg-gradient-to-r from-black via-red-950/20 to-black relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: 'url(/images/hero-bg-soccer.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-black/60 z-1" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight ${isBn ? "font-[var(--font-bengali)]" : "font-[var(--font-display)]"}`}>
                {isBn ? "একটি দল একটি স্বপ্ন একটি সম্প্রদায়" : "One Team. One Dream. One Community."}
              </h2>
              <p className={`text-base sm:text-lg text-white/80 leading-relaxed ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn
                  ? "আরও একটি ক্লাব নয়। আমরা একটি শক্তি। আপনার স্থানীয় দলকে সমর্থন করুন। টাইটান ফোর্স মুলিকান্দিকে সমর্থন করুন।"
                  : "More than a club. Support your local team. Support Titan Force Mulikandi."}
              </p>
            </div>

            <Link
              href="/about"
              className="inline-flex px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider rounded-lg transition-colors duration-300 w-fit"
            >
              {isBn ? "আমাদের সম্প্রদায়ে যোগ দিন" : "Join the Club"}
            </Link>
          </div>

          {/* Right Content - Team Image */}
          <div className="relative h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden border-2 border-red-500/30 group">
            <Image
              src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=600&fit=crop"
              alt="Team"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
