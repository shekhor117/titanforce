/**
 * Route prefetch utilities for performance optimization
 * Prefetches critical routes and assets to improve navigation speed
 */

/**
 * Prefetch critical routes on idle
 */
export function prefetchCriticalRoutes() {
  if (typeof window === 'undefined') return

  // Use requestIdleCallback if available, fallback to setTimeout
  const prefetch = (routes: string[]) => {
    routes.forEach((route) => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.as = 'fetch'
      link.href = route
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })
  }

  if ('requestIdleCallback' in window) {
    requestIdleCallback(
      () => {
        prefetch([
          '/api/fixtures',
          '/api/players',
          '/api/news',
        ])
      },
      { timeout: 3000 }
    )
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(() => {
      prefetch([
        '/api/fixtures',
        '/api/players',
        '/api/news',
      ])
    }, 2000)
  }
}

/**
 * Debounce function for scroll and resize events
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function for high-frequency events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Intersection Observer hook for lazy loading elements
 */
export function useIntersectionObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
) {
  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(entry)
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: '50px',
      ...options,
    }
  )
}
