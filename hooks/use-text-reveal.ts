'use client'

import { Variants } from 'framer-motion'

export interface TextRevealConfig {
  variant?: 'characters' | 'words' | 'lines'
  duration?: number
  staggerChildren?: number
  delay?: number
}

export function useTextRevealVariants(config: TextRevealConfig = {}) {
  const {
    variant = 'characters',
    duration = 0.05,
    staggerChildren = 0.02,
    delay = 0,
  } = config

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren: delay,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: 'easeOut',
      },
    },
  }

  return {
    containerVariants,
    itemVariants,
  }
}

/**
 * Common text reveal configurations for different use cases
 */
export const textRevealPresets = {
  // Fast character reveal
  fastCharacter: {
    variant: 'characters' as const,
    duration: 0.02,
    staggerChildren: 0.005,
  },
  
  // Medium character reveal
  mediumCharacter: {
    variant: 'characters' as const,
    duration: 0.03,
    staggerChildren: 0.01,
  },
  
  // Slow character reveal
  slowCharacter: {
    variant: 'characters' as const,
    duration: 0.05,
    staggerChildren: 0.02,
  },
  
  // Word by word
  wordByWord: {
    variant: 'words' as const,
    duration: 0.1,
    staggerChildren: 0.08,
  },
  
  // Line by line
  lineByLine: {
    variant: 'lines' as const,
    duration: 0.15,
    staggerChildren: 0.12,
  },
}
