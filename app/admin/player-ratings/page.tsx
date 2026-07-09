'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { dataStore, PlayerRating } from '@/lib/data-store'
import { Plus, Trash2, Save } from 'lucide-react'

export default function PlayerRatingsPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [isClient, setIsClient] = useState(false)
  const [ratings, setRatings] = useState<PlayerRating[]>([])
  const [formData, setFormData] = useState({ playerId: '', playerName: '', rating: 5, season: '', votes: 0 })

  useEffect(() => {
    setIsClient(true)
    loadRatings()
  }, [])

  const loadRatings = () => {
    try {
      setRatings(dataStore.getPlayerRatings())
    } catch (err) {
      console.log('[v0] Failed to load ratings')
    }
  }

  const handleAdd = () => {
    if (formData.playerName) {
      const newRating = dataStore.addPlayerRating({ ...formData, rating: Number(formData.rating) })
      setRatings([...ratings, newRating])
      setFormData({ playerId: '', playerName: '', rating: 5, season: '', votes: 0 })
    }
  }

  const handleDelete = (id: string) => {
    dataStore.deletePlayerRating(id)
    setRatings(ratings.filter(r => r.id !== id))
  }

  if (!isClient) return null

  return (
    <div className='space-y-6 p-6'>
      <h1 className='font-[var(--font-display)] text-3xl tracking-wider'>{isBn ? 'খেলোয়াড় রেটিং' : 'Player Ratings'}</h1>
      
      <div className='rounded-lg border-2 border-secondary bg-card p-6 space-y-4'>
        <input type='text' placeholder={isBn ? 'খেলোয়াড় নাম' : 'Player Name'} value={formData.playerName} onChange={(e) => setFormData({...formData, playerName: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='text' placeholder={isBn ? 'মৌসুম' : 'Season'} value={formData.season} onChange={(e) => setFormData({...formData, season: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='number' min='1' max='10' placeholder='Rating (1-10)' value={formData.rating} onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <button onClick={handleAdd} className='bg-accent text-white px-4 py-2 rounded flex items-center gap-2 w-full justify-center'><Plus className='w-4 h-4' />{isBn ? 'যোগ করুন' : 'Add'}</button>
      </div>

      <div className='space-y-2'>
        {ratings.map(rating => (
          <div key={rating.id} className='flex items-center justify-between bg-secondary p-4 rounded-lg'>
            <div><p className='font-semibold'>{rating.playerName}</p><p className='text-sm'>⭐ {rating.rating}/10 • {rating.season}</p></div>
            <button onClick={() => handleDelete(rating.id)} className='p-2 hover:bg-red-500/20 rounded text-red-400'><Trash2 className='w-4 h-4' /></button>
          </div>
        ))}
      </div>
    </div>
  )
}
