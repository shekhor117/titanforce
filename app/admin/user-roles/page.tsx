'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { dataStore, UserRole } from '@/lib/data-store'
import { Plus, Edit2, Trash2, Save } from 'lucide-react'

export default function UserRolesPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [isClient, setIsClient] = useState(false)
  const [roles, setRoles] = useState<UserRole[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', permissions: [] as string[], description: '', isActive: true })
  const [permissionInput, setPermissionInput] = useState('')

  const allPermissions = ['view_dashboard', 'manage_players', 'manage_matches', 'manage_news', 'manage_gallery', 'manage_users', 'manage_settings', 'view_analytics']

  useEffect(() => {
    setIsClient(true)
    loadRoles()
  }, [])

  const loadRoles = () => {
    try {
      setRoles(dataStore.getUserRoles())
    } catch (err) {
      console.log('[v0] Failed to load roles')
    }
  }

  const handleAdd = () => {
    if (formData.name) {
      const newRole = dataStore.addUserRole(formData)
      setRoles([...roles, newRole])
      setFormData({ name: '', permissions: [], description: '', isActive: true })
    }
  }

  const handleDelete = (id: string) => {
    dataStore.deleteUserRole(id)
    setRoles(roles.filter(r => r.id !== id))
  }

  const handleUpdate = (id: string) => {
    dataStore.updateUserRole(id, formData)
    setRoles(roles.map(r => r.id === id ? { ...r, ...formData } : r))
    setEditingId(null)
    setFormData({ name: '', permissions: [], description: '', isActive: true })
  }

  const togglePermission = (perm: string) => {
    setFormData({
      ...formData,
      permissions: formData.permissions.includes(perm) ? formData.permissions.filter(p => p !== perm) : [...formData.permissions, perm]
    })
  }

  if (!isClient) return null

  return (
    <div className='space-y-6 p-6'>
      <h1 className='font-[var(--font-display)] text-3xl tracking-wider'>{isBn ? 'ব্যবহারকারী ভূমিকা' : 'User Roles'}</h1>
      
      <div className='rounded-lg border-2 border-secondary bg-card p-6 space-y-4'>
        <input type='text' placeholder={isBn ? 'ভূমিকা নাম' : 'Role Name'} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <textarea placeholder={isBn ? 'বর্ণনা' : 'Description'} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary h-20' />
        
        <div className='space-y-2'>
          <p className='text-sm font-semibold'>{isBn ? 'অনুমতি' : 'Permissions'}:</p>
          {allPermissions.map(perm => (
            <label key={perm} className='flex items-center gap-2'><input type='checkbox' checked={formData.permissions.includes(perm)} onChange={() => togglePermission(perm)} />{perm.replace(/_/g, ' ')}</label>
          ))}
        </div>
        
        <label className='flex items-center gap-2'><input type='checkbox' checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} />{isBn ? 'সক্রিয়' : 'Active'}</label>
        <button onClick={editingId ? () => handleUpdate(editingId) : handleAdd} className='bg-accent text-white px-4 py-2 rounded w-full'>{isBn ? 'সংরক্ষণ করুন' : 'Save'}</button>
      </div>

      <div className='space-y-2'>
        {roles.map(role => (
          <div key={role.id} className='flex items-center justify-between bg-secondary p-4 rounded-lg'>
            <div><p className='font-semibold'>{role.name}</p><p className='text-xs text-muted-foreground'>{role.permissions.length} permissions</p></div>
            <div className='flex gap-2'>
              <button onClick={() => {setEditingId(role.id); setFormData({name: role.name, permissions: role.permissions, description: role.description || '', isActive: role.isActive})}} className='p-2 hover:bg-accent/20 rounded'><Edit2 className='w-4 h-4' /></button>
              <button onClick={() => handleDelete(role.id)} className='p-2 hover:bg-red-500/20 rounded text-red-400'><Trash2 className='w-4 h-4' /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
