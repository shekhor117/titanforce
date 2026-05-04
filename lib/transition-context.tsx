"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"

interface TransitionContextType {
  isTransitioning: boolean
  startTransition: () => void
  endTransition: () => void
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined)

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false)

  const startTransition = useCallback(() => {
    setIsTransitioning(true)
  }, [])

  const endTransition = useCallback(() => {
    setIsTransitioning(false)
  }, [])

  // Auto-reset transition after page navigation completes
  useEffect(() => {
    if (isTransitioning) {
      // Reset transition after fade-out + navigation time
      const timer = setTimeout(() => {
        setIsTransitioning(false)
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [isTransitioning])

  return (
    <TransitionContext.Provider value={{ isTransitioning, startTransition, endTransition }}>
      {children}
    </TransitionContext.Provider>
  )
}

export function useTransition() {
  const context = useContext(TransitionContext)
  if (!context) {
    throw new Error("useTransition must be used within TransitionProvider")
  }
  return context
}
