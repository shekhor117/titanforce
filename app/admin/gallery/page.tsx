'use client'

import { useState, useEffect } from 'react'
import GalleryManager from '@/components/GalleryManager'
import { getDataService } from '@/lib/data-service'
import type { MediaItem as DBMediaItem } from '@/lib/data-service'
import { PageEntrance } from '@/components/page-entrance'

interface GalleryItem {
  id: string
  title: string
  image: string
  category: string
  date: string
  views: number
  likes: number
  description?: string
}

export default function AdminGalleryPage() {
  const service = getDataService()
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadGallery()
  }, [])

  const loadGallery = async () => {
    try {
      setLoading(true)
      const mediaItems = await service.getMediaItems()
      
      // Convert MediaItem to GalleryItem format
      const convertedItems: GalleryItem[] = (mediaItems || []).map(item => ({
        id: item.id,
        title: item.title || 'Untitled',
        image: item.url || '',
        category: item.category || 'General',
        date: new Date(item.created_at).toLocaleDateString(),
        description: item.description || '',
      }))
      
      setItems(convertedItems)
      setError(null)
    } catch (err) {
      console.error('[v0] Error loading gallery:', err)
      setError('Failed to load gallery items')
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async (item: GalleryItem) => {
    try {
      await service.createMediaItem({
        title: item.title,
        url: item.image,
        category: item.category,
        description: item.description || '',
      })
      
      await loadGallery()
    } catch (err) {
      console.error('[v0] Error adding gallery item:', err)
      setError('Failed to add gallery item')
    }
  }

  const handleUpdateItem = async (item: GalleryItem) => {
    try {
      // Since update might not exist, we can just reload
      await loadGallery()
    } catch (err) {
      console.error('[v0] Error updating gallery item:', err)
      setError('Failed to update gallery item')
    }
  }

  const handleDeleteItem = async (id: string) => {
    try {
      await service.deleteMediaItem(id)
      await loadGallery()
    } catch (err) {
      console.error('[v0] Error deleting gallery item:', err)
      setError('Failed to delete gallery item')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading gallery...</div>
      </div>
    )
  }

  return (
    <PageEntrance delay={0.2} duration={0.6} variant="fadeInUp">
      <div className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <GalleryManager
        items={items}
        onAddItem={handleAddItem}
        onUpdateItem={handleUpdateItem}
        onDeleteItem={handleDeleteItem}
      />
      </div>
    </PageEntrance>
  )
}
