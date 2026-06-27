'use client'

import { useRef, useEffect, useState } from 'react'

interface ScrollProgressAnimationProps {
  children: React.ReactNode
  className?: string
}

/**
 * Animation that triggers continuously as you scroll
 * Shows visual feedback based on scroll position and velocity
 */
export function ScrollProgressAnimation({
  children,
  className = '',
}: ScrollProgressAnimationProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [scrollData, setScrollData] = useState({ progress: 0, velocity: 0 })
  const lastScrollY = useRef(0)
  const lastTimestamp = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const element = ref.current
      if (!element) return

      const rect = element.getBoundingClientRect()
      const elementTop = rect.top
      const elementHeight = rect.height
      const windowHeight = window.innerHeight

      // Calculate how far down the element is in the viewport (0 to 1)
      const elementCenter = elementTop + elementHeight / 2
      const viewportCenter = windowHeight / 2
      const progress = Math.max(0, Math.min(1, 1 - (elementCenter - viewportCenter) / viewportCenter))

      // Calculate velocity
      const now = Date.now()
      const deltaTime = now - lastTimestamp.current
      const deltaScroll = window.scrollY - lastScrollY.current
      const velocity = deltaTime > 0 ? Math.abs(deltaScroll / deltaTime) : 0

      setScrollData({ progress, velocity })

      lastScrollY.current = window.scrollY
      lastTimestamp.current = now

      // Apply dynamic styles based on scroll
      element.style.opacity = String(0.5 + progress * 0.5)
      element.style.transform = `translateY(${-progress * 20}px) scale(${0.95 + progress * 0.05})`
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: 'all 0.1s ease-out',
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </div>
  )
}

/**
 * Creates a parallax effect that moves based on scroll
 */
export function ScrollParallax({
  children,
  className = '',
  speed = 0.5,
}: {
  children: React.ReactNode
  className?: string
  speed?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const element = ref.current
      if (!element) return

      const rect = element.getBoundingClientRect()
      const elementTop = rect.top
      const windowHeight = window.innerHeight

      // Calculate offset based on position in viewport
      const offset = (windowHeight - elementTop) * speed

      element.style.transform = `translateY(${offset * 0.3}px)`
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: 'transform 0.1s ease-out',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  )
}

/**
 * Animates a counter based on scroll progress through an element
 */
export function ScrollCounter({
  from = 0,
  to = 100,
  className = '',
  suffix = '',
}: {
  from?: number
  to?: number
  className?: string
  suffix?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(from)

  useEffect(() => {
    const handleScroll = () => {
      const element = ref.current
      if (!element) return

      const rect = element.getBoundingClientRect()
      const elementTop = rect.top
      const elementHeight = rect.height
      const windowHeight = window.innerHeight

      // Calculate scroll progress through element
      const elementBottom = elementTop + elementHeight
      const progress = Math.max(
        0,
        Math.min(
          1,
          1 - (elementTop - windowHeight) / (elementHeight + windowHeight)
        )
      )

      const newCount = Math.floor(from + (to - from) * progress)
      setCount(newCount)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [from, to])

  return (
    <div ref={ref} className={className}>
      {count}
      {suffix}
    </div>
  )
}

/**
 * Creates a fill animation based on scroll progress
 */
export function ScrollFill({
  children,
  className = '',
  direction = 'top',
}: {
  children: React.ReactNode
  className?: string
  direction?: 'top' | 'bottom' | 'left' | 'right'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const element = ref.current
      const fill = fillRef.current
      if (!element || !fill) return

      const rect = element.getBoundingClientRect()
      const elementTop = rect.top
      const elementHeight = rect.height
      const windowHeight = window.innerHeight

      // Calculate scroll progress
      const elementCenter = elementTop + elementHeight / 2
      const progress = Math.max(
        0,
        Math.min(1, 1 - (elementCenter - windowHeight / 2) / (windowHeight / 2))
      )

      const fillPercent = progress * 100

      if (direction === 'top' || direction === 'bottom') {
        fill.style.height = `${fillPercent}%`
      } else {
        fill.style.width = `${fillPercent}%`
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [direction])

  return (
    <div ref={ref} className={className}>
      <div
        ref={fillRef}
        className="absolute inset-0 bg-primary/20 transition-all duration-100"
        style={{
          [direction === 'top' || direction === 'bottom' ? 'height' : 'width']: '0%',
          [direction === 'bottom' ? 'bottom' : direction === 'right' ? 'right' : 'top']: 0,
          [direction === 'left' || direction === 'right' ? 'height' : 'width']: '100%',
        }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}
