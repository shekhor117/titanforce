"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

function Loader() {
  return (
    <motion.div
      key="loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
      style={{ willChange: "opacity", contain: "layout" }}
    >
      {/* Optimized Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        crossOrigin="anonymous"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-70"
        style={{ 
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          contain: "strict"
        }}
      >
        <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4-GKRGrLqIHbrZJqE1QHe1Em1K38VJVU.mp4" type="video/mp4" />
      </video>

      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none z-1"></div>

      {/* Content - Minimal animations */}
      <div className="relative z-10 text-center">
        {/* Logo - Fade only */}
        <h1
          className="text-6xl md:text-7xl font-bold text-white tracking-[0.15em] leading-none animate-in fade-in duration-600 delay-100"
          style={{ 
            textShadow: "0 0 40px rgba(220, 38, 38, 0.3)",
          }}
        >
          TITAN FORCE
        </h1>

        {/* Divider Lines - Simple fade */}
        <div className="flex items-center justify-center gap-4 my-6 animate-in fade-in duration-500 delay-300">
          <div className="w-16 h-1 bg-gradient-to-r from-transparent to-red-600" />
          <div className="w-16 h-1 bg-gradient-to-l from-transparent to-red-600" />
        </div>

        {/* Subtitle - Fade only */}
        <p className="text-foreground/50 text-xs md:text-sm tracking-[0.15em] uppercase font-light animate-in fade-in duration-500 delay-500">
          Loading Experience
        </p>
      </div>

      {/* Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-red-600 to-red-500"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 1.6, ease: "easeInOut" }}
        style={{ willChange: "width", contain: "layout" }}
      />
    </motion.div>
  )
}

export default function LoaderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const [showLoader, setShowLoader] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    try {
      // Check sessionStorage only after mount
      const alreadyVisited = sessionStorage.getItem("titan-visited")

      if (!alreadyVisited) {
        setShowLoader(true)
        sessionStorage.setItem("titan-visited", "true")

        const timer = setTimeout(() => {
          setShowLoader(false)
        }, 2000)

        return () => clearTimeout(timer)
      }
    } catch (error) {
      console.log("[v0] SessionStorage error:", error)
      // Continue without loader if sessionStorage fails
    }
  }, [])

  // Prevent hydration mismatch - render children immediately
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {showLoader && <Loader />}
      </AnimatePresence>

      {children}
    </>
  )
}

