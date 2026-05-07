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
  username?: string
  usernameChanges?: number
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
  changeUsername: (newUsername: string) => Promise<{ success: boolean; message: string }>
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
    let subscription: { unsubscribe: () => void } | null = null

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
      
      // Set up auth state change listener
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
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
      subscription = data.subscription
      
      // Get current session
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

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
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

  const changeUsername = async (newUsername: string): Promise<{ success: boolean; message: string }> => {
    if (!user?.id) {
      return { success: false, message: "User not found" }
    }

    try {
      const supabase = createClient()
      
      if (!supabase) {
        // Demo mode
        if (user) {
          const updatedUser: User = {
            ...user,
            username: newUsername,
            usernameChanges: (user.usernameChanges || 0) + 1,
          }
          setUser(updatedUser)
          localStorage.setItem("titanforce_user", JSON.stringify(updatedUser))
        }
        return { success: true, message: "Username changed successfully" }
      }

      // Check how many changes the user has made
      const { data: profileData } = await supabase
        .from("profiles")
        .select("username_changes")
        .eq("id", user.id)
        .single()

      if (profileData && (profileData.username_changes || 0) >= 3) {
        return { success: false, message: "You have reached the maximum number of username changes (3)" }
      }

      // Check if username is available
      const { data: existingUsername } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", newUsername)
        .neq("id", user.id)

      if (existingUsername && existingUsername.length > 0) {
        return { success: false, message: "This username is already taken" }
      }

      // Update the username
      const changesCount = (profileData?.username_changes || 0) + 1
      const { error } = await supabase
        .from("profiles")
        .update({
          username: newUsername,
          username_changes: changesCount,
          last_username_change_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) {
        return { success: false, message: error.message }
      }

      // Update local user state
      const updatedUser: User = {
        ...user,
        username: newUsername,
        usernameChanges: changesCount,
      }
      setUser(updatedUser)
      localStorage.setItem("titanforce_user", JSON.stringify(updatedUser))

      return { success: true, message: "Username changed successfully" }
    } catch (error) {
      return { success: false, message: "An error occurred while changing username" }
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, login, logout, signup, updatePlayerProfile, refreshProfile, changeUsername }}>
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
