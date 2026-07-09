'use client'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { dataStore, Merchandise } from '@/lib/data-store'
import { Plus, Trash2 } from 'lucide-react'

export default function MerchandisePage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [isClient, setIsClient] = useState(false)
  const [items, setItems] = useState<Merchandise[]>([])
  const [formData, setFormData] = useState({ name: '', description: '', price: 0, stock: 0, category: '', isActive: true })

  useEffect(() => {
    setIsClient(true)
    loadItems()
  }, [])

  const loadItems = () => {
    try {
      const data = dataStore.getMerchandise()
      setItems(data)
    } catch (err) {
      console.log('[v0] Failed to load items')
    }
  }

  const handleAdd = () => {
    if (formData.name && formData.price > 0) {
      const newItem = dataStore.addMerchandise(formData)
      setItems([...items, newItem])
      setFormData({ name: '', description: '', price: 0, stock: 0, category: '', isActive: true })
    }
  }

  const handleDelete = (id: string) => {
    dataStore.deleteMerchandise(id)
    setItems(items.filter(i => i.id !== id))
  }

  if (!isClient) return null

  return (
    <div className='space-y-6 p-6'>
      <h1 className='font-[var(--font-display)] text-3xl tracking-wider'>{isBn ? 'পণ্যসম্ভার' : 'Merchandise'}</h1>
      
      <div className='rounded-lg border-2 border-secondary bg-card p-6 space-y-4'>
        <input type='text' placeholder={isBn ? 'নাম' : 'Name'} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <textarea placeholder={isBn ? 'বর্ণনা' : 'Description'} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary h-20' />
        <input type='number' placeholder={isBn ? 'দাম' : 'Price'} value={formData.price} onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='number' placeholder={isBn ? 'স্টক' : 'Stock'} value={formData.stock} onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='text' placeholder={isBn ? 'বিভাগ' : 'Category'} value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <button onClick={handleAdd} className='bg-accent text-white px-4 py-2 rounded flex items-center gap-2 w-full justify-center'><Plus className='w-4 h-4' />{isBn ? 'যোগ করুন' : 'Add'}</button>
      </div>

      <div className='space-y-2'>
        {items.map(item => (
          <div key={item.id} className='flex items-center justify-between bg-secondary p-4 rounded-lg'>
            <div><p className='font-semibold'>{item.name}</p><p className='text-xs text-muted-foreground'>${item.price} x {item.stock} in stock</p></div>
            <button onClick={() => handleDelete(item.id)} className='p-2 hover:bg-red-500/20 rounded text-red-400'><Trash2 className='w-4 h-4' /></button>
          </div>
        ))}
      </div>
    </div>
  )
}
