'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { dataStore, Event } from '@/lib/data-store'
import { Plus, Edit2, Trash2 } from 'lucide-react'

export default function EventsPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [isClient, setIsClient] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [formData, setFormData] = useState({ title: '', description: '', date: '', time: '', location: '', type: 'match' as const, isPublished: false })

  useEffect(() => {
    setIsClient(true)
    loadEvents()
  }, [])

  const loadEvents = () => {
    try {
      const data = dataStore.getEvents()
      setEvents(data)
    } catch (err) {
      console.log('[v0] Failed to load events')
    }
  }

  const handleAdd = () => {
    if (formData.title && formData.date) {
      const newEvent = dataStore.addEvent(formData)
      setEvents([...events, newEvent])
      setFormData({ title: '', description: '', date: '', time: '', location: '', type: 'match', isPublished: false })
    }
  }

  const handleDelete = (id: string) => {
    dataStore.deleteEvent(id)
    setEvents(events.filter(e => e.id !== id))
  }

  if (!isClient) return null

  return (
    <div className='space-y-6 p-6'>
      <h1 className='font-[var(--font-display)] text-3xl tracking-wider'>{isBn ? 'ইভেন্ট পরিচালনা' : 'Events Management'}</h1>
      
      <div className='rounded-lg border-2 border-secondary bg-card p-6 space-y-4'>
        <input type='text' placeholder={isBn ? 'শিরোনাম' : 'Title'} value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <textarea placeholder={isBn ? 'বর্ণনা' : 'Description'} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary h-20' />
        <input type='date' value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='time' value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='text' placeholder={isBn ? 'অবস্থান' : 'Location'} value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value as any})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary'>
          <option value='match'>Match</option>
          <option value='training'>Training</option>
          <option value='media'>Media</option>
          <option value='community'>Community</option>
          <option value='other'>Other</option>
        </select>
        <label className='flex items-center gap-2'><input type='checkbox' checked={formData.isPublished} onChange={(e) => setFormData({...formData, isPublished: e.target.checked})} />{isBn ? 'প্রকাশিত' : 'Published'}</label>
        <button onClick={handleAdd} className='bg-accent text-white px-4 py-2 rounded flex items-center gap-2 w-full justify-center'><Plus className='w-4 h-4' />{isBn ? 'যোগ করুন' : 'Add'}</button>
      </div>

      <div className='space-y-2'>
        {events.map(event => (
          <div key={event.id} className='flex items-center justify-between bg-secondary p-4 rounded-lg'>
            <div><p className='font-semibold'>{event.title}</p><p className='text-xs text-muted-foreground'>{event.date} {event.time}</p></div>
            <button onClick={() => handleDelete(event.id)} className='p-2 hover:bg-red-500/20 rounded text-red-400'><Trash2 className='w-4 h-4' /></button>
          </div>
        ))}
      </div>
    </div>
  )
}
