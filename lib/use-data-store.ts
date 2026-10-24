// @ts-nocheck
'use client'

import { useEffect, useState, useRef } from 'react'
import { optimizedDataService } from '@/lib/optimized-data-service'
import { getDataService } from '@/lib/data-service'
import type {
  Player,
  Match,
  Partner,
  NewsItem,
  MediaItem,
  Fan,
  Trophy,
} from '@/lib/data-service'

// Global cache for all data - prevents duplicate fetches
const dataCache = {
  players: null as Player[] | null,
  matches: null as Match[] | null,
  partners: null as Partner[] | null,
  newsItems: null as NewsItem[] | null,
  mediaItems: null as MediaItem[] | null,
  trophies: null as Trophy[] | null,
  injuries: null as any[] | null,
  lastFetch: 0,
  isLoading: false,
}

// One in-flight request per dataset prevents duplicate calls when multiple
// homepage sections use the same hook during the first render.
let playersRequest: Promise<Player[]> | null = null
let matchesRequest: Promise<Match[]> | null = null
let newsRequest: Promise<NewsItem[]> | null = null

export function hydrateDataCache(initialData: Record<string, unknown[]>) {
  if (Array.isArray(initialData.players) && initialData.players.length > 0) dataCache.players = initialData.players as Player[]
  if (Array.isArray(initialData.matches) && initialData.matches.length > 0) dataCache.matches = initialData.matches as Match[]
  if (Array.isArray(initialData.partners) && initialData.partners.length > 0) dataCache.partners = initialData.partners as Partner[]
  if (Array.isArray(initialData.news_items) && initialData.news_items.length > 0) dataCache.newsItems = initialData.news_items as NewsItem[]
  if (Array.isArray(initialData.media_items) && initialData.media_items.length > 0) dataCache.mediaItems = initialData.media_items as MediaItem[]
}

// Keep public data fresh while still preventing duplicate requests during navigation.
  const CACHE_DURATION = 60000
// Keep the first paint responsive; static data is used only if Supabase is slow.
// Production Supabase requests may include a cold-start round trip.
const PUBLIC_DATA_TIMEOUT = 8000
const PUBLIC_DATA_RETRIES = 0
const PUBLIC_DATA_RETRY_DELAY = 0

function withTimeout<T>(promise: Promise<T>, timeout = PUBLIC_DATA_TIMEOUT): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      window.setTimeout(() => reject(new Error('Public data request timed out')), timeout)
    }),
  ])
}

async function fetchWithRetry<T>(request: () => Promise<T>): Promise<T> {
  let lastError: unknown

  for (let attempt = 0; attempt <= PUBLIC_DATA_RETRIES; attempt += 1) {
    try {
      return await withTimeout(request())
    } catch (error) {
      lastError = error
      if (attempt < PUBLIC_DATA_RETRIES) {
        await new Promise((resolve) => window.setTimeout(resolve, PUBLIC_DATA_RETRY_DELAY * (attempt + 1)))
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError))
}

export function useDataStore() {
  const [service, setService] = useState<any>(null)
  const [players, setPlayers] = useState<Player[]>(dataCache.players || [])
  const [matches, setMatches] = useState<Match[]>(dataCache.matches || [])
  const [partners, setPartners] = useState<Partner[]>(dataCache.partners || [])
  const [newsItems, setNewsItems] = useState<NewsItem[]>(dataCache.newsItems || [])
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(dataCache.mediaItems || [])
  const [loading, setLoading] = useState(!dataCache.players && !dataCache.matches && !dataCache.newsItems)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true
    const loadData = async () => {
      if (dataCache.lastFetch && Date.now() - dataCache.lastFetch < CACHE_DURATION &&
          (dataCache.players || dataCache.matches || dataCache.newsItems)) {
        if (isMounted) {
          setService(optimizedDataService)
          setLoading(false)
        }
        return
      }

      try {
        // Keep existing data visible while a stale cache refreshes in the background.
        setLoading(false)
        setService(optimizedDataService)

        const loadAllBackgroundData = async () => {
          const jobs: Array<() => Promise<void>> = [
            async () => { const data = await fetchWithRetry(() => optimizedDataService.fetchData<Player>('players', { order: { key: 'num' } })); dataCache.players = data; setPlayers(data) },
            async () => { const data = await fetchWithRetry(() => optimizedDataService.fetchData<Match>('matches', { order: { key: 'date', ascending: false } })); dataCache.matches = data; setMatches(data) },
            async () => { const data = await fetchWithRetry(() => optimizedDataService.fetchData<NewsItem>('news_items', { order: { key: 'created_at', ascending: false } })); dataCache.newsItems = data; setNewsItems(data) },
            async () => { const data = await fetchWithRetry(() => optimizedDataService.fetchData<Partner>('partners', { order: { key: 'name' } })); dataCache.partners = data; setPartners(data) },
            async () => { const data = await fetchWithRetry(() => optimizedDataService.fetchData<MediaItem>('media_items', { order: { key: 'created_at', ascending: false } })); dataCache.mediaItems = data; setMediaItems(data) },
            async () => { dataCache.trophies = await fetchWithRetry(() => optimizedDataService.fetchData<Trophy>('trophies', { order: { key: 'year', ascending: false } })) },
          ]

          // Load each dataset one at a time to keep database traffic predictable.
          for (const job of jobs) {
            if (!isMounted) return
            try {
              await job()
            } catch (reason) {
              if (isMounted) setError(reason instanceof Error ? reason : new Error(String(reason)))
            }
          }
          dataCache.lastFetch = Date.now()
        }

        // Start loading immediately on mount instead of waiting for browser idle time.
        // Each dataset still resolves independently, so one slow request cannot block the others.
        void loadAllBackgroundData()
      } catch (err) {
        if (isMounted) {
          const error = err instanceof Error ? err : new Error(String(err))
          setError(error)
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadData()

    const refreshOnReturn = () => {
      if (document.visibilityState === 'visible' && Date.now() - dataCache.lastFetch >= CACHE_DURATION) {
        loadData()
      }
    }
    window.addEventListener('focus', refreshOnReturn)
    document.addEventListener('visibilitychange', refreshOnReturn)

    const handleSharedDataChange = (event: Event) => {
      const detail = (event as CustomEvent).detail || {}
      if (!isMounted || !Array.isArray(detail.data)) return

      const rows = detail.data
      switch (detail.tableName) {
        case 'players':
          dataCache.players = rows as Player[]
          setPlayers(dataCache.players)
          break
        case 'matches':
          dataCache.matches = rows as Match[]
          setMatches(dataCache.matches)
          break
        case 'news':
        case 'news_items':
          dataCache.newsItems = rows as NewsItem[]
          setNewsItems(dataCache.newsItems)
          break
        case 'partners':
          dataCache.partners = rows as Partner[]
          setPartners(dataCache.partners)
          break
        case 'media_items':
        case 'media':
          dataCache.mediaItems = rows as MediaItem[]
          setMediaItems(dataCache.mediaItems)
          break
        case 'trophies':
          dataCache.trophies = rows as Trophy[]
          break
      }
      dataCache.lastFetch = Date.now()
    }
    window.addEventListener('shared-data-change', handleSharedDataChange)

    // Use the existing Supabase service only for user-driven realtime updates.
    const dataService = getDataService()
    const unsubscribePublicContent = dataService.subscribeToPublicDataChanges((tableName, payload) => {
      if (!isMounted) return
      window.dispatchEvent(new CustomEvent('public-data-change', {
        detail: { tableName, payload },
      }))
    })

    const unsubscribeAll = dataService.subscribeToAllData(
      (data) => {
        if (isMounted) {
          dataCache.players = data
          dataCache.lastFetch = Date.now()
          setPlayers(data)
        }
      },
      (data) => {
        if (isMounted) {
          dataCache.matches = data
          dataCache.lastFetch = Date.now()
          setMatches(data)
        }
      },
      (data) => {
        if (isMounted) {
          dataCache.partners = data
          dataCache.lastFetch = Date.now()
          setPartners(data)
        }
      },
      (data) => {
        if (isMounted) {
          dataCache.newsItems = data
          dataCache.lastFetch = Date.now()
          setNewsItems(data)
        }
      },
      (data) => {
        if (isMounted) {
          dataCache.mediaItems = data
          dataCache.lastFetch = Date.now()
          setMediaItems(data)
        }
      },
      (data) => {
        if (isMounted) {
        }
      },
      (err) => {
        if (isMounted) {
          setError(err)
        }
      }
    )

    return () => {
      isMounted = false
      window.removeEventListener('focus', refreshOnReturn)
      document.removeEventListener('visibilitychange', refreshOnReturn)
      window.removeEventListener('shared-data-change', handleSharedDataChange)
      unsubscribeAll()
      unsubscribePublicContent()
    }
  }, [])

  return {
    players,
    matches,
    partners,
    newsItems,
    mediaItems,
    loading,
    error,
    service,
  }
}

// Individual hooks for specific data types
export function usePlayers() {
  const service = useRef(getDataService()).current
  const [players, setPlayers] = useState<Player[]>(dataCache.players || [])
  const [loading, setLoading] = useState(!dataCache.players)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true
    const loadingFallback = globalThis.setTimeout(() => {
      if (isMounted) setLoading(false)
    }, 3000)

    const loadPlayers = async () => {
      // If cache is fresh and available, use it immediately without refetching.
      if (dataCache.players && dataCache.lastFetch && Date.now() - dataCache.lastFetch < CACHE_DURATION) {
        setPlayers(dataCache.players)
        setLoading(false)
        return
      }

      try {
        // Public content must not block the page while the data layer refreshes.
        setLoading(false)
        // Public pages use the fast cached JSON snapshot first. Supabase realtime
        // remains subscribed below, so admin edits still arrive without blocking paint.
playersRequest ??= fetchWithRetry(() => optimizedDataService.fetchData<Player>('players', { order: { key: 'num' } })).finally(() => { playersRequest = null })
        const data = await playersRequest
        if (isMounted) {
          dataCache.players = data
          dataCache.lastFetch = Date.now()
          setPlayers(data)
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          const error = err instanceof Error ? err : new Error(String(err))
          setError(error)
          // Still show cached data even if fetch fails.
          if (dataCache.players) setPlayers(dataCache.players)
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadPlayers()

    const unsubscribe = service.subscribeToPlayers((data) => {
      if (isMounted) {
        dataCache.players = data
        dataCache.lastFetch = Date.now()
        setPlayers(data)
      }
    }, (err) => {
      if (isMounted) {
        setError(err)
      }
    })

    return () => {
      isMounted = false
      globalThis.clearTimeout(loadingFallback)
      unsubscribe()
    }
  }, [service])

  return { players, loading, error, service }
}

export function useMatches() {
  const service = useRef(getDataService()).current
  const [matches, setMatches] = useState<Match[]>(dataCache.matches || [])
  const [loading, setLoading] = useState(!dataCache.matches)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadMatches = async () => {
      // If cache is fresh and available, use it immediately
      if (dataCache.matches && dataCache.lastFetch && Date.now() - dataCache.lastFetch < CACHE_DURATION) {
        setMatches(dataCache.matches)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        matchesRequest ??= fetchWithRetry(() => service.getMatches()).finally(() => { matchesRequest = null })
        const data = await matchesRequest
        if (isMounted) {
          dataCache.matches = data
          dataCache.lastFetch = Date.now()
          setMatches(data)
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          const error = err instanceof Error ? err : new Error(String(err))
          setError(error)
          // Still show cached data even if fetch fails
          if (dataCache.matches) {
            setMatches(dataCache.matches)
          }
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadMatches()

    const unsubscribe = service.subscribeToMatches((data) => {
      if (isMounted) {
        dataCache.matches = data
        setMatches(data)
      }
    }, (err) => {
      if (isMounted) {
        setError(err)
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [service])

  return { matches, loading, error, service }
}

export function usePartners() {
  const service = useRef(getDataService()).current
  const [partners, setPartners] = useState<Partner[]>(dataCache.partners || [])
  const [loading, setLoading] = useState(!dataCache.partners)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadPartners = async () => {
      if (dataCache.partners && dataCache.lastFetch && Date.now() - dataCache.lastFetch < CACHE_DURATION) {
        setPartners(dataCache.partners)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await fetchWithRetry(() => service.getPartners())
        if (isMounted) {
          dataCache.partners = data
          dataCache.lastFetch = Date.now()
          setPartners(data)
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          const error = err instanceof Error ? err : new Error(String(err))
          setError(error)
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadPartners()

    const unsubscribe = service.subscribeToPartners((data) => {
      if (isMounted) {
        dataCache.partners = data
        dataCache.lastFetch = Date.now()
        setPartners(data)
      }
    }, (err) => {
      if (isMounted) {
        setError(err)
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  return { partners, loading, error, service }
}

export function useNewsItems() {
  const service = useRef(getDataService()).current
  const [newsItems, setNewsItems] = useState<NewsItem[]>(dataCache.newsItems || [])
  const [loading, setLoading] = useState(!dataCache.newsItems)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadNewsItems = async () => {
      // If cache is fresh and available, use it immediately
      if (dataCache.newsItems && dataCache.lastFetch && Date.now() - dataCache.lastFetch < CACHE_DURATION) {
        setNewsItems(dataCache.newsItems)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        newsRequest ??= fetchWithRetry(() => service.getNewsItems()).finally(() => { newsRequest = null })
        const data = await newsRequest
        if (isMounted) {
          dataCache.newsItems = data
          dataCache.lastFetch = Date.now()
          setNewsItems(data)
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          const error = err instanceof Error ? err : new Error(String(err))
          setError(error)
          // Still show cached data even if fetch fails
          if (dataCache.newsItems) {
            setNewsItems(dataCache.newsItems)
          }
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadNewsItems()

    const unsubscribe = service.subscribeToNewsItems((data) => {
      if (isMounted) {
        dataCache.newsItems = data
        setNewsItems(data)
      }
    }, (err) => {
      if (isMounted) {
        setError(err)
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [service])

  return { newsItems, loading, error, service }
}

export function useMediaItems() {
  const service = useRef(getDataService()).current
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(dataCache.mediaItems || [])
  const [loading, setLoading] = useState(!dataCache.mediaItems)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadMediaItems = async () => {
      if (dataCache.mediaItems && dataCache.lastFetch && Date.now() - dataCache.lastFetch < CACHE_DURATION) {
        setMediaItems(dataCache.mediaItems)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await fetchWithRetry(() => service.getMediaItems())
        if (isMounted) {
          dataCache.mediaItems = data
          dataCache.lastFetch = Date.now()
          setMediaItems(data)
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          const error = err instanceof Error ? err : new Error(String(err))
          setError(error)
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadMediaItems()

    const unsubscribe = service.subscribeToMediaItems((data) => {
      if (isMounted) {
        dataCache.mediaItems = data
        dataCache.lastFetch = Date.now()
        setMediaItems(data)
      }
    }, (err) => {
      if (isMounted) {
        setError(err)
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  return { mediaItems, loading, error, service }
}

export function useTrophies() {
  const service = useRef(getDataService()).current
  const [trophies, setTrophies] = useState<Trophy[]>(dataCache.trophies || [])
  const [loading, setLoading] = useState(!dataCache.trophies)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadTrophies = async () => {
      if (dataCache.trophies && dataCache.lastFetch && Date.now() - dataCache.lastFetch < CACHE_DURATION) {
        setTrophies(dataCache.trophies)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await service.getTrophies()
        if (isMounted) {
          dataCache.trophies = data
          dataCache.lastFetch = Date.now()
          setTrophies(data)
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          const error = err instanceof Error ? err : new Error(String(err))
          setError(error)
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadTrophies()

    return () => {
      isMounted = false
    }
  }, [])

  return { trophies, loading, error, service }
}

export function useInjuries() {
  const service = getDataService()
  const [injuries, setInjuries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadInjuries = async () => {
      try {
        setLoading(true)
        const data = await service.getInjuries()
        if (isMounted) {
          setInjuries(data)
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          const error = err instanceof Error ? err : new Error(String(err))
          setError(error)
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadInjuries()

    const unsubscribe = service.subscribeToInjuries((data) => {
      if (isMounted) {
        setInjuries(data)
      }
    }, (err) => {
      if (isMounted) {
        setError(err)
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  return { injuries, loading, error, service }
}
