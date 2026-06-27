'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useScrollTrigger } from '@/hooks/use-scroll-trigger'

interface ScrollTriggerAnimationProps {
  children: React.ReactNode
  className?: string
  variant?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'rotate'
  duration?: number
  delay?: number
  intensity?: number // 0-1, how strong the animation effect is based on scroll velocity
}

const animationVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: (progress: number) => ({
      opacity: 0.5 + progress * 0.5,
    }),
  },
  slideUp: {
    initial: { opacity: 0, y: 40 },
    animate: (progress: number) => ({
      opacity: 0.3 + progress * 0.7,
      y: 40 - progress * 40,
    }),
  },
  slideDown: {
    initial: { opacity: 0, y: -40 },
    animate: (progress: number) => ({
      opacity: 0.3 + progress * 0.7,
      y: -40 + progress * 40,
    }),
  },
  slideLeft: {
    initial: { opacity: 0, x: 40 },
    animate: (progress: number) => ({
      opacity: 0.3 + progress * 0.7,
      x: 40 - progress * 40,
    }),
  },
  slideRight: {
    initial: { opacity: 0, x: -40 },
    animate: (progress: number) => ({
      opacity: 0.3 + progress * 0.7,
      x: -40 + progress * 40,
    }),
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: (progress: number) => ({
      opacity: 0.3 + progress * 0.7,
      scale: 0.8 + progress * 0.2,
    }),
  },
  rotate: {
    initial: { opacity: 0, rotate: -10 },
    animate: (progress: number) => ({
      opacity: 0.3 + progress * 0.7,
      rotate: -10 + progress * 10,
    }),
  },
}

export function ScrollTriggerAnimation({
  children,
  className = '',
  variant = 'fadeIn',
  duration = 0.3,
  delay = 0,
  intensity = 1,
}: ScrollTriggerAnimationProps) {
  const ref = useRef<HTMLDivElement>(null)
  const animationRef = useRef<HTMLDivElement>(null)

  useScrollTrigger(ref, {
    onScroll: (progress) => {
      if (!animationRef.current) return

      const variantConfig = animationVariants[variant]
      const animateState = variantConfig.animate(progress * intensity)

      // Apply animation to ref
      Object.entries(animateState).forEach(([key, value]) => {
        if (key === 'opacity') {
          animationRef.current!.style.opacity = String(value)
        } else if (key === 'y') {
          animationRef.current!.style.transform = `translateY(${value}px)`
        } else if (key === 'x') {
          animationRef.current!.style.transform = `translateX(${value}px)`
        } else if (key === 'scale') {
          animationRef.current!.style.transform = `scale(${value})`
        } else if (key === 'rotate') {
          animationRef.current!.style.transform = `rotate(${value}deg)`
        }
      })
    },
  })

  return (
    <div ref={ref} className={className}>
      <motion.div
        ref={animationRef}
        initial={animationVariants[variant].initial}
        transition={{ duration }}
      >
        {children}
      </motion.div>
    </div>
  )
}
