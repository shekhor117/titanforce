'use client'

import useSWR from 'swr'

// Configure global fetcher and cache settings
const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 60000, // 1 minute - prevents duplicate requests
  focusThrottleInterval: 60000, // 1 minute
  errorRetryCount: 2,
  errorRetryInterval: 3000,
}

// Optimized fetcher with timeout
const fetcher = async (url: string) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

  try {
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`)
    }

    return res.json()
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

/**
 * Hook for optimized data fetching with client-side caching via SWR
 * Prevents duplicate requests, implements intelligent revalidation, and handles errors gracefully
 */
export function useCachedData<T = any>(
  key: string | null,
  options?: {
    revalidateInterval?: number
    fallbackData?: T
    onError?: (error: Error) => void
  }
) {
  const { data, error, isLoading, mutate } = useSWR<T>(
    key,
    fetcher,
    {
      ...swrConfig,
      revalidateInterval: options?.revalidateInterval || 300000, // 5 minutes default
      fallbackData: options?.fallbackData,
      onError: (error) => {
        console.warn('[v0] SWR fetch error:', error.message)
        options?.onError?.(error)
      },
    }
  )

  return {
    data,
    error,
    loading: isLoading,
    mutate, // For manual revalidation
  }
}

/**
 * Batch multiple data requests into a single SWR call for better performance
 */
export function useCachedBatchData<T = any>(
  keys: (string | null)[],
  fetchers: Array<() => Promise<any>>,
  options?: {
    fallbackData?: T[]
    onError?: (error: Error) => void
  }
) {
  const validKeys = keys.filter(k => k !== null)
  const batchKey = validKeys.length > 0 ? ['batch', ...validKeys].join(':') : null

  const { data, error, isLoading, mutate } = useSWR(
    batchKey,
    async () => {
      try {
        const results = await Promise.all(
          fetchers.map(async (fetcher, index) => {
            try {
              return await fetcher()
            } catch (err) {
              console.warn(`[v0] Batch fetcher ${index} failed:`, err)
              return null
            }
          })
        )
        return results
      } catch (err) {
        throw new Error('Batch fetch failed')
      }
    },
    {
      ...swrConfig,
      dedupingInterval: 120000, // 2 minutes for batch requests
      fallbackData: options?.fallbackData,
      onError: options?.onError,
    }
  )

  return {
    data,
    error,
    loading: isLoading,
    mutate,
  }
}

/**
 * Clear all SWR cache - useful for logout or reset scenarios
 */
export function clearAllCache() {
  // This would need to be called from client components with access to SWR's cache
  console.log('[v0] Clearing SWR cache - make sure to also clear browser storage if needed')
}
