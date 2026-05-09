"use client"

import { useEffect, useState } from "react"
import { useAdmin } from "@/lib/admin-context"

export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { admin, isInitialized } = useAdmin()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // Only redirect if fully initialized and no admin
    if (isInitialized && !admin && !isRedirecting) {
      setIsRedirecting(true)
      // Use window.location for a full page reload to ensure clean state
      window.location.href = "/admin/login"
    }
  }, [admin, isInitialized, isRedirecting])

  // If we have admin data (from localStorage), render immediately
  if (admin) {
    return <>{children}</>
  }

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-foreground/60">Loading...</p>
        </div>
      </div>
    )
  }

  // If initialized but no admin, show nothing (redirect is happening)
  return null
}
