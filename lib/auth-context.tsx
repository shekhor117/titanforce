"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"

export type UserRole = "player" | "fan" | "partner" | null
export type UserStatus = "pending" | "approved" | "rejected"

interface PlayerProfile {
  phone?: string
  age?: string
  position?: string
  jersey?: string
  height?: string
  weight?: string
  foot?: string
  address?: string
  experience?: string
  photoUrl?: string
}

interface Profile {
  id: string
  email: string
  name: string
  role: UserRole
  status: UserStatus
  avatar_url?: string
  created_at?: string
}

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  playerProfile?: PlayerProfile
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  login: (email: string, password: string, role: UserRole) => Promise<void>
  logout: () => void
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>
  updatePlayerProfile: (profile: PlayerProfile) => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  const fetchProfile = async (userId: string) => {
    if (!supabase) return null
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()
    
    if (data) {
      setProfile(data as Profile)
    }
    return data
  }

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id)
    }
  }

  useEffect(() => {
    // If Supabase is not configured, skip auth initialization
    if (!supabase) {
      setIsLoading(false)
      return
    }

    let subscription: { unsubscribe: () => void } | null = null
    let isMounted = true

    const initAuth = async () => {
      // Set up auth state change listener
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!isMounted) return
        
        if (event === "SIGNED_IN" && session?.user) {
          const supabaseUser = session.user
          // Fetch profile first to get role
          const profileData = await fetchProfile(supabaseUser.id)
          if (isMounted) {
            const newUser: User = {
              id: supabaseUser.id,
              name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email?.split("@")[0] || "User",
              email: supabaseUser.email || "",
              role: profileData?.role || null,
              avatar: supabaseUser.user_metadata?.avatar_url,
            }
            setUser(newUser)
            setIsLoading(false)
          }
        } else if (event === "SIGNED_OUT") {
          if (isMounted) {
            setUser(null)
            setProfile(null)
            setIsLoading(false)
          }
        }
      })
      subscription = data.subscription
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!isMounted) return
      
      if (session?.user) {
        const supabaseUser = session.user
        // Fetch profile first to get role
        const profileData = await fetchProfile(supabaseUser.id)
        if (isMounted) {
          const newUser: User = {
            id: supabaseUser.id,
            name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email?.split("@")[0] || "User",
            email: supabaseUser.email || "",
            role: profileData?.role || null,
            avatar: supabaseUser.user_metadata?.avatar_url,
          }
          setUser(newUser)
        }
      }
      if (isMounted) setIsLoading(false)
    }

    initAuth()

    return () => {
      isMounted = false
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true)
    try {
      if (!supabase) {
        // Use mock auth when Supabase is not configured
        const { mockSignInWithEmail } = await import("@/lib/mock-auth")
        const mockUser = mockSignInWithEmail(email, password)
        if (!mockUser) {
          throw new Error("Invalid credentials")
        }
        const newUser: User = {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          role: role,
        }
        setUser(newUser)
        return
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw new Error(error.message)
      }
      
      if (data.user) {
        const supabaseUser = data.user
        const newUser: User = {
          id: supabaseUser.id,
          name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email?.split("@")[0] || "User",
          email: supabaseUser.email || "",
          role: role,
          avatar: supabaseUser.user_metadata?.avatar_url,
        }
        setUser(newUser)
        await fetchProfile(data.user.id)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    if (!supabase) {
      throw new Error("Authentication is not configured")
    }
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name, role },
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? 
            `${window.location.origin}/auth/callback?role=${role}`,
        },
      })

      if (error) {
        throw new Error(error.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    setUser(null)
    setProfile(null)
  }

  const updatePlayerProfile = async (playerProfile: PlayerProfile) => {
    if (!supabase) {
      throw new Error("Authentication is not configured")
    }
    setIsLoading(true)
    try {
      if (user) {
        // Update profile in Supabase
        const { error } = await supabase
          .from("players")
          .upsert({
            id: user.id,
            ...playerProfile,
          })
        
        if (error) {
          throw new Error(error.message)
        }

        const updatedUser: User = {
          ...user,
          playerProfile,
        }
        setUser(updatedUser)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, login, logout, signup, updatePlayerProfile, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
