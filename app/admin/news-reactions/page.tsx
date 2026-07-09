'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { dataStore, NewsReaction } from '@/lib/data-store'
import { Plus, Trash2 } from 'lucide-react'

export default function NewsReactionsPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [isClient, setIsClient] = useState(false)
  const [reactions, setReactions] = useState<NewsReaction[]>([])
  const [formData, setFormData] = useState({ newsId: '', reactionType: 'like', count: 1 })

  const reactionTypes = ['like', 'love', 'wow', 'sad', 'angry']

  useEffect(() => {
    setIsClient(true)
    loadReactions()
  }, [])

  const loadReactions = () => {
    try {
      setReactions(dataStore.getNewsReactions())
    } catch (err) {
      console.log('[v0] Failed to load reactions')
    }
  }

  const handleAdd = () => {
    if (formData.newsId) {
      const newReaction = dataStore.addNewsReaction(formData)
      setReactions([...reactions, newReaction])
      setFormData({ newsId: '', reactionType: 'like', count: 1 })
    }
  }

  const handleDelete = (id: string) => {
    dataStore.deleteNewsReaction(id)
    setReactions(reactions.filter(r => r.id !== id))
  }

  if (!isClient) return null

  return (
    <div className='space-y-6 p-6'>
      <h1 className='font-[var(--font-display)] text-3xl tracking-wider'>{isBn ? 'সংবাদ প্রতিক্রিয়া' : 'News Reactions'}</h1>
      
      <div className='rounded-lg border-2 border-secondary bg-card p-6 space-y-4'>
        <input type='text' placeholder={isBn ? 'খবরের আইডি' : 'News ID'} value={formData.newsId} onChange={(e) => setFormData({...formData, newsId: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <select value={formData.reactionType} onChange={(e) => setFormData({...formData, reactionType: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary'>
          {reactionTypes.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
        <input type='number' min='1' placeholder={isBn ? 'গণনা' : 'Count'} value={formData.count} onChange={(e) => setFormData({...formData, count: Number(e.target.value)})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <button onClick={handleAdd} className='bg-accent text-white px-4 py-2 rounded w-full flex items-center justify-center gap-2'><Plus className='w-4 h-4' />{isBn ? 'যোগ করুন' : 'Add'}</button>
      </div>

      <div className='space-y-2'>
        {reactions.map(reaction => (
          <div key={reaction.id} className='flex items-center justify-between bg-secondary p-4 rounded-lg'>
            <div><p className='font-semibold'>News: {reaction.newsId}</p><p className='text-xs text-muted-foreground'>{reaction.reactionType} - {reaction.count} reactions</p></div>
            <button onClick={() => handleDelete(reaction.id)} className='p-2 hover:bg-red-500/20 rounded text-red-400'><Trash2 className='w-4 h-4' /></button>
          </div>
        ))}
      </div>
    </div>
  )
}
