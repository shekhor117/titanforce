"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

export default function LoaderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Prevent SSR sessionStorage error
    if (typeof window === "undefined") return

    // Check if loader already shown
    const alreadyLoaded = sessionStorage.getItem("titan-force-loaded")

    // First visit only
    if (!alreadyLoaded) {
      setLoading(true)

      const timer = setTimeout(() => {
        setLoading(false)

        // Save session
        sessionStorage.setItem("titan-force-loaded", "true")
      }, 1800)

      return () => clearTimeout(timer)
    }
  }, [])

  // Prevent hydration mismatch
  if (!mounted) return null

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
            className="fixed inset-0 z-[99999] bg-black flex items-center justify-center overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute w-[300px] h-[300px] bg-red-600/20 rounded-full blur-3xl" />

            {/* Logo */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.8,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                ease: "easeOut",
              }}
              className="relative z-10 flex flex-col items-center"
            >
              <h1 className="text-white text-5xl md:text-7xl font-black tracking-[0.3em]">
                TITAN
              </h1>

              <div className="h-[2px] w-24 bg-red-500 my-4" />

              <p className="text-zinc-400 tracking-[0.5em] text-sm uppercase">
                Force Football Club
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </>
  )
}
