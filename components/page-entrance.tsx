'use client'

import { ReactNode } from 'react'
import { EntranceReveal } from '@/components/entrance-reveal'

interface PageEntranceProps {
  children: ReactNode
  delay?: number
  duration?: number
  variant?: 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'fadeInScale' | 'rotateIn'
}

/**
 * Wrapper component to add entrance animations to entire pages
 * Usage: Wrap your page content with <PageEntrance>{content}</PageEntrance>
 */
export function PageEntrance({
  children,
  delay = 0.1,
  duration = 0.6,
  variant = 'fadeInUp'
}: PageEntranceProps) {
  return (
    <EntranceReveal delay={delay} duration={duration} variant={variant}>
      {children}
    </EntranceReveal>
  )
}
