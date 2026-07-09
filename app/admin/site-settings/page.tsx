'use client'

import { useState, useEffect } from 'react'
import { useAdmin } from '@/lib/admin-context'
import { useLanguage } from '@/lib/language-context'
import { dataStore, SiteSettings } from '@/lib/data-store'
import { Save, AlertCircle, Settings } from 'lucide-react'

export default function AdminSiteSettingsPage() {
  const { admin } = useAdmin()
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [isClient, setIsClient] = useState(false)
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setIsClient(true)
    loadSettings()
  }, [])

  const loadSettings = () => {
    try {
      const current = dataStore.getSiteSettings()
      setSettings(current || {
        id: '1',
        siteName: 'Titan Force FC',
        siteDescription: 'Elite Football Club',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    } catch (err) {
      setError('Failed to load settings')
    }
  }

  const handleChange = (field: keyof SiteSettings, value: any) => {
    if (settings) {
      setSettings({ ...settings, [field]: value })
    }
  }

  const handleSave = () => {
    if (!admin || admin.role !== 'admin') {
      setError('Only admins can save')
      return
    }

    if (!settings) {
      setError('No settings to save')
      return
    }

    try {
      dataStore.updateSiteSettings(settings)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError('Failed to save settings')
    }
  }

  if (!isClient) return null

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Settings className="w-8 h-8 text-accent" />
          {isBn ? 'সাইট সেটিংস' : 'Site Settings'}
        </h1>
        <p className="text-foreground/60">{isBn ? 'ওয়েবসাইট কনফিগারেশন পরিচালনা করুন' : 'Manage website configuration'}</p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-3 text-red-200">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-green-200">
          {isBn ? 'সেটিংস সফলভাবে সংরক্ষিত হয়েছে' : 'Settings saved successfully'}
        </div>
      )}

      {settings && (
        <div className="bg-card border-2 border-secondary rounded-lg p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">{isBn ? 'সাইট নাম' : 'Site Name'}</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
                className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{isBn ? 'প্রধান ইমেইল' : 'Contact Email'}</label>
              <input
                type="email"
                value={settings.contactEmail || ''}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">{isBn ? 'বর্ণনা' : 'Description'}</label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => handleChange('siteDescription', e.target.value)}
              className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent h-20 resize-none"
            />
          </div>

          {/* Contact Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">{isBn ? 'ফোন' : 'Phone'}</label>
              <input
                type="tel"
                value={settings.contactPhone || ''}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{isBn ? 'ঠিকানা' : 'Address'}</label>
              <input
                type="text"
                value={settings.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Colors */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">{isBn ? 'প্রধান রঙ' : 'Primary Color'}</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.primaryColor || '#d91e3f'}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.primaryColor || '#d91e3f'}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="flex-1 bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{isBn ? 'গৌণ রঙ' : 'Secondary Color'}</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.secondaryColor || '#1a1a1a'}
                  onChange={(e) => handleChange('secondaryColor', e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.secondaryColor || '#1a1a1a'}
                  onChange={(e) => handleChange('secondaryColor', e.target.value)}
                  className="flex-1 bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">{isBn ? 'সময় অঞ্চল' : 'Timezone'}</label>
              <input
                type="text"
                value={settings.timezone || 'UTC'}
                onChange={(e) => handleChange('timezone', e.target.value)}
                className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent"
                placeholder="UTC"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{isBn ? 'মুদ্রা' : 'Currency'}</label>
              <input
                type="text"
                value={settings.currency || 'BDT'}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent"
                placeholder="BDT"
              />
            </div>
          </div>

          {/* Maintenance Mode */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenanceMode || false}
                onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                className="w-4 h-4 accent-accent"
              />
              <span className="text-sm font-medium">{isBn ? 'রক্ষণাবেক্ষণ মোড' : 'Maintenance Mode'}</span>
            </label>
          </div>

          {/* Save Button */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <Save className="w-4 h-4" />
              {isBn ? 'সংরক্ষণ করুন' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
