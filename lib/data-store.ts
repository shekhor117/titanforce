"use client"

import { useState, useEffect } from "react"

// Types
export interface Player {
  id: string
  num: number
  name: string
  fullName: string
  pos: string
  cat: "GK" | "DEF" | "MID" | "FWD"
  age: number
  hometown: string
  foot: "Left" | "Right" | "Both"
  goals: number
  assists: number
  cleanSheets?: number
  bio: string
  photo?: string
  status: "active" | "injured" | "suspended"
}

export interface Match {
  id: string
  home: string
  away: string
  homeScore: number | null
  awayScore: number | null
  date: string
  time: string
  venue: string
  status: "upcoming" | "live" | "completed"
  result?: "W" | "L" | "D"
  homeGoals?: { player: string; minute: string; assist?: string }[]
  awayGoals?: { player: string; minute: string; assist?: string }[]
  homeLineup?: { position: string; player: string; number: number }[]
  awayLineup?: { position: string; player: string; number: number }[]
}

export interface Partner {
  id: string
  name: string
  type: "title" | "main" | "official" | "media"
  logo?: string
  website?: string
  description?: string
  status: "active" | "pending"
}

export interface Fan {
  id: string
  name: string
  email: string
  phone?: string
  membershipType: "regular" | "premium" | "vip"
  joinDate: string
  status: "active" | "pending"
}

export interface NewsItem {
  id: string
  title: string
  excerpt: string
  content: string
  image?: string
  author: string
  category: "match" | "transfer" | "club" | "community"
  publishDate: string
  status: "draft" | "published"
  featured: boolean
}

export interface MediaItem {
  id: string
  title: string
  type: "photo" | "video"
  url: string
  thumbnail?: string
  category: string
  uploadDate: string
}

export interface SiteSettings {
  siteName: string
  tagline: string
  description: string
  contactEmail: string
  contactPhone: string
  address: string
  socialLinks: {
    facebook?: string
    instagram?: string
    twitter?: string
    youtube?: string
  }
  heroTitle: string
  heroSubtitle: string
  aboutTitle: string
  aboutDescription: string
}

// Default data
const defaultPlayers: Player[] = [
  {
    id: "1",
    num: 1,
    name: "Shuronjit",
    fullName: "Shuronjit Biswas",
    pos: "Goalkeeper",
    cat: "GK",
    age: 17,
    hometown: "Mulikandi, Sylhet",
    foot: "Right",
    goals: 0,
    assists: 0,
    cleanSheets: 0,
    bio: "A commanding presence in goal with excellent reflexes and shot-stopping ability. The last line of defense for Titan Force.",
    status: "active"
  },
  {
    id: "2",
    num: 3,
    name: "Srijon",
    fullName: "Srijon Roy",
    pos: "CB / RB",
    cat: "DEF",
    age: 21,
    hometown: "Mulikandi, Sylhet",
    foot: "Right",
    goals: 0,
    assists: 0,
    bio: "Versatile defender who can play both center-back and right-back. Known for his pace and recovery runs.",
    status: "active"
  },
  {
    id: "3",
    num: 4,
    name: "Akash",
    fullName: "Akash Roy",
    pos: "CB / LB",
    cat: "DEF",
    age: 17,
    hometown: "Mulikandi, Sylhet",
    foot: "Right",
    goals: 0,
    assists: 0,
    bio: "Strong left-footed defender with excellent aerial ability. A rock at the back for the team.",
    status: "active"
  },
  {
    id: "4",
    num: 5,
    name: "Akash",
    fullName: "Akash Roy",
    pos: "CB / CDM",
    cat: "DEF",
    age: 19,
    hometown: "Mulikandi, Sylhet",
    foot: "Both",
    goals: 0,
    assists: 0,
    bio: "The defensive anchor who can drop back or push forward. Great at breaking up opposition attacks.",
    status: "active"
  },
  {
    id: "5",
    num: 6,
    name: "Sujon",
    fullName: "Sujon Roy",
    pos: "CAM",
    cat: "MID",
    age: 20,
    hometown: "Mulikandi, Sylhet",
    foot: "Right",
    goals: 0,
    assists: 0,
    bio: "Creative playmaker with excellent vision and passing range. The engine of Titan Force's attack.",
    status: "active"
  },
  {
    id: "6",
    num: 7,
    name: "Shuvo",
    fullName: "Shuvo Roy",
    pos: "LW / RW / CAM",
    cat: "FWD",
    age: 19,
    hometown: "Mulikandi, Sylhet",
    foot: "Right",
    goals: 0,
    assists: 0,
    bio: "Explosive winger with pace to burn. Can play on either flank and loves to cut inside to shoot.",
    status: "active"
  },
  {
    id: "7",
    num: 8,
    name: "Sojib",
    fullName: "Sojib Roy",
    pos: "CM / CAM",
    cat: "MID",
    age: 20,
    hometown: "Mulikandi, Sylhet",
    foot: "Right",
    goals: 0,
    assists: 0,
    bio: "Box-to-box midfielder who covers every blade of grass. Combines work rate with technical quality.",
    status: "active"
  },
  {
    id: "8",
    num: 9,
    name: "Sajon",
    fullName: "Sajon Biswas",
    pos: "ST / CF",
    cat: "FWD",
    age: 17,
    hometown: "Mulikandi, Sylhet",
    foot: "Right",
    goals: 0,
    assists: 0,
    bio: "Clinical striker with a natural instinct for goal. The team's top scorer and focal point of the attack.",
    status: "active"
  },
  {
    id: "9",
    num: 11,
    name: "Kourov",
    fullName: "Kourov Chakroborty",
    pos: "LW / ST",
    cat: "FWD",
    age: 18,
    hometown: "Mulikandi, Sylhet",
    foot: "Right",
    goals: 0,
    assists: 0,
    bio: "Tricky left winger who can also play as a second striker. Dangerous in one-on-one situations.",
    status: "active"
  },
  {
    id: "10",
    num: 17,
    name: "Shekhor",
    fullName: "Shekhor Mohan Roy",
    pos: "CB / CM / CDM",
    cat: "DEF",
    age: 20,
    hometown: "Mulikandi, Sylhet",
    foot: "Right",
    goals: 0,
    assists: 0,
    bio: "Versatile player who can slot into defense or midfield. A true utility player with leadership qualities.",
    status: "active"
  },
]

const defaultMatches: Match[] = [
  {
    id: "1",
    home: "Titan Force",
    away: "TBD",
    homeScore: null,
    awayScore: null,
    date: "TBD",
    time: "",
    venue: "Mulikandi Ground",
    status: "upcoming"
  }
]

const defaultSettings: SiteSettings = {
  siteName: "Titan Force FC",
  tagline: "Mulikandi, Sylhet",
  description: "Titan Force is more than a football team — it's a brotherhood forged on the local pitches of Mulikandi. We play with pride, passion, and an unbreakable team spirit.",
  contactEmail: "contact@titanforce.com",
  contactPhone: "+880 1234 567890",
  address: "Mulikandi, Sylhet, Bangladesh",
  socialLinks: {
    facebook: "https://facebook.com/titanforcefc",
    instagram: "https://instagram.com/titanforcefc"
  },
  heroTitle: "TITAN FORCE",
  heroSubtitle: "MULIKANDI FC",
  aboutTitle: "ABOUT THE CLUB",
  aboutDescription: "Titan Force is more than a football team — it's a brotherhood forged on the local pitches of Mulikandi. We play with pride, passion, and an unbreakable team spirit."
}

// Storage keys
const STORAGE_KEYS = {
  players: "titanforce_players",
  matches: "titanforce_matches",
  partners: "titanforce_partners",
  fans: "titanforce_fans",
  news: "titanforce_news",
  media: "titanforce_media",
  settings: "titanforce_settings"
}

// Helper functions
function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  } catch {
    return defaultValue
  }
}

function setToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent("dataStoreUpdate", { detail: { key } }))
  } catch (error) {
    console.error("Failed to save to localStorage:", error)
  }
}

// Data Store API
export const dataStore = {
  // Players
  getPlayers: (): Player[] => getFromStorage(STORAGE_KEYS.players, defaultPlayers),
  setPlayers: (players: Player[]) => setToStorage(STORAGE_KEYS.players, players),
  addPlayer: (player: Omit<Player, "id">) => {
    const players = dataStore.getPlayers()
    const newPlayer = { ...player, id: Date.now().toString() }
    dataStore.setPlayers([...players, newPlayer])
    return newPlayer
  },
  updatePlayer: (id: string, updates: Partial<Player>) => {
    const players = dataStore.getPlayers()
    const index = players.findIndex(p => p.id === id)
    if (index !== -1) {
      players[index] = { ...players[index], ...updates }
      dataStore.setPlayers(players)
    }
  },
  deletePlayer: (id: string) => {
    const players = dataStore.getPlayers().filter(p => p.id !== id)
    dataStore.setPlayers(players)
  },

  // Matches
  getMatches: (): Match[] => getFromStorage(STORAGE_KEYS.matches, defaultMatches),
  setMatches: (matches: Match[]) => setToStorage(STORAGE_KEYS.matches, matches),
  addMatch: (match: Omit<Match, "id">) => {
    const matches = dataStore.getMatches()
    const newMatch = { ...match, id: Date.now().toString() }
    dataStore.setMatches([...matches, newMatch])
    return newMatch
  },
  updateMatch: (id: string, updates: Partial<Match>) => {
    const matches = dataStore.getMatches()
    const index = matches.findIndex(m => m.id === id)
    if (index !== -1) {
      matches[index] = { ...matches[index], ...updates }
      dataStore.setMatches(matches)
    }
  },
  deleteMatch: (id: string) => {
    const matches = dataStore.getMatches().filter(m => m.id !== id)
    dataStore.setMatches(matches)
  },

  // Partners
  getPartners: (): Partner[] => getFromStorage(STORAGE_KEYS.partners, []),
  setPartners: (partners: Partner[]) => setToStorage(STORAGE_KEYS.partners, partners),
  addPartner: (partner: Omit<Partner, "id">) => {
    const partners = dataStore.getPartners()
    const newPartner = { ...partner, id: Date.now().toString() }
    dataStore.setPartners([...partners, newPartner])
    return newPartner
  },
  updatePartner: (id: string, updates: Partial<Partner>) => {
    const partners = dataStore.getPartners()
    const index = partners.findIndex(p => p.id === id)
    if (index !== -1) {
      partners[index] = { ...partners[index], ...updates }
      dataStore.setPartners(partners)
    }
  },
  deletePartner: (id: string) => {
    const partners = dataStore.getPartners().filter(p => p.id !== id)
    dataStore.setPartners(partners)
  },

  // Fans
  getFans: (): Fan[] => getFromStorage(STORAGE_KEYS.fans, []),
  setFans: (fans: Fan[]) => setToStorage(STORAGE_KEYS.fans, fans),
  addFan: (fan: Omit<Fan, "id">) => {
    const fans = dataStore.getFans()
    const newFan = { ...fan, id: Date.now().toString() }
    dataStore.setFans([...fans, newFan])
    return newFan
  },
  updateFan: (id: string, updates: Partial<Fan>) => {
    const fans = dataStore.getFans()
    const index = fans.findIndex(f => f.id === id)
    if (index !== -1) {
      fans[index] = { ...fans[index], ...updates }
      dataStore.setFans(fans)
    }
  },
  deleteFan: (id: string) => {
    const fans = dataStore.getFans().filter(f => f.id !== id)
    dataStore.setFans(fans)
  },

  // News
  getNews: (): NewsItem[] => getFromStorage(STORAGE_KEYS.news, []),
  setNews: (news: NewsItem[]) => setToStorage(STORAGE_KEYS.news, news),
  addNews: (newsItem: Omit<NewsItem, "id">) => {
    const news = dataStore.getNews()
    const newItem = { ...newsItem, id: Date.now().toString() }
    dataStore.setNews([...news, newItem])
    return newItem
  },
  updateNews: (id: string, updates: Partial<NewsItem>) => {
    const news = dataStore.getNews()
    const index = news.findIndex(n => n.id === id)
    if (index !== -1) {
      news[index] = { ...news[index], ...updates }
      dataStore.setNews(news)
    }
  },
  deleteNews: (id: string) => {
    const news = dataStore.getNews().filter(n => n.id !== id)
    dataStore.setNews(news)
  },

  // Media
  getMedia: (): MediaItem[] => getFromStorage(STORAGE_KEYS.media, []),
  setMedia: (media: MediaItem[]) => setToStorage(STORAGE_KEYS.media, media),
  addMedia: (mediaItem: Omit<MediaItem, "id">) => {
    const media = dataStore.getMedia()
    const newItem = { ...mediaItem, id: Date.now().toString() }
    dataStore.setMedia([...media, newItem])
    return newItem
  },
  deleteMedia: (id: string) => {
    const media = dataStore.getMedia().filter(m => m.id !== id)
    dataStore.setMedia(media)
  },

  // Settings
  getSettings: (): SiteSettings => getFromStorage(STORAGE_KEYS.settings, defaultSettings),
  setSettings: (settings: SiteSettings) => setToStorage(STORAGE_KEYS.settings, settings),
  updateSettings: (updates: Partial<SiteSettings>) => {
    const settings = dataStore.getSettings()
    dataStore.setSettings({ ...settings, ...updates })
  },

  // Reset all data
  resetToDefaults: () => {
    dataStore.setPlayers(defaultPlayers)
    dataStore.setMatches(defaultMatches)
    dataStore.setPartners([])
    dataStore.setFans([])
    dataStore.setNews([])
    dataStore.setMedia([])
    dataStore.setSettings(defaultSettings)
  }
}

// Hook for subscribing to data changes
export function useDataStore<T>(
  getter: () => T,
  key: string
): T {
  const [data, setData] = useState<T>(getter)

  useEffect(() => {
    // Initial load
    setData(getter())

    // Listen for changes
    const handleUpdate = (event: CustomEvent) => {
      if (event.detail.key === key || event.detail.key === `titanforce_${key}`) {
        setData(getter())
      }
    }

    window.addEventListener("dataStoreUpdate", handleUpdate as EventListener)
    
    // Also listen for storage events from other tabs
    const handleStorage = (event: StorageEvent) => {
      if (event.key?.includes("titanforce_")) {
        setData(getter())
      }
    }
    window.addEventListener("storage", handleStorage)

    return () => {
      window.removeEventListener("dataStoreUpdate", handleUpdate as EventListener)
      window.removeEventListener("storage", handleStorage)
    }
  }, [getter, key])

  return data
}
