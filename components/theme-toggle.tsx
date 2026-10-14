'use client'

import { useTheme } from '@/lib/theme-context'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const context = useTheme()
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !context) {
    return null
  }

  const { theme, setTheme, isDark } = context

  return (
    <div className="relative w-full md:w-auto">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="neo-btn w-full md:w-auto p-2 flex items-center justify-center md:justify-start"
        aria-label="Toggle theme menu"
        title={`Current theme: ${theme}`}
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-primary" />
        ) : (
          <Moon className="w-5 h-5 text-primary" />
        )}
      </button>
      
      {showMenu && (
        <div className="neo-panel absolute right-0 mt-2 w-full min-w-40 space-y-2 rounded-2xl p-2 z-50">
          <button
            onClick={() => {
              setTheme('light')
              setShowMenu(false)
            }}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors ${
              theme === 'light'
                ? 'bg-primary text-primary-foreground'
                : 'bg-background text-foreground hover:bg-primary/10 hover:text-primary'
            }`}
          >
            <Sun className="h-4 w-4 shrink-0" />
            <span>Light</span>
            {theme === 'light' && <span className="ml-auto text-xs">✓</span>}
          </button>

          <button
            onClick={() => {
              setTheme('dark')
              setShowMenu(false)
            }}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors ${
              theme === 'dark'
                ? 'bg-primary text-primary-foreground'
                : 'bg-background text-foreground hover:bg-primary/10 hover:text-primary'
            }`}
          >
            <Moon className="h-4 w-4 shrink-0" />
            <span>Dark</span>
            {theme === 'dark' && <span className="ml-auto text-xs">✓</span>}
          </button>

          <button
            onClick={() => {
              setTheme('system')
              setShowMenu(false)
            }}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors ${
              theme === 'system'
                ? 'bg-primary text-primary-foreground'
                : 'bg-background text-foreground hover:bg-primary/10 hover:text-primary'
            }`}
          >
            <Moon className="h-4 w-4 shrink-0" />
            <span>System</span>
            {theme === 'system' && <span className="ml-auto text-xs">✓</span>}
          </button>
        </div>
      )}
    </div>
  )
}
