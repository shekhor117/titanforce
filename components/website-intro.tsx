"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

export default function WebsiteIntro({
  children,
}: {
  children: React.ReactNode
}) {
  const [showIntro, setShowIntro] =
    useState(false)

  const [mounted, setMounted] =
    useState(false)

  useEffect(() => {
    setMounted(true)

    if (typeof window === "undefined")
      return

    // Show intro only first open
    const introSeen =
      sessionStorage.getItem(
        "titan-intro-seen"
      )

    if (!introSeen) {
      setShowIntro(true)

      sessionStorage.setItem(
        "titan-intro-seen",
        "true"
      )

      const timer = setTimeout(() => {
        setShowIntro(false)
      }, 2600)

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
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
            className="fixed inset-0 z-[999999] bg-black overflow-hidden flex items-center justify-center"
          >
            {/* Background */}
            <div className="absolute inset-0">

              {/* Stadium Image */}
              <img
                src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1600&auto=format&fit=crop"
                alt="Football Stadium"
                className="w-full h-full object-cover opacity-20"
              />

              <div className="absolute inset-0 bg-black/80" />

              {/* Glow */}
              <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-red-600/20 rounded-full blur-3xl" />

              <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-red-500/10 rounded-full blur-3xl" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center text-center px-6">

              {/* Logo */}
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
                className="w-28 h-28 rounded-full border-4 border-red-600 bg-black flex items-center justify-center"
              >
                <span className="text-white text-4xl font-black">
                  TF
                </span>
              </motion.div>

              {/* Club Name */}
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
                  delay: 0.3,
                  duration: 0.8,
                }}
                className="mt-8 text-6xl md:text-8xl font-black tracking-[0.2em]"
              >
                TITAN
              </motion.h1>

              <motion.h2
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.5,
                  duration: 0.8,
                }}
                className="text-3xl md:text-5xl font-light tracking-[0.5em] text-zinc-300 mt-2"
              >
                FORCE
              </motion.h2>

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
                  delay: 0.8,
                  duration: 0.7,
                }}
                className="mt-6 text-zinc-400 uppercase tracking-[0.35em] text-sm"
              >
                Football Club • Mulikandi
              </motion.p>

              {/* Line Animation */}
              <motion.div
                initial={{
                  width: 0,
                }}
                animate={{
                  width: 180,
                }}
                transition={{
                  delay: 1,
                  duration: 0.8,
                }}
                className="h-[2px] bg-red-500 mt-8"
              />

              {/* Bottom Text */}
              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  delay: 1.3,
                  duration: 0.8,
                }}
                className="mt-8 text-zinc-500 text-sm tracking-[0.25em]"
              >
                BUILT FROM PASSION
              </motion.p>

            </div>

            {/* Bottom Gradient */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </>
  )
}