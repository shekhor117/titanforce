"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { signInWithEmail, signOut, AuthUser } from "@/lib/auth-utils"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"

interface AdminContextType {
  admin: AuthUser | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
  error: string | null
  isInitialized: boolean
  isConfigured: boolean
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isConfigured] = useState(() => isSupabaseConfigured())

  const supabase = createClient()

  // Check if admin is logged in on mount
  useEffect(() => {
    let isMounted = true
    let subscription: any = null
    
    // If Supabase is not configured, mark as initialized and return
    if (!supabase) {
      setIsInitialized(true)
      return
    }
    
    const initializeAuth = async () => {
      try {
        // First check for existing session
        const { data } = await supabase.auth.getSession()
        
        if (data.session?.user && isMounted) {
          const userRole = (data.session.user.user_metadata?.role as "admin" | "moderator") || "user"
          
          // Only set admin if user has admin/moderator role
          if (userRole === "admin" || userRole === "moderator") {
            const user: AuthUser = {
              id: data.session.user.id,
              email: data.session.user.email || "",
              name: data.session.user.user_metadata?.full_name || "User",
              role: userRole,
              emailVerified: data.session.user.email_confirmed_at ? true : false,
            }
            setAdmin(user)
          }
        }

        // Set up auth state change listener
        const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
          async (_event, session) => {
            if (!isMounted) return
            
            if (session?.user) {
              const userRole = (session.user.user_metadata?.role as "admin" | "moderator") || "user"
              
              if (userRole === "admin" || userRole === "moderator") {
                const user: AuthUser = {
                  id: session.user.id,
                  email: session.user.email || "",
                  name: session.user.user_metadata?.full_name || "User",
                  role: userRole,
                  emailVerified: session.user.email_confirmed_at ? true : false,
                }
                setAdmin(user)
              } else {
                // User lost admin role
                setAdmin(null)
              }
            } else {
              setAdmin(null)
            }
          }
        )

        subscription = authSubscription
        if (isMounted) setIsInitialized(true)
      } catch (err) {
        console.error("[v0] Error verifying auth:", err)
        if (isMounted) setIsInitialized(true)
      }
    }

    initializeAuth()
    
    return () => {
      isMounted = false
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [supabase])

  const login = async (email: string, password: string) => {
    console.log("[v0] AdminProvider.login() called with email:", email)
    setIsLoading(true)
    setError(null)

    try {
      console.log("[v0] Calling signInWithEmail...")
      // Use Supabase authentication
      const user = await signInWithEmail(email, password)
      
      console.log("[v0] User logged in, role:", user.role)
      
      // Check if user has admin role
      if (user.role !== "admin" && user.role !== "moderator") {
        console.log("[v0] User role is not admin/moderator, signing out")
        await signOut()
        throw new Error("Your account does not have admin access")
      }

      console.log("[v0] Admin login successful")
      setAdmin(user)
      setIsLoading(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed"
      console.log("[v0] Login error:", message)
      setError(message)
      setIsLoading(false)
      throw err
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await signOut()
      setAdmin(null)
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Logout failed"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminContext.Provider value={{ admin, login, logout, isLoading, error, isInitialized, isConfigured }}>
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
