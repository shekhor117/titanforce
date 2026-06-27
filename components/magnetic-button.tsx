'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface MagneticButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  magnetDistance?: number
  pulseGlow?: boolean
}

export function MagneticButton({
  children,
  onClick,
  className = '',
  magnetDistance = 30,
  pulseGlow = true,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distance = Math.sqrt(
      Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
    )

    if (distance < magnetDistance) {
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX)
      const x = Math.cos(angle) * (magnetDistance - distance) * 0.3
      const y = Math.sin(angle) * (magnetDistance - distance) * 0.3

      setPosition({ x, y })
    } else {
      setPosition({ x: 0, y: 0 })
    }
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
    >
      <motion.div
        animate={{ x: position.x, y: position.y }}
        transition={{ type: 'spring', stiffness: 150, damping: 15 }}
        className={`relative ${
          pulseGlow ? 'hover:shadow-[0_0_40px_rgba(220,38,38,0.6)]' : ''
        } transition-shadow duration-300 rounded-lg`}
      >
        {children}
        {pulseGlow && (
          <div className="absolute inset-0 rounded-lg bg-red-600 opacity-0 animate-pulse pointer-events-none" />
        )}
      </motion.div>
    </div>
  )
}

interface GlowPulseProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
  duration?: number
}

export function GlowPulse({
  children,
  className = '',
  glowColor = 'rgba(220, 38, 38, 0.5)',
  duration = 2,
}: GlowPulseProps) {
  return (
    <motion.div
      className={className}
      animate={{
        boxShadow: [
          `0 0 20px ${glowColor}`,
          `0 0 40px ${glowColor}`,
          `0 0 20px ${glowColor}`,
        ],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}
