"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function LoaderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const [showLoader, setShowLoader] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Check sessionStorage only after mount
    const alreadyVisited = sessionStorage.getItem("titan-visited")

    if (!alreadyVisited) {
      setShowLoader(true)
      sessionStorage.setItem("titan-visited", "true")

      const timer = setTimeout(() => {
        setShowLoader(false)
      }, 2200)

      return () => clearTimeout(timer)
    }
  }, [])

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {showLoader && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-950 via-red-950 to-slate-900 flex flex-col items-center justify-center overflow-hidden"
            style={{ willChange: "opacity" }}
          >
            {/* Video Background */}
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover z-0 opacity-40"
            >
              <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4-CuTDy6CwqRbR09SWUXdXVIEB4400d.mp4" type="video/mp4" />
            </video>

            {/* Gradient overlay for burgundy effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-red-950/30 to-slate-900/40 pointer-events-none z-1"></div>

            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Logo Animation */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.8, 
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: 0.1
                }}
                style={{ willChange: "transform, opacity" }}
              >
                <motion.h1
                  className="text-7xl md:text-8xl font-bold text-white tracking-[0.3em] leading-none"
                  style={{ 
                    textShadow: "0 0 40px rgba(220, 38, 38, 0.3)",
                    willChange: "transform"
                  }}
                >
                  TITAN
                </motion.h1>
              </motion.div>

              {/* Divider Line */}
              <motion.div
                className="flex items-center justify-center gap-4 my-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{ willChange: "opacity" }}
              >
                <motion.div
                  className="w-12 h-0.5 bg-gradient-to-r from-transparent to-red-600"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                  origin="left"
                  style={{ willChange: "transform" }}
                />
                <motion.div
                  className="w-2 h-2 bg-red-600 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  style={{ willChange: "transform" }}
                />
                <motion.div
                  className="w-12 h-0.5 bg-gradient-to-l from-transparent to-red-600"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                  origin="right"
                  style={{ willChange: "transform" }}
                />
              </motion.div>

              {/* Subtitle */}
              <motion.p
                className="text-red-600 text-xs md:text-sm tracking-[0.25em] uppercase font-semibold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                style={{ willChange: "opacity, transform" }}
              >
                Force Football Club
              </motion.p>

              {/* Tagline */}
              <motion.p
                className="text-foreground/40 text-xs md:text-sm tracking-[0.15em] uppercase mt-3 font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                style={{ willChange: "opacity" }}
              >
                Pride · Passion · Power
              </motion.p>
            </div>

            {/* Loading Progress Dots */}
            <motion.div
              className="flex gap-2 mt-12 relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              style={{ willChange: "opacity" }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2.5 h-2.5 bg-red-600 rounded-full"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 1, 0.4]
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                  style={{ willChange: "transform, opacity" }}
                />
              ))}
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-red-600 to-red-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              style={{ willChange: "width" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </>
  )
}

