/**
 * Performance Monitoring Utility
 * Tracks Core Web Vitals and custom metrics
 */

interface PerformanceMetric {
  name: string
  value: number
  unit: string
  timestamp: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private navigationStartTime: number = performance.now()

  /**
   * Measure Largest Contentful Paint (LCP)
   * Target: < 2.5 seconds
   */
  measureLCP(): number | null {
    if (typeof window === 'undefined') return null

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        this.recordMetric('LCP', lastEntry.renderTime || lastEntry.loadTime, 'ms')
      })

      observer.observe({ entryTypes: ['largest-contentful-paint'] })

      return null // LCP is reported asynchronously
    } catch (error) {
      console.warn('[v0] LCP measurement failed:', error)
      return null
    }
  }

  /**
   * Measure First Input Delay (FID)
   * Target: < 100ms
   * Note: Now uses Interaction to Next Paint (INP) in modern browsers
   */
  measureFID(): void {
    if (typeof window === 'undefined') return

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('FID', entry.processingDuration, 'ms')
        }
      })

      observer.observe({ entryTypes: ['first-input'] })
    } catch (error) {
      console.warn('[v0] FID measurement failed:', error)
    }
  }

  /**
   * Measure Cumulative Layout Shift (CLS)
   * Target: < 0.1
   */
  measureCLS(): void {
    if (typeof window === 'undefined') return

    try {
      let clsValue = 0
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
            this.recordMetric('CLS', clsValue, 'unitless')
          }
        }
      })

      observer.observe({ entryTypes: ['layout-shift'] })
    } catch (error) {
      console.warn('[v0] CLS measurement failed:', error)
    }
  }

  /**
   * Measure First Contentful Paint (FCP)
   * Target: < 1.8 seconds
   */
  measureFCP(): number | null {
    if (typeof window === 'undefined') return null

    try {
      const perfData = performance.getEntriesByType('paint')
      const fcp = perfData.find(entry => entry.name === 'first-contentful-paint')

      if (fcp) {
        this.recordMetric('FCP', fcp.startTime, 'ms')
        return fcp.startTime
      }

      return null
    } catch (error) {
      console.warn('[v0] FCP measurement failed:', error)
      return null
    }
  }

  /**
   * Measure Time to Interactive (TTI)
   * Estimated based on Long Tasks API
   */
  measureTTI(): void {
    if (typeof window === 'undefined') return

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if ((entry as any).duration > 50) {
            this.recordMetric('Long Task', (entry as any).duration, 'ms')
          }
        }
      })

      observer.observe({ entryTypes: ['longtask'] })
    } catch (error) {
      console.warn('[v0] TTI measurement failed:', error)
    }
  }

  /**
   * Measure API response times
   */
  recordAPIMetric(endpoint: string, duration: number): void {
    this.recordMetric(`API: ${endpoint}`, duration, 'ms')
  }

  /**
   * Measure custom performance marks
   */
  recordCustomMetric(name: string, duration: number, unit: string = 'ms'): void {
    this.recordMetric(name, duration, unit)
  }

  /**
   * Internal: Record a metric
   */
  private recordMetric(name: string, value: number, unit: string): void {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
    }

    this.metrics.push(metric)

    if (process.env.NODE_ENV === 'development') {
      console.log(`[v0] Performance - ${name}: ${value.toFixed(2)}${unit}`)
    }

    // Send to analytics if configured
    this.sendToAnalytics(metric)
  }

  /**
   * Send metrics to analytics service
   */
  private sendToAnalytics(metric: PerformanceMetric): void {
    if (typeof window === 'undefined') return

    try {
      // Send to your analytics endpoint
      // Example: mixpanel, google analytics, custom endpoint, etc.
      if (window.gtag) {
        window.gtag('event', 'performance', {
          metric_name: metric.name,
          metric_value: metric.value,
          metric_unit: metric.unit,
        })
      }
    } catch (error) {
      console.warn('[v0] Analytics send failed:', error)
    }
  }

  /**
   * Get all recorded metrics
   */
  getMetrics(): PerformanceMetric[] {
    return this.metrics
  }

  /**
   * Get metrics summary for debugging
   */
  getSummary(): Record<string, number> {
    const summary: Record<string, number> = {}

    this.metrics.forEach(metric => {
      if (!summary[metric.name]) {
        summary[metric.name] = 0
      }
      summary[metric.name] = Math.max(summary[metric.name], metric.value)
    })

    return summary
  }

  /**
   * Initialize all measurements
   */
  initialize(): void {
    this.measureFCP()
    this.measureLCP()
    this.measureFID()
    this.measureCLS()
    this.measureTTI()

    if (process.env.NODE_ENV === 'development') {
      console.log('[v0] Performance monitoring initialized')
    }
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor()

// Auto-initialize on import in client
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      performanceMonitor.initialize()
    })
  } else {
    performanceMonitor.initialize()
  }
}

export default performanceMonitor
