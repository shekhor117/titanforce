'use client'

import { createClient } from '@/lib/supabase/client'

export interface Honour {
  id: string
  name: string
  year: number
  category: 'league' | 'cup' | 'championship' | 'tournament'
  description: string
  icon: string
  runners_up?: string
  image_url?: string
  featured?: boolean
  createdAt?: Date
}

// Default honours for display when database is empty
const DEFAULT_HONOURS: Honour[] = [
  {
    id: '1',
    name: 'Premier League Champion',
    year: 2024,
    category: 'league',
    description: 'Won the prestigious Premier League title with dominant performances',
    icon: '🏆',
    runners_up: 'Manchester United',
    featured: true,
  },
  {
    id: '2',
    name: 'FA Cup Winner',
    year: 2023,
    category: 'cup',
    description: 'Triumphant FA Cup victory in an exciting final',
    icon: '🥇',
    runners_up: 'Liverpool',
    featured: true,
  },
  {
    id: '3',
    name: 'League Cup Champion',
    year: 2023,
    category: 'cup',
    description: 'Claimed the League Cup with an impressive display',
    icon: '🏅',
    runners_up: 'Arsenal',
  },
  {
    id: '4',
    name: 'UEFA Champions League',
    year: 2022,
    category: 'championship',
    description: 'European glory - Won the Champions League',
    icon: '⭐',
    runners_up: 'Real Madrid',
    featured: true,
  },
  {
    id: '5',
    name: 'Community Shield',
    year: 2022,
    category: 'tournament',
    description: 'Defeated Arsenal to claim the Community Shield',
    icon: '🎖️',
    runners_up: 'Arsenal',
  },
]

class HonourDataService {
  async getHonours(): Promise<Honour[]> {
    try {
      const supabase = createClient()
      if (!supabase) return DEFAULT_HONOURS

      const { data, error } = await supabase
        .from('honours')
        .select('*')
        .order('year', { ascending: false })

      if (error) throw error

      if (!data || data.length === 0) return DEFAULT_HONOURS

      return data.map(t => ({
        id: t.id,
        name: t.name,
        year: t.year,
        category: t.category,
        description: t.description,
        icon: t.icon || '🏆',
        runners_up: t.runners_up,
        image_url: t.image_url,
        featured: t.featured,
        createdAt: t.created_at ? new Date(t.created_at) : undefined
      }))
    } catch (error) {
      console.error('[v0] Error fetching honours:', error)
      return DEFAULT_HONOURS
    }
  }

  async getHonourById(id: string): Promise<Honour | undefined> {
    try {
      const supabase = createClient()
      if (!supabase) return undefined

      const { data, error } = await supabase
        .from('honours')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (!data) return undefined

      return {
        id: data.id,
        name: data.name,
        year: data.year,
        category: data.category,
        description: data.description,
        icon: data.icon || '🏆',
        runners_up: data.runners_up,
        image_url: data.image_url,
        featured: data.featured,
        createdAt: data.created_at ? new Date(data.created_at) : undefined
      }
    } catch (error) {
      console.error('[v0] Error fetching honour:', error)
      return undefined
    }
  }

  async getFeaturedHonours(): Promise<Honour[]> {
    try {
      const supabase = createClient()
      if (!supabase) return DEFAULT_HONOURS.filter(t => t.featured)

      const { data, error } = await supabase
        .from('honours')
        .select('*')
        .eq('featured', true)
        .order('year', { ascending: false })

      if (error) throw error

      if (!data || data.length === 0) {
        return DEFAULT_HONOURS.filter(t => t.featured)
      }

      return data.map(t => ({
        id: t.id,
        name: t.name,
        year: t.year,
        category: t.category,
        description: t.description,
        icon: t.icon || '🏆',
        runners_up: t.runners_up,
        image_url: t.image_url,
        featured: t.featured,
        createdAt: t.created_at ? new Date(t.created_at) : undefined
      }))
    } catch (error) {
      console.error('[v0] Error fetching featured honours:', error)
      return DEFAULT_HONOURS.filter(t => t.featured)
    }
  }

  async getHonoursByYear(year: number): Promise<Honour[]> {
    try {
      const supabase = createClient()
      if (!supabase) return []

      const { data, error } = await supabase
        .from('honours')
        .select('*')
        .eq('year', year)
        .order('year', { ascending: false })

      if (error) throw error

      return (data || []).map(t => ({
        id: t.id,
        name: t.name,
        year: t.year,
        category: t.category,
        description: t.description,
        icon: t.icon || '🏆',
        runners_up: t.runners_up,
        image_url: t.image_url,
        featured: t.featured,
        createdAt: t.created_at ? new Date(t.created_at) : undefined
      }))
    } catch (error) {
      console.error('[v0] Error fetching honours by year:', error)
      return []
    }
  }

  async addHonour(honour: Omit<Honour, 'id' | 'createdAt'>): Promise<Honour | null> {
    try {
      const supabase = createClient()
      if (!supabase) return null

      const { data, error } = await supabase
        .from('honours')
        .insert([
          {
            name: honour.name,
            year: honour.year,
            category: honour.category,
            description: honour.description,
            icon: honour.icon,
            runners_up: honour.runners_up,
            image_url: honour.image_url,
            featured: honour.featured || false
          }
        ])
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        name: data.name,
        year: data.year,
        category: data.category,
        description: data.description,
        icon: data.icon || '🏆',
        runners_up: data.runners_up,
        image_url: data.image_url,
        featured: data.featured,
        createdAt: data.created_at ? new Date(data.created_at) : undefined
      }
    } catch (error) {
      console.error('[v0] Error adding honour:', error)
      return null
    }
  }

  async updateHonour(id: string, updates: Partial<Honour>): Promise<Honour | null> {
    try {
      const supabase = createClient()
      if (!supabase) return null

      const updateData: Record<string, unknown> = {}
      if (updates.name) updateData.name = updates.name
      if (updates.year) updateData.year = updates.year
      if (updates.category) updateData.category = updates.category
      if (updates.description) updateData.description = updates.description
      if (updates.icon) updateData.icon = updates.icon
      if (updates.runners_up !== undefined) updateData.runners_up = updates.runners_up
      if (updates.image_url) updateData.image_url = updates.image_url
      if (updates.featured !== undefined) updateData.featured = updates.featured

      const { data, error } = await supabase
        .from('honours')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        name: data.name,
        year: data.year,
        category: data.category,
        description: data.description,
        icon: data.icon || '🏆',
        runners_up: data.runners_up,
        image_url: data.image_url,
        featured: data.featured,
        createdAt: data.created_at ? new Date(data.created_at) : undefined
      }
    } catch (error) {
      console.error('[v0] Error updating honour:', error)
      return null
    }
  }

  async deleteHonour(id: string): Promise<boolean> {
    try {
      const supabase = createClient()
      if (!supabase) return false

      const { error } = await supabase
        .from('honours')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('[v0] Error deleting honour:', error)
      return false
    }
  }

  async toggleFeatured(id: string): Promise<Honour | null> {
    try {
      const honour = await this.getHonourById(id)
      if (!honour) return null

      return await this.updateHonour(id, { featured: !honour.featured })
    } catch (error) {
      console.error('[v0] Error toggling featured:', error)
      return null
    }
  }

  async getHonourStats() {
    try {
      const honours = await this.getHonours()
      return {
        total: honours.length,
        featured: honours.filter(t => t.featured).length,
        byCategory: {
          league: honours.filter(t => t.category === 'league').length,
          cup: honours.filter(t => t.category === 'cup').length,
          championship: honours.filter(t => t.category === 'championship').length,
          tournament: honours.filter(t => t.category === 'tournament').length,
        },
      }
    } catch (error) {
      console.error('[v0] Error getting honour stats:', error)
      return {
        total: 0,
        featured: 0,
        byCategory: { league: 0, cup: 0, championship: 0, tournament: 0 },
      }
    }
  }
}

export default new HonourDataService()
