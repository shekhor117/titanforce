// @ts-nocheck
'use client'

import { useEffect, useState, useRef } from 'react'
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
const PUBLIC_DATA_TIMEOUT = 5000
const PUBLIC_DATA_RETRIES = 1
const PUBLIC_DATA_RETRY_DELAY = 250
const PUBLIC_LOADING_FALLBACK = 6000
const inFlightRequests = new Map<string, Promise<unknown>>()

const PUBLIC_FALLBACK_PLAYERS = [{ id: 'demo-player-1', num: 10, name: 'Titan Player', full_name: 'Titan Player', position: 'Forward', category: 'FWD', goals: 0, assists: 0, status: 'active', created_at: '', updated_at: '' }] as Player[]
const PUBLIC_FALLBACK_MATCHES = [{ id: 'demo-match-1', home: 'Titan Force', away: 'Upcoming Opponent', date: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10), time: '18:00', venue: 'Home Ground', home_score: null, away_score: null, status: 'upcoming', tournament: 'Friendly Match', created_at: '', updated_at: '' }] as Match[]
const PUBLIC_FALLBACK_PARTNERS = [{ id: 'demo-partner-1', name: 'Titan Force Community Partner', category: 'Community', description: 'Official Titan Force partner', created_at: '', updated_at: '' }] as Partner[]
const PUBLIC_FALLBACK_NEWS = [{ id: 'demo-news-1', title: 'Titan Force Latest Update', description: 'Stay connected with the latest club news and updates.', content: 'Stay connected with Titan Force.', category: 'Club News', created_at: '', updated_at: '' }] as NewsItem[]

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

function fetchShared<T>(key: string, request: () => Promise<T>) {
  const existing = inFlightRequests.get(key) as Promise<T> | undefined
  if (existing) return existing

  const promise = fetchWithRetry(request).finally(() => {
    inFlightRequests.delete(key)
  })
  inFlightRequests.set(key, promise)
  return promise
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
    const dataService = getDataService()
    
    const loadData = async () => {
      try {
        setLoading(true)
        setService(dataService)

        const requests = [
          fetchShared('players', () => dataService.getPlayers()),
          fetchShared('matches', () => dataService.getMatches()),
          fetchShared('partners', () => dataService.getPartners()),
          fetchShared('news-items', () => dataService.getNewsItems()),
          fetchShared('media-items', () => dataService.getMediaItems()),
          fetchShared('trophies', () => dataService.getTrophies()),
        ]
        const results = await Promise.allSettled(requests)
        const [playersResult, matchesResult, partnersResult, newsResult, mediaResult] = results
        const firstError = results.find((result) => result.status === "rejected")

        if (isMounted) {
          const nextPlayers = playersResult.status === "fulfilled" && Array.isArray(playersResult.value) && playersResult.value.length > 0 ? playersResult.value : PUBLIC_FALLBACK_PLAYERS
          const nextMatches = matchesResult.status === "fulfilled" && Array.isArray(matchesResult.value) && matchesResult.value.length > 0 ? matchesResult.value : PUBLIC_FALLBACK_MATCHES
          const nextPartners = partnersResult.status === "fulfilled" && Array.isArray(partnersResult.value) && partnersResult.value.length > 0 ? partnersResult.value : PUBLIC_FALLBACK_PARTNERS
          const nextNewsItems = newsResult.status === "fulfilled" && Array.isArray(newsResult.value) && newsResult.value.length > 0 ? newsResult.value : PUBLIC_FALLBACK_NEWS
          const nextMediaItems = mediaResult.status === "fulfilled" && Array.isArray(mediaResult.value) ? mediaResult.value : []

          if (playersResult.status === "fulfilled") {
            dataCache.players = nextPlayers
            setPlayers(nextPlayers)
          }
          if (matchesResult.status === "fulfilled") {
            dataCache.matches = nextMatches
            setMatches(nextMatches)
          }
          if (partnersResult.status === "fulfilled") {
            dataCache.partners = nextPartners
            setPartners(nextPartners)
          }
          if (newsResult.status === "fulfilled") {
            dataCache.newsItems = nextNewsItems
            setNewsItems(nextNewsItems)
          }
          if (mediaResult.status === "fulfilled") {
            dataCache.mediaItems = nextMediaItems
            setMediaItems(nextMediaItems)
          }
          if (results[5].status === "fulfilled") {
            dataCache.trophies = Array.isArray(results[5].value) ? results[5].value : []
          }
          dataCache.lastFetch = Date.now()
          setError(firstError?.status === "rejected"
            ? (firstError.reason instanceof Error ? firstError.reason : new Error(String(firstError.reason)))
            : null)
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

    // Use unified channel for all realtime updates - more efficient than separate channels
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
        const data = await fetchShared('players', () => service.getPlayers())
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
          setPlayers(dataCache.players?.length ? dataCache.players : PUBLIC_FALLBACK_PLAYERS)
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadPlayers()

    const unsubscribe = service.subscribeToPlayers((data) => {
      if (isMounted) {
          const nextPlayers = Array.isArray(data) && data.length > 0 ? data : PUBLIC_FALLBACK_PLAYERS
          dataCache.players = nextPlayers
          dataCache.lastFetch = Date.now()
          setPlayers(nextPlayers)
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
        const data = await fetchShared('matches', () => service.getMatches())
        if (isMounted) {
          const nextMatches = Array.isArray(data) && data.length > 0 ? data : PUBLIC_FALLBACK_MATCHES
          dataCache.matches = nextMatches
          dataCache.lastFetch = Date.now()
          setMatches(nextMatches)
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          const error = err instanceof Error ? err : new Error(String(err))
          setError(error)
          // Still show cached data even if fetch fails
          setMatches(dataCache.matches?.length ? dataCache.matches : PUBLIC_FALLBACK_MATCHES)
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
        const data = await fetchShared('partners', () => service.getPartners())
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
          setPartners(dataCache.partners?.length ? dataCache.partners : PUBLIC_FALLBACK_PARTNERS)
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadPartners()

    const unsubscribe = service.subscribeToPartners((data) => {
      if (isMounted) {
          const nextPartners = Array.isArray(data) && data.length > 0 ? data : PUBLIC_FALLBACK_PARTNERS
          dataCache.partners = nextPartners
          dataCache.lastFetch = Date.now()
          setPartners(nextPartners)
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
        const data = await fetchShared('news-items', () => service.getNewsItems())
        if (isMounted) {
          const nextNewsItems = Array.isArray(data) && data.length > 0 ? data : PUBLIC_FALLBACK_NEWS
          dataCache.newsItems = nextNewsItems
          dataCache.lastFetch = Date.now()
          setNewsItems(nextNewsItems)
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          const error = err instanceof Error ? err : new Error(String(err))
          setError(error)
          setNewsItems(dataCache.newsItems?.length ? dataCache.newsItems : PUBLIC_FALLBACK_NEWS)
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadNewsItems()
    const loadingWatchdog = window.setTimeout(() => {
      if (isMounted) {
        setLoading(false)
        setError((current) => current ?? new Error('Public news request took too long'))
      }
    }, PUBLIC_LOADING_FALLBACK)

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
      window.clearTimeout(loadingWatchdog)
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
        const data = await fetchShared('media-items', () => service.getMediaItems())
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
