'use client'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { dataStore, Poll } from '@/lib/data-store'
import { Plus, Trash2 } from 'lucide-react'

export default function PollsPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [isClient, setIsClient] = useState(false)
  const [polls, setPolls] = useState<Poll[]>([])
  const [formData, setFormData] = useState({ question: '', description: '', options: [{id: '1', text: '', votes: 0}], status: 'active' as const, endsAt: new Date().toISOString().split('T')[0] })

  useEffect(() => {
    setIsClient(true)
    loadPolls()
  }, [])

  const loadPolls = () => {
    try {
      const data = dataStore.getPolls()
      setPolls(data)
    } catch (err) {
      console.log('[v0] Failed to load polls')
    }
  }

  const handleAdd = () => {
    if (formData.question && formData.options.length > 0) {
      const newPoll = dataStore.addPoll(formData)
      setPolls([...polls, newPoll])
      setFormData({ question: '', description: '', options: [{id: '1', text: '', votes: 0}], status: 'active', endsAt: new Date().toISOString().split('T')[0] })
    }
  }

  const handleDelete = (id: string) => {
    dataStore.deletePoll(id)
    setPolls(polls.filter(p => p.id !== id))
  }

  if (!isClient) return null

  return (
    <div className='space-y-6 p-6'>
      <h1 className='font-[var(--font-display)] text-3xl tracking-wider'>{isBn ? 'পোল' : 'Polls'}</h1>
      
      <div className='rounded-lg border-2 border-secondary bg-card p-6 space-y-4'>
        <input type='text' placeholder={isBn ? 'প্রশ্ন' : 'Question'} value={formData.question} onChange={(e) => setFormData({...formData, question: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <textarea placeholder={isBn ? 'বর্ণনা' : 'Description'} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary h-20' />
        <input type='date' value={formData.endsAt} onChange={(e) => setFormData({...formData, endsAt: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as any})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary'><option value='active'>Active</option><option value='closed'>Closed</option></select>
        <button onClick={handleAdd} className='bg-accent text-white px-4 py-2 rounded flex items-center gap-2 w-full justify-center'><Plus className='w-4 h-4' />{isBn ? 'যোগ করুন' : 'Add'}</button>
      </div>

      <div className='space-y-2'>
        {polls.map(poll => (
          <div key={poll.id} className='flex items-center justify-between bg-secondary p-4 rounded-lg'>
            <div><p className='font-semibold'>{poll.question}</p><p className='text-xs text-muted-foreground'>{poll.options.length} options</p></div>
            <button onClick={() => handleDelete(poll.id)} className='p-2 hover:bg-red-500/20 rounded text-red-400'><Trash2 className='w-4 h-4' /></button>
          </div>
        ))}
      </div>
    </div>
  )
}
