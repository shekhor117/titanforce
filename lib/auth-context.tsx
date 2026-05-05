"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

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

  const fetchProfile = async (userId: string) => {
    const supabase = createClient()
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
    const initAuth = async () => {
      // First check Supabase auth
      const supabase = createClient()
      
      if (!supabase) {
        // Supabase not configured - use localStorage fallback only
        const savedUser = localStorage.getItem("titanforce_user")
        if (savedUser) {
          try {
            const parsed = JSON.parse(savedUser)
            setUser(parsed)
            setProfile({
              id: parsed.id,
              email: parsed.email,
              name: parsed.name,
              role: parsed.role,
              status: "approved",
            })
          } catch (error) {
            localStorage.removeItem("titanforce_user")
          }
        }
        setIsLoading(false)
        return
      }
      
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        const supabaseUser = session.user
        const newUser: User = {
          id: supabaseUser.id,
          name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email?.split("@")[0] || "User",
          email: supabaseUser.email || "",
          role: null,
          avatar: supabaseUser.user_metadata?.avatar_url,
        }
        setUser(newUser)
        await fetchProfile(supabaseUser.id)
      } else {
        // Fallback to localStorage for demo
        const savedUser = localStorage.getItem("titanforce_user")
        if (savedUser) {
          try {
            const parsed = JSON.parse(savedUser)
            setUser(parsed)
            setProfile({
              id: parsed.id,
              email: parsed.email,
              name: parsed.name,
              role: parsed.role,
              status: "approved",
            })
          } catch (error) {
            localStorage.removeItem("titanforce_user")
          }
        }
      }
      setIsLoading(false)
    }

    initAuth()

    // Listen for auth changes
    const supabase = createClient()
    if (!supabase) return
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const supabaseUser = session.user
        const newUser: User = {
          id: supabaseUser.id,
          name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email?.split("@")[0] || "User",
          email: supabaseUser.email || "",
          role: null,
          avatar: supabaseUser.user_metadata?.avatar_url,
        }
        setUser(newUser)
        await fetchProfile(supabaseUser.id)
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      if (!supabase) {
        // Supabase not configured - use localStorage demo
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: email.split("@")[0],
          email,
          role,
        }
        setUser(newUser)
        setProfile({
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role,
          status: "approved",
        })
        localStorage.setItem("titanforce_user", JSON.stringify(newUser))
        return
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // Fallback to localStorage demo
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: email.split("@")[0],
          email,
          role,
        }
        setUser(newUser)
        setProfile({
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role,
          status: "approved",
        })
        localStorage.setItem("titanforce_user", JSON.stringify(newUser))
      } else if (data.user) {
        await fetchProfile(data.user.id)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      if (!supabase) {
        // Supabase not configured - use localStorage demo
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name,
          email,
          role,
        }
        setUser(newUser)
        setProfile({
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role,
          status: role === "fan" ? "approved" : "pending",
        })
        localStorage.setItem("titanforce_user", JSON.stringify(newUser))
        return
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      })

      if (error) {
        // Fallback to localStorage demo
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name,
          email,
          role,
        }
        setUser(newUser)
        setProfile({
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role,
          status: role === "fan" ? "approved" : "pending",
        })
        localStorage.setItem("titanforce_user", JSON.stringify(newUser))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    const supabase = createClient()
    if (supabase) {
      await supabase.auth.signOut()
    }
    setUser(null)
    setProfile(null)
    localStorage.removeItem("titanforce_user")
  }

  const updatePlayerProfile = async (playerProfile: PlayerProfile) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      if (user) {
        const updatedUser: User = {
          ...user,
          playerProfile,
        }
        setUser(updatedUser)
        localStorage.setItem("titanforce_user", JSON.stringify(updatedUser))
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
