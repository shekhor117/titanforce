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
    setThemeState(initialTheme)
    
    if (initialTheme === "light") {
      document.documentElement.classList.remove("dark")
      setIsDark(false)
    } else if (initialTheme === "dark") {
      document.documentElement.classList.add("dark")
      setIsDark(true)
    }
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem("titanforce_theme", newTheme)
    
    if (newTheme === "light") {
      document.documentElement.classList.remove("dark")
      setIsDark(false)
    } else if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
      setIsDark(true)
    }
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
