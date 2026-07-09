'use client'

import { useEffect } from 'react'

/**
 * ScrollAnimationProvider
 * Enables smooth scroll animations globally across the website
 * Uses GPU-accelerated transforms and optimized scroll behavior
 */
export function ScrollAnimationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Inject optimized CSS for scroll performance
    const style = document.createElement('style')
    style.textContent = `
      html {
        scroll-behavior: smooth;
      }
      
      [data-scroll-animate] {
        will-change: transform, opacity;
      }
      
      @media (prefers-reduced-motion: reduce) {
        html {
          scroll-behavior: auto;
        }
        
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      try {
        document.head.removeChild(style)
      } catch (e) {
        // Silently ignore cleanup errors
      }
    }
  }, [])

  return <>{children}</>
}
