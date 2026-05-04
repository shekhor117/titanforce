"use client"

import { useTheme } from "@/lib/theme-context"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const context = useTheme()
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !context) {
    return null
  }

  const { theme, setTheme, isDark } = context

  const handleToggle = () => {
    console.log("[v0] Theme toggle clicked. Current isDark:", isDark)
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-lg border border-primary/30 hover:bg-primary/10 transition-colors duration-300"
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-primary" />
      ) : (
        <Moon className="w-5 h-5 text-primary" />
      )}
    </button>
  )
}
