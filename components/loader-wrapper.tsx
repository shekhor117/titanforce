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
      }, 1600)

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
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center"
          >
            {/* Logo/Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center"
            >
              <motion.h1
                className="text-5xl md:text-7xl font-bold text-white tracking-[0.3em]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              >
                TITAN
              </motion.h1>
              
              <motion.div
                className="w-16 h-0.5 bg-red-600 mx-auto my-3"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
              />
              
              <motion.p
                className="text-red-600 text-sm md:text-base tracking-[0.2em] uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                Force Football Club
              </motion.p>
            </motion.div>

            {/* Loading dots */}
            <motion.div
              className="flex gap-1.5 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-2 h-2 bg-red-600 rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </>
  )
}
