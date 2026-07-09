'use client'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { dataStore, CoachingStaff } from '@/lib/data-store'
import { Plus, Trash2 } from 'lucide-react'

export default function CoachingStaffPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [isClient, setIsClient] = useState(false)
  const [staff, setStaff] = useState<CoachingStaff[]>([])
  const [formData, setFormData] = useState({ name: '', role: 'head-coach' as const, experience: 0, specialization: '', joinDate: new Date().toISOString().split('T')[0], isActive: true })

  useEffect(() => {
    setIsClient(true)
    loadStaff()
  }, [])

  const loadStaff = () => {
    try {
      const data = dataStore.getCoachingStaff()
      setStaff(data)
    } catch (err) {
      console.log('[v0] Failed to load staff')
    }
  }

  const handleAdd = () => {
    if (formData.name) {
      const newMember = dataStore.addCoachingStaff(formData)
      setStaff([...staff, newMember])
      setFormData({ name: '', role: 'head-coach', experience: 0, specialization: '', joinDate: new Date().toISOString().split('T')[0], isActive: true })
    }
  }

  const handleDelete = (id: string) => {
    dataStore.deleteCoachingStaff(id)
    setStaff(staff.filter(s => s.id !== id))
  }

  if (!isClient) return null

  return (
    <div className='space-y-6 p-6'>
      <h1 className='font-[var(--font-display)] text-3xl tracking-wider'>{isBn ? 'প্রশিক্ষক' : 'Coaching Staff'}</h1>
      
      <div className='rounded-lg border-2 border-secondary bg-card p-6 space-y-4'>
        <input type='text' placeholder={isBn ? 'নাম' : 'Name'} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value as any})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary'><option value='head-coach'>Head Coach</option><option value='assistant'>Assistant</option><option value='goalkeeper-coach'>Goalkeeper Coach</option><option value='fitness-coach'>Fitness Coach</option><option value='medical-staff'>Medical Staff</option></select>
        <input type='number' placeholder={isBn ? 'অভিজ্ঞতা (বছর)' : 'Experience (years)'} value={formData.experience} onChange={(e) => setFormData({...formData, experience: parseInt(e.target.value)})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='text' placeholder={isBn ? 'বিশেষত্ব' : 'Specialization'} value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='date' value={formData.joinDate} onChange={(e) => setFormData({...formData, joinDate: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <button onClick={handleAdd} className='bg-accent text-white px-4 py-2 rounded flex items-center gap-2 w-full justify-center'><Plus className='w-4 h-4' />{isBn ? 'যোগ করুন' : 'Add'}</button>
      </div>

      <div className='space-y-2'>
        {staff.map(member => (
          <div key={member.id} className='flex items-center justify-between bg-secondary p-4 rounded-lg'>
            <div><p className='font-semibold'>{member.name}</p><p className='text-xs text-muted-foreground'>{member.role} - {member.experience}y exp</p></div>
            <button onClick={() => handleDelete(member.id)} className='p-2 hover:bg-red-500/20 rounded text-red-400'><Trash2 className='w-4 h-4' /></button>
          </div>
        ))}
      </div>
    </div>
  )
}
