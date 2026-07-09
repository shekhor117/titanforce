'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { dataStore, Testimonial } from '@/lib/data-store'
import { Save, Plus, Edit2, Trash2, AlertCircle, Star } from 'lucide-react'

export default function AdminTestimonialsPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [isClient, setIsClient] = useState(false)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    author: '',
    role: '',
    content: '',
    rating: 5,
    image: '',
    isActive: true
  })

  useEffect(() => {
    setIsClient(true)
    loadData()
  }, [])

  const loadData = () => {
    try {
      const data = dataStore.getTestimonials()
      setTestimonials(data)
    } catch (err) {
      setError('Failed to load testimonials')
    }
  }

  const handleEdit = (item: Testimonial) => {
    setFormData({
      author: item.author,
      role: item.role || '',
      content: item.content,
      rating: item.rating || 5,
      image: item.image || '',
      isActive: item.isActive
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleSave = () => {
    if (!formData.author || !formData.content) {
      setError('Author and content are required')
      return
    }

    try {
      if (editingId) {
        dataStore.updateTestimonial(editingId, formData)
      } else {
        dataStore.addTestimonial(formData)
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
        dataStore.deleteTestimonial(id)
        loadData()
      } catch (err) {
        setError('Failed to delete')
      }
    }
  }

  const handleReset = () => {
    setFormData({ author: '', role: '', content: '', rating: 5, image: '', isActive: true })
    setEditingId(null)
    setShowForm(false)
    setError(null)
  }

  if (!isClient) return null

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{isBn ? 'প্রশংসাপত্র' : 'Testimonials'}</h1>
          <p className="text-foreground/60">{isBn ? 'গ্রাহক পর্যালোচনা পরিচালনা করুন' : 'Manage customer reviews'}</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
            <Plus className="w-4 h-4" />
            {isBn ? 'নতুন' : 'New'}
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
              <label className="block text-sm font-medium mb-2">{isBn ? 'লেখকের নাম' : 'Author'}</label>
              <input type="text" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{isBn ? 'ভূমিকা' : 'Role'}</label>
              <input type="text" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{isBn ? 'মন্তব্য' : 'Testimonial'}</label>
            <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent h-24 resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{isBn ? 'রেটিং' : 'Rating'}</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((r) => (
                <button key={r} onClick={() => setFormData({ ...formData, rating: r })} className={`w-8 h-8 flex items-center justify-center rounded ${formData.rating >= r ? 'bg-yellow-400 text-black' : 'bg-secondary text-foreground'}`}>
                  <Star className="w-4 h-4 fill-current" />
                </button>
              ))}
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
        {testimonials.map((item) => (
          <div key={item.id} className="bg-card border-2 border-secondary rounded-lg p-4 flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-foreground">{item.author}</h3>
                {item.rating && <div className="flex gap-1">{Array(item.rating).fill(0).map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}</div>}
              </div>
              {item.role && <p className="text-foreground/60 text-sm">{item.role}</p>}
              <p className="text-foreground/70 text-sm mt-1 line-clamp-2">{item.content}</p>
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
