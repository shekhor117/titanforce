"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { signInWithEmail, signOut, getCurrentUser, AuthUser } from "@/lib/auth-utils"
import { createClient } from "@/lib/supabase/client"

interface AdminContextType {
  admin: AuthUser | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
  error: string | null
  isInitialized: boolean
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Check if admin is logged in on mount
  useEffect(() => {
    let isMounted = true
    
    const initializeAuth = async () => {
      // First, immediately check localStorage for faster hydration
      const stored = localStorage.getItem("titanforce_admin")
      
      if (stored && isMounted) {
        try {
          const userData = JSON.parse(stored)
          setAdmin(userData)
        } catch (err) {
          localStorage.removeItem("titanforce_admin")
        }
      }
      
      try {
        const supabase = createClient()
        
        if (!supabase) {
          // No Supabase - already handled localStorage above
          if (isMounted) setIsInitialized(true)
          return
        }

        // Get current user from Supabase session
        const { data } = await supabase.auth.getSession()
        if (data.session?.user && isMounted) {
          const user: AuthUser = {
            id: data.session.user.id,
            email: data.session.user.email || "",
            name: data.session.user.user_metadata?.full_name || "User",
            role: (data.session.user.user_metadata?.role as "admin" | "moderator") || "user",
            emailVerified: data.session.user.email_confirmed_at ? true : false,
          }
          setAdmin(user)
          localStorage.setItem("titanforce_admin", JSON.stringify(user))
        }
      } catch (err) {
        console.error("[v0] Error initializing auth:", err)
        // localStorage fallback already handled above
      } finally {
        if (isMounted) setIsInitialized(true)
      }
    }

    initializeAuth()
    
    return () => {
      isMounted = false
    }
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      
      if (!supabase) {
        // Fallback: hardcoded demo credentials for development
        const ADMIN_EMAIL = "admin@titanforce.com"
        const ADMIN_PASSWORD = "admin123456"

        if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
          throw new Error("Invalid credentials. Use demo: admin@titanforce.com / admin123456")
        }

        const demoUser: AuthUser = {
          id: "demo-admin-1",
          email: email,
          name: "Admin",
          role: "admin",
          emailVerified: true,
        }

        setAdmin(demoUser)
        localStorage.setItem("titanforce_admin", JSON.stringify(demoUser))
        return
      }

      // Use Supabase authentication
      const user = await signInWithEmail(email, password)
      
      // Check if user has admin role
      if (user.role !== "admin" && user.role !== "moderator") {
        await signOut()
        throw new Error("User account does not have admin access")
      }

      setAdmin(user)
      localStorage.setItem("titanforce_admin", JSON.stringify(user))
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed"
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      if (supabase) {
        await signOut()
      }
      setAdmin(null)
      localStorage.removeItem("titanforce_admin")
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Logout failed"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminContext.Provider value={{ admin, login, logout, isLoading, error, isInitialized }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider")
  }
  return context
}
