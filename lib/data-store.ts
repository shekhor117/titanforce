"use client"

import { useState, useEffect } from "react"
import { getDataService } from "@/lib/data-service"

// Types
export interface Player {
  id: string
  num: number
  name: string
  full_name: string
  position: string
  category: "GK" | "DEF" | "MID" | "FWD"
  age: number
  hometown: string
  foot: "Left" | "Right" | "Both"
  goals: number
  assists: number
  clean_sheets?: number
  bio: string
  image_url?: string
  email?: string
  status: "active" | "injured" | "suspended" | "recovering" | "recovered"
  // Personal Dates
  date_of_birth?: string
  join_date?: string
  season_year?: string
  // Extended Stats
  appearances?: number
  minutes_played?: number
  pass_accuracy?: number
  chances_created?: number
  // Season Stats
  premier_matches?: number
  cup_matches?: number
  yellow_cards?: number
  red_cards?: number
  man_of_the_match?: number
  average_rating?: number
  // Player Attributes (0-100)
  pace?: number
  shooting?: number
  passing?: number
  dribbling?: number
  defending?: number
  physical?: number
  // Legacy camelCase names for backward compatibility
  fullName?: string
  pos?: string
  cat?: "GK" | "DEF" | "MID" | "FWD"
  cleanSheets?: number
  photo?: string
  dateOfBirth?: string
  joinDate?: string
  seasonYear?: string
  minutes?: number
  passAccuracy?: number
  chancesCreated?: number
  premierMatches?: number
  cupMatches?: number
  yellowCards?: number
  redCards?: number
  motmAwards?: number
  averageRating?: number
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

// Challenge/Goals type
export interface Challenge {
  id: string
  title: string
  description: string
  icon?: string
  targetValue?: number
  currentValue?: number
  deadline?: string
  status: "active" | "completed" | "upcoming"
  category: "team" | "player" | "milestone"
  reward?: string
  createdAt: string
  updatedAt: string
}

// MOTM (Man of the Match) type
export interface MOTM {
  id: string
  matchId: string
  playerId: string
  playerName: string
  rating: number // 1-10
  stats?: {
    passes?: number
    tackles?: number
    goals?: number
    assists?: number
    shotAccuracy?: string
  }
  notes?: string
  votesCount?: number
  createdAt: string
  updatedAt: string
}

// Newsletter Campaign type
export interface NewsletterCampaign {
  id: string
  title: string
  subject: string
  content: string
  recipients: string[] // emails
  status: "draft" | "scheduled" | "sent"
  scheduledFor?: string
  sentAt?: string
  openRate?: number
  clickRate?: number
  createdAt: string
  updatedAt: string
}

// About Page Content type
export interface AboutContent {
  id: string
  title: string
  description: string
  content: string
  image?: string
  sections: Array<{
    heading: string
    text: string
  }>
  createdAt: string
  updatedAt: string
}

// Site Settings type
export interface SiteSettings {
  id: string
  siteName: string
  siteDescription: string
  logo?: string
  favicon?: string
  primaryColor?: string
  secondaryColor?: string
  contactEmail?: string
  contactPhone?: string
  address?: string
  timezone?: string
  currency?: string
  maintenanceMode?: boolean
  createdAt: string
  updatedAt: string
}

// Banner/Hero Content type
export interface Banner {
  id: string
  title: string
  description?: string
  image?: string
  link?: string
  buttonText?: string
  page: "home" | "shop" | "team" | "news" | "gallery"
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Testimonial/Review type
export interface Testimonial {
  id: string
  author: string
  role?: string
  content: string
  rating?: number // 1-5
  image?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Social Media Links type
export interface SocialLink {
  id: string
  platform: "facebook" | "twitter" | "instagram" | "youtube" | "tiktok" | "linkedin"
  url: string
  displayName?: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Club Info type
export interface ClubInfo {
  id: string
  founded: string
  homeGround: string
  motto: string
  community: string
  createdAt: string
  updatedAt: string
}

// Statistics/Stats type
export interface Statistics {
  id: string
  totalPlayers: number
  totalWins: number
  totalTeams: number
  totalFans: number
  trophies?: number
  matches?: number
  goals?: number
  description?: string
  createdAt: string
  updatedAt: string
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
  challenges: "titanforce_challenges",
  motm: "titanforce_motm",
  newsletters: "titanforce_newsletters",
  aboutContent: "titanforce_about_content",
  siteSettings: "titanforce_site_settings",
  banners: "titanforce_banners",
  testimonials: "titanforce_testimonials",
  socialLinks: "titanforce_social_links",
  clubInfo: "titanforce_club_info",
  statistics: "titanforce_statistics",
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

// Data Store API - Now backed by Supabase via data-service.ts
export const dataStore = {
  // Players - Supabase backed
  getPlayers: async (): Promise<Player[]> => {
    try {
      const service = getDataService()
      const data = await service.getPlayers()
      // Map Supabase schema to app schema
      return data.map(p => ({
        id: p.id,
        num: p.num || 0,
        name: p.full_name?.split(' ')[0] || p.name || '',
        fullName: p.full_name || p.name || '',
        pos: p.pos || '',
        cat: p.cat as "GK" | "DEF" | "MID" | "FWD",
        age: p.age || 0,
        hometown: p.hometown || '',
        foot: (p.foot as "Left" | "Right" | "Both") || "Right",
        goals: p.goals || 0,
        assists: p.assists || 0,
        cleanSheets: p.clean_sheets,
        bio: p.bio || '',
        photo: p.photo_url,
        status: (p.status as "active" | "injured" | "suspended") || "active",
        dateOfBirth: p.date_of_birth,
        joinDate: p.join_date,
        seasonYear: p.season_year,
        appearances: p.appearances,
        minutes: p.minutes,
        passAccuracy: p.pass_accuracy,
        chancesCreated: p.chances_created,
        premierMatches: p.premier_matches,
        cupMatches: p.cup_matches,
        yellowCards: p.yellow_cards,
        redCards: p.red_cards,
        motmAwards: p.motm_awards,
        averageRating: p.average_rating,
        pace: p.pace,
        shooting: p.shooting,
        passing: p.passing,
        dribbling: p.dribbling,
        defending: p.defending,
        physical: p.physical,
      })) 
    } catch (err) {
      return []
    }
  },
  setPlayers: (players: Player[]) => {
    // Note: This is handled via dataService operations
  },
  addPlayer: async (player: Omit<Player, "id">) => {
    const service = getDataService()
    return await service.addPlayer({
      num: player.num,
      name: player.name,
      full_name: player.fullName,
      pos: player.pos,
      cat: player.cat,
      age: player.age,
      hometown: player.hometown,
      foot: player.foot,
      goals: player.goals,
      assists: player.assists,
      bio: player.bio,
      photo_url: player.photo,
      status: player.status,
      date_of_birth: player.dateOfBirth,
      join_date: player.joinDate,
      season_year: player.seasonYear,
    })
  },
  updatePlayer: async (id: string, updates: Partial<Player>) => {
    const service = getDataService()
    return await service.updatePlayer(id, {
      full_name: updates.fullName,
      num: updates.num,
      pos: updates.pos,
      cat: updates.cat,
      age: updates.age,
      hometown: updates.hometown,
      foot: updates.foot,
      goals: updates.goals,
      assists: updates.assists,
      bio: updates.bio,
      photo_url: updates.photo,
      status: updates.status,
    })
  },
  deletePlayer: async (id: string) => {
    const service = getDataService()
    return await service.deletePlayer(id)
  },

  // Matches - Supabase backed
  getMatches: async (): Promise<Match[]> => {
    try {
      const service = getDataService()
      const data = await service.getMatches()
      return data.map(m => ({
        id: m.id,
        home: m.home_team || 'Titan Force',
        away: m.away_team || 'TBD',
        homeScore: m.home_score,
        awayScore: m.away_score,
        date: m.date || '',
        time: m.time || '',
        venue: m.venue || '',
        status: (m.status as "upcoming" | "live" | "completed") || "upcoming",
        result: (m.result as "W" | "L" | "D"),
      }))
    } catch (err) {
      return []
    }
  },
  setMatches: (matches: Match[]) => {
  },
  addMatch: async (match: Omit<Match, "id">) => {
    const service = getDataService()
    return await service.addMatch({
      home_team: match.home,
      away_team: match.away,
      home_score: match.homeScore,
      away_score: match.awayScore,
      date: match.date,
      time: match.time,
      venue: match.venue,
      status: match.status,
      result: match.result,
    })
  },
  updateMatch: async (id: string, updates: Partial<Match>) => {
    const service = getDataService()
    return await service.updateMatch(id, {
      home_team: updates.home,
      away_team: updates.away,
      home_score: updates.homeScore,
      away_score: updates.awayScore,
      date: updates.date,
      time: updates.time,
      venue: updates.venue,
      status: updates.status,
      result: updates.result,
    })
  },
  deleteMatch: async (id: string) => {
    const service = getDataService()
    return await service.deleteMatch(id)
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

  // Contacts - Supabase backed with localStorage fallback
  getContacts: async (): Promise<ContactMessage[]> => {
    try {
      const service = getDataService()
      const data = await service.getContactMessages()
      if (data.length > 0) {
        return data.map(c => ({
          id: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone,
          subject: c.subject,
          message: c.message,
          status: c.status,
          createdAt: c.created_at,
        }))
      }
      // Fallback to localStorage
      return getFromStorage(STORAGE_KEYS.contacts, [])
    } catch {
      return getFromStorage(STORAGE_KEYS.contacts, [])
    }
  },
  setContacts: (contacts: ContactMessage[]) => setToStorage(STORAGE_KEYS.contacts, contacts),
  addContact: async (contact: Omit<ContactMessage, "id" | "createdAt" | "status">) => {
    try {
      const service = getDataService()
      const newContact = await service.createContactMessage({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        subject: contact.subject,
        message: contact.message,
        status: "unread",
      })
      return {
        id: newContact.id,
        name: newContact.name,
        email: newContact.email,
        phone: newContact.phone,
        subject: newContact.subject,
        message: newContact.message,
        status: newContact.status,
        createdAt: newContact.created_at,
      }
    } catch {
      // Fallback to localStorage
      const contacts = getFromStorage(STORAGE_KEYS.contacts, []) as ContactMessage[]
      const newContact = { 
        ...contact, 
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: "unread" as const
      }
      setToStorage(STORAGE_KEYS.contacts, [...contacts, newContact])
      return newContact
    }
  },
  updateContact: async (id: string, updates: Partial<ContactMessage>) => {
    try {
      const service = getDataService()
      await service.updateContactMessage(id, {
        status: updates.status,
      })
    } catch {
      // Fallback to localStorage
      const contacts = getFromStorage(STORAGE_KEYS.contacts, []) as ContactMessage[]
      const index = contacts.findIndex(c => c.id === id)
      if (index !== -1) {
        contacts[index] = { ...contacts[index], ...updates }
        setToStorage(STORAGE_KEYS.contacts, contacts)
      }
    }
  },
  deleteContact: async (id: string) => {
    try {
      const service = getDataService()
      await service.deleteContactMessage(id)
    } catch {
      // Fallback to localStorage
      const contacts = (getFromStorage(STORAGE_KEYS.contacts, []) as ContactMessage[]).filter(c => c.id !== id)
      setToStorage(STORAGE_KEYS.contacts, contacts)
    }
  },

  // Challenges CRUD
  getChallenges: (): Challenge[] => getFromStorage(STORAGE_KEYS.challenges, []),
  setChallenges: (challenges: Challenge[]) => setToStorage(STORAGE_KEYS.challenges, challenges),
  addChallenge: (challenge: Omit<Challenge, "id" | "createdAt" | "updatedAt">) => {
    const challenges = dataStore.getChallenges()
    const newChallenge = {
      ...challenge,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    dataStore.setChallenges([...challenges, newChallenge])
    dataStore.addActivityLog({ action: "create", entity: "challenge", entityId: newChallenge.id, description: `Added challenge "${challenge.title}"` })
    return newChallenge
  },
  updateChallenge: (id: string, updates: Partial<Challenge>) => {
    const challenges = dataStore.getChallenges()
    const index = challenges.findIndex(c => c.id === id)
    if (index !== -1) {
      const oldTitle = challenges[index].title
      challenges[index] = { ...challenges[index], ...updates, updatedAt: new Date().toISOString() }
      dataStore.setChallenges(challenges)
      dataStore.addActivityLog({ action: "update", entity: "challenge", entityId: id, description: `Updated challenge "${oldTitle}"` })
    }
  },
  deleteChallenge: (id: string) => {
    const challenges = dataStore.getChallenges()
    const challenge = challenges.find(c => c.id === id)
    dataStore.setChallenges(challenges.filter(c => c.id !== id))
    if (challenge) {
      dataStore.addActivityLog({ action: "delete", entity: "challenge", entityId: id, description: `Deleted challenge "${challenge.title}"` })
    }
  },

  // MOTM CRUD
  getMOTMs: (): MOTM[] => getFromStorage(STORAGE_KEYS.motm, []),
  setMOTMs: (motms: MOTM[]) => setToStorage(STORAGE_KEYS.motm, motms),
  addMOTM: (motm: Omit<MOTM, "id" | "createdAt" | "updatedAt">) => {
    const motms = dataStore.getMOTMs()
    const newMOTM = {
      ...motm,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    dataStore.setMOTMs([...motms, newMOTM])
    dataStore.addActivityLog({ action: "create", entity: "motm", entityId: newMOTM.id, description: `Added MOTM for ${motm.playerName}` })
    return newMOTM
  },
  updateMOTM: (id: string, updates: Partial<MOTM>) => {
    const motms = dataStore.getMOTMs()
    const index = motms.findIndex(m => m.id === id)
    if (index !== -1) {
      const oldPlayer = motms[index].playerName
      motms[index] = { ...motms[index], ...updates, updatedAt: new Date().toISOString() }
      dataStore.setMOTMs(motms)
      dataStore.addActivityLog({ action: "update", entity: "motm", entityId: id, description: `Updated MOTM for ${oldPlayer}` })
    }
  },
  deleteMOTM: (id: string) => {
    const motms = dataStore.getMOTMs()
    const motm = motms.find(m => m.id === id)
    dataStore.setMOTMs(motms.filter(m => m.id !== id))
    if (motm) {
      dataStore.addActivityLog({ action: "delete", entity: "motm", entityId: id, description: `Deleted MOTM for ${motm.playerName}` })
    }
  },

  // Newsletter CRUD
  getNewsletters: (): NewsletterCampaign[] => getFromStorage(STORAGE_KEYS.newsletters, []),
  setNewsletters: (newsletters: NewsletterCampaign[]) => setToStorage(STORAGE_KEYS.newsletters, newsletters),
  addNewsletter: (newsletter: Omit<NewsletterCampaign, "id" | "createdAt" | "updatedAt">) => {
    const newsletters = dataStore.getNewsletters()
    const newNewsletter = {
      ...newsletter,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    dataStore.setNewsletters([...newsletters, newNewsletter])
    dataStore.addActivityLog({ action: "create", entity: "newsletter", entityId: newNewsletter.id, description: `Created newsletter "${newsletter.title}"` })
    return newNewsletter
  },
  updateNewsletter: (id: string, updates: Partial<NewsletterCampaign>) => {
    const newsletters = dataStore.getNewsletters()
    const index = newsletters.findIndex(n => n.id === id)
    if (index !== -1) {
      const oldTitle = newsletters[index].title
      newsletters[index] = { ...newsletters[index], ...updates, updatedAt: new Date().toISOString() }
      dataStore.setNewsletters(newsletters)
      dataStore.addActivityLog({ action: "update", entity: "newsletter", entityId: id, description: `Updated newsletter "${oldTitle}"` })
    }
  },
  deleteNewsletter: (id: string) => {
    const newsletters = dataStore.getNewsletters()
    const newsletter = newsletters.find(n => n.id === id)
    dataStore.setNewsletters(newsletters.filter(n => n.id !== id))
    if (newsletter) {
      dataStore.addActivityLog({ action: "delete", entity: "newsletter", entityId: id, description: `Deleted newsletter "${newsletter.title}"` })
    }
  },

  // About Content CRUD
  getAboutContent: (): AboutContent[] => getFromStorage(STORAGE_KEYS.aboutContent, []),
  setAboutContent: (content: AboutContent[]) => setToStorage(STORAGE_KEYS.aboutContent, content),
  addAboutContent: (content: Omit<AboutContent, "id" | "createdAt" | "updatedAt">) => {
    const allContent = dataStore.getAboutContent()
    const newContent = { ...content, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    dataStore.setAboutContent([...allContent, newContent])
    dataStore.addActivityLog({ action: "create", entity: "about", entityId: newContent.id, description: `Added about section "${content.title}"` })
    return newContent
  },
  updateAboutContent: (id: string, updates: Partial<AboutContent>) => {
    const content = dataStore.getAboutContent()
    const index = content.findIndex(c => c.id === id)
    if (index !== -1) {
      const oldTitle = content[index].title
      content[index] = { ...content[index], ...updates, updatedAt: new Date().toISOString() }
      dataStore.setAboutContent(content)
      dataStore.addActivityLog({ action: "update", entity: "about", entityId: id, description: `Updated about section "${oldTitle}"` })
    }
  },
  deleteAboutContent: (id: string) => {
    const content = dataStore.getAboutContent()
    const item = content.find(c => c.id === id)
    dataStore.setAboutContent(content.filter(c => c.id !== id))
    if (item) {
      dataStore.addActivityLog({ action: "delete", entity: "about", entityId: id, description: `Deleted about section "${item.title}"` })
    }
  },

  // Site Settings CRUD
  getSiteSettings: (): SiteSettings | null => getFromStorage(STORAGE_KEYS.siteSettings, null),
  setSiteSettings: (settings: SiteSettings) => setToStorage(STORAGE_KEYS.siteSettings, settings),
  updateSiteSettings: (updates: Partial<SiteSettings>) => {
    const current = dataStore.getSiteSettings() || { id: "1", siteName: "Titan Force", siteDescription: "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    const updated = { ...current, ...updates, updatedAt: new Date().toISOString() }
    dataStore.setSiteSettings(updated)
    dataStore.addActivityLog({ action: "update", entity: "settings", entityId: "1", description: "Updated site settings" })
    return updated
  },

  // Banner CRUD
  getBanners: (): Banner[] => getFromStorage(STORAGE_KEYS.banners, []),
  setBanners: (banners: Banner[]) => setToStorage(STORAGE_KEYS.banners, banners),
  addBanner: (banner: Omit<Banner, "id" | "createdAt" | "updatedAt">) => {
    const banners = dataStore.getBanners()
    const newBanner = { ...banner, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    dataStore.setBanners([...banners, newBanner])
    dataStore.addActivityLog({ action: "create", entity: "banner", entityId: newBanner.id, description: `Added banner "${banner.title}" for ${banner.page}` })
    return newBanner
  },
  updateBanner: (id: string, updates: Partial<Banner>) => {
    const banners = dataStore.getBanners()
    const index = banners.findIndex(b => b.id === id)
    if (index !== -1) {
      const oldTitle = banners[index].title
      banners[index] = { ...banners[index], ...updates, updatedAt: new Date().toISOString() }
      dataStore.setBanners(banners)
      dataStore.addActivityLog({ action: "update", entity: "banner", entityId: id, description: `Updated banner "${oldTitle}"` })
    }
  },
  deleteBanner: (id: string) => {
    const banners = dataStore.getBanners()
    const banner = banners.find(b => b.id === id)
    dataStore.setBanners(banners.filter(b => b.id !== id))
    if (banner) {
      dataStore.addActivityLog({ action: "delete", entity: "banner", entityId: id, description: `Deleted banner "${banner.title}"` })
    }
  },

  // Testimonial CRUD
  getTestimonials: (): Testimonial[] => getFromStorage(STORAGE_KEYS.testimonials, []),
  setTestimonials: (testimonials: Testimonial[]) => setToStorage(STORAGE_KEYS.testimonials, testimonials),
  addTestimonial: (testimonial: Omit<Testimonial, "id" | "createdAt" | "updatedAt">) => {
    const testimonials = dataStore.getTestimonials()
    const newTestimonial = { ...testimonial, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    dataStore.setTestimonials([...testimonials, newTestimonial])
    dataStore.addActivityLog({ action: "create", entity: "testimonial", entityId: newTestimonial.id, description: `Added testimonial from "${testimonial.author}"` })
    return newTestimonial
  },
  updateTestimonial: (id: string, updates: Partial<Testimonial>) => {
    const testimonials = dataStore.getTestimonials()
    const index = testimonials.findIndex(t => t.id === id)
    if (index !== -1) {
      const oldAuthor = testimonials[index].author
      testimonials[index] = { ...testimonials[index], ...updates, updatedAt: new Date().toISOString() }
      dataStore.setTestimonials(testimonials)
      dataStore.addActivityLog({ action: "update", entity: "testimonial", entityId: id, description: `Updated testimonial from "${oldAuthor}"` })
    }
  },
  deleteTestimonial: (id: string) => {
    const testimonials = dataStore.getTestimonials()
    const testimonial = testimonials.find(t => t.id === id)
    dataStore.setTestimonials(testimonials.filter(t => t.id !== id))
    if (testimonial) {
      dataStore.addActivityLog({ action: "delete", entity: "testimonial", entityId: id, description: `Deleted testimonial from "${testimonial.author}"` })
    }
  },

  // Social Links CRUD
  getSocialLinks: (): SocialLink[] => getFromStorage(STORAGE_KEYS.socialLinks, []),
  setSocialLinks: (links: SocialLink[]) => setToStorage(STORAGE_KEYS.socialLinks, links),
  addSocialLink: (link: Omit<SocialLink, "id" | "createdAt" | "updatedAt">) => {
    const links = dataStore.getSocialLinks()
    const newLink = { ...link, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    dataStore.setSocialLinks([...links, newLink])
    dataStore.addActivityLog({ action: "create", entity: "sociallink", entityId: newLink.id, description: `Added ${link.platform} social link` })
    return newLink
  },
  updateSocialLink: (id: string, updates: Partial<SocialLink>) => {
    const links = dataStore.getSocialLinks()
    const index = links.findIndex(l => l.id === id)
    if (index !== -1) {
      const oldPlatform = links[index].platform
      links[index] = { ...links[index], ...updates, updatedAt: new Date().toISOString() }
      dataStore.setSocialLinks(links)
      dataStore.addActivityLog({ action: "update", entity: "sociallink", entityId: id, description: `Updated ${oldPlatform} social link` })
    }
  },
  deleteSocialLink: (id: string) => {
    const links = dataStore.getSocialLinks()
    const link = links.find(l => l.id === id)
    dataStore.setSocialLinks(links.filter(l => l.id !== id))
    if (link) {
      dataStore.addActivityLog({ action: "delete", entity: "sociallink", entityId: id, description: `Deleted ${link.platform} social link` })
    }
  },

  // Club Info CRUD
  getClubInfo: (): ClubInfo | null => getFromStorage(STORAGE_KEYS.clubInfo, null),
  setClubInfo: (info: ClubInfo) => setToStorage(STORAGE_KEYS.clubInfo, info),
  updateClubInfo: (updates: Partial<ClubInfo>) => {
    const current = dataStore.getClubInfo() || { 
      id: "1", 
      founded: "2025", 
      homeGround: "Mulikandi", 
      motto: "One Team, One Dream",
      community: "Stronger Together",
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString() 
    }
    const updated = { ...current, ...updates, updatedAt: new Date().toISOString() }
    dataStore.setClubInfo(updated)
    dataStore.addActivityLog({ action: "update", entity: "clubinfo", entityId: "1", description: "Updated club information" })
    return updated
  },

  // Statistics CRUD
  getStatistics: (): Statistics | null => getFromStorage(STORAGE_KEYS.statistics, null),
  setStatistics: (stats: Statistics) => setToStorage(STORAGE_KEYS.statistics, stats),
  updateStatistics: (updates: Partial<Statistics>) => {
    const current = dataStore.getStatistics() || { 
      id: "1", 
      totalPlayers: 120, 
      totalWins: 15, 
      totalTeams: 8,
      totalFans: 1000,
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString() 
    }
    const updated = { ...current, ...updates, updatedAt: new Date().toISOString() }
    dataStore.setStatistics(updated)
    dataStore.addActivityLog({ action: "update", entity: "statistics", entityId: "1", description: "Updated club statistics" })
    return updated
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

// Hook for subscribing to data changes - Updated for Supabase async getters
export function useDataStore<T>(
  getter: (() => T) | (() => Promise<T>),
  key: string
): T {
  // Initialize with safe default: empty array for arrays, null for objects
  const [data, setData] = useState<T>(() => {
    // Don't try to call async getters synchronously in initializer
    // Just return the safe default
    return ([] as unknown as T)
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    // Initial load
    const loadData = async () => {
      try {
        const result = await Promise.resolve((getter as any)())
        if (isMounted) {
          setData(result ?? ([] as unknown as T))
        }
      } catch (err) {
        console.error(`[v0] Error loading ${key}:`, err)
        if (isMounted) {
          setData(([] as unknown as T))
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadData()

    // Setup real-time subscription via data-service
    let unsubscribe: (() => void) | null = null
    const setupSubscription = async () => {
      try {
        let service
        try {
          service = getDataService()
        } catch (err) {
          console.warn('[v0] Failed to get data service:', err)
          return
        }
        
        if (!service) {
          console.warn('[v0] Data service is null')
          return
        }

        if (key === 'players') {
          unsubscribe = service.subscribeToPlayers((data) => {
            if (isMounted) {
              setData((data ?? []) as any)
            }
          }, (err) => {
            console.error('[v0] Players subscription error:', err)
          })
        } else if (key === 'matches') {
          unsubscribe = service.subscribeToMatches((data) => {
            if (isMounted) {
              setData((data ?? []) as any)
            }
          }, (err) => {
            console.error('[v0] Matches subscription error:', err)
          })
        } else if (key === 'partners') {
          unsubscribe = service.subscribeToPartners((data) => {
            if (isMounted) {
              setData((data ?? []) as any)
            }
          }, (err) => {
            console.error('[v0] Partners subscription error:', err)
          })
        } else if (key === 'news') {
          unsubscribe = service.subscribeToNewsItems((data) => {
            if (isMounted) {
              setData((data ?? []) as any)
            }
          }, (err) => {
            console.error('[v0] News subscription error:', err)
          })
        } else if (key === 'contacts') {
          unsubscribe = service.subscribeToContactMessages((data) => {
            if (isMounted) {
              // Map to ContactMessage format
              const mapped = data.map(c => ({
                id: c.id,
                name: c.name,
                email: c.email,
                phone: c.phone,
                subject: c.subject,
                message: c.message,
                status: c.status,
                createdAt: c.created_at,
              }))
              setData((mapped ?? []) as any)
            }
          }, (err) => {
            console.error('[v0] Contacts subscription error:', err)
          })
        }
      } catch (err) {
        console.warn('[v0] Failed to setup realtime subscription for', key, ':', err)
      }
    }

    setupSubscription()

    // Listen for changes from other tabs (backward compatible)
    const handleUpdate = (event: CustomEvent) => {
      if ((event.detail?.key === key || event.detail?.key === `titanforce_${key}`) && isMounted) {
        loadData()
      }
    }

    window.addEventListener("dataStoreUpdate", handleUpdate as EventListener)
    
    // Also listen for storage events from other tabs
    const handleStorage = (event: StorageEvent) => {
      if (event.key?.includes("titanforce_") && isMounted) {
        loadData()
      }
    }
    window.addEventListener("storage", handleStorage)

    return () => {
      isMounted = false
      window.removeEventListener("dataStoreUpdate", handleUpdate as EventListener)
      window.removeEventListener("storage", handleStorage)
      if (unsubscribe) {
        try {
          unsubscribe()
        } catch (err) {
          console.warn('[v0] Error unsubscribing from', key, ':', err)
        }
      }
    }
  }, [getter, key])

  return data ?? ([] as unknown as T)
}
