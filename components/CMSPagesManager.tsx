'use client'

import React, { useState, useEffect } from 'react'
import { getCMSService, type CMSPage } from '@/lib/cms-service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Trash2, Edit, Plus, Eye, EyeOff, Check } from 'lucide-react'

export default function CMSPagesManager() {
  const service = getCMSService()
  const [pages, setPages] = useState<CMSPage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<CMSPage>>({})
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadPages()
  }, [])

  const loadPages = async () => {
    try {
      setLoading(true)
      const data = await service.getPages(true)
      setPages(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pages')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      if (!formData.slug || !formData.title || !formData.title_bn) {
        setError('Please fill in all required fields')
        return
      }

      const newPage = await service.createPage({
        slug: formData.slug,
        title: formData.title,
        title_bn: formData.title_bn,
        content: formData.content || '',
        content_bn: formData.content_bn || '',
        excerpt: formData.excerpt || '',
        excerpt_bn: formData.excerpt_bn || '',
        status: 'draft',
      })

      setPages([newPage, ...pages])
      setFormData({})
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create page')
    }
  }

  const handleUpdate = async (id: string) => {
    try {
      const updated = await service.updatePage(id, formData)
      setPages(pages.map((p) => (p.id === id ? updated : p)))
      setEditingId(null)
      setFormData({})
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update page')
    }
  }

  const handlePublish = async (id: string) => {
    try {
      const published = await service.publishPage(id)
      setPages(pages.map((p) => (p.id === id ? published : p)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish page')
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this page?')) return

    try {
      await service.deletePage(id)
      setPages(pages.filter((p) => p.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete page')
    }
  }

  const handleEdit = (page: CMSPage) => {
    setEditingId(page.id)
    setFormData(page)
  }

  const filteredPages = pages.filter((page) =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">CMS Pages</h2>
        <Button onClick={() => setEditingId('new')} className="gap-2">
          <Plus size={16} />
          New Page
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Form */}
      {(editingId === 'new' || editingId) && (
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold">
            {editingId === 'new' ? 'Create New Page' : 'Edit Page'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Slug *</label>
              <Input
                placeholder="page-slug"
                value={formData.slug || ''}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                disabled={editingId !== 'new'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Title (English) *
              </label>
              <Input
                placeholder="Page Title"
                value={formData.title || ''}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Title (Bengali)
              </label>
              <Input
                placeholder="পৃষ্ঠা শিরোনাম"
                value={formData.title_bn || ''}
                onChange={(e) =>
                  setFormData({ ...formData, title_bn: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Featured Image URL
              </label>
              <Input
                placeholder="https://example.com/image.jpg"
                value={formData.featured_image || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    featured_image: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Excerpt (English)
              </label>
              <textarea
                placeholder="Brief excerpt..."
                value={formData.excerpt || ''}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                className="w-full p-2 border border-slate-300 rounded text-sm"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Excerpt (Bengali)
              </label>
              <textarea
                placeholder="সংক্ষিপ্ত বিবরণ..."
                value={formData.excerpt_bn || ''}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt_bn: e.target.value })
                }
                className="w-full p-2 border border-slate-300 rounded text-sm"
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() =>
                editingId === 'new'
                  ? handleCreate()
                  : handleUpdate(editingId)
              }
              className="gap-2"
            >
              <Check size={16} />
              {editingId === 'new' ? 'Create' : 'Update'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEditingId(null)
                setFormData({})
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Search */}
      <div>
        <Input
          placeholder="Search pages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Pages List */}
      <div className="space-y-2">
        {loading ? (
          <div className="text-center py-8 text-slate-600">Loading pages...</div>
        ) : filteredPages.length === 0 ? (
          <div className="text-center py-8 text-slate-600">
            No pages found. Create your first page to get started.
          </div>
        ) : (
          filteredPages.map((page) => (
            <div
              key={page.id}
              className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold">{page.title}</h3>
                  <Badge
                    variant={page.status === 'published' ? 'default' : 'secondary'}
                  >
                    {page.status}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 mt-1">/{page.slug}</p>
                {page.excerpt && (
                  <p className="text-sm text-slate-600 mt-1 line-clamp-1">
                    {page.excerpt}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                {page.status === 'draft' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePublish(page.id)}
                    className="gap-1"
                  >
                    <Eye size={14} />
                    Publish
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(page)}
                >
                  <Edit size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(page.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
