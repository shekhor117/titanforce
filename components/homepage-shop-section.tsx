"use client"

import { useLanguage } from "@/lib/language-context"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"

export function HomepageShopSection() {
  const { language, t } = useLanguage()

  return (
    <section className="py-16 md:py-24 bg-secondary relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary rounded-full mix-blend-screen" />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <p className="text-xs md:text-sm uppercase tracking-[0.2em] font-semibold text-primary">
              {language === "bn" ? "শপ" : "SHOP"}
            </p>
            <h2 className="font-[var(--font-display)] text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider text-foreground leading-tight">
              NEW HOME KIT<br />
              2024/25
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-md">
              {language === "bn"
                ? "আমাদের নতুন হোম কিট এখন উপলব্ধ। এক্সক্লুসিভ ডিজাইন এবং উচ্চমানের উপকরণ দিয়ে তৈরি।"
                : "Introducing our stunning new home kit for the 2024/25 season. Featuring exclusive design and premium quality materials."}
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-bold text-sm md:text-base uppercase tracking-wider rounded hover:bg-accent transition-colors duration-300 hover-lift"
            >
              <ShoppingBag className="w-5 h-5" />
              {language === "bn" ? "এখনই কিনুন" : "SHOP NOW"}
            </Link>
          </div>

          {/* Right Image */}
          <div className="relative h-96 md:h-full min-h-[400px]">
            <Image
              src="/images/kit-placeholder.jpg"
              alt="New Home Kit 2024/25"
              fill
              className="object-cover rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = "none"
              }}
            />
            {/* Fallback - gradient background */}
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-primary/30 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <ShoppingBag className="w-12 h-12 text-primary opacity-50" />
                </div>
                <p className="text-muted-foreground text-sm">Jersey Image</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
