'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AboutPageContent } from "@/components/about-page-content"
import { EntranceReveal } from "@/components/entrance-reveal"

const About3DScene = dynamic(() => import('@/components/3d-about-scene').then(mod => ({ default: mod.About3DScene })), {
  loading: () => <div className="w-full h-64 bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 rounded-lg" />,
})

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero Section with 3D Background */}
        <section className="hero-gradient relative overflow-hidden py-16 md:py-24">
          {/* 3D Scene Background */}
          <div className="absolute inset-0 z-0 opacity-40">
            <About3DScene />
          </div>

          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden z-1">
            <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-[-150px] right-[-100px] w-[450px] h-[450px] bg-accent/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-primary/10 rounded-full blur-3xl animate-blob" />
          </div>

          <div
            className="absolute inset-0 opacity-10 z-1"
            style={{
              background: "radial-gradient(circle at 70% 30%, var(--primary) 0%, transparent 60%)",
            }}
          />

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
