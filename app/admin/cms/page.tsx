'use client'

import { useState } from 'react'
import { ArticleManager } from '@/components/cms/article-manager'
import { PageManager } from '@/components/cms/page-manager'
import { EventManager } from '@/components/cms/event-manager'
import { FileText, BookOpen, Calendar } from 'lucide-react'

type TabType = 'articles' | 'pages' | 'events'

export default function CMSAdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('articles')

  const tabs = [
    {
      id: 'articles' as TabType,
      label: 'Articles & News',
      icon: FileText,
      description: 'Manage blog posts and news articles',
    },
    {
      id: 'pages' as TabType,
      label: 'Pages',
      icon: BookOpen,
      description: 'Manage static pages like About, Rules, etc.',
    },
    {
      id: 'events' as TabType,
      label: 'Events & Matches',
      icon: Calendar,
      description: 'Manage team matches, tournaments, and events',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Content Management System</h1>
        <p className="text-slate-600 mt-2">
          Create, edit, and manage all your website content with rich text editing, image uploads, and scheduling
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title={tab.description}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg p-6">
        {activeTab === 'articles' && <ArticleManager />}
        {activeTab === 'pages' && <PageManager />}
        {activeTab === 'events' && <EventManager />}
      </div>
    </div>
  )
}
