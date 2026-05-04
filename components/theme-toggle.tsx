"use client"

import { useTheme } from "@/lib/theme-context"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme, isDark } = useTheme()

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
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
