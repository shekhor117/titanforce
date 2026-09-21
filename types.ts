export type GalleryCategory = 'match' | 'training' | 'team' | 'fans' | 'events' | string

export interface GalleryItem {
  id?: string
  title?: string
  description?: string
  image_url?: string
  category?: GalleryCategory
  created_at?: string
  [key: string]: any
}

export interface NewsArticle {
  id?: string
  title?: string
  description?: string
  content?: string
  image_url?: string
  category?: string
  published_at?: string
  [key: string]: any
}

export type NewsCategory = string
export interface NewsUpdate extends NewsArticle {
  summary?: string
  author?: string
  date?: string
  status?: string
  views?: number
  clicks?: number
}
export type FixtureStatus = string
export type FixtureEventType = string

export interface FixtureEvent {
  id?: string
  minute?: number
  type?: FixtureEventType
  player?: string
  [key: string]: any
}

export interface Fixture {
  id?: string
  home_team?: string
  away_team?: string
  match_date?: string
  status?: FixtureStatus
  events?: FixtureEvent[]
  [key: string]: any
}

export interface Player {
  id?: string
  name?: string
  number?: number
  position?: string
  [key: string]: any
}
