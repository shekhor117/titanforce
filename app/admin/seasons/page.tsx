'use client'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { dataStore, Season } from '@/lib/data-store'
import { Plus, Edit2, Trash2 } from 'lucide-react'

export default function SeasonsPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [isClient, setIsClient] = useState(false)
  const [seasons, setSeasons] = useState<Season[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ year: new Date().getFullYear(), name: '', startDate: '', endDate: '', status: 'upcoming' as const, isActive: true })

  useEffect(() => {
    setIsClient(true)
    loadSeasons()
  }, [])

  const loadSeasons = () => {
    try {
      const data = dataStore.getSeasons()
      setSeasons(data)
    } catch (err) {
      console.log('[v0] Failed to load seasons')
    }
  }

  const handleAdd = () => {
    if (formData.year && formData.name) {
      const newSeason = dataStore.addSeason(formData)
      setSeasons([...seasons, newSeason])
      setFormData({ year: new Date().getFullYear(), name: '', startDate: '', endDate: '', status: 'upcoming', isActive: true })
    }
  }

  const handleDelete = (id: string) => {
    dataStore.deleteSeason(id)
    setSeasons(seasons.filter(s => s.id !== id))
  }

  if (!isClient) return null

  return (
    <div className='space-y-6 p-6'>
      <h1 className='font-[var(--font-display)] text-3xl tracking-wider'>{isBn ? 'ঋতু' : 'Seasons'}</h1>
      
      <div className='rounded-lg border-2 border-secondary bg-card p-6 space-y-4'>
        <input type='number' placeholder={isBn ? 'বছর' : 'Year'} value={formData.year} onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='text' placeholder={isBn ? 'নাম' : 'Name'} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='date' value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='date' value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as any})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary'><option value='upcoming'>Upcoming</option><option value='ongoing'>Ongoing</option><option value='completed'>Completed</option></select>
        <button onClick={handleAdd} className='bg-accent text-white px-4 py-2 rounded flex items-center gap-2 w-full justify-center'><Plus className='w-4 h-4' />{isBn ? 'যোগ করুন' : 'Add'}</button>
      </div>

      <div className='space-y-2'>
        {seasons.map(season => (
          <div key={season.id} className='flex items-center justify-between bg-secondary p-4 rounded-lg'>
            <div><p className='font-semibold'>{season.name} ({season.year})</p><p className='text-xs text-muted-foreground'>{season.status}</p></div>
            <button onClick={() => handleDelete(season.id)} className='p-2 hover:bg-red-500/20 rounded text-red-400'><Trash2 className='w-4 h-4' /></button>
          </div>
        ))}
      </div>
    </div>
  )
}
