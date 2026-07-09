'use client'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { dataStore, MatchEvent } from '@/lib/data-store'
import { Plus, Trash2 } from 'lucide-react'

export default function MatchEventsPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [isClient, setIsClient] = useState(false)
  const [events, setEvents] = useState<MatchEvent[]>([])
  const [formData, setFormData] = useState({ matchId: '', playerId: '', playerName: '', eventType: 'goal' as const, minute: 0, description: '' })

  useEffect(() => {
    setIsClient(true)
    loadEvents()
  }, [])

  const loadEvents = () => {
    try {
      const data = dataStore.getMatchEvents()
      setEvents(data)
    } catch (err) {
      console.log('[v0] Failed to load events')
    }
  }

  const handleAdd = () => {
    if (formData.matchId && formData.playerName) {
      const newEvent = dataStore.addMatchEvent(formData)
      setEvents([...events, newEvent])
      setFormData({ matchId: '', playerId: '', playerName: '', eventType: 'goal', minute: 0, description: '' })
    }
  }

  const handleDelete = (id: string) => {
    dataStore.deleteMatchEvent(id)
    setEvents(events.filter(e => e.id !== id))
  }

  if (!isClient) return null

  return (
    <div className='space-y-6 p-6'>
      <h1 className='font-[var(--font-display)] text-3xl tracking-wider'>{isBn ? 'ম্যাচ ইভেন্ট' : 'Match Events'}</h1>
      
      <div className='rounded-lg border-2 border-secondary bg-card p-6 space-y-4'>
        <input type='text' placeholder={isBn ? 'ম্যাচ আইডি' : 'Match ID'} value={formData.matchId} onChange={(e) => setFormData({...formData, matchId: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='text' placeholder={isBn ? 'খেলোয়াড়ের নাম' : 'Player Name'} value={formData.playerName} onChange={(e) => setFormData({...formData, playerName: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <select value={formData.eventType} onChange={(e) => setFormData({...formData, eventType: e.target.value as any})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary'><option value='goal'>Goal</option><option value='assist'>Assist</option><option value='yellow-card'>Yellow Card</option><option value='red-card'>Red Card</option><option value='substitution'>Substitution</option></select>
        <input type='number' placeholder={isBn ? 'মিনিট' : 'Minute'} value={formData.minute} onChange={(e) => setFormData({...formData, minute: parseInt(e.target.value)})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='text' placeholder={isBn ? 'বর্ণনা' : 'Description'} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <button onClick={handleAdd} className='bg-accent text-white px-4 py-2 rounded flex items-center gap-2 w-full justify-center'><Plus className='w-4 h-4' />{isBn ? 'যোগ করুন' : 'Add'}</button>
      </div>

      <div className='space-y-2'>
        {events.map(event => (
          <div key={event.id} className='flex items-center justify-between bg-secondary p-4 rounded-lg'>
            <div><p className='font-semibold'>{event.playerName} - {event.eventType}</p><p className='text-xs text-muted-foreground'>Min {event.minute}</p></div>
            <button onClick={() => handleDelete(event.id)} className='p-2 hover:bg-red-500/20 rounded text-red-400'><Trash2 className='w-4 h-4' /></button>
          </div>
        ))}
      </div>
    </div>
  )
}
