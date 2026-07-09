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

// Create supabase client outside component to prevent recreating
let supabaseClient: any = null

function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient()
  }
  return supabaseClient
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isConfigured] = useState(() => isSupabaseConfigured())

  // Check if admin is logged in on mount
  useEffect(() => {
    let isMounted = true
    let subscription: any = null
    
    const initializeAuth = async () => {
      try {
        // If Supabase is not configured, mark as initialized immediately
        if (!isConfigured) {
          if (isMounted) {
            setIsInitialized(true)
          }
          return
        }

        const supabase = getSupabaseClient()
        
        // Mark as initialized immediately to prevent timeout warnings
        if (isMounted) {
          setIsInitialized(true)
        }
        
        // Set up auth state change listener (non-blocking)
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
                setAdmin(null)
              }
            } else {
              setAdmin(null)
            }
          }
        )

        subscription = authSubscription
        
        // Check for existing session (fire and forget - don't block on this)
        supabase.auth.getSession().then(({ data }) => {
          if (!isMounted) return
          
          if (data.session?.user) {
            const userRole = (data.session.user.user_metadata?.role as "admin" | "moderator") || "user"
            
            if (userRole === "admin" || userRole === "moderator") {
              const user: AuthUser = {
                id: data.session.user.id,
                email: data.session.user.email || "",
                name: data.session.user.user_metadata?.full_name || "User",
                role: userRole,
                emailVerified: data.session.user.email_confirmed_at ? true : false,
              }
              setAdmin(user)
            } else {
              setAdmin(null)
            }
          }
        }).catch(() => {
          // Silently ignore session check errors
        })
      } catch (err) {
        // Handle initialization error silently
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
  }, [isConfigured])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const user = await signInWithEmail(email, password)
      
      // Check if user has admin role
      if (user.role !== "admin" && user.role !== "moderator") {
        await signOut()
        throw new Error("Your account does not have admin access. Contact the administrator to grant access.")
      }

      // Immediately set admin state
      setAdmin(user)
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
