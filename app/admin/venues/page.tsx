'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { dataStore, Venue } from '@/lib/data-store'
import { Plus, Trash2 } from 'lucide-react'
import { AdminLoadingSkeleton } from '@/components/admin-loading-skeleton'

export default function VenuesPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [isClient, setIsClient] = useState(false)
  const [venues, setVenues] = useState<Venue[]>([])
  const [formData, setFormData] = useState({ name: '', address: '', city: '', capacity: 0, facilities: [] as string[], isActive: true })

  useEffect(() => {
    setIsClient(true)
    loadVenues()
  }, [])

  const loadVenues = () => {
    try {
      const data = dataStore.getVenues()
      setVenues(data)
    } catch (err) {
      console.log('[v0] Failed to load venues')
    }
  }

  const handleAdd = () => {
    if (formData.name && formData.address) {
      const newVenue = dataStore.addVenue(formData)
      setVenues([...venues, newVenue])
      setFormData({ name: '', address: '', city: '', capacity: 0, facilities: [], isActive: true })
    }
  }

  const handleDelete = (id: string) => {
    dataStore.deleteVenue(id)
    setVenues(venues.filter(v => v.id !== id))
  }

  if (!isClient) return <AdminLoadingSkeleton />

  return (
    <div className='space-y-6 p-6'>
      <h1 className='font-[var(--font-display)] text-3xl tracking-wider'>{isBn ? 'ভেন্যু পরিচালনা' : 'Venues Management'}</h1>
      
      <div className='rounded-lg border-2 border-secondary bg-card p-6 space-y-4'>
        <input type='text' placeholder={isBn ? 'নাম' : 'Name'} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='text' placeholder={isBn ? 'ঠিকানা' : 'Address'} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='text' placeholder={isBn ? 'শহর' : 'City'} value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='number' placeholder={isBn ? 'ক্ষমতা' : 'Capacity'} value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value) || 0})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <button onClick={handleAdd} className='bg-accent text-white px-4 py-2 rounded flex items-center gap-2 w-full justify-center'><Plus className='w-4 h-4' />{isBn ? 'যোগ করুন' : 'Add'}</button>
      </div>

      <div className='space-y-2'>
        {venues.map(venue => (
          <div key={venue.id} className='flex items-center justify-between bg-secondary p-4 rounded-lg'>
            <div><p className='font-semibold'>{venue.name}</p><p className='text-xs text-muted-foreground'>{venue.city} - {venue.capacity} capacity</p></div>
            <button onClick={() => handleDelete(venue.id)} className='p-2 hover:bg-red-500/20 rounded text-red-400'><Trash2 className='w-4 h-4' /></button>
          </div>
        ))}
      </div>
    </div>
  )
}
