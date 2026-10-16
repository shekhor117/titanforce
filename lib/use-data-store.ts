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

// Keep public data fresh while still preventing duplicate requests during navigation.
const CACHE_DURATION = 5000
const PUBLIC_DATA_TIMEOUT = 12000
const PUBLIC_DATA_RETRIES = 3
const PUBLIC_DATA_RETRY_DELAY = 500

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
      try {
        setLoading(true)
        setService(optimizedDataService)

        const loadAllBackgroundData = async () => {
          const results = await Promise.allSettled([
            fetchWithRetry(() => optimizedDataService.fetchData<Player>('players', { order: { key: 'num' } })),
            fetchWithRetry(() => optimizedDataService.fetchData<Match>('matches', { order: { key: 'date', ascending: false } })),
            fetchWithRetry(() => optimizedDataService.fetchData<NewsItem>('news_items', { order: { key: 'created_at', ascending: false } })),
            fetchWithRetry(() => optimizedDataService.fetchData<Partner>('partners', { order: { key: 'name' } })),
            fetchWithRetry(() => optimizedDataService.fetchData<MediaItem>('media_items', { order: { key: 'created_at', ascending: false } })),
            fetchWithRetry(() => optimizedDataService.fetchData<Trophy>('trophies', { order: { key: 'year', ascending: false } })),
          ])
          if (!isMounted) return
          const [playersResult, matchesResult, newsResult, partnersResult, mediaResult, trophiesResult] = results
          if (playersResult.status === 'fulfilled') { dataCache.players = playersResult.value; setPlayers(playersResult.value) }
          if (matchesResult.status === 'fulfilled') { dataCache.matches = matchesResult.value; setMatches(matchesResult.value) }
          if (newsResult.status === 'fulfilled') { dataCache.newsItems = newsResult.value; setNewsItems(newsResult.value) }
          if (partnersResult.status === 'fulfilled') { dataCache.partners = partnersResult.value; setPartners(partnersResult.value) }
          if (mediaResult.status === 'fulfilled') { dataCache.mediaItems = mediaResult.value; setMediaItems(mediaResult.value) }
          if (trophiesResult.status === 'fulfilled') dataCache.trophies = trophiesResult.value
          const failed = results.find((result) => result.status === 'rejected')
          if (failed) setError(failed.reason instanceof Error ? failed.reason : new Error(String(failed.reason)))
          dataCache.lastFetch = Date.now()
        }

        // Do not block the first paint; fetch every public dataset after the page is interactive.
        setLoading(false)
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(loadAllBackgroundData, { timeout: 2500 })
        } else {
          window.setTimeout(loadAllBackgroundData, 100)
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

    const loadPlayers = async () => {
      // If cache is fresh and available, use it immediately
      if (dataCache.players && Date.now() - dataCache.lastFetch < CACHE_DURATION) {
        setPlayers(dataCache.players)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await fetchWithRetry(() => service.getPlayers())
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
          // Still show cached data even if fetch fails
          if (dataCache.players) {
            setPlayers(dataCache.players)
          }
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
      if (dataCache.matches && Date.now() - dataCache.lastFetch < CACHE_DURATION) {
        setMatches(dataCache.matches)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await fetchWithRetry(() => service.getMatches())
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
      if (dataCache.partners && Date.now() - dataCache.lastFetch < CACHE_DURATION) {
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
      if (dataCache.newsItems && Date.now() - dataCache.lastFetch < CACHE_DURATION) {
        setNewsItems(dataCache.newsItems)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await fetchWithRetry(() => service.getNewsItems())
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
      if (dataCache.mediaItems && Date.now() - dataCache.lastFetch < CACHE_DURATION) {
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
      if (dataCache.trophies && Date.now() - dataCache.lastFetch < CACHE_DURATION) {
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
