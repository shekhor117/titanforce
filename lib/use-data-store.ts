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
  const service = getDataService()
  const [players, setPlayers] = useState<Player[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [partners, setPartners] = useState<Partner[]>([])
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [playersData, matchesData, partnersData, newsData, mediaData] = await Promise.all([
          service.getPlayers(),
          service.getMatches(),
          service.getPartners(),
          service.getNewsItems(),
          service.getMediaItems(),
        ])

        setPlayers(playersData)
        setMatches(matchesData)
        setPartners(partnersData)
        setNewsItems(newsData)
        setMediaItems(mediaData)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setLoading(false)
      }
    }

    loadData()

    // Subscribe to real-time updates
    const unsubscribePlayers = service.subscribeToPlayers(setPlayers, setError)
    const unsubscribeMatches = service.subscribeToMatches(setMatches, setError)
    const unsubscribePartners = service.subscribeToPartners(setPartners, setError)
    const unsubscribeNews = service.subscribeToNewsItems(setNewsItems, setError)
    const unsubscribeMedia = service.subscribeToMediaItems(setMediaItems, setError)

    return () => {
      unsubscribePlayers()
      unsubscribeMatches()
      unsubscribePartners()
      unsubscribeNews()
      unsubscribeMedia()
    }
  }, [service])

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
    const loadPlayers = async () => {
      try {
        setLoading(true)
        const data = await service.getPlayers()
        setPlayers(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setLoading(false)
      }
    }

    loadPlayers()

    const unsubscribe = service.subscribeToPlayers(setPlayers, setError)

    return () => unsubscribe()
  }, [service])

  return { players, loading, error, service }
}

export function useMatches() {
  const service = getDataService()
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoading(true)
        const data = await service.getMatches()
        setMatches(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setLoading(false)
      }
    }

    loadMatches()

    const unsubscribe = service.subscribeToMatches(setMatches, setError)

    return () => unsubscribe()
  }, [service])

  return { matches, loading, error, service }
}

export function usePartners() {
  const service = getDataService()
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadPartners = async () => {
      try {
        setLoading(true)
        const data = await service.getPartners()
        setPartners(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setLoading(false)
      }
    }

    loadPartners()

    const unsubscribe = service.subscribeToPartners(setPartners, setError)

    return () => unsubscribe()
  }, [service])

  return { partners, loading, error, service }
}

export function useNewsItems() {
  const service = getDataService()
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadNewsItems = async () => {
      try {
        setLoading(true)
        const data = await service.getNewsItems()
        setNewsItems(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setLoading(false)
      }
    }

    loadNewsItems()

    const unsubscribe = service.subscribeToNewsItems(setNewsItems, setError)

    return () => unsubscribe()
  }, [service])

  return { newsItems, loading, error, service }
}

export function useMediaItems() {
  const service = getDataService()
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadMediaItems = async () => {
      try {
        setLoading(true)
        const data = await service.getMediaItems()
        setMediaItems(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setLoading(false)
      }
    }

    loadMediaItems()

    const unsubscribe = service.subscribeToMediaItems(setMediaItems, setError)

    return () => unsubscribe()
  }, [service])

  return { mediaItems, loading, error, service }
}
