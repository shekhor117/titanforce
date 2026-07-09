'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { dataStore } from '@/lib/data-store'
import { Save, Plus, Trash2, AlertCircle } from 'lucide-react'

export default function AdminFooterPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [isClient, setIsClient] = useState(false)
  const [brandDescription, setBrandDescription] = useState('')
  const [quickLinks, setQuickLinks] = useState<Array<{ label: string; href: string }>>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)
    loadFooterContent()
  }, [])

  const loadFooterContent = () => {
    try {
      const content = dataStore.getFooterContent()
      if (content) {
        setBrandDescription(content.brandDescription)
        setQuickLinks(content.quickLinks || [])
      }
    } catch (err) {
      setError('Failed to load footer content')
    }
  }

  const handleSave = () => {
    try {
      dataStore.updateFooterContent({ brandDescription, quickLinks, aboutLinks: [], supportLinks: [], companyLinks: [] })
      setError(null)
    } catch (err) {
      setError('Failed to save')
    }
  }

  if (!isClient) return null

  return (
    <div className='space-y-6 p-6'>
      <h1 className='font-[var(--font-display)] text-3xl tracking-wider text-foreground mb-2'>
        {isBn ? 'ফুটার পরিচালনা' : 'Footer Management'}
      </h1>
      {error && <div className='bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200'>{error}</div>}
      <div className='rounded-xl border-2 border-secondary bg-card p-6 space-y-4'>
        <div>
          <label className='block text-sm font-medium mb-2'>{isBn ? 'ব্র্যান্ড বর্ণনা' : 'Brand Description'}</label>
          <textarea value={brandDescription} onChange={(e) => setBrandDescription(e.target.value)} className='w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg h-24' />
        </div>
        <button onClick={handleSave} className='bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-lg flex items-center gap-2'>
          <Save className='w-4 h-4' /> {isBn ? 'সংরক্ষণ' : 'Save'}
        </button>
      </div>
    </div>
  )
}
