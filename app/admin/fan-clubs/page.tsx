'use client'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { dataStore, FanClub } from '@/lib/data-store'
import { Plus, Trash2 } from 'lucide-react'

export default function FanClubsPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [isClient, setIsClient] = useState(false)
  const [clubs, setClubs] = useState<FanClub[]>([])
  const [formData, setFormData] = useState({ name: '', description: '', location: '', memberCount: 0, founded: new Date().getFullYear().toString(), isActive: true })

  useEffect(() => {
    setIsClient(true)
    loadClubs()
  }, [])

  const loadClubs = () => {
    try {
      const data = dataStore.getFanClubs()
      setClubs(data)
    } catch (err) {
      console.log('[v0] Failed to load clubs')
    }
  }

  const handleAdd = () => {
    if (formData.name && formData.location) {
      const newClub = dataStore.addFanClub(formData)
      setClubs([...clubs, newClub])
      setFormData({ name: '', description: '', location: '', memberCount: 0, founded: new Date().getFullYear().toString(), isActive: true })
    }
  }

  const handleDelete = (id: string) => {
    dataStore.deleteFanClub(id)
    setClubs(clubs.filter(c => c.id !== id))
  }

  if (!isClient) return null

  return (
    <div className='space-y-6 p-6'>
      <h1 className='font-[var(--font-display)] text-3xl tracking-wider'>{isBn ? 'ফ্যান ক্লাব' : 'Fan Clubs'}</h1>
      
      <div className='rounded-lg border-2 border-secondary bg-card p-6 space-y-4'>
        <input type='text' placeholder={isBn ? 'নাম' : 'Name'} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <textarea placeholder={isBn ? 'বর্ণনা' : 'Description'} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary h-20' />
        <input type='text' placeholder={isBn ? 'অবস্থান' : 'Location'} value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='number' placeholder={isBn ? 'সদস্য সংখ্যা' : 'Member Count'} value={formData.memberCount} onChange={(e) => setFormData({...formData, memberCount: parseInt(e.target.value)})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='text' placeholder={isBn ? 'প্রতিষ্ঠা বছর' : 'Founded Year'} value={formData.founded} onChange={(e) => setFormData({...formData, founded: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <button onClick={handleAdd} className='bg-accent text-white px-4 py-2 rounded flex items-center gap-2 w-full justify-center'><Plus className='w-4 h-4' />{isBn ? 'যোগ করুন' : 'Add'}</button>
      </div>

      <div className='space-y-2'>
        {clubs.map(club => (
          <div key={club.id} className='flex items-center justify-between bg-secondary p-4 rounded-lg'>
            <div><p className='font-semibold'>{club.name}</p><p className='text-xs text-muted-foreground'>{club.location} - {club.memberCount} members</p></div>
            <button onClick={() => handleDelete(club.id)} className='p-2 hover:bg-red-500/20 rounded text-red-400'><Trash2 className='w-4 h-4' /></button>
          </div>
        ))}
      </div>
    </div>
  )
}
