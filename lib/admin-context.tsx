import React, { createContext, useContext, useState, ReactNode, useEffect } from "react"

interface AdminUser {
  id: string
  email: string
  name: string
  role: "admin"
}

interface AdminContextType {
  admin: AdminUser | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  error: string | null
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if admin is logged in on mount
  useEffect(() => {
    const stored = localStorage.getItem("titanforce_admin")
    if (stored) {
      setAdmin(JSON.parse(stored))
    }
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Hardcoded admin credentials (in production, this would be a real API call)
      const ADMIN_EMAIL = "admin@titanforce.com"
      const ADMIN_PASSWORD = "admin123456"

      if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
        throw new Error("Invalid admin credentials")
      }

      const adminUser: AdminUser = {
        id: "admin-1",
        email: email,
        name: "Admin",
        role: "admin",
      }

      setAdmin(adminUser)
      localStorage.setItem("titanforce_admin", JSON.stringify(adminUser))
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed"
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setAdmin(null)
    localStorage.removeItem("titanforce_admin")
  }

  return (
    <AdminContext.Provider value={{ admin, login, logout, isLoading, error }}>
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
