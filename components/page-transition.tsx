"use client"

import { useTransition } from "@/lib/transition-context"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function PageTransition() {
  const { isTransitioning } = useTransition()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <AnimatePresence mode="wait">
      {isTransitioning && (
        <motion.div
          key="transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="fixed inset-0 z-[999] bg-background pointer-events-none"
        >
          {/* Loading indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{ 
                duration: 0.8, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="w-3 h-3 bg-primary rounded-full shadow-lg" style={{ 
                boxShadow: "0 0 20px rgba(220, 38, 38, 0.6)" 
              }} />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

