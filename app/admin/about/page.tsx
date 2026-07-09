'use client'

import { useState, useEffect } from 'react'
import { useAdmin } from '@/lib/admin-context'
import { useLanguage } from '@/lib/language-context'
import { dataStore, AboutContent } from '@/lib/data-store'
import { Save, RefreshCw, Plus, Edit2, Trash2, AlertCircle } from 'lucide-react'

export default function AdminAboutPage() {
  const { admin } = useAdmin()
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [isClient, setIsClient] = useState(false)
  const [aboutContent, setAboutContent] = useState<AboutContent[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    image: '',
    sections: [] as Array<{ heading: string; text: string }>
  })

  useEffect(() => {
    setIsClient(true)
    loadData()
  }, [])

  const loadData = () => {
    try {
      const data = dataStore.getAboutContent()
      setAboutContent(data)
    } catch (err) {
      setError('Failed to load about content')
    }
  }

  const handleEdit = (item: AboutContent) => {
    setFormData({
      title: item.title,
      description: item.description,
      content: item.content,
      image: item.image || '',
      sections: item.sections
    })
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
        dataStore.updateAboutContent(editingId, formData)
      } else {
        dataStore.addAboutContent(formData)
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
        dataStore.deleteAboutContent(id)
        loadData()
      } catch (err) {
        setError('Failed to delete')
      }
    }
  }

  const handleReset = () => {
    setFormData({ title: '', description: '', content: '', image: '', sections: [] })
    setEditingId(null)
    setShowForm(false)
    setError(null)
  }

  if (!isClient) return null

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{isBn ? 'আমাদের সম্পর্কে' : 'About Page'}</h1>
          <p className="text-foreground/60">{isBn ? 'আমাদের সম্পর্কে পৃষ্ঠার বিষয়বস্তু পরিচালনা করুন' : 'Manage about page content'}</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            {isBn ? 'নতুন যোগ করুন' : 'Add New'}
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
          <div>
            <label className="block text-sm font-medium mb-2">{isBn ? 'শিরোনাম' : 'Title'}</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{isBn ? 'বর্ণনা' : 'Description'}</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent h-20 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{isBn ? 'বিষয়বস্তু' : 'Content'}</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent h-32 resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <Save className="w-4 h-4" />
              {editingId ? isBn ? 'আপডেট করুন' : 'Update' : isBn ? 'যোগ করুন' : 'Add'}
            </button>
            <button
              onClick={handleReset}
              className="bg-secondary hover:bg-secondary/80 text-foreground px-6 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <RefreshCw className="w-4 h-4" />
              {isBn ? 'বাতিল করুন' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {aboutContent.map((item) => (
          <div key={item.id} className="bg-card border-2 border-secondary rounded-lg p-4 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-foreground">{item.title}</h3>
              <p className="text-foreground/60 text-sm mt-1">{item.description}</p>
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
