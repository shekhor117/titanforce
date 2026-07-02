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
    let timeoutId: any = null
    
    const initializeAuth = async () => {
      try {
        // If Supabase is not configured, use development demo admin for testing
        if (!isConfigured) {
          if (isMounted) {
            // In development mode, allow demo admin access
            const demoAdmin: AuthUser = {
              id: "demo-admin-dev",
              email: "admin@titanforce.com",
              name: "Demo Admin",
              role: "admin",
              emailVerified: true
            }
            setAdmin(demoAdmin)
            setIsInitialized(true)
          }
          return
        }

        const supabase = getSupabaseClient()
        
        // Safety timeout - if initialization takes more than 5 seconds, mark as initialized anyway
        timeoutId = setTimeout(() => {
          if (isMounted && !isInitialized) {
            console.warn('[v0] Admin initialization timeout - marking as initialized')
            setIsInitialized(true)
          }
        }, 5000)
        
        // Set up auth state change listener first (non-blocking)
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
        
        // Check for existing session (non-blocking) with timeout
        const sessionPromise = supabase.auth.getSession().then(({ data }) => {
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
          
          // Mark as initialized after session check completes
          if (isMounted) {
            setIsInitialized(true)
          }
        })

        // Timeout for session check - if it takes longer than 3 seconds, mark as initialized anyway
        const sessionTimeout = new Promise<void>((resolve) => {
          setTimeout(() => {
            if (isMounted) {
              setIsInitialized(true)
            }
            resolve()
          }, 3000)
        })

        Promise.race([sessionPromise, sessionTimeout]).catch(() => {
          // Even on error, mark as initialized
          if (isMounted) {
            setIsInitialized(true)
          }
        })
      } catch (err) {
        // Handle initialization error silently
        if (isMounted) setIsInitialized(true)
      }
    }

    initializeAuth()
    
    return () => {
      isMounted = false
      if (timeoutId) clearTimeout(timeoutId)
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
