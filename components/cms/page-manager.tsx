'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { RichTextEditor } from './rich-text-editor'
import { ImageUploader } from './image-uploader'
import { uploadMedia, deleteMedia, generateSlug } from '@/lib/services/media-service'
import * as pageService from '@/lib/services/page-service'
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react'

export function PageManager() {
  const [pages, setPages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentPage, setCurrentPage] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    meta_description: '',
    meta_keywords: [] as string[],
    featured_image_url: '',
    featured_image_alt: '',
    status: 'draft' as const,
  })

  useEffect(() => {
    loadPages()
  }, [])

  const loadPages = async () => {
    setIsLoading(true)
    try {
      const result = await pageService.getPages(1, 10)
      setPages(result.pages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pages')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (file: File): Promise<string> => {
    const result = await uploadMedia(file, 'pages')
    return result.url
  }

  const handleSave = async () => {
    try {
      if (!formData.title || !formData.slug || !formData.content) {
        setError('Title, slug, and content are required')
        return
      }

      if (currentPage) {
        const updated = await pageService.updatePage(currentPage.id, formData)
        setPages(pages.map((p) => (p.id === currentPage.id ? updated : p)))
        setSuccess('Page updated')
      } else {
        const newPage = await pageService.createPage(formData)
        setPages([...pages, newPage])
        setSuccess('Page created')
      }

      resetForm()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save page')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this page?')) return
    try {
      await pageService.deletePage(id)
      setPages(pages.filter((p) => p.id !== id))
      setSuccess('Page deleted')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete page')
    }
  }

  const handleEdit = (page: any) => {
    setCurrentPage(page)
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      meta_description: page.meta_description || '',
      meta_keywords: page.meta_keywords || [],
      featured_image_url: page.featured_image_url || '',
      featured_image_alt: page.featured_image_alt || '',
      status: page.status,
    })
    setIsEditing(true)
  }

  const resetForm = () => {
    setIsEditing(false)
    setCurrentPage(null)
    setFormData({
      title: '',
      slug: '',
      content: '',
      meta_description: '',
      meta_keywords: [],
      featured_image_url: '',
      featured_image_alt: '',
      status: 'draft',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pages</h2>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Page
          </Button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {success}
        </div>
      )}

      {isEditing ? (
        <div className="bg-white border rounded-lg p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {currentPage ? 'Edit Page' : 'Create Page'}
            </h3>
            <button onClick={resetForm}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Page title"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })
              }}
              className="px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Featured Image</label>
            <ImageUploader
              onImageUpload={handleImageUpload}
              value={formData.featured_image_url}
              onChange={(url) => setFormData({ ...formData, featured_image_url: url })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              onImageUpload={handleImageUpload}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Meta Description</label>
            <textarea
              value={formData.meta_description}
              onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              maxLength={160}
              rows={2}
            />
          </div>

          <div className="flex justify-between items-center border-t pt-4">
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>

            <div className="flex gap-2">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" />
                Save Page
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : pages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No pages found</div>
          ) : (
            pages.map((page) => (
              <div
                key={page.id}
                className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-sm"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{page.title}</h4>
                  <p className="text-sm text-gray-500">{page.slug}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(page)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(page.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
