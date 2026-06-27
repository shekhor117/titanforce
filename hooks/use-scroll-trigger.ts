'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface ScrollTriggerOptions {
  onScroll?: (progress: number, velocity: number) => void
  onEnter?: () => void
  onLeave?: () => void
  threshold?: number
  margin?: number
}

export function useScrollTrigger(
  ref: React.RefObject<HTMLElement>,
  options: ScrollTriggerOptions = {}
) {
  const {
    onScroll,
    onEnter,
    onLeave,
    threshold = 0.3,
    margin = 0,
  } = options

  const [isVisible, setIsVisible] = useState(false)
  const lastScrollY = useRef(0)
  const lastTimestamp = useRef(0)

  const handleScroll = useCallback(() => {
    if (!ref.current) return

    const element = ref.current
    const rect = element.getBoundingClientRect()
    const elementTop = rect.top
    const elementHeight = rect.height
    const windowHeight = window.innerHeight

    // Calculate if element is in viewport with margin
    const triggerPoint = windowHeight - margin
    const isCurrentlyVisible =
      elementTop < triggerPoint && elementTop + elementHeight > 0

    // Detect enter/leave
    if (isCurrentlyVisible && !isVisible) {
      setIsVisible(true)
      onEnter?.()
    } else if (!isCurrentlyVisible && isVisible) {
      setIsVisible(false)
      onLeave?.()
    }

    // Calculate scroll progress (0 to 1)
    const elementCenter = elementTop + elementHeight / 2
    const progress = Math.max(
      0,
      Math.min(1, 1 - elementCenter / (windowHeight / 2))
    )

    // Calculate scroll velocity
    const now = Date.now()
    const deltaTime = now - lastTimestamp.current
    const deltaScroll = window.scrollY - lastScrollY.current
    const velocity = deltaTime > 0 ? deltaScroll / deltaTime : 0

    lastScrollY.current = window.scrollY
    lastTimestamp.current = now

    onScroll?.(progress, velocity)
  }, [ref, isVisible, onScroll, onEnter, onLeave, threshold, margin])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Call once on mount

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return { isVisible }
}

/**
 * Hook to track scroll velocity across the entire page
 */
export function usePageScrollVelocity() {
  const [velocity, setVelocity] = useState(0)
  const lastScrollY = useRef(0)
  const lastTimestamp = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now()
      const deltaTime = now - lastTimestamp.current
      const deltaScroll = window.scrollY - lastScrollY.current

      if (deltaTime > 0) {
        const newVelocity = deltaScroll / deltaTime
        setVelocity(Math.abs(newVelocity))
      }

      lastScrollY.current = window.scrollY
      lastTimestamp.current = now
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return velocity
}

/**
 * Hook to get scroll progress (0 to 1) from top to bottom of page
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = window.scrollY
      const newProgress = totalHeight > 0 ? scrolled / totalHeight : 0

      setProgress(newProgress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Call once on mount

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return progress
}
