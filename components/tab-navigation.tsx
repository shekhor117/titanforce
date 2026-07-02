'use client'

import { ReactNode } from 'react'

export interface Tab {
  id: string
  label: string
  icon?: ReactNode
  content: ReactNode
}

interface TabNavigationProps {
  tabs: Tab[]
  defaultTabId?: string
  onChange?: (tabId: string) => void
  variant?: 'default' | 'pills' | 'underline'
  isBn?: boolean
}

export function TabNavigation({
  tabs,
  defaultTabId,
  onChange,
  variant = 'default',
  isBn = false,
}: TabNavigationProps) {
  const [activeTab, setActiveTab] = React.useState(defaultTabId || tabs[0]?.id)

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onChange?.(tabId)
  }

  const activeTabData = tabs.find(tab => tab.id === activeTab)

  const tabButtonClasses = {
    default:
      'px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300',
    pills: 'px-3 py-2 sm:px-6 sm:py-2 rounded-full font-semibold text-sm transition-all duration-300',
    underline: 'px-3 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold relative',
  }

  const getTabClasses = (tabId: string) => {
    const isActive = tabId === activeTab
    const baseClasses = tabButtonClasses[variant]

    if (variant === 'underline') {
      return `${baseClasses} ${
        isActive
          ? 'text-primary border-b-2 border-primary'
          : 'text-foreground/60 hover:text-foreground border-b-2 border-transparent'
      }`
    }

    return `${baseClasses} ${
      isActive
        ? 'bg-primary text-primary-foreground shadow-lg'
        : 'bg-secondary/50 text-foreground/80 hover:bg-secondary hover:text-foreground'
    }`
  }

  return (
    <div className="w-full">
      {/* Tab buttons */}
      <div
        className={`flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8 ${
          variant === 'underline' ? 'border-b border-secondary' : ''
        }`}
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`${getTabClasses(tab.id)} flex items-center gap-2`}
          >
            {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
            <span className={isBn ? 'font-[var(--font-bengali)]' : ''}>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="animate-fade-up">{activeTabData?.content}</div>
    </div>
  )
}

import React from 'react'
