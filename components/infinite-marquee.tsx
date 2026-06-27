'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface InfiniteMarqueeProps {
  children: ReactNode
  direction?: 'left' | 'right'
  speed?: number
  gap?: number
  className?: string
  pauseOnHover?: boolean
}

export function InfiniteMarquee({
  children,
  direction = 'left',
  speed = 20,
  gap = 24,
  className = '',
  pauseOnHover = true,
}: InfiniteMarqueeProps) {
  const xOffset = direction === 'left' ? -100 : 100

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        className="flex gap-8 md:gap-12"
        animate={{ x: [0, xOffset + '%'] }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear',
        }}
        whileHover={pauseOnHover ? { animationPlayState: 'paused' } : undefined}
      >
        {/* Duplicate content for seamless loop */}
        {[0, 1].map((index) => (
          <div key={index} className="flex gap-8 md:gap-12 flex-shrink-0">
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

interface MarqueeItemProps {
  children: ReactNode
  className?: string
}

export function MarqueeItem({ children, className = '' }: MarqueeItemProps) {
  return (
    <div className={`flex-shrink-0 ${className}`}>
      {children}
    </div>
  )
}
