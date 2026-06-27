'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface ParallaxHeroProps {
  children: React.ReactNode
  offset?: number
}

export function ParallaxHero({ children, offset = 50 }: ParallaxHeroProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [yOffset, setYOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const elementTop = rect.top
        const elementHeight = rect.height

        // Only apply parallax while element is in view
        if (elementTop < window.innerHeight && elementTop + elementHeight > 0) {
          const scrolled = window.scrollY
          const elementOffsetTop = ref.current.offsetTop
          const parallax = (scrolled - elementOffsetTop) * 0.5

          setYOffset(parallax)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div ref={ref} style={{ transform: `translateY(${yOffset}px)` }}>
      {children}
    </div>
  )
}

interface TextRevealProps {
  text: string
  className?: string
  delay?: number
}

export function TextReveal({ text, className = '', delay = 0 }: TextRevealProps) {
  const words = text.split(' ')

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: delay,
      },
    },
  }

  const word = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  }

  return (
    <div
      className={`flex flex-wrap ${className}`}
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
      {words.map((word, i) => (
        <motion.span key={i} variants={word} className="mr-2">
          {word}
        </motion.span>
      ))}
      </motion.div>
    </div>
  )
}
