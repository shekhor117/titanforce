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
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 rounded-lg border border-primary/30 hover:bg-primary/10 transition-colors duration-300"
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
        <div className="absolute right-0 mt-2 w-40 bg-card border border-primary/30 rounded-lg shadow-lg overflow-hidden z-50">
          <button
            onClick={() => {
              setTheme('light')
              setShowMenu(false)
            }}
            className={`w-full px-4 py-2 flex items-center gap-2 transition-colors text-left ${
              theme === 'light'
                ? 'bg-primary/20 text-primary'
                : 'hover:bg-primary/10 text-foreground'
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
            className={`w-full px-4 py-2 flex items-center gap-2 transition-colors text-left ${
              theme === 'dark'
                ? 'bg-primary/20 text-primary'
                : 'hover:bg-primary/10 text-foreground'
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
            className={`w-full px-4 py-2 flex items-center gap-2 transition-colors text-left ${
              theme === 'system'
                ? 'bg-primary/20 text-primary'
                : 'hover:bg-primary/10 text-foreground'
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
