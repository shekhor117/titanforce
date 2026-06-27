'use client'

import { motion } from 'framer-motion'
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AboutPageContent } from "@/components/about-page-content"
import { EntranceReveal } from "@/components/entrance-reveal"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 md:py-24">
          {/* Hero Content */}
          <motion.div 
            className="relative max-w-6xl mx-auto px-4 text-center z-10"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-black tracking-wider text-white mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            >
              ABOUT US
            </motion.h1>
            <motion.p 
              className="text-lg text-white font-semibold max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            >
              Learn about Titan Force FC&apos;s history, mission, and values
            </motion.p>
          </motion.div>
        </section>

        {/* Content Section */}
        <EntranceReveal delay={0.3} duration={0.6} variant="fadeInUp">
          <AboutPageContent />
        </EntranceReveal>
      </main>
      <Footer />
    </div>
  )
}
