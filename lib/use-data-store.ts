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
  Trophy,
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
    const dataService = getDataService()
    
    const loadData = async () => {
      try {
        setLoading(true)
        setService(dataService)
        const [playersData, matchesData, partnersData, newsData, mediaData, trophiesData] = await Promise.all([
          dataService.getPlayers(),
          dataService.getMatches(),
          dataService.getPartners(),
          dataService.getNewsItems(),
          dataService.getMediaItems(),
          dataService.getTrophies(),
        ])

        if (isMounted) {
          setPlayers(playersData)
          setMatches(matchesData)
          setPartners(partnersData)
          setNewsItems(newsData)
          setMediaItems(mediaData)
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

    loadData()

    // Use unified channel for all realtime updates - more efficient than separate channels
    const unsubscribeAll = dataService.subscribeToAllData(
      (data) => {
        if (isMounted) {
          setPlayers(data)
        }
      },
      (data) => {
        if (isMounted) {
          setMatches(data)
        }
      },
      (data) => {
        if (isMounted) {
          setPartners(data)
        }
      },
      (data) => {
        if (isMounted) {
          setNewsItems(data)
        }
      },
      (data) => {
        if (isMounted) {
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
  const service = getDataService()
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadPlayers = async () => {
      try {
        setLoading(true)
        const data = await service.getPlayers()
        if (isMounted) {
          setPlayers(data)
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

    loadPlayers()

    const unsubscribe = service.subscribeToPlayers((data) => {
      if (isMounted) {
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

    loadMatches()

    const unsubscribe = service.subscribeToMatches((data) => {
      if (isMounted) {
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

    loadNewsItems()

    const unsubscribe = service.subscribeToNewsItems((data) => {
      if (isMounted) {
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
  const service = getDataService()
  const [trophies, setTrophies] = useState<Trophy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadTrophies = async () => {
      try {
        setLoading(true)
        const data = await service.getTrophies()
        if (isMounted) {
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

    const unsubscribe = service.subscribeToTrophies((data) => {
      if (isMounted) {
        setTrophies(data)
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

  return { trophies, loading, error, service }
}
