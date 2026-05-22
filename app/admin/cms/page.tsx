'use client'

import React, { useState } from 'react'
import CMSPagesManager from '@/components/CMSPagesManager'
import CMSMediaLibrary from '@/components/CMSMediaLibrary'
import CMSSEOManager from '@/components/CMSSEOManager'
import { Button } from '@/components/ui/button'
import { FileText, Image, Search } from 'lucide-react'

export default function CMSAdminPage() {
  const [activeTab, setActiveTab] = useState<'pages' | 'media' | 'seo'>('pages')

  const tabs = [
    { id: 'pages', label: 'Pages', icon: FileText },
    { id: 'media', label: 'Media Library', icon: Image },
    { id: 'seo', label: 'SEO Settings', icon: Search },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Content Management System</h1>
        <p className="text-slate-600 mt-2">
          Manage your website content, media, and SEO settings
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                isActive
                  ? 'border-b-2 border-red-500 text-red-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg">
        {activeTab === 'pages' && <CMSPagesManager />}
        {activeTab === 'media' && <CMSMediaLibrary />}
        {activeTab === 'seo' && <CMSSEOManager />}
      </div>
    </div>
  )
}
