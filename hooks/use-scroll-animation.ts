'use client'

import { useEffect, useRef } from 'react'
import { useAnimation, useInView } from 'framer-motion'

interface ScrollAnimationOptions {
  threshold?: number
  once?: boolean
  margin?: string
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const controls = useAnimation()
  const isInView = useInView(ref, {
    once: options.once ?? true,
    margin: options.margin ?? '0px 0px -100px 0px',
  })

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  return { ref, controls }
}
