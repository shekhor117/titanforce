'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { dataStore, PlayerVote } from '@/lib/data-store'
import { Plus, Trash2 } from 'lucide-react'

export default function PlayerVotesPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [isClient, setIsClient] = useState(false)
  const [votes, setVotes] = useState<PlayerVote[]>([])
  const [formData, setFormData] = useState({ playerId: '', playerName: '', voteCount: 1, category: 'player-of-week' })

  const categories = ['player-of-week', 'player-of-month', 'best-defender', 'best-striker', 'most-improved']

  useEffect(() => {
    setIsClient(true)
    loadVotes()
  }, [])

  const loadVotes = () => {
    try {
      setVotes(dataStore.getPlayerVotes())
    } catch (err) {
      console.log('[v0] Failed to load votes')
    }
  }

  const handleAdd = () => {
    if (formData.playerName) {
      const newVote = dataStore.addPlayerVote(formData)
      setVotes([...votes, newVote])
      setFormData({ playerId: '', playerName: '', voteCount: 1, category: 'player-of-week' })
    }
  }

  const handleDelete = (id: string) => {
    dataStore.deletePlayerVote(id)
    setVotes(votes.filter(v => v.id !== id))
  }

  if (!isClient) return null

  return (
    <div className='space-y-6 p-6'>
      <h1 className='font-[var(--font-display)] text-3xl tracking-wider'>{isBn ? 'খেলোয়াড় ভোট' : 'Player Votes'}</h1>
      
      <div className='rounded-lg border-2 border-secondary bg-card p-6 space-y-4'>
        <input type='text' placeholder={isBn ? 'খেলোয়াড় নাম' : 'Player Name'} value={formData.playerName} onChange={(e) => setFormData({...formData, playerName: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary'>
          {categories.map(cat => <option key={cat} value={cat}>{cat.replace(/-/g, ' ')}</option>)}
        </select>
        <input type='number' min='1' placeholder={isBn ? 'ভোট সংখ্যা' : 'Vote Count'} value={formData.voteCount} onChange={(e) => setFormData({...formData, voteCount: Number(e.target.value)})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <button onClick={handleAdd} className='bg-accent text-white px-4 py-2 rounded w-full flex items-center justify-center gap-2'><Plus className='w-4 h-4' />{isBn ? 'যোগ করুন' : 'Add'}</button>
      </div>

      <div className='space-y-2'>
        {votes.map(vote => (
          <div key={vote.id} className='flex items-center justify-between bg-secondary p-4 rounded-lg'>
            <div><p className='font-semibold'>{vote.playerName}</p><p className='text-xs text-muted-foreground'>{vote.category} - {vote.voteCount} votes</p></div>
            <button onClick={() => handleDelete(vote.id)} className='p-2 hover:bg-red-500/20 rounded text-red-400'><Trash2 className='w-4 h-4' /></button>
          </div>
        ))}
      </div>
    </div>
  )
}
