"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

export type Theme = "dark" | "light" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

/**
 * Get the effective theme based on the current setting
 * If theme is "system", it returns the device's preferred theme
 */
function getEffectiveTheme(theme: Theme): "dark" | "light" {
  if (theme === "system") {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }
    return "dark"
  }
  return theme
}

/**
 * Apply theme to the document
 */
function applyTheme(effectiveTheme: "dark" | "light") {
  if (effectiveTheme === "light") {
    document.documentElement.classList.remove("dark")
    document.documentElement.classList.add("light")
  } else {
    document.documentElement.classList.add("dark")
    document.documentElement.classList.remove("light")
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system")
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Load saved theme preference or default to "system"
    const savedTheme = localStorage.getItem("titanforce_theme") as Theme | null
    const initialTheme = savedTheme || "system"
    setThemeState(initialTheme)
    
    // Get effective theme and apply it
    const effectiveTheme = getEffectiveTheme(initialTheme)
    applyTheme(effectiveTheme)
    setIsDark(effectiveTheme === "dark")
  }, [])

  // Listen for system theme changes when theme is set to "system"
  useEffect(() => {
    if (!mounted || theme !== "system") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    
    const handleChange = (e: MediaQueryListEvent) => {
      const newIsDark = e.matches
      setIsDark(newIsDark)
      applyTheme(newIsDark ? "dark" : "light")
    }

    // Support both addEventListener and deprecated addListener for broader compatibility
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange)
    } else {
      mediaQuery.addListener(handleChange)
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange)
      } else {
        mediaQuery.removeListener(handleChange)
      }
    }
  }, [mounted, theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem("titanforce_theme", newTheme)
    
    // Get effective theme and apply it
    const effectiveTheme = getEffectiveTheme(newTheme)
    applyTheme(effectiveTheme)
    setIsDark(effectiveTheme === "dark")
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
