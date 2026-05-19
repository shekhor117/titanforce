'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/language-context'
import { Image as ImageIcon, Trash2, Plus, X, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type MediaType = 'match' | 'team-events' | 'training' | 'merchandise' | 'news'

interface MediaItem {
  id: string
  title: string
  description?: string
  url: string
  category?: MediaType
  created_at: string
}

const MEDIA_TYPES: { value: MediaType; label: string; labelBn: string }[] = [
  { value: 'match', label: 'Match', labelBn: 'ম্যাচ' },
  { value: 'team-events', label: 'Team Events', labelBn: 'টিম ইভেন্ট' },
  { value: 'training', label: 'Training', labelBn: 'প্রশিক্ষণ' },
  { value: 'merchandise', label: 'Merchandise', labelBn: 'পণ্য' },
  { value: 'news', label: 'News', labelBn: 'খবর' }
]

export default function AdminGalleryPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  
  const [items, setItems] = useState<MediaItem[]>([])
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([])
  const [selectedType, setSelectedType] = useState<MediaType | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [fileInput, setFileInput] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'match' as MediaType
  })

  useEffect(() => {
    loadMediaItems()
  }, [])

  const loadMediaItems = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error('[v0] Failed to load media items:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = items

    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.category === selectedType)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.description || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredItems(filtered)
  }, [items, selectedType, searchQuery])

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!fileInput) {
        alert(isBn ? 'ছবি নির্বাচন করুন' : 'Please select an image')
        setIsSubmitting(false)
        return
      }

      const supabase = createClient()
      const fileName = `${Date.now()}-${fileInput.name}`
      const filePath = `images/${fileName}`

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('Gallery')
        .upload(filePath, fileInput)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: publicUrl } = supabase.storage
        .from('Gallery')
        .getPublicUrl(filePath)

      // Save to database
      const { error: dbError } = await supabase
        .from('media_items')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            url: publicUrl.publicUrl,
            category: formData.category
          }
        ])

      if (dbError) throw dbError

      // Reset form
      setFormData({ title: '', description: '', category: 'match' })
      setFileInput(null)
      setShowForm(false)

      // Reload items
      await loadMediaItems()
    } catch (error) {
      console.error('[v0] Error adding media item:', error)
      alert(isBn ? 'ত্রুটি হয়েছে' : 'Error adding image')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm(isBn ? 'নিশ্চিত?' : 'Are you sure?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('media_items')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadMediaItems()
    } catch (error) {
      console.error('[v0] Error deleting item:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{isBn ? 'গ্যালারি' : 'Gallery'}</h1>
          <p className="text-muted-foreground">
            {isBn ? 'ছবি আপলোড এবং পরিচালনা করুন' : 'Upload and manage gallery images'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90"
          >
            <Plus className="w-4 h-4" />
            {isBn ? 'নতুন যোগ করুন' : 'Add New'}
          </button>

          <input
            type="text"
            placeholder={isBn ? 'খুঁজুন...' : 'Search...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg flex-1 min-w-48"
          />
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-muted p-6 rounded-lg mb-6">
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{isBn ? 'শিরোনাম' : 'Title'}</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{isBn ? 'বর্ণনা' : 'Description'}</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{isBn ? 'ধরন' : 'Type'}</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as MediaType })}
                  className="w-full px-3 py-2 border border-border rounded"
                >
                  {MEDIA_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {isBn ? type.labelBn : type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{isBn ? 'ছবি' : 'Image'}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFileInput(e.target.files?.[0] || null)}
                  className="w-full"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? (isBn ? 'যুক্ত হচ্ছে...' : 'Adding...') : (isBn ? 'যোগ করুন' : 'Add')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="border border-border px-4 py-2 rounded hover:bg-muted"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1 rounded text-sm ${selectedType === 'all' ? 'bg-primary text-primary-foreground' : 'border border-border'}`}
          >
            {isBn ? 'সব' : 'All'}
          </button>
          {MEDIA_TYPES.map(type => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`px-3 py-1 rounded text-sm ${selectedType === type.value ? 'bg-primary text-primary-foreground' : 'border border-border'}`}
            >
              {isBn ? type.labelBn : type.label}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="text-center py-12">{isBn ? 'লোড হচ্ছে...' : 'Loading...'}</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {isBn ? 'কোনো ছবি নেই' : 'No images found'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map(item => (
              <div key={item.id} className="border border-border rounded-lg overflow-hidden">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-3">
                  <h3 className="font-semibold text-sm truncate">{item.title}</h3>
                  {item.description && (
                    <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                  )}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="flex-1 bg-destructive text-destructive-foreground text-xs py-1 rounded hover:opacity-90"
                    >
                      {isBn ? 'মুছুন' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
