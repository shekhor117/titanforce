'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { dataStore, Achievement } from '@/lib/data-store'
import { Plus, Trash2 } from 'lucide-react'

export default function AchievementsPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [isClient, setIsClient] = useState(false)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [formData, setFormData] = useState({ title: '', description: '', icon: '', category: 'player' as const, criteria: '', isActive: true })

  useEffect(() => {
    setIsClient(true)
    loadAchievements()
  }, [])

  const loadAchievements = () => {
    try {
      const data = dataStore.getAchievements()
      setAchievements(data)
    } catch (err) {
      console.log('[v0] Failed to load achievements')
    }
  }

  const handleAdd = () => {
    if (formData.title) {
      const newAchievement = dataStore.addAchievement(formData)
      setAchievements([...achievements, newAchievement])
      setFormData({ title: '', description: '', icon: '', category: 'player', criteria: '', isActive: true })
    }
  }

  const handleDelete = (id: string) => {
    dataStore.deleteAchievement(id)
    setAchievements(achievements.filter(a => a.id !== id))
  }

  if (!isClient) return null

  return (
    <div className='space-y-6 p-6'>
      <h1 className='font-[var(--font-display)] text-3xl tracking-wider'>{isBn ? 'অর্জন পরিচালনা' : 'Achievements Management'}</h1>
      
      <div className='rounded-lg border-2 border-secondary bg-card p-6 space-y-4'>
        <input type='text' placeholder={isBn ? 'শিরোনাম' : 'Title'} value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <textarea placeholder={isBn ? 'বর্ণনা' : 'Description'} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary h-20' />
        <input type='text' placeholder={isBn ? 'আইকন' : 'Icon'} value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value as any})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary'>
          <option value='player'>Player</option>
          <option value='team'>Team</option>
          <option value='milestone'>Milestone</option>
          <option value='special'>Special</option>
        </select>
        <input type='text' placeholder={isBn ? 'মানদণ্ড' : 'Criteria'} value={formData.criteria} onChange={(e) => setFormData({...formData, criteria: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <button onClick={handleAdd} className='bg-accent text-white px-4 py-2 rounded flex items-center gap-2 w-full justify-center'><Plus className='w-4 h-4' />{isBn ? 'যোগ করুন' : 'Add'}</button>
      </div>

      <div className='space-y-2'>
        {achievements.map(achievement => (
          <div key={achievement.id} className='flex items-center justify-between bg-secondary p-4 rounded-lg'>
            <div><p className='font-semibold'>{achievement.title}</p><p className='text-xs text-muted-foreground'>{achievement.category}</p></div>
            <button onClick={() => handleDelete(achievement.id)} className='p-2 hover:bg-red-500/20 rounded text-red-400'><Trash2 className='w-4 h-4' /></button>
          </div>
        ))}
      </div>
    </div>
  )
}
