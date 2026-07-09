'use client'

import React, { memo, useMemo } from 'react'
import { motion } from 'framer-motion'

interface TextRevealProps {
  children: string
  className?: string
  as?: keyof JSX.IntrinsicElements
  delay?: number
  duration?: number
  staggerChildren?: number
  variant?: 'characters' | 'words' | 'lines'
  once?: boolean
}

function TextRevealComponent({
  children,
  className = '',
  as: Component = 'div',
  delay = 0,
  duration = 0.05,
  staggerChildren = 0.02,
  variant = 'characters',
  once = false,
}: TextRevealProps) {
  const words = useMemo(() => children.split(' '), [children])
  const lines = useMemo(() => children.split('\n'), [children])

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: Math.max(staggerChildren, 0.008),
        delayChildren: delay,
      },
    },
  }), [staggerChildren, delay])

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: Math.max(duration, 0.03),
        ease: 'easeOut',
      },
    },
  }), [duration])

  if (variant === 'characters') {
    return (
      <motion.div
        className={className}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: '-50px' }}
      >
        {children.split('').map((char, index) => (
          <motion.span key={`${char}-${index}`} variants={itemVariants}>
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.div>
    )
  }

  if (variant === 'words') {
    return (
      <motion.div
        className={className}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: '-50px' }}
      >
        {words.map((word, index) => (
          <motion.span key={`${word}-${index}`} variants={itemVariants}>
            {word}
            {index < words.length - 1 && '\u00A0'}
          </motion.span>
        ))}
      </motion.div>
    )
  }

  // Lines variant
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-50px' }}
    >
      {lines.map((line, index) => (
        <motion.div key={`${line}-${index}`} variants={itemVariants}>
          {line}
        </motion.div>
      ))}
    </motion.div>
  )
}

export const TextReveal = memo(TextRevealComponent)
