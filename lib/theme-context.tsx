"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

export type Theme = "dark" | "light" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark")
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("titanforce_theme") as Theme | null
    const initialTheme = savedTheme || "dark"
    console.log("[v0] Initializing theme. Saved:", savedTheme, "Using:", initialTheme)
    setThemeState(initialTheme)
    
    if (initialTheme === "light") {
      document.documentElement.classList.remove("dark")
      document.documentElement.classList.add("light")
      setIsDark(false)
    } else if (initialTheme === "dark") {
      document.documentElement.classList.add("dark")
      document.documentElement.classList.remove("light")
      setIsDark(true)
    }
  }, [])

  const setTheme = (newTheme: Theme) => {
    console.log("[v0] Setting theme to:", newTheme)
    setThemeState(newTheme)
    localStorage.setItem("titanforce_theme", newTheme)
    
    if (newTheme === "light") {
      document.documentElement.classList.remove("dark")
      document.documentElement.classList.add("light")
      setIsDark(false)
    } else if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
      document.documentElement.classList.remove("light")
      setIsDark(true)
    }
    console.log("[v0] Theme set. isDark:", newTheme === "dark", "Classes:", document.documentElement.className)
  }

  if (!mounted) return <>{children}</>

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  return context || null
}
