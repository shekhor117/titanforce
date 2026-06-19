"use client"

import { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"

function Loader() {
  return (
    <motion.div
      key="loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
      style={{ willChange: "opacity" }}
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
        style={{ backfaceVisibility: "hidden" }}
      >
        <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4-GKRGrLqIHbrZJqE1QHe1Em1K38VJVU.mp4" type="video/mp4" />
      </video>

      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none z-1"></div>

      {/* Content - Simplified animations */}
      <div className="relative z-10 text-center">
        {/* Logo Animation - Simplified */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          style={{ willChange: "opacity" }}
        >
          <h1
            className="text-6xl md:text-7xl font-bold text-white tracking-[0.15em] leading-none"
            style={{ 
              textShadow: "0 0 40px rgba(220, 38, 38, 0.3)",
            }}
          >
            TITAN FORCE
          </h1>
        </motion.div>

        {/* Divider Line - Optimized */}
        <motion.div
          className="flex items-center justify-center gap-4 my-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ willChange: "opacity" }}
        >
          <motion.div
            className="w-16 h-1 bg-gradient-to-r from-transparent to-red-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.35 }}
            style={{ willChange: "opacity" }}
          />
          <motion.div
            className="w-16 h-1 bg-gradient-to-l from-transparent to-red-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.35 }}
            style={{ willChange: "opacity" }}
          />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="text-foreground/50 text-xs md:text-sm tracking-[0.15em] uppercase font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{ willChange: "opacity" }}
        >
          Loading Experience
        </motion.p>
      </div>

      {/* Progress Bar - Using width animation but optimized */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-red-600 to-red-500"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 1.8, ease: "easeInOut" }}
        style={{ willChange: "width" }}
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
    // Use requestAnimationFrame to defer state updates
    const rafId = requestAnimationFrame(() => {
      setMounted(true)
      
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
    })

    return () => cancelAnimationFrame(rafId)
  }, [])

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>
  }

  const loaderContent = useMemo(() => showLoader ? <Loader /> : null, [showLoader])

  return (
    <>
      <AnimatePresence mode="wait">
        {loaderContent}
      </AnimatePresence>

      {children}
    </>
  )
}

