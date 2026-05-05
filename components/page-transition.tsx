"use client"

import { useTransition } from "@/lib/transition-context"
import { useEffect, useState } from "react"

export function PageTransition() {
  const { isTransitioning } = useTransition()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* Fade Out Overlay */}
      <div
        className={`
          fixed inset-0 z-[999]
          bg-background
          transition-opacity duration-300
          pointer-events-none
          ${isTransitioning ? "opacity-100" : "opacity-0"}
        `}
      />
      
      {/* Optional: Loading indicator */}
      {isTransitioning && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center pointer-events-none">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        </div>
      )}
    </>
  )
}
