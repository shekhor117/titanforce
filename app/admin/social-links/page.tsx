'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { dataStore, SocialLink } from '@/lib/data-store'
import { Save, Plus, Edit2, Trash2, AlertCircle } from 'lucide-react'

export default function AdminSocialLinksPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [isClient, setIsClient] = useState(false)
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    platform: 'facebook' as const,
    url: '',
    displayName: '',
    order: 1,
    isActive: true
  })

  const platforms = ['facebook', 'twitter', 'instagram', 'youtube', 'tiktok', 'linkedin'] as const

  useEffect(() => {
    setIsClient(true)
    loadData()
  }, [])

  const loadData = () => {
    try {
      const data = dataStore.getSocialLinks()
      setSocialLinks(data.sort((a, b) => a.order - b.order))
    } catch (err) {
      setError('Failed to load social links')
    }
  }

  const handleEdit = (item: SocialLink) => {
    setFormData({
      platform: item.platform,
      url: item.url,
      displayName: item.displayName || '',
      order: item.order,
      isActive: item.isActive
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleSave = () => {
    if (!formData.url) {
      setError('URL is required')
      return
    }

    try {
      if (editingId) {
        dataStore.updateSocialLink(editingId, formData)
      } else {
        dataStore.addSocialLink(formData)
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
        dataStore.deleteSocialLink(id)
        loadData()
      } catch (err) {
        setError('Failed to delete')
      }
    }
  }

  const handleReset = () => {
    setFormData({ platform: 'facebook', url: '', displayName: '', order: 1, isActive: true })
    setEditingId(null)
    setShowForm(false)
    setError(null)
  }

  if (!isClient) return null

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{isBn ? 'সোশ্যাল লিংক' : 'Social Links'}</h1>
          <p className="text-foreground/60">{isBn ? 'সোশ্যাল মিডিয়া লিংক পরিচালনা করুন' : 'Manage social media links'}</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
            <Plus className="w-4 h-4" />
            {isBn ? 'নতুন লিংক' : 'Add Link'}
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
              <label className="block text-sm font-medium mb-2">{isBn ? 'প্ল্যাটফর্ম' : 'Platform'}</label>
              <select value={formData.platform} onChange={(e) => setFormData({ ...formData, platform: e.target.value as any })} className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent">
                {platforms.map((p) => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{isBn ? 'অর্ডার' : 'Order'}</label>
              <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{isBn ? 'URL' : 'URL'}</label>
            <input type="url" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent" placeholder="https://facebook.com/titanforce" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{isBn ? 'প্রদর্শন নাম' : 'Display Name'}</label>
            <input type="text" value={formData.displayName} onChange={(e) => setFormData({ ...formData, displayName: e.target.value })} className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent" placeholder="Titan Force FC" />
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
        {socialLinks.map((item) => (
          <div key={item.id} className="bg-card border-2 border-secondary rounded-lg p-4 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-foreground">{item.platform.toUpperCase()}</h3>
              <p className="text-foreground/60 text-sm mt-1">{item.url}</p>
              {item.displayName && <p className="text-foreground/70 text-sm">{item.displayName}</p>}
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
