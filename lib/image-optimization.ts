/**
 * Image Optimization Utilities
 * Helps ensure optimal image loading and performance
 */

/**
 * Get optimized image dimensions for responsive loading
 * Prevents layout shift and reduces bundle size
 */
export function getOptimizedImageDimensions(
  originalWidth: number,
  originalHeight: number,
  containerWidth: number
) {
  const aspectRatio = originalHeight / originalWidth
  return {
    width: Math.min(containerWidth, originalWidth),
    height: Math.min(containerWidth, originalWidth) * aspectRatio,
  }
}

/**
 * Generate srcSet for responsive images
 * Provides appropriate image sizes for different screen sizes
 */
export function generateSrcSet(basePath: string): string {
  return [
    `${basePath}?w=640 640w`,
    `${basePath}?w=750 750w`,
    `${basePath}?w=828 828w`,
    `${basePath}?w=1080 1080w`,
    `${basePath}?w=1200 1200w`,
  ].join(', ')
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizes(): string {
  return [
    '(max-width: 640px) 100vw',
    '(max-width: 1024px) 50vw',
    '(max-width: 1280px) 33vw',
    '25vw',
  ].join(', ')
}

/**
 * Preload critical images for above-the-fold content
 */
export function preloadCriticalImages(images: string[]) {
  if (typeof window === 'undefined') return

  images.forEach(img => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = img
    link.type = 'image/webp'
    document.head.appendChild(link)
  })
}

/**
 * Lazy load images with intersection observer
 */
export function lazyLoadImages() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return
  }

  const images = document.querySelectorAll('img[data-lazy]')

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement
        img.src = img.dataset.src || ''
        img.removeAttribute('data-lazy')
        observer.unobserve(img)
      }
    })
  })

  images.forEach(img => observer.observe(img))
}

/**
 * Optimize image quality based on connection speed
 */
export function getOptimalImageQuality(): 'low' | 'medium' | 'high' {
  if (typeof window === 'undefined' || !('navigator' in window)) {
    return 'high'
  }

  const connection = (navigator as any).connection
  if (!connection) return 'high'

  const effectiveType = connection.effectiveType
  const saveData = connection.saveData

  if (saveData) return 'low'
  if (effectiveType === '4g') return 'high'
  if (effectiveType === '3g') return 'medium'
  return 'low'
}

/**
 * Convert image to WebP format for better compression
 * Falls back to original format if not supported
 */
export function getImageFormatByBrowser(originalPath: string): string {
  if (typeof window === 'undefined') return originalPath

  const canvas = document.createElement('canvas')
  if (canvas.toDataURL('image/webp').includes('webp')) {
    return originalPath.includes('?') 
      ? originalPath + '&f=webp'
      : originalPath + '?f=webp'
  }

  return originalPath
}

/**
 * Calculate blur hash for placeholder generation
 * Useful for smooth image loading transitions
 */
export function generateImagePlaceholder(
  dominantColor: string,
  width: number,
  height: number
): string {
  // Returns a CSS gradient that matches the dominant color
  return `linear-gradient(135deg, ${dominantColor}00 0%, ${dominantColor}20 100%)`
}
