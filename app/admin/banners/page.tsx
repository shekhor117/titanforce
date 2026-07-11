'use client'

import { useState, useEffect } from 'react'
import { useAdmin } from '@/lib/admin-context'
import { useLanguage } from '@/lib/language-context'
import { dataStore, Banner } from '@/lib/data-store'
import { Save, Plus, Edit2, Trash2, AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function AdminBannersPage() {
  const { admin } = useAdmin()
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [isClient, setIsClient] = useState(false)
  const [banners, setBanners] = useState<Banner[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    link: '',
    buttonText: '',
    page: 'home' as 'home' | 'shop' | 'team' | 'news' | 'gallery',
    order: 1,
    isActive: true
  })

  useEffect(() => {
    setIsClient(true)
    loadData()
  }, [])

  const loadData = () => {
    try {
      const data = dataStore.getBanners()
      setBanners(data)
    } catch (err) {
      setError('Failed to load banners')
    }
  }

  const handleEdit = (item: Banner) => {
    const { id, createdAt, updatedAt, ...formFields } = item
    setFormData(formFields)
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleSave = () => {
    if (!formData.title) {
      setError('Title is required')
      return
    }

    try {
      if (editingId) {
        dataStore.updateBanner(editingId, formData)
      } else {
        dataStore.addBanner(formData)
      }
      loadData()
      handleReset()
    } catch (err) {
      setError('Failed to save')
    }
  }

  const handleDelete = (id: string) => {
    if (confirm(isBn ? 'আপনি কি নিশ্চিত?' : 'Are you sure?')) {
      try {
        dataStore.deleteBanner(id)
        loadData()
      } catch (err) {
        setError('Failed to delete')
      }
    }
  }

  const handleReset = () => {
    setFormData({ title: '', description: '', image: '', link: '', buttonText: '', page: 'home', order: 1, isActive: true })
    setEditingId(null)
    setShowForm(false)
    setError(null)
  }

  if (!isClient) return null

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{isBn ? 'ব্যানার' : 'Banners'}</h1>
          <p className="text-foreground/60">{isBn ? 'পৃষ্ঠার ব্যানার পরিচালনা করুন' : 'Manage page banners'}</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
            <Plus className="w-4 h-4" />
            {isBn ? 'নতুন ব্যানার' : 'New Banner'}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-3 text-red-200">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-card border-2 border-secondary rounded-lg p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">{isBn ? 'শিরোনাম' : 'Title'}</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{isBn ? 'পৃষ্ঠা' : 'Page'}</label>
              <select value={formData.page} onChange={(e) => setFormData({ ...formData, page: e.target.value as any })} className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent">
                <option value="home">Home</option>
                <option value="shop">Shop</option>
                <option value="team">Team</option>
                <option value="news">News</option>
                <option value="gallery">Gallery</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{isBn ? 'বর্ণনা' : 'Description'}</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent h-16 resize-none" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">{isBn ? 'লিংক' : 'Link'}</label>
              <input type="text" value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent" placeholder="/shop" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{isBn ? 'বাটন টেক্সট' : 'Button Text'}</label>
              <input type="text" value={formData.buttonText} onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })} className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent" />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4 accent-accent" />
              <span className="text-sm font-medium">{isBn ? 'সক্রিয়' : 'Active'}</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button onClick={handleSave} className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition">
              <Save className="w-4 h-4" />
              {editingId ? isBn ? 'আপডেট' : 'Update' : isBn ? 'যোগ করুন' : 'Add'}
            </button>
            <button onClick={handleReset} className="bg-secondary hover:bg-secondary/80 text-foreground px-6 py-2 rounded-lg transition">
              {isBn ? 'বাতিল করুন' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {banners.map((item) => (
          <div key={item.id} className="bg-card border-2 border-secondary rounded-lg p-4 flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-foreground">{item.title}</h3>
                {item.isActive ? <Eye className="w-4 h-4 text-green-400" /> : <EyeOff className="w-4 h-4 text-foreground/50" />}
              </div>
              <p className="text-foreground/60 text-sm mt-1">{item.page}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(item)} className="p-2 hover:bg-secondary rounded-lg transition text-blue-400">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-secondary rounded-lg transition text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
