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
      {/* Animated Grid Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(167, 25, 48, 0.05) 25%, rgba(167, 25, 48, 0.05) 26%, transparent 27%, transparent 74%, rgba(167, 25, 48, 0.05) 75%, rgba(167, 25, 48, 0.05) 76%, transparent 77%, transparent),
                            linear-gradient(90deg, transparent 24%, rgba(167, 25, 48, 0.05) 25%, rgba(167, 25, 48, 0.05) 26%, transparent 27%, transparent 74%, rgba(167, 25, 48, 0.05) 75%, rgba(167, 25, 48, 0.05) 76%, transparent 77%, transparent)`,
          backgroundSize: '60px 60px'
        }} />
        
        {/* Animated scan lines */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(167, 25, 48, 0.3) 0px, rgba(167, 25, 48, 0.3) 2px, transparent 2px, transparent 4px)',
            backgroundSize: '100% 4px'
          }}
          animate={{ backgroundPosition: ['0px 0px', '0px 4px'] }}
          transition={{ duration: 0.3, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Floating neon lines decoration */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="absolute w-96 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"
          style={{ filter: 'blur(8px)', boxShadow: '0 0 20px rgba(220, 38, 38, 0.6)' }}
          animate={{ 
            opacity: [0.3, 0.8, 0.3],
            scaleX: [0.8, 1, 0.8]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-96 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent rotate-90"
          style={{ filter: 'blur(8px)', boxShadow: '0 0 20px rgba(220, 38, 38, 0.6)' }}
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scaleY: [0.8, 1, 0.8]
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Neon border effect */}
        <div className="relative mb-8">
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{
              border: '2px solid',
              borderColor: 'rgba(167, 25, 48, 0.5)',
              boxShadow: '0 0 30px rgba(167, 25, 48, 0.3), inset 0 0 20px rgba(167, 25, 48, 0.1)',
              filter: 'blur(0.5px)'
            }}
            animate={{
              boxShadow: [
                '0 0 30px rgba(167, 25, 48, 0.3), inset 0 0 20px rgba(167, 25, 48, 0.1)',
                '0 0 40px rgba(167, 25, 48, 0.5), inset 0 0 30px rgba(167, 25, 48, 0.2)',
                '0 0 30px rgba(167, 25, 48, 0.3), inset 0 0 20px rgba(167, 25, 48, 0.1)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Logo with neon glow */}
          <h1
            className="text-6xl md:text-7xl font-bold text-white tracking-[0.15em] leading-none px-8 py-6 relative z-10"
            style={{ 
              textShadow: '0 0 10px rgba(220, 38, 38, 0.3), 0 0 30px rgba(167, 25, 48, 0.4), 0 0 50px rgba(167, 25, 48, 0.2)',
              letterSpacing: '0.15em'
            }}
          >
            TITAN
            <br />
            FORCE
          </h1>
        </div>

        {/* Animated corner brackets */}
        <div className="relative flex items-center justify-center gap-8 my-8">
          <motion.svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ filter: 'drop-shadow(0 0 8px rgba(167, 25, 48, 0.6))' }}
          >
            <path d="M10 10 L20 20 L10 30" stroke="rgba(167, 25, 48, 0.8)" strokeWidth="2" strokeLinecap="round" />
          </motion.svg>
          
          <motion.div
            className="w-12 h-1 bg-gradient-to-r from-red-600 to-transparent"
            style={{ boxShadow: '0 0 15px rgba(220, 38, 38, 0.6)' }}
            animate={{ scaleX: [0.5, 1, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          
          <motion.svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            style={{ filter: 'drop-shadow(0 0 8px rgba(167, 25, 48, 0.6))' }}
          >
            <path d="M30 10 L20 20 L30 30" stroke="rgba(167, 25, 48, 0.8)" strokeWidth="2" strokeLinecap="round" />
          </motion.svg>
        </div>

        {/* Subtitle with glow */}
        <motion.p
          className="text-xs md:text-sm tracking-[0.15em] uppercase font-light"
          style={{
            color: 'rgba(167, 25, 48, 0.8)',
            textShadow: '0 0 10px rgba(167, 25, 48, 0.4)'
          }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          Initializing System
        </motion.p>
      </div>

      {/* Neon progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-1"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(167, 25, 48, 0.8), transparent)',
          boxShadow: '0 0 20px rgba(220, 38, 38, 0.8)',
          filter: 'blur(0.5px)'
        }}
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 1.8, ease: "easeInOut" }}
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

