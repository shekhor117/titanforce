'use client'

import { useEffect, useState } from 'react'
import { getDataService } from '@/lib/data-service'
import type {
  Player,
  Match,
  Partner,
  NewsItem,
  MediaItem,
  Fan,
} from '@/lib/data-service'

export function useDataStore() {
  const [service, setService] = useState<any>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [partners, setPartners] = useState<Partner[]>([])
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true
    const loadData = async () => {
      try {
        setLoading(true)
        const dataService = getDataService()
        setService(dataService)
        const [playersData, matchesData, partnersData, newsData, mediaData] = await Promise.all([
          dataService.getPlayers(),
          dataService.getMatches(),
          dataService.getPartners(),
          dataService.getNewsItems(),
          dataService.getMediaItems(),
        ])

        if (isMounted) {
          setPlayers(playersData)
          setMatches(matchesData)
          setPartners(partnersData)
          setNewsItems(newsData)
          setMediaItems(mediaData)
          setError(null)
          console.log("[v0] Loaded initial data:", { players: playersData.length, matches: matchesData.length })
        }
      } catch (err) {
        if (isMounted) {
          const error = err instanceof Error ? err : new Error(String(err))
          setError(error)
          console.error("[v0] Error loading data:", error.message)
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadData()

    // Subscribe to real-time updates - only if service is initialized
    let unsubscribePlayers = () => {}
    let unsubscribeMatches = () => {}
    let unsubscribePartners = () => {}
    let unsubscribeNews = () => {}
    let unsubscribeMedia = () => {}

    return () => {
      isMounted = false
      unsubscribePlayers()
      unsubscribeMatches()
      unsubscribePartners()
      unsubscribeNews()
      unsubscribeMedia()
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
  const service = getDataService()
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadPlayers = async () => {
      try {
        setLoading(true)
        console.log("[v0] usePlayers: Starting to load players")
        const data = await service.getPlayers()
        if (isMounted) {
          console.log("[v0] usePlayers: Loaded", data.length, "players", data)
          setPlayers(data)
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          const error = err instanceof Error ? err : new Error(String(err))
          console.error("[v0] usePlayers: Load error:", error.message, "Full error:", err)
          setError(error)
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadPlayers()

    const unsubscribe = service.subscribeToPlayers((data) => {
      if (isMounted) {
        console.log("[v0] usePlayers: Real-time update -", data.length, "players")
        setPlayers(data)
      }
    }, (err) => {
      if (isMounted) {
        console.error("[v0] usePlayers: Subscription error:", err.message)
        setError(err)
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  return { players, loading, error, service }
}

export function useMatches() {
  const service = getDataService()
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadMatches = async () => {
      try {
        setLoading(true)
        const data = await service.getMatches()
        if (isMounted) {
          setMatches(data)
          setError(null)
          console.log("[v0] useMatches: Loaded", data.length, "matches")
        }
      } catch (err) {
        if (isMounted) {
          const error = err instanceof Error ? err : new Error(String(err))
          setError(error)
          console.error("[v0] useMatches: Load error:", error.message)
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadMatches()

    const unsubscribe = service.subscribeToMatches((data) => {
      if (isMounted) {
        console.log("[v0] useMatches: Real-time update -", data.length, "matches")
        setMatches(data)
      }
    }, (err) => {
      if (isMounted) {
        console.error("[v0] useMatches: Subscription error:", err.message)
        setError(err)
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  return { matches, loading, error, service }
}

export function usePartners() {
  const service = getDataService()
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadPartners = async () => {
      try {
        setLoading(true)
        const data = await service.getPartners()
        if (isMounted) {
          setPartners(data)
          setError(null)
          console.log("[v0] usePartners: Loaded", data.length, "partners")
        }
      } catch (err) {
        if (isMounted) {
          const error = err instanceof Error ? err : new Error(String(err))
          setError(error)
          console.error("[v0] usePartners: Load error:", error.message)
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadPartners()

    const unsubscribe = service.subscribeToPartners((data) => {
      if (isMounted) {
        console.log("[v0] usePartners: Real-time update -", data.length, "partners")
        setPartners(data)
      }
    }, (err) => {
      if (isMounted) {
        console.error("[v0] usePartners: Subscription error:", err.message)
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
  const service = getDataService()
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadNewsItems = async () => {
      try {
        setLoading(true)
        const data = await service.getNewsItems()
        if (isMounted) {
          setNewsItems(data)
          setError(null)
          console.log("[v0] useNewsItems: Loaded", data.length, "items")
        }
      } catch (err) {
        if (isMounted) {
          const error = err instanceof Error ? err : new Error(String(err))
          setError(error)
          console.error("[v0] useNewsItems: Load error:", error.message)
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadNewsItems()

    const unsubscribe = service.subscribeToNewsItems((data) => {
      if (isMounted) {
        console.log("[v0] useNewsItems: Real-time update -", data.length, "items")
        setNewsItems(data)
      }
    }, (err) => {
      if (isMounted) {
        console.error("[v0] useNewsItems: Subscription error:", err.message)
        setError(err)
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  return { newsItems, loading, error, service }
}

export function useMediaItems() {
  const service = getDataService()
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadMediaItems = async () => {
      try {
        setLoading(true)
        const data = await service.getMediaItems()
        if (isMounted) {
          setMediaItems(data)
          setError(null)
          console.log("[v0] useMediaItems: Loaded", data.length, "items")
        }
      } catch (err) {
        if (isMounted) {
          const error = err instanceof Error ? err : new Error(String(err))
          setError(error)
          console.error("[v0] useMediaItems: Load error:", error.message)
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadMediaItems()

    const unsubscribe = service.subscribeToMediaItems((data) => {
      if (isMounted) {
        console.log("[v0] useMediaItems: Real-time update -", data.length, "items")
        setMediaItems(data)
      }
    }, (err) => {
      if (isMounted) {
        console.error("[v0] useMediaItems: Subscription error:", err.message)
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
