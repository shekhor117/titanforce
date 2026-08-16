'use client'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { dataStore, TrainingProgram } from '@/lib/data-store'
import { Plus, Trash2 } from 'lucide-react'
import { AdminLoadingSkeleton } from '@/components/admin-loading-skeleton'

export default function TrainingProgramsPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [isClient, setIsClient] = useState(false)
  const [programs, setPrograms] = useState<TrainingProgram[]>([])
  const [formData, setFormData] = useState({ name: '', description: '', focusArea: '', duration: 30, intensity: 'medium' as const, schedule: [], isActive: true })

  useEffect(() => {
    setIsClient(true)
    loadPrograms()
  }, [])

  const loadPrograms = () => {
    try {
      const data = dataStore.getTrainingPrograms()
      setPrograms(data)
    } catch (err) {
      console.log('[v0] Failed to load programs')
    }
  }

  const handleAdd = () => {
    if (formData.name && formData.description) {
      const newProgram = dataStore.addTrainingProgram(formData)
      setPrograms([...programs, newProgram])
      setFormData({ name: '', description: '', focusArea: '', duration: 30, intensity: 'medium', schedule: [], isActive: true })
    }
  }

  const handleDelete = (id: string) => {
    dataStore.deleteTrainingProgram(id)
    setPrograms(programs.filter(p => p.id !== id))
  }

  if (!isClient) return <AdminLoadingSkeleton />

  return (
    <div className='space-y-6 p-6'>
      <h1 className='font-[var(--font-display)] text-3xl tracking-wider'>{isBn ? 'প্রশিক্ষণ কর্মসূচি' : 'Training Programs'}</h1>
      
      <div className='rounded-lg border-2 border-secondary bg-card p-6 space-y-4'>
        <input type='text' placeholder={isBn ? 'নাম' : 'Name'} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <textarea placeholder={isBn ? 'বিবরণ' : 'Description'} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary h-20' />
        <input type='text' placeholder={isBn ? 'ফোকাস এলাকা' : 'Focus Area'} value={formData.focusArea} onChange={(e) => setFormData({...formData, focusArea: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='number' placeholder={isBn ? 'সময়কাল' : 'Duration (days)'} value={formData.duration} onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <select value={formData.intensity} onChange={(e) => setFormData({...formData, intensity: e.target.value as any})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary'><option value='low'>Low</option><option value='medium'>Medium</option><option value='high'>High</option></select>
        <button onClick={handleAdd} className='bg-accent text-white px-4 py-2 rounded flex items-center gap-2 w-full justify-center'><Plus className='w-4 h-4' />{isBn ? 'যোগ করুন' : 'Add'}</button>
      </div>

      <div className='space-y-2'>
        {programs.map(program => (
          <div key={program.id} className='flex items-center justify-between bg-secondary p-4 rounded-lg'>
            <div><p className='font-semibold'>{program.name}</p><p className='text-xs text-muted-foreground'>{program.focusArea}</p></div>
            <button onClick={() => handleDelete(program.id)} className='p-2 hover:bg-red-500/20 rounded text-red-400'><Trash2 className='w-4 h-4' /></button>
          </div>
        ))}
      </div>
    </div>
  )
}
