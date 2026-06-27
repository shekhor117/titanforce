'use client'

import { useEffect } from 'react'

/**
 * ScrollAnimationProvider
 * Enables smooth scroll animations globally across the website
 * Uses GPU-accelerated transforms for optimal performance
 */
export function ScrollAnimationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Enable smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth'

    // Optimize performance with GPU acceleration hints
    const style = document.createElement('style')
    style.textContent = `
      * {
        will-change: auto;
      }
      
      [data-scroll-animate] {
        will-change: transform, opacity;
      }
      
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return <>{children}</>
}
