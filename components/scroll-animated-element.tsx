'use client'

import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'

interface ScrollAnimatedElementProps {
  children: ReactNode
  className?: string
  variant?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'fadeInScale' | 'slideInUp' | 'slideInLeft' | 'slideInRight'
  delay?: number
  duration?: number
  once?: boolean
  margin?: string
}

const animationVariants = {
  fadeInUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeInLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  fadeInRight: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  fadeInScale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  slideInUp: {
    hidden: { opacity: 0, y: 80 },
    visible: { opacity: 1, y: 0 },
  },
  slideInLeft: {
    hidden: { opacity: 0, x: -80 },
    visible: { opacity: 1, x: 0 },
  },
  slideInRight: {
    hidden: { opacity: 0, x: 80 },
    visible: { opacity: 1, x: 0 },
  },
}

export function ScrollAnimatedElement({
  children,
  className,
  variant = 'fadeInUp',
  delay = 0,
  duration = 0.6,
  once = true,
  margin = '0px 0px -100px 0px',
}: ScrollAnimatedElementProps) {
  const { ref, controls } = useScrollAnimation({ once, margin })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={animationVariants[variant]}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
