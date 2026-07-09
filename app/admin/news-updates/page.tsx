'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { dataStore, NewsUpdate } from '@/lib/data-store'
import { Plus, Edit2, Trash2 } from 'lucide-react'

export default function NewsUpdatesPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [isClient, setIsClient] = useState(false)
  const [updates, setUpdates] = useState<NewsUpdate[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ title: '', content: '', category: '', author: '', featured: false, publishedAt: new Date().toISOString().split('T')[0] })

  useEffect(() => {
    setIsClient(true)
    loadUpdates()
  }, [])

  const loadUpdates = () => {
    try {
      const data = dataStore.getNewsUpdates()
      setUpdates(data)
    } catch (err) {
      console.log('[v0] Failed to load updates')
    }
  }

  const handleAdd = () => {
    if (formData.title && formData.content) {
      const newUpdate = dataStore.addNewsUpdate({
        ...formData,
        publishedAt: new Date(formData.publishedAt).toISOString()
      })
      setUpdates([...updates, newUpdate])
      setFormData({ title: '', content: '', category: '', author: '', featured: false, publishedAt: new Date().toISOString().split('T')[0] })
    }
  }

  const handleDelete = (id: string) => {
    dataStore.deleteNewsUpdate(id)
    setUpdates(updates.filter(u => u.id !== id))
  }

  const handleUpdate = (id: string) => {
    dataStore.updateNewsUpdate(id, formData)
    setUpdates(updates.map(u => u.id === id ? { ...u, ...formData } : u))
    setEditingId(null)
    setFormData({ title: '', content: '', category: '', author: '', featured: false, publishedAt: new Date().toISOString().split('T')[0] })
  }

  if (!isClient) return null

  return (
    <div className='space-y-6 p-6'>
      <h1 className='font-[var(--font-display)] text-3xl tracking-wider'>{isBn ? 'সংবাদ আপডেট' : 'News Updates'}</h1>
      
      <div className='rounded-lg border-2 border-secondary bg-card p-6 space-y-4'>
        <input type='text' placeholder={isBn ? 'শিরোনাম' : 'Title'} value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <textarea placeholder={isBn ? 'বিষয়বস্তু' : 'Content'} value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary h-24' />
        <input type='text' placeholder={isBn ? 'বিভাগ' : 'Category'} value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='text' placeholder={isBn ? 'লেখক' : 'Author'} value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='date' value={formData.publishedAt} onChange={(e) => setFormData({...formData, publishedAt: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <label className='flex items-center gap-2'><input type='checkbox' checked={formData.featured} onChange={(e) => setFormData({...formData, featured: e.target.checked})} />{isBn ? 'বৈশিষ্ট্যযুক্ত' : 'Featured'}</label>
        <button onClick={editingId ? () => handleUpdate(editingId) : handleAdd} className='bg-accent text-white px-4 py-2 rounded flex items-center gap-2 w-full justify-center'><Plus className='w-4 h-4' />{isBn ? 'সংরক্ষণ করুন' : 'Save'}</button>
      </div>

      <div className='space-y-2'>
        {updates.map(update => (
          <div key={update.id} className='flex items-center justify-between bg-secondary p-4 rounded-lg'>
            <div><p className='font-semibold'>{update.title}</p><p className='text-xs text-muted-foreground'>{update.category}</p></div>
            <div className='flex gap-2'>
              <button onClick={() => {setEditingId(update.id); setFormData({title: update.title, content: update.content, category: update.category, author: update.author || '', featured: update.featured, publishedAt: update.publishedAt.split('T')[0]})}} className='p-2 hover:bg-accent/20 rounded'><Edit2 className='w-4 h-4' /></button>
              <button onClick={() => handleDelete(update.id)} className='p-2 hover:bg-red-500/20 rounded text-red-400'><Trash2 className='w-4 h-4' /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
