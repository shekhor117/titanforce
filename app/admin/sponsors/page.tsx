'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { dataStore, Sponsor } from '@/lib/data-store'
import { Plus, Trash2 } from 'lucide-react'

export default function SponsorsPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [isClient, setIsClient] = useState(false)
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [formData, setFormData] = useState({ name: '', logo: '', description: '', website: '', contactEmail: '', tier: 'gold' as const, isActive: true })

  useEffect(() => {
    setIsClient(true)
    loadSponsors()
  }, [])

  const loadSponsors = () => {
    try {
      const data = dataStore.getSponsors()
      setSponsors(data)
    } catch (err) {
      console.log('[v0] Failed to load sponsors')
    }
  }

  const handleAdd = () => {
    if (formData.name && formData.description) {
      const newSponsor = dataStore.addSponsor(formData)
      setSponsors([...sponsors, newSponsor])
      setFormData({ name: '', logo: '', description: '', website: '', contactEmail: '', tier: 'gold', isActive: true })
    }
  }

  const handleDelete = (id: string) => {
    dataStore.deleteSponsor(id)
    setSponsors(sponsors.filter(s => s.id !== id))
  }

  if (!isClient) return null

  return (
    <div className='space-y-6 p-6'>
      <h1 className='font-[var(--font-display)] text-3xl tracking-wider'>{isBn ? 'স্পন্সর পরিচালনা' : 'Sponsors Management'}</h1>
      
      <div className='rounded-lg border-2 border-secondary bg-card p-6 space-y-4'>
        <input type='text' placeholder={isBn ? 'নাম' : 'Name'} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='text' placeholder={isBn ? 'লোগো URL' : 'Logo URL'} value={formData.logo} onChange={(e) => setFormData({...formData, logo: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <textarea placeholder={isBn ? 'বর্ণনা' : 'Description'} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary h-20' />
        <input type='text' placeholder={isBn ? 'ওয়েবসাইট' : 'Website'} value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='email' placeholder={isBn ? 'যোগাযোগ ইমেইল' : 'Contact Email'} value={formData.contactEmail} onChange={(e) => setFormData({...formData, contactEmail: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <select value={formData.tier} onChange={(e) => setFormData({...formData, tier: e.target.value as any})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary'>
          <option value='platinum'>Platinum</option>
          <option value='gold'>Gold</option>
          <option value='silver'>Silver</option>
          <option value='bronze'>Bronze</option>
        </select>
        <button onClick={handleAdd} className='bg-accent text-white px-4 py-2 rounded flex items-center gap-2 w-full justify-center'><Plus className='w-4 h-4' />{isBn ? 'যোগ করুন' : 'Add'}</button>
      </div>

      <div className='space-y-2'>
        {sponsors.map(sponsor => (
          <div key={sponsor.id} className='flex items-center justify-between bg-secondary p-4 rounded-lg'>
            <div><p className='font-semibold'>{sponsor.name}</p><p className='text-xs text-muted-foreground'>{sponsor.tier}</p></div>
            <button onClick={() => handleDelete(sponsor.id)} className='p-2 hover:bg-red-500/20 rounded text-red-400'><Trash2 className='w-4 h-4' /></button>
          </div>
        ))}
      </div>
    </div>
  )
}
