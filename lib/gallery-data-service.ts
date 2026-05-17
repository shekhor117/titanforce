'use client'

import { createClient } from '@/lib/supabase/client'

export type GalleryType = 'match' | 'team-events' | 'training' | 'merchandise' | 'news'

export interface GalleryItem {
  id: string
  title: string
  description: string
  imageUrl: string
  type: GalleryType
  isFeatured: boolean
  createdAt: Date
  uploadedBy?: string
}

class GalleryDataService {
  async getGalleryItems(type?: GalleryType): Promise<GalleryItem[]> {
    try {
      const supabase = createClient()
      if (!supabase) return []

      let query = supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false })

      if (type) {
        query = query.eq('type', type)
      }

      const { data, error } = await query
      if (error) throw error

      return (data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        imageUrl: item.image_url,
        type: item.type,
        isFeatured: item.is_featured,
        createdAt: new Date(item.created_at),
        uploadedBy: item.uploaded_by
      }))
    } catch (error) {
      console.error('Error fetching gallery items:', error)
      return []
    }
  }

  async getFeaturedItems(limit: number = 6): Promise<GalleryItem[]> {
    try {
      const supabase = createClient()
      if (!supabase) return []

      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return (data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        imageUrl: item.image_url,
        type: item.type,
        isFeatured: item.is_featured,
        createdAt: new Date(item.created_at),
        uploadedBy: item.uploaded_by
      }))
    } catch (error) {
      console.error('Error fetching featured items:', error)
      return []
    }
  }

  async getItemById(id: string): Promise<GalleryItem | undefined> {
    try {
      const supabase = createClient()
      if (!supabase) return undefined

      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (!data) return undefined

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        imageUrl: data.image_url,
        type: data.type,
        isFeatured: data.is_featured,
        createdAt: new Date(data.created_at),
        uploadedBy: data.uploaded_by
      }
    } catch (error) {
      console.error('Error fetching gallery item:', error)
      return undefined
    }
  }

  async addItem(item: Omit<GalleryItem, 'id' | 'createdAt'>, userId?: string): Promise<GalleryItem | null> {
    try {
      const supabase = createClient()
      if (!supabase) return null

      const { data, error } = await supabase
        .from('gallery')
        .insert([
          {
            title: item.title,
            description: item.description,
            image_url: item.imageUrl,
            type: item.type,
            is_featured: item.isFeatured,
            uploaded_by: userId
          }
        ])
        .select()
        .single()

      if (error) throw error
      if (!data) return null

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        imageUrl: data.image_url,
        type: data.type,
        isFeatured: data.is_featured,
        createdAt: new Date(data.created_at),
        uploadedBy: data.uploaded_by
      }
    } catch (error) {
      console.error('Error adding gallery item:', error)
      return null
    }
  }

  async updateItem(id: string, updates: Partial<GalleryItem>): Promise<GalleryItem | null> {
    try {
      const supabase = createClient()
      if (!supabase) return null

      const updateData: Record<string, unknown> = {}
      if (updates.title) updateData.title = updates.title
      if (updates.description) updateData.description = updates.description
      if (updates.imageUrl) updateData.image_url = updates.imageUrl
      if (updates.type) updateData.type = updates.type
      if (updates.isFeatured !== undefined) updateData.is_featured = updates.isFeatured

      const { data, error } = await supabase
        .from('gallery')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      if (!data) return null

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        imageUrl: data.image_url,
        type: data.type,
        isFeatured: data.is_featured,
        createdAt: new Date(data.created_at),
        uploadedBy: data.uploaded_by
      }
    } catch (error) {
      console.error('Error updating gallery item:', error)
      return null
    }
  }

  async deleteItem(id: string): Promise<boolean> {
    try {
      const supabase = createClient()
      if (!supabase) return false

      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting gallery item:', error)
      return false
    }
  }

  async toggleFeatured(id: string): Promise<boolean> {
    try {
      const item = await this.getItemById(id)
      if (!item) return false

      const result = await this.updateItem(id, { isFeatured: !item.isFeatured })
      return result !== null
    } catch (error) {
      console.error('Error toggling featured status:', error)
      return false
    }
  }

  async searchItems(query: string): Promise<GalleryItem[]> {
    try {
      const supabase = createClient()
      if (!supabase) return []

      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (error) throw error

      return (data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        imageUrl: item.image_url,
        type: item.type,
        isFeatured: item.is_featured,
        createdAt: new Date(item.created_at),
        uploadedBy: item.uploaded_by
      }))
    } catch (error) {
      console.error('Error searching gallery items:', error)
      return []
    }
  }

  async getGalleryStats() {
    try {
      const supabase = createClient()
      if (!supabase) return { total: 0, featured: 0, byType: {} }

      const { data, error } = await supabase
        .from('gallery')
        .select('type, is_featured')

      if (error) throw error

      const items = data || []
      return {
        total: items.length,
        featured: items.filter(item => item.is_featured).length,
        byType: {
          match: items.filter(item => item.type === 'match').length,
          'team-events': items.filter(item => item.type === 'team-events').length,
          training: items.filter(item => item.type === 'training').length,
          merchandise: items.filter(item => item.type === 'merchandise').length,
          news: items.filter(item => item.type === 'news').length
        }
      }
    } catch (error) {
      console.error('Error getting gallery stats:', error)
      return { total: 0, featured: 0, byType: {} }
    }
  }

  async getRecentItems(limit: number = 5): Promise<GalleryItem[]> {
    try {
      const supabase = createClient()
      if (!supabase) return []

      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return (data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        imageUrl: item.image_url,
        type: item.type,
        isFeatured: item.is_featured,
        createdAt: new Date(item.created_at),
        uploadedBy: item.uploaded_by
      }))
    } catch (error) {
      console.error('Error fetching recent items:', error)
      return []
    }
  }

  async uploadGalleryImage(file: File, fileName: string): Promise<string | null> {
    try {
      const supabase = createClient()
      if (!supabase) return null

      const { data, error } = await supabase.storage
        .from('gallery')
        .upload(`images/${fileName}`, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      const { data: urlData } = supabase.storage
        .from('gallery')
        .getPublicUrl(data.path)

      return urlData.publicUrl
    } catch (error) {
      console.error('Error uploading gallery image:', error)
      return null
    }
  }

  async deleteGalleryImage(filePath: string): Promise<boolean> {
    try {
      const supabase = createClient()
      if (!supabase) return false

      const { error } = await supabase.storage
        .from('gallery')
        .remove([filePath])

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting gallery image:', error)
      return false
    }
  }
}

export default new GalleryDataService()
