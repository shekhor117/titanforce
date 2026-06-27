'use client'

import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'

interface ScrollStaggerContainerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
  duration?: number
  once?: boolean
  margin?: string
  variant?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'fadeInScale'
}

const childVariants = {
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
}

export function ScrollStaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  duration = 0.6,
  once = false,
  margin = '0px 0px -100px 0px',
  variant = 'fadeInUp',
}: ScrollStaggerContainerProps) {
  const { ref, controls } = useScrollAnimation({ once, margin })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.3,
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className={className}
    >
      {React.Children.map(children, (child) => (
        <motion.div
          variants={childVariants[variant]}
          transition={{ duration }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
