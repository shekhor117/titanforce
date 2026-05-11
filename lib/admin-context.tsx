"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { signInWithEmail, signOut, AuthUser } from "@/lib/auth-utils"
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
      // Fast path: Check localStorage first (instant)
      const stored = localStorage.getItem("titanforce_admin")
      if (stored && isMounted) {
        try {
          const userData = JSON.parse(stored)
          setAdmin(userData)
          setIsInitialized(true)
          return
        } catch {
          localStorage.removeItem("titanforce_admin")
        }
      }
      
      // Mark as initialized immediately (don't wait for Supabase)
      if (isMounted) setIsInitialized(true)
      
      // Background: Verify with Supabase if available
      try {
        const supabase = createClient()
        
        if (!supabase) {
          return
        }

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
        console.error("Error verifying auth:", err)
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
        // Demo mode: accept any email with password length >= 6
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters")
        }

        const demoUser: AuthUser = {
          id: `demo-admin-${Date.now()}`,
          email: email,
          name: email.split("@")[0] || "Admin",
          role: "admin",
          emailVerified: true,
        }

        setAdmin(demoUser)
        localStorage.setItem("titanforce_admin", JSON.stringify(demoUser))
        setIsLoading(false)
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
      setIsLoading(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed"
      setError(message)
      setIsLoading(false)
      throw err
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
