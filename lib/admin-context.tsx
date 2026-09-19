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

async function hasDualAdminAccess(
  user: {
    id: string
    app_metadata?: Record<string, unknown>
    user_metadata?: Record<string, unknown>
  },
) {
  // Supabase Auth app_metadata is the single source of truth for admin access.
  // It is server-controlled and cannot be edited by the user from the client.
  const appRole = typeof user.app_metadata?.role === "string"
    ? user.app_metadata.role.trim().toLowerCase()
    : ""

  return ["admin", "super_admin", "moderator"].includes(appRole)
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
          (_event, session) => {
            if (!isMounted) return

            // Do not await Supabase calls inside this callback; Supabase may
            // hold an auth lock while notifying listeners, causing a login
            // request to hang indefinitely.
            void (async () => {
              if (session?.user) {
                const hasAccess = await hasDualAdminAccess(session.user)
                if (!isMounted) return

                if (hasAccess) {
                  const role = (session.user.app_metadata?.role as "admin" | "moderator" | "super_admin") || "admin"
                  setAdmin({
                    id: session.user.id,
                    email: session.user.email || "",
                    name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User",
                    role,
                    emailVerified: Boolean(session.user.email_confirmed_at),
                  })
                  setError(null)
                } else {
                  setAdmin(null)
                  setError("Your account does not have admin access.")
                }
              } else {
                setAdmin(null)
              }
              setIsLoading(false)
            })()
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
            if (await hasDualAdminAccess(data.session.user)) {
              const user: AuthUser = {
                id: data.session.user.id,
                email: data.session.user.email || "",
                name: data.session.user.user_metadata?.full_name || data.session.user.email?.split("@")[0] || "User",
                role: (data.session.user.app_metadata?.role as "admin" | "moderator" | "super_admin") || "admin",
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
      const { data: userData } = supabase ? await supabase.auth.getUser() : { data: { user: null } }
      const hasAccess = supabase && userData.user
        ? await hasDualAdminAccess(userData.user)
        : false
      if (!hasAccess) {
        setIsLoading(false)
        await signOut()
        throw new Error("Your account does not have admin access. Contact the administrator to grant access.")
      }

      // Resolve the login promise before navigation so the form cannot remain
      // blocked if the auth event callback is delayed by the network.
      setAdmin({
        ...user,
        role: (userData.user.app_metadata?.role as "admin" | "moderator" | "super_admin") || "admin",
      })
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
