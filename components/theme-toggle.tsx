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
        <div className="neo-panel absolute right-0 mt-2 w-full md:w-40 overflow-hidden z-50">
          <button
            onClick={() => {
              setTheme('light')
              setShowMenu(false)
            }}
            className={`neo-soft w-full px-4 py-2 flex items-center gap-2 text-left transition-all ${
              theme === 'light'
                ? 'neo-btn-primary'
                : 'hover:bg-primary/5 text-foreground'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span className="text-sm">Light</span>
            {theme === 'light' && <span className="ml-auto text-xs">✓</span>}
          </button>

          <button
            onClick={() => {
              setTheme('dark')
              setShowMenu(false)
            }}
            className={`neo-soft w-full px-4 py-2 flex items-center gap-2 text-left transition-all ${
              theme === 'dark'
                ? 'neo-btn-primary'
                : 'hover:bg-primary/5 text-foreground'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span className="text-sm">Dark</span>
            {theme === 'dark' && <span className="ml-auto text-xs">✓</span>}
          </button>

          <button
            onClick={() => {
              setTheme('system')
              setShowMenu(false)
            }}
            className={`neo-soft w-full px-4 py-2 flex items-center gap-2 text-left transition-all ${
              theme === 'system'
                ? 'neo-btn-primary'
                : 'hover:bg-primary/5 text-foreground'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span className="text-sm">System</span>
            {theme === 'system' && <span className="ml-auto text-xs">✓</span>}
          </button>
        </div>
      )}
    </div>
  )
}
