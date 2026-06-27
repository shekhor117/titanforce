'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface CounterAnimationProps {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
  delay?: number
}

export function CounterAnimation({
  end,
  duration = 2,
  prefix = '',
  suffix = '',
  className = '',
  delay = 0,
}: CounterAnimationProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    const startTime = Date.now()
    const timer = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000
      const progress = Math.min(elapsed / duration, 1)

      setCount(Math.floor(end * progress))

      if (progress === 1) {
        clearInterval(timer)
      }
    }, 30)

    return () => clearInterval(timer)
  }, [isVisible, end, duration])

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6 }}
      viewport={{ once: true }}
    >
      {prefix}
      {count}
      {suffix}
    </motion.div>
  )
}

interface ProgressBarProps {
  value: number
  max?: number
  duration?: number
  className?: string
  barClassName?: string
  delay?: number
  showLabel?: boolean
}

export function ProgressBarAnimation({
  value,
  max = 100,
  duration = 1.5,
  className = '',
  barClassName = 'bg-accent',
  delay = 0,
  showLabel = false,
}: ProgressBarProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const percentage = (value / max) * 100

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`w-full ${className}`}>
      <div className="w-full h-2 bg-card/50 rounded-full overflow-hidden border border-accent/20">
        <motion.div
          className={`h-full ${barClassName} rounded-full`}
          initial={{ width: 0 }}
          animate={isVisible ? { width: `${percentage}%` } : { width: 0 }}
          transition={{
            delay,
            duration,
            type: 'spring',
            stiffness: 50,
            damping: 20,
          }}
        />
      </div>
      {showLabel && (
        <motion.p
          className="text-xs text-muted-foreground mt-2"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: delay + duration * 0.5 }}
        >
          {Math.round(percentage)}%
        </motion.p>
      )}
    </div>
  )
}
