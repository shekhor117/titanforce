'use client'

import { useRef, useEffect } from 'react'
import { motion, useMotionValue, useTransform, useMotionTemplate } from 'framer-motion'

interface ScrollProgressAnimationProps {
  children: React.ReactNode
  className?: string
}

/**
 * ScrollProgressAnimation - উচ্চ দৃশ্যমান স্ক্রল অ্যানিমেশন
 * প্রতিটি স্ক্রল করার সময় উপাদান অ্যানিমেট হয়
 */
export function ScrollProgressAnimation({
  children,
  className = '',
}: ScrollProgressAnimationProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  // Motion values for smooth scroll-based animations
  const scaleValue = useMotionValue(0.9)
  const opacityValue = useMotionValue(0.5)
  const yValue = useMotionValue(30)
  const rotateValue = useMotionValue(0)

  useEffect(() => {
    const handleScroll = () => {
      const element = ref.current
      if (!element) return

      const rect = element.getBoundingClientRect()
      const elementTop = rect.top
      const elementHeight = rect.height
      const windowHeight = window.innerHeight

      // Calculate element visibility (0 = below viewport, 1 = centered, 0 = above viewport)
      const elementCenter = elementTop + elementHeight / 2
      const distanceFromCenter = Math.abs(elementCenter - windowHeight / 2)
      const maxDistance = windowHeight / 2 + elementHeight / 2
      const progress = Math.max(0, Math.min(1, 1 - distanceFromCenter / maxDistance))

      // Apply animations based on scroll progress
      scaleValue.set(0.85 + progress * 0.15) // Scale from 0.85 to 1
      opacityValue.set(0.3 + progress * 0.7) // Opacity from 0.3 to 1
      yValue.set(50 * (1 - progress)) // Move up from 50px to 0px
      rotateValue.set(progress * 2) // Slight rotation
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Call once on mount

    return () => window.removeEventListener('scroll', handleScroll)
  }, [scaleValue, opacityValue, yValue, rotateValue])

  const shadowOpacity = useTransform(opacityValue, (value) => value * 0.3)
  const filterBrightness = useTransform(opacityValue, (value) => 0.8 + value * 0.2)

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        scale: scaleValue,
        opacity: opacityValue,
        y: yValue,
        rotate: rotateValue,
      }}
    >
      {children}
    </motion.div>
  )
}

/**
 * ScrollParallax - প্যারালাক্স স্ক্রল ইফেক্ট
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
  const yValue = useMotionValue(0)

  useEffect(() => {
    const handleScroll = () => {
      const element = ref.current
      if (!element) return

      const rect = element.getBoundingClientRect()
      const elementTop = rect.top
      const windowHeight = window.innerHeight

      // Calculate parallax offset
      const offset = (windowHeight - elementTop) * speed * 0.5

      yValue.set(offset)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [yValue, speed])

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y: yValue }}
    >
      {children}
    </motion.div>
  )
}

/**
 * ScrollCounter - স্ক্রল করার সময় সংখ্যা বৃদ্ধি করুন
 */
export function ScrollCounter({
  end,
  suffix = '',
  className = '',
}: {
  end: number
  suffix?: string
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const countValue = useMotionValue(0)
  const displayValue = useTransform(countValue, (value) => Math.floor(value))

  useEffect(() => {
    const handleScroll = () => {
      const element = ref.current
      if (!element) return

      const rect = element.getBoundingClientRect()
      const elementTop = rect.top
      const elementHeight = rect.height
      const windowHeight = window.innerHeight

      const elementCenter = elementTop + elementHeight / 2
      const distanceFromCenter = Math.abs(elementCenter - windowHeight / 2)
      const maxDistance = windowHeight / 2 + elementHeight / 2
      const progress = Math.max(0, Math.min(1, 1 - distanceFromCenter / maxDistance))

      countValue.set(end * progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [end, countValue])

  return (
    <motion.div
      ref={ref}
      className={className}
    >
      {displayValue}
      {suffix}
    </motion.div>
  )
}

/**
 * ScrollFill - টপ থেকে বটম পর্যন্ত ফিল করুন
 */
export function ScrollFill({
  children,
  className = '',
  direction = 'vertical',
}: {
  children: React.ReactNode
  className?: string
  direction?: 'vertical' | 'horizontal'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const fillValue = useMotionValue(0)

  useEffect(() => {
    const handleScroll = () => {
      const element = ref.current
      if (!element) return

      const rect = element.getBoundingClientRect()
      const elementTop = rect.top
      const elementHeight = rect.height
      const windowHeight = window.innerHeight

      const elementCenter = elementTop + elementHeight / 2
      const distanceFromCenter = Math.abs(elementCenter - windowHeight / 2)
      const maxDistance = windowHeight / 2 + elementHeight / 2
      const progress = Math.max(0, Math.min(1, 1 - distanceFromCenter / maxDistance))

      fillValue.set(progress * 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [fillValue])

  const backgroundGradient = useMotionTemplate`linear-gradient(
    ${direction === 'vertical' ? 'to bottom' : 'to right'},
    rgb(220, 38, 38) 0%,
    rgb(220, 38, 38) ${fillValue}%,
    transparent ${fillValue}%,
    transparent 100%
  )`

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        backgroundImage: backgroundGradient,
      }}
    >
      {children}
    </motion.div>
  )
}
