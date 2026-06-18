'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { RichTextEditorDynamic } from './rich-text-editor-dynamic'
import { ImageUploader } from './image-uploader'
import { uploadMedia, deleteMedia, generateSlug } from '@/lib/services/media-service'
import * as articleService from '@/lib/services/article-service'
import { Plus, Trash2, Edit2, Save, X, Eye, Lock } from 'lucide-react'

type ArticleFormMode = 'create' | 'edit' | 'view'

interface ArticleManagerProps {
  onArticleChange?: (article: any) => void
}

export function ArticleManager({ onArticleChange }: ArticleManagerProps) {
  const [isClient, setIsClient] = useState(false)
  const [articles, setArticles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [formMode, setFormMode] = useState<ArticleFormMode>('create')
  const [currentArticle, setCurrentArticle] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('published')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Ensure client-side initialization
  useEffect(() => {
    setIsClient(true)
  }, [])

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image_url: '',
    featured_image_alt: '',
    status: 'draft' as const,
    category: '',
    tags: [] as string[],
    seo_title: '',
    seo_description: '',
    seo_keywords: [] as string[],
  })

  // Load articles (only after client is ready)
  useEffect(() => {
    if (!isClient) return
    
    const timer = setTimeout(() => {
      loadArticles()
    }, 0)
    return () => clearTimeout(timer)
  }, [statusFilter, searchTerm, isClient])

  const loadArticles = async () => {
    setIsLoading(true)
    try {
      const result = await articleService.getArticles(1, 10, {
        status: statusFilter as any,
        search: searchTerm,
      })
      setArticles(result.articles)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load articles')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const result = await uploadMedia(file, 'articles')
      return result.url
    } catch (err) {
      throw err
    }
  }

  const handleSlugChange = (title: string) => {
    setFormData({ ...formData, slug: generateSlug(title) })
  }

  const handleSave = async () => {
    try {
      setError(null)
      if (!formData.title || !formData.slug || !formData.content) {
        setError('Title, slug, and content are required')
        return
      }

      if (formMode === 'create') {
        const newArticle = await articleService.createArticle(formData)
        setArticles([newArticle, ...articles])
        setSuccess('Article created successfully')
      } else if (formMode === 'edit' && currentArticle) {
        const updated = await articleService.updateArticle(currentArticle.id, formData)
        setArticles(articles.map((a) => (a.id === currentArticle.id ? updated : a)))
        setSuccess('Article updated successfully')
      }

      // Reset form
      setFormMode('create')
      setCurrentArticle(null)
      setFormData({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        featured_image_url: '',
        featured_image_alt: '',
        status: 'draft',
        category: '',
        tags: [],
        seo_title: '',
        seo_description: '',
        seo_keywords: [],
      })

      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save article')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return

    try {
      await articleService.deleteArticle(id)
      setArticles(articles.filter((a) => a.id !== id))
      setSuccess('Article deleted successfully')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete article')
    }
  }

  const handleEdit = (article: any) => {
    setCurrentArticle(article)
    setFormData({
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt || '',
      featured_image_url: article.featured_image_url || '',
      featured_image_alt: article.featured_image_alt || '',
      status: article.status,
      category: article.category || '',
      tags: article.tags || [],
      seo_title: article.seo_title || '',
      seo_description: article.seo_description || '',
      seo_keywords: article.seo_keywords || [],
    })
    setFormMode('edit')
  }

  const handlePublish = async (id: string) => {
    try {
      const updated = await articleService.publishArticle(id)
      setArticles(articles.map((a) => (a.id === id ? updated : a)))
      setSuccess('Article published')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish article')
    }
  }

  const handleRemoveImage = async () => {
    if (formData.featured_image_url) {
      try {
        await deleteMedia(formData.featured_image_url)
        setFormData({ ...formData, featured_image_url: '' })
      } catch (err) {
        setError('Failed to remove image')
      }
    }
  }

  if (!isClient) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Article Manager</h2>
        {formMode !== 'create' && (
          <Button
            onClick={() => {
              setFormMode('create')
              setCurrentArticle(null)
              setFormData({
                title: '',
                slug: '',
                content: '',
                excerpt: '',
                featured_image_url: '',
                featured_image_alt: '',
                status: 'draft',
                category: '',
                tags: [],
                seo_title: '',
                seo_description: '',
                seo_keywords: [],
              })
            }}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            New Article
          </Button>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {success}
        </div>
      )}

      {/* Form or List */}
      {formMode !== 'create' || currentArticle ? (
        // Edit Form
        <div className="bg-white border rounded-lg p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {formMode === 'create' ? 'Create Article' : 'Edit Article'}
            </h3>
            <button
              onClick={() => {
                setFormMode('create')
                setCurrentArticle(null)
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Title & Slug */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value })
                  handleSlugChange(e.target.value)
                }}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Article title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug *</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="article-slug"
              />
            </div>
          </div>

          {/* Excerpt & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Excerpt</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Brief description"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., News, Updates"
              />
            </div>
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium mb-3">Featured Image</label>
            <ImageUploader
              onImageUpload={handleImageUpload}
              value={formData.featured_image_url}
              onChange={(url) => setFormData({ ...formData, featured_image_url: url })}
              onRemove={handleRemoveImage}
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-2">Content *</label>
              <RichTextEditorDynamic
                content={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                onImageUpload={handleImageUpload}
                placeholder="Write your article content here..."
              />
          </div>

          {/* SEO Fields */}
          <div className="border-t pt-4 space-y-4">
            <h4 className="font-medium">SEO Settings</h4>
            <div>
              <label className="block text-sm font-medium mb-1">SEO Title</label>
              <input
                type="text"
                value={formData.seo_title}
                onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="SEO title"
                maxLength={60}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">SEO Description</label>
              <textarea
                value={formData.seo_description}
                onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="SEO description"
                maxLength={160}
                rows={2}
              />
            </div>
          </div>

          {/* Status & Actions */}
          <div className="flex justify-between items-center border-t pt-4">
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setFormMode('create')}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" />
                Save Article
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // List View
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Articles List */}
          {isLoading ? (
            <div className="text-center py-8">Loading articles...</div>
          ) : articles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No articles found</div>
          ) : (
            <div className="space-y-2">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-sm transition"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{article.title}</h4>
                    <p className="text-sm text-gray-500">
                      {article.slug} · {article.status} · {new Date(article.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {article.status === 'draft' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePublish(article.id)}
                        title="Publish"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(article)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(article.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
