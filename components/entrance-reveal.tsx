'use client'

import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface EntranceRevealProps {
  children: ReactNode
  delay?: number
  duration?: number
  variant?: 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'fadeInScale' | 'rotateIn'
  className?: string
  staggerChildren?: boolean
}

const variantAnimations = {
  fadeInUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -40 },
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
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
  rotateIn: {
    hidden: { opacity: 0, scale: 0.9, rotate: -5 },
    visible: { opacity: 1, scale: 1, rotate: 0 },
  },
}

export function EntranceReveal({
  children,
  delay = 0,
  duration = 0.5,
  variant = 'fadeInUp',
  className = '',
  staggerChildren = false,
}: EntranceRevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={variantAnimations[variant]}
      transition={{ duration: Math.min(duration, 0.5), delay: Math.min(delay, 0.3), ease: 'easeOut' }}
      className={className}
    >
      {staggerChildren && React.isValidElement(children) && React.Children.count(children) > 1 ? (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {React.Children.map(children, (child) => (
            <motion.div variants={variantAnimations[variant]}>
              {child}
            </motion.div>
          ))}
        </motion.div>
      ) : (
        children
      )}
    </motion.div>
  )
}
