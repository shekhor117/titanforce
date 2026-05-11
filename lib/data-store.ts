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
  // Personal Dates
  dateOfBirth?: string
  joinDate?: string
  seasonYear?: string
  // Extended Stats
  appearances?: number
  minutes?: number
  passAccuracy?: number
  chancesCreated?: number
  // Season Stats
  premierMatches?: number
  cupMatches?: number
  yellowCards?: number
  redCards?: number
  motmAwards?: number
  averageRating?: number
  // Player Attributes (0-100)
  pace?: number
  shooting?: number
  passing?: number
  dribbling?: number
  defending?: number
  physical?: number
  // Trophies
  trophies?: { name: string; year: string }[]
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

// Activity log types
export interface ActivityLog {
  id: string
  action: "create" | "update" | "delete" | "login" | "export" | "import"
  entity: string
  entityId?: string
  description: string
  timestamp: string
  user?: string
}

// User types for admin management
export interface AdminUser {
  id: string
  name: string
  email: string
  role: "admin" | "player" | "fan" | "partner"
  status: "active" | "inactive"
  joinedAt: string
  lastLogin?: string
}

// Contact message types
export interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: "unread" | "read" | "replied"
  createdAt: string
}

// Rating and voting types
export interface PlayerRating {
  playerId: string
  visitorId: string
  rating: number // 1-5 stars
  timestamp: string
}

export interface PlayerVote {
  playerId: string
  visitorId: string
  voteType: "motm" | "favorite" // Man of the Match or Favorite Player
  matchId?: string // For MOTM votes
  timestamp: string
}

export interface MatchVote {
  matchId: string
  visitorId: string
  prediction: "home" | "draw" | "away"
  timestamp: string
}

export interface NewsReaction {
  newsId: string
  visitorId: string
  reaction: "like" | "love" | "wow" | "sad"
  timestamp: string
}

// Storage keys
const STORAGE_KEYS = {
  players: "titanforce_players",
  matches: "titanforce_matches",
  partners: "titanforce_partners",
  fans: "titanforce_fans",
  news: "titanforce_news",
  media: "titanforce_media",
  settings: "titanforce_settings",
  activityLog: "titanforce_activity_log",
  adminUsers: "titanforce_admin_users",
  contacts: "titanforce_contacts",
  playerRatings: "titanforce_player_ratings",
  playerVotes: "titanforce_player_votes",
  matchVotes: "titanforce_match_votes",
  newsReactions: "titanforce_news_reactions",
  visitorId: "titanforce_visitor_id"
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
    dataStore.addActivityLog({ action: "create", entity: "player", entityId: newPlayer.id, description: `Added player ${player.name}` })
    return newPlayer
  },
  updatePlayer: (id: string, updates: Partial<Player>) => {
    const players = dataStore.getPlayers()
    const index = players.findIndex(p => p.id === id)
    if (index !== -1) {
      const oldName = players[index].name
      players[index] = { ...players[index], ...updates }
      dataStore.setPlayers(players)
      dataStore.addActivityLog({ action: "update", entity: "player", entityId: id, description: `Updated player ${oldName}` })
    }
  },
  deletePlayer: (id: string) => {
    const players = dataStore.getPlayers()
    const player = players.find(p => p.id === id)
    dataStore.setPlayers(players.filter(p => p.id !== id))
    if (player) {
      dataStore.addActivityLog({ action: "delete", entity: "player", entityId: id, description: `Deleted player ${player.name}` })
    }
  },

  // Matches
  getMatches: (): Match[] => getFromStorage(STORAGE_KEYS.matches, defaultMatches),
  setMatches: (matches: Match[]) => setToStorage(STORAGE_KEYS.matches, matches),
  addMatch: (match: Omit<Match, "id">) => {
    const matches = dataStore.getMatches()
    const newMatch = { ...match, id: Date.now().toString() }
    dataStore.setMatches([...matches, newMatch])
    dataStore.addActivityLog({ action: "create", entity: "match", entityId: newMatch.id, description: `Added match ${match.home} vs ${match.away}` })
    return newMatch
  },
  updateMatch: (id: string, updates: Partial<Match>) => {
    const matches = dataStore.getMatches()
    const index = matches.findIndex(m => m.id === id)
    if (index !== -1) {
      matches[index] = { ...matches[index], ...updates }
      dataStore.setMatches(matches)
      dataStore.addActivityLog({ action: "update", entity: "match", entityId: id, description: `Updated match ${matches[index].home} vs ${matches[index].away}` })
    }
  },
  deleteMatch: (id: string) => {
    const matches = dataStore.getMatches()
    const match = matches.find(m => m.id === id)
    dataStore.setMatches(matches.filter(m => m.id !== id))
    if (match) {
      dataStore.addActivityLog({ action: "delete", entity: "match", entityId: id, description: `Deleted match ${match.home} vs ${match.away}` })
    }
  },

  // Partners
  getPartners: (): Partner[] => getFromStorage(STORAGE_KEYS.partners, []),
  setPartners: (partners: Partner[]) => setToStorage(STORAGE_KEYS.partners, partners),
  addPartner: (partner: Omit<Partner, "id">) => {
    const partners = dataStore.getPartners()
    const newPartner = { ...partner, id: Date.now().toString() }
    dataStore.setPartners([...partners, newPartner])
    dataStore.addActivityLog({ action: "create", entity: "partner", entityId: newPartner.id, description: `Added partner ${partner.name}` })
    return newPartner
  },
  updatePartner: (id: string, updates: Partial<Partner>) => {
    const partners = dataStore.getPartners()
    const index = partners.findIndex(p => p.id === id)
    if (index !== -1) {
      const oldName = partners[index].name
      partners[index] = { ...partners[index], ...updates }
      dataStore.setPartners(partners)
      dataStore.addActivityLog({ action: "update", entity: "partner", entityId: id, description: `Updated partner ${oldName}` })
    }
  },
  deletePartner: (id: string) => {
    const partners = dataStore.getPartners()
    const partner = partners.find(p => p.id === id)
    dataStore.setPartners(partners.filter(p => p.id !== id))
    if (partner) {
      dataStore.addActivityLog({ action: "delete", entity: "partner", entityId: id, description: `Deleted partner ${partner.name}` })
    }
  },

  // Fans
  getFans: (): Fan[] => getFromStorage(STORAGE_KEYS.fans, []),
  setFans: (fans: Fan[]) => setToStorage(STORAGE_KEYS.fans, fans),
  addFan: (fan: Omit<Fan, "id">) => {
    const fans = dataStore.getFans()
    const newFan = { ...fan, id: Date.now().toString() }
    dataStore.setFans([...fans, newFan])
    dataStore.addActivityLog({ action: "create", entity: "fan", entityId: newFan.id, description: `Added fan ${fan.name}` })
    return newFan
  },
  updateFan: (id: string, updates: Partial<Fan>) => {
    const fans = dataStore.getFans()
    const index = fans.findIndex(f => f.id === id)
    if (index !== -1) {
      const oldName = fans[index].name
      fans[index] = { ...fans[index], ...updates }
      dataStore.setFans(fans)
      dataStore.addActivityLog({ action: "update", entity: "fan", entityId: id, description: `Updated fan ${oldName}` })
    }
  },
  deleteFan: (id: string) => {
    const fans = dataStore.getFans()
    const fan = fans.find(f => f.id === id)
    dataStore.setFans(fans.filter(f => f.id !== id))
    if (fan) {
      dataStore.addActivityLog({ action: "delete", entity: "fan", entityId: id, description: `Deleted fan ${fan.name}` })
    }
  },

  // News
  getNews: (): NewsItem[] => getFromStorage(STORAGE_KEYS.news, []),
  setNews: (news: NewsItem[]) => setToStorage(STORAGE_KEYS.news, news),
  addNews: (newsItem: Omit<NewsItem, "id">) => {
    const news = dataStore.getNews()
    const newItem = { ...newsItem, id: Date.now().toString() }
    dataStore.setNews([...news, newItem])
    dataStore.addActivityLog({ action: "create", entity: "news", entityId: newItem.id, description: `Added news "${newsItem.title}"` })
    return newItem
  },
  updateNews: (id: string, updates: Partial<NewsItem>) => {
    const news = dataStore.getNews()
    const index = news.findIndex(n => n.id === id)
    if (index !== -1) {
      const oldTitle = news[index].title
      news[index] = { ...news[index], ...updates }
      dataStore.setNews(news)
      dataStore.addActivityLog({ action: "update", entity: "news", entityId: id, description: `Updated news "${oldTitle}"` })
    }
  },
  deleteNews: (id: string) => {
    const news = dataStore.getNews()
    const item = news.find(n => n.id === id)
    dataStore.setNews(news.filter(n => n.id !== id))
    if (item) {
      dataStore.addActivityLog({ action: "delete", entity: "news", entityId: id, description: `Deleted news "${item.title}"` })
    }
  },

  // Media
  getMedia: (): MediaItem[] => getFromStorage(STORAGE_KEYS.media, []),
  setMedia: (media: MediaItem[]) => setToStorage(STORAGE_KEYS.media, media),
  addMedia: (mediaItem: Omit<MediaItem, "id">) => {
    const media = dataStore.getMedia()
    const newItem = { ...mediaItem, id: Date.now().toString() }
    dataStore.setMedia([...media, newItem])
    dataStore.addActivityLog({ action: "create", entity: "media", entityId: newItem.id, description: `Added media "${mediaItem.title}"` })
    return newItem
  },
  deleteMedia: (id: string) => {
    const media = dataStore.getMedia()
    const item = media.find(m => m.id === id)
    dataStore.setMedia(media.filter(m => m.id !== id))
    if (item) {
      dataStore.addActivityLog({ action: "delete", entity: "media", entityId: id, description: `Deleted media "${item.title}"` })
    }
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
    dataStore.setActivityLog([])
    dataStore.setAdminUsers([])
    dataStore.setContacts([])
  },

  // Activity Log
  getActivityLog: (): ActivityLog[] => getFromStorage(STORAGE_KEYS.activityLog, []),
  setActivityLog: (logs: ActivityLog[]) => setToStorage(STORAGE_KEYS.activityLog, logs),
  addActivityLog: (log: Omit<ActivityLog, "id" | "timestamp">) => {
    const logs = dataStore.getActivityLog()
    const newLog = { 
      ...log, 
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    }
    // Keep only last 100 logs
    const updatedLogs = [newLog, ...logs].slice(0, 100)
    dataStore.setActivityLog(updatedLogs)
    return newLog
  },
  clearActivityLog: () => {
    dataStore.setActivityLog([])
  },

  // Admin Users
  getAdminUsers: (): AdminUser[] => getFromStorage(STORAGE_KEYS.adminUsers, []),
  setAdminUsers: (users: AdminUser[]) => setToStorage(STORAGE_KEYS.adminUsers, users),
  addAdminUser: (user: Omit<AdminUser, "id">) => {
    const users = dataStore.getAdminUsers()
    const newUser = { ...user, id: Date.now().toString() }
    dataStore.setAdminUsers([...users, newUser])
    dataStore.addActivityLog({ action: "create", entity: "user", entityId: newUser.id, description: `Created user ${user.name}` })
    return newUser
  },
  updateAdminUser: (id: string, updates: Partial<AdminUser>) => {
    const users = dataStore.getAdminUsers()
    const index = users.findIndex(u => u.id === id)
    if (index !== -1) {
      const oldName = users[index].name
      users[index] = { ...users[index], ...updates }
      dataStore.setAdminUsers(users)
      dataStore.addActivityLog({ action: "update", entity: "user", entityId: id, description: `Updated user ${oldName}` })
    }
  },
  deleteAdminUser: (id: string) => {
    const users = dataStore.getAdminUsers()
    const user = users.find(u => u.id === id)
    const filtered = users.filter(u => u.id !== id)
    dataStore.setAdminUsers(filtered)
    if (user) {
      dataStore.addActivityLog({ action: "delete", entity: "user", entityId: id, description: `Deleted user ${user.name}` })
    }
  },

  // Contacts
  getContacts: (): ContactMessage[] => getFromStorage(STORAGE_KEYS.contacts, []),
  setContacts: (contacts: ContactMessage[]) => setToStorage(STORAGE_KEYS.contacts, contacts),
  addContact: (contact: Omit<ContactMessage, "id" | "createdAt" | "status">) => {
    const contacts = dataStore.getContacts()
    const newContact = { 
      ...contact, 
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: "unread" as const
    }
    dataStore.setContacts([...contacts, newContact])
    return newContact
  },
  updateContact: (id: string, updates: Partial<ContactMessage>) => {
    const contacts = dataStore.getContacts()
    const index = contacts.findIndex(c => c.id === id)
    if (index !== -1) {
      contacts[index] = { ...contacts[index], ...updates }
      dataStore.setContacts(contacts)
    }
  },
  deleteContact: (id: string) => {
    const contacts = dataStore.getContacts().filter(c => c.id !== id)
    dataStore.setContacts(contacts)
  },

  // Export all data
  exportAllData: () => {
    const data = {
      players: dataStore.getPlayers(),
      matches: dataStore.getMatches(),
      partners: dataStore.getPartners(),
      fans: dataStore.getFans(),
      news: dataStore.getNews(),
      media: dataStore.getMedia(),
      settings: dataStore.getSettings(),
      adminUsers: dataStore.getAdminUsers(),
      contacts: dataStore.getContacts(),
      exportDate: new Date().toISOString()
    }
    dataStore.addActivityLog({ action: "export", entity: "system", description: "Exported all data" })
    return data
  },

  // Import all data
  importAllData: (data: Record<string, unknown>) => {
    if (data.players) dataStore.setPlayers(data.players as Player[])
    if (data.matches) dataStore.setMatches(data.matches as Match[])
    if (data.partners) dataStore.setPartners(data.partners as Partner[])
    if (data.fans) dataStore.setFans(data.fans as Fan[])
    if (data.news) dataStore.setNews(data.news as NewsItem[])
    if (data.media) dataStore.setMedia(data.media as MediaItem[])
    if (data.settings) dataStore.setSettings(data.settings as SiteSettings)
    if (data.adminUsers) dataStore.setAdminUsers(data.adminUsers as AdminUser[])
    if (data.contacts) dataStore.setContacts(data.contacts as ContactMessage[])
    dataStore.addActivityLog({ action: "import", entity: "system", description: "Imported data backup" })
  },

  // Get dashboard stats
  getDashboardStats: () => {
    return {
      players: dataStore.getPlayers().length,
      matches: dataStore.getMatches().length,
      fans: dataStore.getFans().length,
      partners: dataStore.getPartners().length,
      news: dataStore.getNews().length,
      media: dataStore.getMedia().length,
      users: dataStore.getAdminUsers().length,
      contacts: dataStore.getContacts().length,
      unreadContacts: dataStore.getContacts().filter(c => c.status === "unread").length,
      activePartners: dataStore.getPartners().filter(p => p.status === "active").length,
      upcomingMatches: dataStore.getMatches().filter(m => m.status === "upcoming").length,
      publishedNews: dataStore.getNews().filter(n => n.status === "published").length
    }
  },

  // Visitor ID (for tracking ratings/votes without login)
  getVisitorId: (): string => {
    if (typeof window === "undefined") return ""
    let visitorId = localStorage.getItem(STORAGE_KEYS.visitorId)
    if (!visitorId) {
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem(STORAGE_KEYS.visitorId, visitorId)
    }
    return visitorId
  },

  // Player Ratings
  getPlayerRatings: (): PlayerRating[] => getFromStorage(STORAGE_KEYS.playerRatings, []),
  setPlayerRatings: (ratings: PlayerRating[]) => setToStorage(STORAGE_KEYS.playerRatings, ratings),
  ratePlayer: (playerId: string, rating: number) => {
    const visitorId = dataStore.getVisitorId()
    const ratings = dataStore.getPlayerRatings()
    const existingIndex = ratings.findIndex(r => r.playerId === playerId && r.visitorId === visitorId)
    
    const newRating: PlayerRating = {
      playerId,
      visitorId,
      rating,
      timestamp: new Date().toISOString()
    }
    
    if (existingIndex !== -1) {
      ratings[existingIndex] = newRating
    } else {
      ratings.push(newRating)
    }
    
    dataStore.setPlayerRatings(ratings)
    return newRating
  },
  getPlayerAverageRating: (playerId: string): { average: number; count: number } => {
    const ratings = dataStore.getPlayerRatings().filter(r => r.playerId === playerId)
    if (ratings.length === 0) return { average: 0, count: 0 }
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0)
    return { average: sum / ratings.length, count: ratings.length }
  },
  getVisitorPlayerRating: (playerId: string): number | null => {
    const visitorId = dataStore.getVisitorId()
    const rating = dataStore.getPlayerRatings().find(r => r.playerId === playerId && r.visitorId === visitorId)
    return rating ? rating.rating : null
  },

  // Player Votes (Favorite Player)
  getPlayerVotes: (): PlayerVote[] => getFromStorage(STORAGE_KEYS.playerVotes, []),
  setPlayerVotes: (votes: PlayerVote[]) => setToStorage(STORAGE_KEYS.playerVotes, votes),
  voteForPlayer: (playerId: string, voteType: "motm" | "favorite", matchId?: string) => {
    const visitorId = dataStore.getVisitorId()
    const votes = dataStore.getPlayerVotes()
    
    // For favorite, only one vote per visitor. For MOTM, one per match.
    const existingIndex = voteType === "favorite"
      ? votes.findIndex(v => v.visitorId === visitorId && v.voteType === "favorite")
      : votes.findIndex(v => v.visitorId === visitorId && v.voteType === "motm" && v.matchId === matchId)
    
    const newVote: PlayerVote = {
      playerId,
      visitorId,
      voteType,
      matchId,
      timestamp: new Date().toISOString()
    }
    
    if (existingIndex !== -1) {
      votes[existingIndex] = newVote
    } else {
      votes.push(newVote)
    }
    
    dataStore.setPlayerVotes(votes)
    return newVote
  },
  getPlayerVoteCount: (playerId: string, voteType: "motm" | "favorite"): number => {
    return dataStore.getPlayerVotes().filter(v => v.playerId === playerId && v.voteType === voteType).length
  },
  getVisitorFavoritePlayer: (): string | null => {
    const visitorId = dataStore.getVisitorId()
    const vote = dataStore.getPlayerVotes().find(v => v.visitorId === visitorId && v.voteType === "favorite")
    return vote ? vote.playerId : null
  },

  // Match Votes (Predictions)
  getMatchVotes: (): MatchVote[] => getFromStorage(STORAGE_KEYS.matchVotes, []),
  setMatchVotes: (votes: MatchVote[]) => setToStorage(STORAGE_KEYS.matchVotes, votes),
  voteForMatch: (matchId: string, prediction: "home" | "draw" | "away") => {
    const visitorId = dataStore.getVisitorId()
    const votes = dataStore.getMatchVotes()
    const existingIndex = votes.findIndex(v => v.matchId === matchId && v.visitorId === visitorId)
    
    const newVote: MatchVote = {
      matchId,
      visitorId,
      prediction,
      timestamp: new Date().toISOString()
    }
    
    if (existingIndex !== -1) {
      votes[existingIndex] = newVote
    } else {
      votes.push(newVote)
    }
    
    dataStore.setMatchVotes(votes)
    return newVote
  },
  getMatchVoteCounts: (matchId: string): { home: number; draw: number; away: number } => {
    const votes = dataStore.getMatchVotes().filter(v => v.matchId === matchId)
    return {
      home: votes.filter(v => v.prediction === "home").length,
      draw: votes.filter(v => v.prediction === "draw").length,
      away: votes.filter(v => v.prediction === "away").length
    }
  },
  getVisitorMatchVote: (matchId: string): "home" | "draw" | "away" | null => {
    const visitorId = dataStore.getVisitorId()
    const vote = dataStore.getMatchVotes().find(v => v.matchId === matchId && v.visitorId === visitorId)
    return vote ? vote.prediction : null
  },

  // News Reactions
  getNewsReactions: (): NewsReaction[] => getFromStorage(STORAGE_KEYS.newsReactions, []),
  setNewsReactions: (reactions: NewsReaction[]) => setToStorage(STORAGE_KEYS.newsReactions, reactions),
  reactToNews: (newsId: string, reaction: "like" | "love" | "wow" | "sad") => {
    const visitorId = dataStore.getVisitorId()
    const reactions = dataStore.getNewsReactions()
    const existingIndex = reactions.findIndex(r => r.newsId === newsId && r.visitorId === visitorId)
    
    const newReaction: NewsReaction = {
      newsId,
      visitorId,
      reaction,
      timestamp: new Date().toISOString()
    }
    
    if (existingIndex !== -1) {
      // Toggle off if same reaction
      if (reactions[existingIndex].reaction === reaction) {
        reactions.splice(existingIndex, 1)
        dataStore.setNewsReactions(reactions)
        return null
      }
      reactions[existingIndex] = newReaction
    } else {
      reactions.push(newReaction)
    }
    
    dataStore.setNewsReactions(reactions)
    return newReaction
  },
  getNewsReactionCounts: (newsId: string): { like: number; love: number; wow: number; sad: number } => {
    const reactions = dataStore.getNewsReactions().filter(r => r.newsId === newsId)
    return {
      like: reactions.filter(r => r.reaction === "like").length,
      love: reactions.filter(r => r.reaction === "love").length,
      wow: reactions.filter(r => r.reaction === "wow").length,
      sad: reactions.filter(r => r.reaction === "sad").length
    }
  },
  getVisitorNewsReaction: (newsId: string): "like" | "love" | "wow" | "sad" | null => {
    const visitorId = dataStore.getVisitorId()
    const reaction = dataStore.getNewsReactions().find(r => r.newsId === newsId && r.visitorId === visitorId)
    return reaction ? reaction.reaction : null
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
