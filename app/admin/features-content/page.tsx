'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { dataStore } from '@/lib/data-store'
import { Save, AlertCircle } from 'lucide-react'

export default function AdminFeaturesContentPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [isClient, setIsClient] = useState(false)
  const [heroTitle, setHeroTitle] = useState('')
  const [heroDescription, setHeroDescription] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)
    loadContent()
  }, [])

  const loadContent = () => {
    try {
      const content = dataStore.getFeaturePageContent()
      if (content) {
        setHeroTitle(content.heroTitle)
        setHeroDescription(content.heroDescription)
      }
    } catch (err) {
      setError('Failed to load features content')
    }
  }

  const handleSave = () => {
    try {
      dataStore.updateFeaturePageContent({ heroTitle, heroDescription, sections: [] })
      setError(null)
    } catch (err) {
      setError('Failed to save')
    }
  }

  if (!isClient) return null

  return (
    <div className='space-y-6 p-6'>
      <h1 className='font-[var(--font-display)] text-3xl tracking-wider text-foreground mb-2'>
        {isBn ? 'বৈশিষ্ট্য সামগ্রী' : 'Features Content'}
      </h1>
      {error && <div className='bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200'>{error}</div>}
      <div className='rounded-xl border-2 border-secondary bg-card p-6 space-y-4'>
        <div>
          <label className='block text-sm font-medium mb-2'>{isBn ? 'নায়ক শিরোনাম' : 'Hero Title'}</label>
          <input type='text' value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} className='w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded' />
        </div>
        <div>
          <label className='block text-sm font-medium mb-2'>{isBn ? 'নায়ক বর্ণনা' : 'Hero Description'}</label>
          <textarea value={heroDescription} onChange={(e) => setHeroDescription(e.target.value)} className='w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded h-24' />
        </div>
        <button onClick={handleSave} className='bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-lg flex items-center gap-2'>
          <Save className='w-4 h-4' /> {isBn ? 'সংরক্ষণ' : 'Save'}
        </button>
      </div>
    </div>
  )
}
