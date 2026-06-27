'use client'

import { useState, useEffect } from 'react'
import NewsManager from '@/components/NewsManager'
import { getDataService } from '@/lib/data-service'
import type { NewsItem } from '@/lib/data-service'
import { PageEntrance } from '@/components/page-entrance'

interface NewsArticle {
  id: string
  title: string
  category: 'Match Report' | 'Transfer News' | 'Feature' | 'Interview' | 'Club News'
  summary: string
  content: string
  author: string
  date: string
  status: 'Draft' | 'Published'
  views: number
  clicks: number
  image?: string
}

export default function AdminNewsPage() {
  const service = getDataService()
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
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
      const newsItems = await retryOperation(() => service.getNewsItems())
      
      // Convert NewsItem to NewsArticle format
      const convertedArticles: NewsArticle[] = (newsItems || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        category: (item.category as any) || 'Club News',
        summary: item.excerpt || item.content?.substring(0, 200) || '',
        content: item.content || '',
        author: item.author || 'Admin',
        date: new Date(item.created_at).toLocaleDateString(),
        status: (item.status === 'published' ? 'Published' : 'Draft') as 'Draft' | 'Published',
        views: item.views || 0,
        clicks: item.clicks || 0,
        image: item.image || '',
      }))
      
      setArticles(convertedArticles)
      setError(null)
    } catch (err) {
      console.error('[v0] Error loading news:', err)
      setError('Failed to load news articles')
    } finally {
      setLoading(false)
    }
  }

  const handleAddArticle = async (article: NewsArticle) => {
    try {
      await service.createNewsItem({
        title: article.title,
        content: article.content,
        author: article.author,
        category: article.category.toLowerCase() as any,
        status: article.status.toLowerCase() as any,
        image: article.image || null,
      })
      
      await loadNews()
    } catch (err) {
      console.error('[v0] Error adding news:', err)
      setError('Failed to add news article')
    }
  }

  const handleUpdateArticle = async (article: NewsArticle) => {
    try {
      await service.updateNewsItem(article.id, {
        title: article.title,
        excerpt: article.summary,
        content: article.content,
        author: article.author,
        category: article.category.toLowerCase() as any,
        status: article.status.toLowerCase() as any,
        image: article.image || null,
        views: article.views,
        clicks: article.clicks,
      })
      
      await loadNews()
    } catch (err) {
      console.error('[v0] Error updating news:', err)
      setError('Failed to update news article')
    }
  }

  const handleDeleteArticle = async (articleId: string) => {
    try {
      await service.deleteNewsItem(articleId)
      await loadNews()
    } catch (err) {
      console.error('[v0] Error deleting news:', err)
      setError('Failed to delete news article')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading news...</div>
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
        
        <NewsManager
          articles={articles}
          onAddArticle={handleAddArticle}
          onUpdateArticle={handleUpdateArticle}
          onDeleteArticle={handleDeleteArticle}
        />
      </div>
    </PageEntrance>
  )
}
