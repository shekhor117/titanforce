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

async function hasDualAdminAccess(supabase: any, user: { id: string; user_metadata?: Record<string, unknown> }) {
  const metadataRole = user.user_metadata?.role
  if (metadataRole !== "admin" && metadataRole !== "moderator") return false

  const { data, error } = await supabase
    .from("app_users")
    .select("role, is_active")
    .eq("id", user.id)
    .maybeSingle()

  if (error) {
    console.warn("[v0] Admin role lookup failed:", error.message)
    return false
  }

  return Boolean(
    data?.is_active !== false &&
    (data?.role === "admin" || data?.role === "moderator")
  )
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
        
        // Set up auth state change listener first (non-blocking)
        const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
          async (_event, session) => {
            if (!isMounted) return
            
            if (session?.user) {
              const userRole = (session.user.user_metadata?.role as "admin" | "moderator") || "user"
              
              if (await hasDualAdminAccess(supabase, session.user)) {
                const user: AuthUser = {
                  id: session.user.id,
                  email: session.user.email || "",
                  name: session.user.user_metadata?.full_name || "User",
                  role: userRole,
                  emailVerified: session.user.email_confirmed_at ? true : false,
                }
                setAdmin(user)
                // Clear any errors when session becomes valid
                setError(null)
              } else {
                setAdmin(null)
              }
            } else {
              setAdmin(null)
            }
            // Reset loading state when auth state changes
            setIsLoading(false)
          }
        )

        subscription = authSubscription
        
        // Check for existing session with timeout protection
        try {
          const { data, error } = await Promise.race([
            supabase.auth.getSession(),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Session check timeout')), 5000)
            )
          ]) as any
          
          if (error) throw error
          
          if (data?.session?.user) {
            const userRole = (data.session.user.user_metadata?.role as "admin" | "moderator") || "user"
            
            if (await hasDualAdminAccess(supabase, data.session.user)) {
              const user: AuthUser = {
                id: data.session.user.id,
                email: data.session.user.email || "",
                name: data.session.user.user_metadata?.full_name || "User",
                role: userRole,
                emailVerified: data.session.user.email_confirmed_at ? true : false,
              }
              if (isMounted) setAdmin(user)
            } else {
              if (isMounted) setAdmin(null)
            }
          }
        } catch (sessionError) {
          // Session check failed or timed out, continue anyway
          // The auth state change listener will catch real sessions
          if (isMounted) {
            console.debug('[v0] Session check error (non-fatal):', sessionError)
          }
        }
        
        // Mark as initialized after session check completes or times out
        if (isMounted) {
          setIsInitialized(true)
        }
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
      
      // Require both Supabase app metadata and app_users authorization.
      const supabase = getSupabaseClient()
      const hasAccess = supabase ? await hasDualAdminAccess(supabase, { id: user.id, user_metadata: { role: user.role } }) : false
      if (!hasAccess) {
        setIsLoading(false)
        await signOut()
        throw new Error("Your account does not have admin access. Contact the administrator to grant access.")
      }

      // Immediately set admin state and keep loading true for smooth redirect
      setAdmin(user)
      // Keep loading true so UI shows consistent loading state during redirect
      // It will be reset when context subscription updates
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
