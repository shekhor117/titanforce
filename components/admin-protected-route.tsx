"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAdmin } from "@/lib/admin-context"

export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { admin, isInitialized } = useAdmin()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // Only redirect if fully initialized and no admin
    if (isInitialized && !admin && !isRedirecting) {
      setIsRedirecting(true)
      router.push("/admin/login")
    }
  }, [admin, isInitialized, isRedirecting, router])

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
