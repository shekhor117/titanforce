'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { dataStore, ShopCategory } from '@/lib/data-store'
import { Save, Plus, Trash2, Edit2, AlertCircle } from 'lucide-react'

export default function AdminShopCategoriesPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [isClient, setIsClient] = useState(false)
  const [categories, setCategories] = useState<ShopCategory[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)
    loadCategories()
  }, [])

  const loadCategories = () => {
    try {
      const cats = dataStore.getShopCategories()
      setCategories(cats)
    } catch (err) {
      setError('Failed to load categories')
    }
  }

  const handleSave = () => {
    if (!name.trim()) {
      setError('Category name is required')
      return
    }
    try {
      if (editingId) {
        dataStore.updateShopCategory(editingId, { name, slug: slug || name.toLowerCase() })
      } else {
        dataStore.addShopCategory({ name, slug: slug || name.toLowerCase(), order: categories.length, isActive: true })
      }
      loadCategories()
      handleReset()
    } catch (err) {
      setError('Failed to save category')
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this category?')) {
      dataStore.deleteShopCategory(id)
      loadCategories()
    }
  }

  const handleEdit = (cat: ShopCategory) => {
    setName(cat.name)
    setSlug(cat.slug)
    setEditingId(cat.id)
    setShowForm(true)
  }

  const handleReset = () => {
    setName('')
    setSlug('')
    setEditingId(null)
    setShowForm(false)
    setError(null)
  }

  if (!isClient) return null

  return (
    <div className='space-y-6 p-6'>
      <div className='flex items-center justify-between'>
        <h1 className='font-[var(--font-display)] text-3xl tracking-wider text-foreground'>{isBn ? 'বিভাগ' : 'Categories'}</h1>
        {!showForm && <button onClick={() => setShowForm(true)} className='bg-accent px-4 py-2 rounded text-white flex items-center gap-2'><Plus className='w-4 h-4' /> {isBn ? 'নতুন' : 'New'}</button>}
      </div>
      
      {error && <div className='bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200'>{error}</div>}

      {showForm && (
        <div className='rounded-xl border-2 border-secondary bg-card p-6 space-y-4'>
          <input type='text' placeholder='Category Name' value={name} onChange={(e) => setName(e.target.value)} className='w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded' />
          <input type='text' placeholder='Slug' value={slug} onChange={(e) => setSlug(e.target.value)} className='w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded' />
          <div className='flex gap-2'>
            <button onClick={handleSave} className='bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded flex items-center gap-2'><Save className='w-4 h-4' /> {isBn ? 'সংরক্ষণ' : 'Save'}</button>
            <button onClick={handleReset} className='bg-secondary hover:bg-secondary/80 text-foreground px-4 py-2 rounded'>{isBn ? 'বাতিল' : 'Cancel'}</button>
          </div>
        </div>
      )}

      <div className='space-y-2'>
        {categories.length === 0 ? <div className='text-center py-8 text-foreground/60'>{isBn ? 'কোন বিভাগ নেই' : 'No categories'}</div> : categories.map(cat => (
          <div key={cat.id} className='bg-card border border-secondary rounded-lg p-4 flex items-center justify-between'>
            <div><div className='font-bold'>{cat.name}</div><div className='text-sm text-foreground/60'>{cat.slug}</div></div>
            <div className='flex gap-2'>
              <button onClick={() => handleEdit(cat)} className='p-2 hover:bg-secondary rounded text-blue-400'><Edit2 className='w-4 h-4' /></button>
              <button onClick={() => handleDelete(cat.id)} className='p-2 hover:bg-secondary rounded text-red-400'><Trash2 className='w-4 h-4' /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
