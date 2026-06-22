"use client"

import { useLanguage } from "@/lib/language-context"
import { useState } from "react"
import { Mail, CheckCircle } from "lucide-react"

export function HomepageNewsletter() {
  const { language, t } = useLanguage()
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [agree, setAgree] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && agree) {
      setSubscribed(true)
      setEmail("")
      setAgree(false)
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-primary rounded-full mix-blend-screen" />
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="glass-card rounded-lg p-8 md:p-12 text-center space-y-6">
          {/* Icon */}
          <div className="inline-block">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="font-[var(--font-display)] text-3xl md:text-5xl uppercase tracking-wider text-foreground">
            {language === "bn" ? "পরিবারে যোগ দিন" : "JOIN THE FAMILY"}
          </h2>

          {/* Description */}
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === "bn"
              ? "আমাদের নিউজলেটার সাবস্ক্রাইব করুন এবং সর্বশেষ খবর, ম্যাচ আপডেট এবং এক্সক্লুসিভ অফার পান।"
              : "Subscribe to our newsletter and never miss the latest news, matches and offers."}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder={language === "bn" ? "আপনার ইমেল" : "Enter your email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input w-full px-4 py-3 rounded placeholder:text-muted-foreground text-foreground"
              required
            />

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="agree"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="w-4 h-4 mt-1"
                required
              />
              <label htmlFor="agree" className="text-xs text-muted-foreground">
                {language === "bn"
                  ? "আমি গোপনীয়তা নীতি এবং শর্তাবলীতে সম্মত।"
                  : "I agree to the Privacy Policy and Terms of Use"}
              </label>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wider rounded hover:bg-accent transition-colors duration-300 hover-lift"
            >
              {subscribed ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {language === "bn" ? "সাবস্ক্রাইব হয়েছে!" : "Subscribed!"}
                </span>
              ) : (
                (language === "bn" ? "সাবস্ক্রাইব করুন" : "SUBSCRIBE")
              )}
            </button>
          </form>

          {/* Privacy Notice */}
          <p className="text-xs text-muted-foreground">
            {language === "bn"
              ? "আমরা আপনার তথ্য কখনো তৃতীয় পক্ষের সাথে শেয়ার করি না।"
              : "© 2024 Titan Force. All rights reserved."}
          </p>
        </div>
      </div>
    </section>
  )
}
