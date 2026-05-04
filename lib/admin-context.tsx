"use client"

import React, { createContext, useContext, ReactNode, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface AdminUser {
  id: string
  email: string
  role: "admin" | "player" | "fan"
}

interface AdminContextType {
  admin: AdminUser | null
  isLoading: boolean
  error: string | null
  isAdmin: boolean
  logout: () => Promise<void>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          // Fetch user profile from Supabase to check role
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("id, email, role")
            .eq("id", user.id)
            .single()

          if (profileError) throw profileError

          if (profile) {
            setAdmin({
              id: profile.id,
              email: profile.email,
              role: profile.role,
            })
          }
        }
      } catch (err) {
        console.error("[v0] Error checking admin:", err)
        setError(err instanceof Error ? err.message : "Failed to check admin status")
      } finally {
        setIsLoading(false)
      }
    }

    checkAdmin()
  }, [])

  const logout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      setAdmin(null)
    } catch (err) {
      console.error("[v0] Error logging out:", err)
      setError(err instanceof Error ? err.message : "Failed to logout")
    }
  }

  return (
    <AdminContext.Provider
      value={{
        admin,
        isLoading,
        error,
        isAdmin: admin?.role === "admin",
        logout,
      }}
    >
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
