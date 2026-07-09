'use client'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { dataStore, Fundraiser } from '@/lib/data-store'
import { Plus, Trash2 } from 'lucide-react'

export default function FundraisersPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [isClient, setIsClient] = useState(false)
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([])
  const [formData, setFormData] = useState({ title: '', description: '', goal: 0, raised: 0, category: '', status: 'active' as const, endsAt: new Date().toISOString().split('T')[0] })

  useEffect(() => {
    setIsClient(true)
    loadFundraisers()
  }, [])

  const loadFundraisers = () => {
    try {
      const data = dataStore.getFundraisers()
      setFundraisers(data)
    } catch (err) {
      console.log('[v0] Failed to load fundraisers')
    }
  }

  const handleAdd = () => {
    if (formData.title && formData.goal > 0) {
      const newFundraiser = dataStore.addFundraiser(formData)
      setFundraisers([...fundraisers, newFundraiser])
      setFormData({ title: '', description: '', goal: 0, raised: 0, category: '', status: 'active', endsAt: new Date().toISOString().split('T')[0] })
    }
  }

  const handleDelete = (id: string) => {
    dataStore.deleteFundraiser(id)
    setFundraisers(fundraisers.filter(f => f.id !== id))
  }

  if (!isClient) return null

  return (
    <div className='space-y-6 p-6'>
      <h1 className='font-[var(--font-display)] text-3xl tracking-wider'>{isBn ? 'তহবিল সংগ্রহ' : 'Fundraisers'}</h1>
      
      <div className='rounded-lg border-2 border-secondary bg-card p-6 space-y-4'>
        <input type='text' placeholder={isBn ? 'শিরোনাম' : 'Title'} value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <textarea placeholder={isBn ? 'বর্ণনা' : 'Description'} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary h-20' />
        <input type='number' placeholder={isBn ? 'লক্ষ্য' : 'Goal'} value={formData.goal} onChange={(e) => setFormData({...formData, goal: parseFloat(e.target.value)})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='text' placeholder={isBn ? 'বিভাগ' : 'Category'} value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='date' value={formData.endsAt} onChange={(e) => setFormData({...formData, endsAt: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <button onClick={handleAdd} className='bg-accent text-white px-4 py-2 rounded flex items-center gap-2 w-full justify-center'><Plus className='w-4 h-4' />{isBn ? 'যোগ করুন' : 'Add'}</button>
      </div>

      <div className='space-y-2'>
        {fundraisers.map(fundraiser => (
          <div key={fundraiser.id} className='flex items-center justify-between bg-secondary p-4 rounded-lg'>
            <div><p className='font-semibold'>{fundraiser.title}</p><p className='text-xs text-muted-foreground'>${fundraiser.raised} / ${fundraiser.goal}</p></div>
            <button onClick={() => handleDelete(fundraiser.id)} className='p-2 hover:bg-red-500/20 rounded text-red-400'><Trash2 className='w-4 h-4' /></button>
          </div>
        ))}
      </div>
    </div>
  )
}
