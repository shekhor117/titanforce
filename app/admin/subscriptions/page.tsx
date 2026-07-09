'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { dataStore, Subscription } from '@/lib/data-store'
import { Plus, Trash2 } from 'lucide-react'

export default function SubscriptionsPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [isClient, setIsClient] = useState(false)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [formData, setFormData] = useState({ userId: '', email: '', type: 'newsletter' as const, isActive: true, subscribedAt: new Date().toISOString() })

  useEffect(() => {
    setIsClient(true)
    loadSubscriptions()
  }, [])

  const loadSubscriptions = () => {
    try {
      const data = dataStore.getSubscriptions()
      setSubscriptions(data)
    } catch (err) {
      console.log('[v0] Failed to load subscriptions')
    }
  }

  const handleAdd = () => {
    if (formData.email) {
      const newSubscription = dataStore.addSubscription(formData)
      setSubscriptions([...subscriptions, newSubscription])
      setFormData({ userId: '', email: '', type: 'newsletter', isActive: true, subscribedAt: new Date().toISOString() })
    }
  }

  const handleDelete = (id: string) => {
    dataStore.deleteSubscription(id)
    setSubscriptions(subscriptions.filter(s => s.id !== id))
  }

  if (!isClient) return null

  return (
    <div className='space-y-6 p-6'>
      <h1 className='font-[var(--font-display)] text-3xl tracking-wider'>{isBn ? 'সদস্যপদ পরিচালনা' : 'Subscriptions Management'}</h1>
      
      <div className='rounded-lg border-2 border-secondary bg-card p-6 space-y-4'>
        <input type='email' placeholder={isBn ? 'ইমেইল' : 'Email'} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='text' placeholder={isBn ? 'ব্যবহারকারী ID' : 'User ID'} value={formData.userId} onChange={(e) => setFormData({...formData, userId: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value as any})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary'>
          <option value='newsletter'>Newsletter</option>
          <option value='match-updates'>Match Updates</option>
          <option value='offers'>Offers</option>
          <option value='all'>All</option>
        </select>
        <button onClick={handleAdd} className='bg-accent text-white px-4 py-2 rounded flex items-center gap-2 w-full justify-center'><Plus className='w-4 h-4' />{isBn ? 'যোগ করুন' : 'Add'}</button>
      </div>

      <div className='space-y-2'>
        {subscriptions.map(sub => (
          <div key={sub.id} className='flex items-center justify-between bg-secondary p-4 rounded-lg'>
            <div><p className='font-semibold'>{sub.email}</p><p className='text-xs text-muted-foreground'>{sub.type}</p></div>
            <button onClick={() => handleDelete(sub.id)} className='p-2 hover:bg-red-500/20 rounded text-red-400'><Trash2 className='w-4 h-4' /></button>
          </div>
        ))}
      </div>
    </div>
  )
}
