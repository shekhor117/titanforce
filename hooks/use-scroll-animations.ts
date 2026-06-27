'use client'

import { useRef, useEffect } from 'react'
import { useMotionValue, useTransform } from 'framer-motion'

export interface ScrollAnimationConfig {
  threshold?: number
  margin?: string
  duration?: number
}

/**
 * Hook to detect when element enters viewport and return animation state
 */
export function useScrollIntoView(config: ScrollAnimationConfig = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useMotionValue(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isInView.set(entry.isIntersecting ? 1 : 0)
      },
      {
        threshold: config.threshold ?? 0.1,
        rootMargin: config.margin ?? '0px 0px -100px 0px',
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isInView, config.threshold, config.margin])

  return { ref, isInView }
}

/**
 * Hook for parallax scroll effect
 */
export function useParallaxScroll(speed: number = 0.5) {
  const ref = useRef<HTMLDivElement>(null)
  const yOffset = useMotionValue(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const elementTop = rect.top
      const windowHeight = window.innerHeight

      const offset = (windowHeight - elementTop) * speed * 0.5
      yOffset.set(offset)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed, yOffset])

  return { ref, yOffset }
}

/**
 * Hook for counter animation on scroll
 */
export function useScrollCounter(end: number, duration: number = 2) {
  const ref = useRef<HTMLDivElement>(null)
  const count = useMotionValue(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true

          const startTime = Date.now()
          const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000
            const progress = Math.min(elapsed / duration, 1)

            count.set(Math.floor(end * progress))

            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }

          animate()
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [count, end, duration])

  return { ref, count }
}
