'use client'

import { useState, useEffect } from 'react'
import NewsUpdatesManager from '@/components/NewsUpdatesManager'
import { getDataService } from '@/lib/data-service'
import type { NewsUpdate } from '@/lib/data-service'
import { PageEntrance } from '@/components/page-entrance'

export default function AdminNewsUpdatesPage() {
  const service = getDataService()
  const [updates, setUpdates] = useState<NewsUpdate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadNewsUpdates()
  }, [])

  const loadNewsUpdates = async () => {
    const retryOperation = async (operation: () => Promise<any>, maxRetries = 3): Promise<any> => {
      for (let i = 0; i < maxRetries; i++) {
        try {
          return await operation()
        } catch (err) {
          if (i === maxRetries - 1) throw err
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
        }
      }
    }

    try {
      setLoading(true)
      const newsUpdates = await retryOperation(() => service.getNewsUpdates(true))
      setUpdates(newsUpdates || [])
      setError(null)
    } catch (err) {
      console.error('[v0] Error loading news updates:', err)
      setError('Failed to load news updates')
    } finally {
      setLoading(false)
    }
  }

  const handleAddUpdate = async (
    update: Omit<NewsUpdate, 'id' | 'created_at' | 'updated_at'>
  ) => {
    try {
      await service.createNewsUpdate({
        ...update,
        published_by: undefined,
      })
      await loadNewsUpdates()
    } catch (err) {
      console.error('[v0] Error adding news update:', err)
      setError('Failed to add news update')
    }
  }

  const handleUpdateUpdate = async (update: NewsUpdate) => {
    try {
      const { id, created_at, updated_at, ...rest } = update
      await service.updateNewsUpdate(id, rest)
      await loadNewsUpdates()
    } catch (err) {
      console.error('[v0] Error updating news update:', err)
      setError('Failed to update news update')
    }
  }

  const handleDeleteUpdate = async (id: string) => {
    try {
      await service.deleteNewsUpdate(id)
      await loadNewsUpdates()
    } catch (err) {
      console.error('[v0] Error deleting news update:', err)
      setError('Failed to delete news update')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading news updates...</div>
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

        <NewsUpdatesManager
          updates={updates}
          onAddUpdate={handleAddUpdate}
          onUpdateUpdate={handleUpdateUpdate}
          onDeleteUpdate={handleDeleteUpdate}
          isLoading={loading}
        />
      </div>
    </PageEntrance>
  )
}
