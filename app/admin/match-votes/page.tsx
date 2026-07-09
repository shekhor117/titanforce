'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { dataStore, MatchVote } from '@/lib/data-store'
import { Plus, Trash2 } from 'lucide-react'

export default function MatchVotesPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [isClient, setIsClient] = useState(false)
  const [votes, setVotes] = useState<MatchVote[]>([])
  const [formData, setFormData] = useState({ matchId: '', voteType: 'win', userId: '', voteCount: 1 })

  useEffect(() => {
    setIsClient(true)
    loadVotes()
  }, [])

  const loadVotes = () => {
    try {
      setVotes(dataStore.getMatchVotes())
    } catch (err) {
      console.log('[v0] Failed to load votes')
    }
  }

  const handleAdd = () => {
    if (formData.matchId) {
      const newVote = dataStore.addMatchVote(formData)
      setVotes([...votes, newVote])
      setFormData({ matchId: '', voteType: 'win', userId: '', voteCount: 1 })
    }
  }

  const handleDelete = (id: string) => {
    dataStore.deleteMatchVote(id)
    setVotes(votes.filter(v => v.id !== id))
  }

  if (!isClient) return null

  return (
    <div className='space-y-6 p-6'>
      <h1 className='font-[var(--font-display)] text-3xl tracking-wider'>{isBn ? 'ম্যাচ ভোট' : 'Match Votes'}</h1>
      
      <div className='rounded-lg border-2 border-secondary bg-card p-6 space-y-4'>
        <input type='text' placeholder={isBn ? 'ম্যাচ আইডি' : 'Match ID'} value={formData.matchId} onChange={(e) => setFormData({...formData, matchId: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <select value={formData.voteType} onChange={(e) => setFormData({...formData, voteType: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary'>
          <option value='win'>Win</option>
          <option value='draw'>Draw</option>
          <option value='loss'>Loss</option>
        </select>
        <input type='text' placeholder={isBn ? 'ব্যবহারকারী আইডি' : 'User ID'} value={formData.userId} onChange={(e) => setFormData({...formData, userId: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='number' min='1' placeholder={isBn ? 'ভোট সংখ্যা' : 'Vote Count'} value={formData.voteCount} onChange={(e) => setFormData({...formData, voteCount: Number(e.target.value)})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <button onClick={handleAdd} className='bg-accent text-white px-4 py-2 rounded w-full flex items-center justify-center gap-2'><Plus className='w-4 h-4' />{isBn ? 'যোগ করুন' : 'Add'}</button>
      </div>

      <div className='space-y-2'>
        {votes.map(vote => (
          <div key={vote.id} className='flex items-center justify-between bg-secondary p-4 rounded-lg'>
            <div><p className='font-semibold'>Match: {vote.matchId}</p><p className='text-xs text-muted-foreground'>{vote.voteType} - {vote.voteCount} votes</p></div>
            <button onClick={() => handleDelete(vote.id)} className='p-2 hover:bg-red-500/20 rounded text-red-400'><Trash2 className='w-4 h-4' /></button>
          </div>
        ))}
      </div>
    </div>
  )
}
