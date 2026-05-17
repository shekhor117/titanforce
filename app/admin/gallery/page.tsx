'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import GalleryDataService, { GalleryItem, GalleryType } from '@/lib/gallery-data-service'
import { useLanguage } from '@/lib/language-context'
import { Image as ImageIcon, Trash2, Star, Plus, X, ArrowLeft } from 'lucide-react'

const GALLERY_TYPES: { value: GalleryType; label: string; labelBn: string }[] = [
  { value: 'match', label: 'Match', labelBn: 'ম্যাচ' },
  { value: 'team-events', label: 'Team Events', labelBn: 'টিম ইভেন্ট' },
  { value: 'training', label: 'Training', labelBn: 'প্রশিক্ষণ' },
  { value: 'merchandise', label: 'Merchandise', labelBn: 'পণ্য' },
  { value: 'news', label: 'News', labelBn: 'খবর' }
]

export default function AdminGalleryPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const isBn = language === 'bn'
  
  const [items, setItems] = useState<GalleryItem[]>([])
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([])
  const [selectedType, setSelectedType] = useState<GalleryType | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [fileInput, setFileInput] = useState<File | null>(null)

  useEffect(() => {
    loadGalleryItems()
  }, [])

  const loadGalleryItems = async () => {
    try {
      const allItems = await GalleryDataService.getGalleryItems()
      setItems(allItems)
    } catch (error) {
      console.error('Failed to load gallery items:', error)
    }
  }

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'match' as GalleryType,
    isFeatured: false
  })

  useEffect(() => {
    let filtered = items

    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredItems(filtered)
  }, [items, selectedType, searchQuery])

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let imageUrl = ''
      
      if (fileInput) {
        const fileName = `${Date.now()}-${fileInput.name}`
        imageUrl = await GalleryDataService.uploadGalleryImage(fileInput, fileName) || ''
      }

      if (!imageUrl) {
        alert(isBn ? 'ছবি আপলোড করতে ব্যর্থ হয়েছে' : 'Failed to upload image')
        return
      }

      const newItem = await GalleryDataService.addItem({
        title: formData.title,
        description: formData.description,
        imageUrl,
        type: formData.type,
        isFeatured: formData.isFeatured
      })
      
      if (newItem) {
        setItems([newItem, ...items])
        setFormData({
          title: '',
          description: '',
          type: 'match',
          isFeatured: false
        })
        setFileInput(null)
        setShowForm(false)
      }
    } catch (error) {
      console.error('Failed to add item:', error)
      alert(isBn ? 'আইটেম যোগ করতে ব্যর্থ হয়েছে' : 'Failed to add item')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm(isBn ? 'আপনি কি নিশ্চিত?' : 'Are you sure?')) {
      try {
        const success = await GalleryDataService.deleteItem(id)
        if (success) {
          setItems(items.filter(item => item.id !== id))
        }
      } catch (error) {
        console.error('Failed to delete item:', error)
        alert(isBn ? 'আইটেম মুছতে ব্যর্থ হয়েছে' : 'Failed to delete item')
      }
    }
  }

  const handleToggleFeatured = async (id: string) => {
    try {
      const success = await GalleryDataService.toggleFeatured(id)
      if (success) {
        setItems(items.map(item =>
          item.id === id ? { ...item, isFeatured: !item.isFeatured } : item
        ))
      }
    } catch (error) {
      console.error('Failed to toggle featured:', error)
      alert(isBn ? 'ব্যর্থ হয়েছে' : 'Failed to update')
    }
  }

  const stats = {
    total: items.length,
    featured: items.filter(item => item.isFeatured).length,
    byType: {
      match: items.filter(item => item.type === 'match').length,
      'team-events': items.filter(item => item.type === 'team-events').length,
      training: items.filter(item => item.type === 'training').length,
      merchandise: items.filter(item => item.type === 'merchandise').length,
      news: items.filter(item => item.type === 'news').length
    }
  }
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
            title={isBn ? 'ড্যাশবোর্ডে ফিরুন' : 'Back to Dashboard'}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{isBn ? 'গ্যালারি পরিচালনা' : 'Manage Gallery'}</h1>
            <p className="text-muted-foreground mt-1">
              {isBn ? `মোট ${stats.total} আইটেম` : `${stats.total} total items`}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {isBn ? 'নতুন যোগ করুন' : 'Add New'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.total}</div>
          <p className="text-sm text-muted-foreground mt-1">{isBn ? 'মোট' : 'Total'}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-accent">{stats.featured}</div>
          <p className="text-sm text-muted-foreground mt-1">{isBn ? 'বৈশিষ্ট্য' : 'Featured'}</p>
        </div>
        {GALLERY_TYPES.map(type => (
          <div key={type.value} className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.byType[type.value]}</div>
            <p className="text-xs text-muted-foreground mt-1">{isBn ? type.labelBn : type.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedType('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedType === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card border border-border text-foreground hover:bg-muted'
          }`}
        >
          {isBn ? 'সব' : 'All'}
        </button>
        {GALLERY_TYPES.map(type => (
          <button
            key={type.value}
            onClick={() => setSelectedType(type.value)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedType === type.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-foreground hover:bg-muted'
            }`}
          >
            {isBn ? type.labelBn : type.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder={isBn ? 'অনুসন্ধান করুন...' : 'Search...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{isBn ? 'নতুন আইটেম যোগ করুন' : 'Add New Item'}</h2>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleAddItem} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">{isBn ? 'শিরোনাম' : 'Title'}</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{isBn ? 'বিবরণ' : 'Description'}</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{isBn ? 'ছবি' : 'Image'}</label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => setFileInput(e.target.files?.[0] || null)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {fileInput && (
                <div className="mt-3 text-sm text-muted-foreground">
                  {isBn ? 'নির্বাচিত:' : 'Selected:'} {fileInput.name}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{isBn ? 'ধরন' : 'Type'}</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as GalleryType })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {GALLERY_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {isBn ? type.labelBn : type.label}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium">{isBn ? 'বৈশিষ্ট্য হিসেবে চিহ্নিত করুন' : 'Mark as Featured'}</span>
            </label>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (isBn ? 'যোগ করা হচ্ছে...' : 'Adding...') : (isBn ? 'যোগ করুন' : 'Add')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Gallery Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors group">
            <div className="relative h-48 overflow-hidden bg-muted">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&h=300&fit=crop'
                }}
              />
              {item.isFeatured && (
                <div className="absolute top-2 right-2 bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-bold">
                  {isBn ? 'বৈশিষ্ট্য' : 'Featured'}
                </div>
              )}
            </div>

            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                  {GALLERY_TYPES.find(t => t.value === item.type)?.[isBn ? 'labelBn' : 'label']}
                </span>
                <span className="text-xs text-muted-foreground">
                  {item.createdAt.toLocaleDateString()}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleFeatured(item.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded transition-colors text-sm"
                  title={isBn ? 'বৈশিষ্ট্য হিসেবে চিহ্নিত করুন' : 'Toggle Featured'}
                >
                  <Star className={`w-4 h-4 ${item.isFeatured ? 'fill-current text-accent' : ''}`} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded transition-colors text-sm"
                  title={isBn ? 'মুছুন' : 'Delete'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{isBn ? 'কোন আইটেম পাওয়া যায়নি' : 'No items found'}</p>
        </div>
      )}
    </div>
  )
}
