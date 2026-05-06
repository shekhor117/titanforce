"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

export default function OpeningAnimation({
  children,
}: {
  children: React.ReactNode
}) {
  const [showIntro, setShowIntro] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    if (typeof window === "undefined") return

    // Show only first website open
    const alreadyOpened = sessionStorage.getItem("titan-opening-animation")

    if (!alreadyOpened) {
      setShowIntro(true)

      sessionStorage.setItem("titan-opening-animation", "true")

      const timer = setTimeout(() => {
        setShowIntro(false)
      }, 2400)

      return () => clearTimeout(timer)
    }
  }, [])

  // Prevent hydration mismatch
  if (!mounted) return null

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
            className="fixed inset-0 z-[999999] overflow-hidden bg-black flex items-center justify-center"
          >
            {/* Background */}
            <div className="absolute inset-0">
              {/* Stadium Image */}
              <img
                src="https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?q=80&w=1600&auto=format&fit=crop"
                alt="stadium"
                className="w-full h-full object-cover opacity-20"
              />

              <div className="absolute inset-0 bg-black/80" />

              {/* Red Glow */}
              <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] bg-red-600/20 rounded-full blur-3xl" />

              <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-red-500/10 rounded-full blur-3xl" />
            </div>

            {/* Center Content */}
            <div className="relative z-10 flex flex-col items-center">
              {/* Logo Circle */}
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.7,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.7,
                  ease: "easeOut",
                }}
                className="w-28 h-28 rounded-full border-4 border-red-600 bg-black flex items-center justify-center shadow-2xl"
              >
                <span className="text-white text-4xl font-black tracking-wider">
                  TF
                </span>
              </motion.div>

              {/* TITAN FORCE */}
              <motion.h1
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.3,
                }}
                className="mt-8 text-5xl md:text-7xl font-black tracking-[0.25em] text-white"
              >
                TITAN FORCE
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.6,
                }}
                className="mt-4 text-zinc-400 uppercase tracking-[0.5em] text-sm"
              >
                Football Club
              </motion.p>

              {/* Loading Bar */}
              <motion.div
                initial={{
                  width: 0,
                }}
                animate={{
                  width: "220px",
                }}
                transition={{
                  duration: 1.4,
                  delay: 0.8,
                  ease: "easeInOut",
                }}
                className="mt-10 h-[3px] bg-red-600 rounded-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </>
  )
}
