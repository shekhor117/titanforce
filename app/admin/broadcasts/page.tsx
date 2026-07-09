'use client'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { dataStore, Broadcast } from '@/lib/data-store'
import { Plus, Trash2 } from 'lucide-react'

export default function BroadcastsPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [isClient, setIsClient] = useState(false)
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([])
  const [formData, setFormData] = useState({ matchId: '', title: '', streamUrl: '', platform: 'youtube' as const, startTime: new Date().toISOString(), duration: 90, isLive: false })

  useEffect(() => {
    setIsClient(true)
    loadBroadcasts()
  }, [])

  const loadBroadcasts = () => {
    try {
      const data = dataStore.getBroadcasts()
      setBroadcasts(data)
    } catch (err) {
      console.log('[v0] Failed to load broadcasts')
    }
  }

  const handleAdd = () => {
    if (formData.matchId && formData.title && formData.streamUrl) {
      const newBroadcast = dataStore.addBroadcast(formData)
      setBroadcasts([...broadcasts, newBroadcast])
      setFormData({ matchId: '', title: '', streamUrl: '', platform: 'youtube', startTime: new Date().toISOString(), duration: 90, isLive: false })
    }
  }

  const handleDelete = (id: string) => {
    dataStore.deleteBroadcast(id)
    setBroadcasts(broadcasts.filter(b => b.id !== id))
  }

  if (!isClient) return null

  return (
    <div className='space-y-6 p-6'>
      <h1 className='font-[var(--font-display)] text-3xl tracking-wider'>{isBn ? 'সম্প্রচার' : 'Broadcasts'}</h1>
      
      <div className='rounded-lg border-2 border-secondary bg-card p-6 space-y-4'>
        <input type='text' placeholder={isBn ? 'ম্যাচ আইডি' : 'Match ID'} value={formData.matchId} onChange={(e) => setFormData({...formData, matchId: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='text' placeholder={isBn ? 'শিরোনাম' : 'Title'} value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='url' placeholder={isBn ? 'স্ট্রিম URL' : 'Stream URL'} value={formData.streamUrl} onChange={(e) => setFormData({...formData, streamUrl: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <select value={formData.platform} onChange={(e) => setFormData({...formData, platform: e.target.value as any})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary'><option value='youtube'>YouTube</option><option value='facebook'>Facebook</option><option value='website'>Website</option><option value='other'>Other</option></select>
        <input type='number' placeholder={isBn ? 'সময়কাল (মিনিট)' : 'Duration (min)'} value={formData.duration} onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <label className='flex items-center gap-2'><input type='checkbox' checked={formData.isLive} onChange={(e) => setFormData({...formData, isLive: e.target.checked})} />{isBn ? 'লাইভ' : 'Live'}</label>
        <button onClick={handleAdd} className='bg-accent text-white px-4 py-2 rounded flex items-center gap-2 w-full justify-center'><Plus className='w-4 h-4' />{isBn ? 'যোগ করুন' : 'Add'}</button>
      </div>

      <div className='space-y-2'>
        {broadcasts.map(broadcast => (
          <div key={broadcast.id} className='flex items-center justify-between bg-secondary p-4 rounded-lg'>
            <div><p className='font-semibold'>{broadcast.title}</p><p className='text-xs text-muted-foreground'>{broadcast.platform} - {broadcast.isLive ? 'Live' : 'Upcoming'}</p></div>
            <button onClick={() => handleDelete(broadcast.id)} className='p-2 hover:bg-red-500/20 rounded text-red-400'><Trash2 className='w-4 h-4' /></button>
          </div>
        ))}
      </div>
    </div>
  )
}
