'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { dataStore, EmailTemplate } from '@/lib/data-store'
import { Plus, Edit2, Trash2, Save } from 'lucide-react'

export default function EmailTemplatesPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [isClient, setIsClient] = useState(false)
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', subject: '', templateBody: '', templateType: 'welcome' as const, isActive: true, variables: [] })

  useEffect(() => {
    setIsClient(true)
    loadTemplates()
  }, [])

  const loadTemplates = () => {
    try {
      setTemplates(dataStore.getEmailTemplates())
    } catch (err) {
      console.log('[v0] Failed to load templates')
    }
  }

  const handleAdd = () => {
    if (formData.name && formData.subject) {
      const newTemplate = dataStore.addEmailTemplate(formData)
      setTemplates([...templates, newTemplate])
      setFormData({ name: '', subject: '', templateBody: '', templateType: 'welcome', isActive: true, variables: [] })
    }
  }

  const handleDelete = (id: string) => {
    dataStore.deleteEmailTemplate(id)
    setTemplates(templates.filter(t => t.id !== id))
  }

  const handleUpdate = (id: string) => {
    dataStore.updateEmailTemplate(id, formData)
    setTemplates(templates.map(t => t.id === id ? { ...t, ...formData } : t))
    setEditingId(null)
    setFormData({ name: '', subject: '', templateBody: '', templateType: 'welcome', isActive: true, variables: [] })
  }

  if (!isClient) return null

  return (
    <div className='space-y-6 p-6'>
      <h1 className='font-[var(--font-display)] text-3xl tracking-wider'>{isBn ? 'ইমেইল টেমপ্লেট' : 'Email Templates'}</h1>
      
      <div className='rounded-lg border-2 border-secondary bg-card p-6 space-y-4'>
        <input type='text' placeholder={isBn ? 'নাম' : 'Name'} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='text' placeholder={isBn ? 'বিষয়' : 'Subject'} value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <select value={formData.templateType} onChange={(e) => setFormData({...formData, templateType: e.target.value as any})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary'>
          <option value='welcome'>Welcome</option>
          <option value='newsletter'>Newsletter</option>
          <option value='notification'>Notification</option>
          <option value='alert'>Alert</option>
          <option value='confirmation'>Confirmation</option>
        </select>
        <textarea placeholder={isBn ? 'টেমপ্লেট বডি' : 'Template Body'} value={formData.templateBody} onChange={(e) => setFormData({...formData, templateBody: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary h-24' />
        <label className='flex items-center gap-2'><input type='checkbox' checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} />{isBn ? 'সক্রিয়' : 'Active'}</label>
        <button onClick={editingId ? () => handleUpdate(editingId) : handleAdd} className='bg-accent text-white px-4 py-2 rounded w-full'>{isBn ? 'সংরক্ষণ করুন' : 'Save'}</button>
      </div>

      <div className='space-y-2'>
        {templates.map(template => (
          <div key={template.id} className='flex items-center justify-between bg-secondary p-4 rounded-lg'>
            <div><p className='font-semibold'>{template.name}</p><p className='text-xs text-muted-foreground'>{template.templateType}</p></div>
            <div className='flex gap-2'>
              <button onClick={() => {setEditingId(template.id); setFormData({name: template.name, subject: template.subject, templateBody: template.templateBody, templateType: template.templateType, isActive: template.isActive, variables: template.variables || []})}} className='p-2 hover:bg-accent/20 rounded'><Edit2 className='w-4 h-4' /></button>
              <button onClick={() => handleDelete(template.id)} className='p-2 hover:bg-red-500/20 rounded text-red-400'><Trash2 className='w-4 h-4' /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
