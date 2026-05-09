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
      console.log("[v0] AdminContext: Starting initialization")
      
      // Check localStorage for stored admin data
      const stored = localStorage.getItem("titanforce_admin")
      console.log("[v0] AdminContext: localStorage stored =", stored ? "found" : "not found")
      
      if (stored && isMounted) {
        try {
          const userData = JSON.parse(stored)
          console.log("[v0] AdminContext: Setting admin from localStorage:", userData.email)
          setAdmin(userData)
        } catch {
          console.log("[v0] AdminContext: Failed to parse localStorage")
          localStorage.removeItem("titanforce_admin")
        }
      }
      
      try {
        const supabase = createClient()
        console.log("[v0] AdminContext: Supabase =", supabase ? "available" : "null (demo mode)")
        
        if (!supabase) {
          // No Supabase - already handled localStorage above
          console.log("[v0] AdminContext: Setting isInitialized=true (demo mode)")
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
        console.error("Error initializing auth:", err)
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
    console.log("[v0] AdminContext: login() called with email:", email)
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      
      if (!supabase) {
        console.log("[v0] AdminContext: Demo mode login")
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

        console.log("[v0] AdminContext: Setting admin and localStorage")
        setAdmin(demoUser)
        const userJson = JSON.stringify(demoUser)
        localStorage.setItem("titanforce_admin", userJson)
        // Verify localStorage was written
        const verifyStored = localStorage.getItem("titanforce_admin")
        console.log("[v0] AdminContext: Login successful, localStorage verified =", verifyStored ? "yes" : "NO")
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
