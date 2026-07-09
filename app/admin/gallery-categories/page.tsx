'use client'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { dataStore, GalleryCategory } from '@/lib/data-store'
import { Plus, Trash2 } from 'lucide-react'

export default function GalleryCategoriesPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [isClient, setIsClient] = useState(false)
  const [categories, setCategories] = useState<GalleryCategory[]>([])
  const [formData, setFormData] = useState({ name: '', description: '', order: 0, isActive: true })

  useEffect(() => {
    setIsClient(true)
    loadCategories()
  }, [])

  const loadCategories = () => {
    try {
      const data = dataStore.getGalleryCategories()
      setCategories(data)
    } catch (err) {
      console.log('[v0] Failed to load categories')
    }
  }

  const handleAdd = () => {
    if (formData.name) {
      const newCategory = dataStore.addGalleryCategory(formData)
      setCategories([...categories, newCategory])
      setFormData({ name: '', description: '', order: 0, isActive: true })
    }
  }

  const handleDelete = (id: string) => {
    dataStore.deleteGalleryCategory(id)
    setCategories(categories.filter(c => c.id !== id))
  }

  if (!isClient) return null

  return (
    <div className='space-y-6 p-6'>
      <h1 className='font-[var(--font-display)] text-3xl tracking-wider'>{isBn ? 'গ্যালারি বিভাগ' : 'Gallery Categories'}</h1>
      
      <div className='rounded-lg border-2 border-secondary bg-card p-6 space-y-4'>
        <input type='text' placeholder={isBn ? 'নাম' : 'Name'} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <textarea placeholder={isBn ? 'বর্ণনা' : 'Description'} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary h-20' />
        <input type='number' placeholder={isBn ? 'ক্রম' : 'Order'} value={formData.order} onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <label className='flex items-center gap-2'><input type='checkbox' checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} />{isBn ? 'সক্রিয়' : 'Active'}</label>
        <button onClick={handleAdd} className='bg-accent text-white px-4 py-2 rounded flex items-center gap-2 w-full justify-center'><Plus className='w-4 h-4' />{isBn ? 'যোগ করুন' : 'Add'}</button>
      </div>

      <div className='space-y-2'>
        {categories.map(category => (
          <div key={category.id} className='flex items-center justify-between bg-secondary p-4 rounded-lg'>
            <div><p className='font-semibold'>{category.name}</p><p className='text-xs text-muted-foreground'>Order: {category.order}</p></div>
            <button onClick={() => handleDelete(category.id)} className='p-2 hover:bg-red-500/20 rounded text-red-400'><Trash2 className='w-4 h-4' /></button>
          </div>
        ))}
      </div>
    </div>
  )
}
