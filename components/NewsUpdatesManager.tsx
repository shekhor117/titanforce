'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { NewsUpdate } from '@/lib/data-service'
import { Trash2, Edit2, Plus, Calendar } from 'lucide-react'

interface NewsUpdatesManagerProps {
  updates: NewsUpdate[]
  onAddUpdate: (update: Omit<NewsUpdate, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  onUpdateUpdate: (update: NewsUpdate) => Promise<void>
  onDeleteUpdate: (id: string) => Promise<void>
  isLoading?: boolean
}

const categoryOptions = ['match_update', 'transfer_news', 'injury_report', 'general_news', 'announcement']
const priorityOptions = ['low', 'medium', 'high', 'urgent']
const statusOptions = ['draft', 'scheduled', 'published', 'archived']

export default function NewsUpdatesManager({
  updates,
  onAddUpdate,
  onUpdateUpdate,
  onDeleteUpdate,
  isLoading = false,
}: NewsUpdatesManagerProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<NewsUpdate>>({
    title: '',
    content: '',
    summary: '',
    category: 'general_news',
    priority: 'medium',
    status: 'draft',
    featured: false,
    image_url: '',
    image_alt: '',
  })

  const handleAdd = async () => {
    if (!formData.title?.trim() || !formData.content?.trim()) {
      alert('Please fill in title and content')
      return
    }

    try {
      await onAddUpdate({
        title: formData.title,
        content: formData.content,
        summary: formData.summary || '',
        category: (formData.category as NewsUpdate['category']) || 'general_news',
        priority: (formData.priority as NewsUpdate['priority']) || 'medium',
        status: (formData.status as NewsUpdate['status']) || 'draft',
        featured: formData.featured || false,
        image_url: formData.image_url || '',
        image_alt: formData.image_alt || '',
        views_count: 0,
      })

      setFormData({
        title: '',
        content: '',
        summary: '',
        category: 'general_news',
        priority: 'medium',
        status: 'draft',
        featured: false,
        image_url: '',
        image_alt: '',
      })
      setIsAdding(false)
    } catch (error) {
      console.error('[v0] Error adding update:', error)
      alert('Failed to add news update')
    }
  }

  const handleUpdate = async () => {
    if (!editingId) return

    try {
      const update = updates.find((u) => u.id === editingId)
      if (!update) return

      await onUpdateUpdate({
        ...update,
        ...formData,
      })

      setEditingId(null)
      setFormData({
        title: '',
        content: '',
        summary: '',
        category: 'general_news',
        priority: 'medium',
        status: 'draft',
        featured: false,
        image_url: '',
        image_alt: '',
      })
    } catch (error) {
      console.error('[v0] Error updating update:', error)
      alert('Failed to update news update')
    }
  }

  const startEditing = (update: NewsUpdate) => {
    setEditingId(update.id)
    setFormData(update)
    setIsAdding(false)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setIsAdding(false)
    setFormData({
      title: '',
      content: '',
      summary: '',
      category: 'general_news',
      priority: 'medium',
      status: 'draft',
      featured: false,
      image_url: '',
      image_alt: '',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">News & Updates</h2>
        <Button
          onClick={() => {
            setIsAdding(!isAdding)
            if (isAdding) cancelEdit()
          }}
          disabled={isLoading}
        >
          <Plus className="w-4 h-4 mr-2" />
          {isAdding ? 'Cancel' : 'Add Update'}
        </Button>
      </div>

      {/* Form */}
      {(isAdding || editingId) && (
        <div className="border rounded-lg p-6 bg-gray-50 space-y-4">
          <h3 className="font-semibold text-lg">
            {editingId ? 'Edit Update' : 'Add New Update'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Title"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <select
              className="border rounded px-3 py-2"
              value={formData.category || 'general_news'}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as NewsUpdate['category'] })}
            >
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace(/_/g, ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              className="border rounded px-3 py-2"
              value={formData.priority || 'medium'}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as NewsUpdate['priority'] })}
            >
              {priorityOptions.map((p) => (
                <option key={p} value={p}>
                  {p.toUpperCase()}
                </option>
              ))}
            </select>

            <select
              className="border rounded px-3 py-2"
              value={formData.status || 'draft'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as NewsUpdate['status'] })}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s.toUpperCase()}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured || false}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4"
              />
              <span>Featured</span>
            </label>
          </div>

          <Textarea
            placeholder="Summary (brief overview)"
            value={formData.summary || ''}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            rows={2}
          />

          <Textarea
            placeholder="Content (main body)"
            value={formData.content || ''}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={5}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Image URL"
              value={formData.image_url || ''}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            />
            <Input
              placeholder="Image Alt Text"
              value={formData.image_alt || ''}
              onChange={(e) => setFormData({ ...formData, image_alt: e.target.value })}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={cancelEdit}>
              Cancel
            </Button>
            <Button onClick={editingId ? handleUpdate : handleAdd} disabled={isLoading}>
              {editingId ? 'Update' : 'Add'} Update
            </Button>
          </div>
        </div>
      )}

      {/* Updates List */}
      <div className="space-y-4">
        {updates.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No news updates yet. Create one to get started!
          </div>
        ) : (
          updates.map((update) => (
            <div key={update.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{update.title}</h3>
                    {update.featured && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">
                        Featured
                      </span>
                    )}
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        update.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : update.status === 'scheduled'
                            ? 'bg-blue-100 text-blue-800'
                            : update.status === 'archived'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {update.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{update.summary || update.content.substring(0, 100)}...</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{update.category.replace(/_/g, ' ').toUpperCase()}</span>
                    <span>Priority: {update.priority.toUpperCase()}</span>
                    <span>Views: {update.views_count}</span>
                    {update.published_at && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(update.published_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEditing(update)}
                    disabled={isLoading}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this update?')) {
                        onDeleteUpdate(update.id)
                      }
                    }}
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
