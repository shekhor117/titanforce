"use client"

import { useTheme } from "@/lib/theme-context"
import { Moon, Sun, Settings } from "lucide-react"
import { useEffect, useState } from "react"

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

  const themeOptions = [
    { value: "light" as const, label: "Light", icon: Sun },
    { value: "dark" as const, label: "Dark", icon: Moon },
    { value: "system" as const, label: "System", icon: Settings },
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 rounded-lg border border-primary/30 hover:bg-primary/10 transition-colors duration-300"
        aria-label="Toggle theme menu"
        title={`Current theme: ${theme}`}
      >
        {theme === "system" ? (
          <Settings className="w-5 h-5 text-primary" />
        ) : isDark ? (
          <Sun className="w-5 h-5 text-primary" />
        ) : (
          <Moon className="w-5 h-5 text-primary" />
        )}
      </button>
      
      {showMenu && (
        <div className="absolute right-0 mt-2 w-40 bg-card border border-primary/30 rounded-lg shadow-lg overflow-hidden z-50">
          {themeOptions.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => {
                setTheme(value)
                setShowMenu(false)
              }}
              className={`w-full px-4 py-2 flex items-center gap-2 transition-colors ${
                theme === value
                  ? "bg-primary/20 text-primary"
                  : "hover:bg-primary/10 text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{label}</span>
              {theme === value && <span className="ml-auto text-xs">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
