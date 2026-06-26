"use client"

import { useEffect, useState } from "react"
import { useAdmin } from "@/lib/admin-context"
import { useRouter, usePathname } from "next/navigation"

export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { admin, isInitialized } = useAdmin()
  const router = useRouter()
  const pathname = usePathname()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client before using router
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    // Check if we're on a public admin page
    const isPublicPage = pathname?.includes("/admin/login") || 
                         pathname?.includes("/admin/signup") || 
                         pathname?.includes("/admin/forgot-password")

    // If initialization is complete, immediately proceed with redirect logic
    if (isInitialized) {
      if (!admin && !isRedirecting && !isPublicPage) {
        setIsRedirecting(true)
        router.push("/admin/login")
      }
    }
  }, [isClient, admin, isInitialized, isRedirecting, router, pathname])

  // If we have admin data, render immediately
  if (admin) {
    return <>{children}</>
  }

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-foreground/60">Initializing...</p>
        </div>
      </div>
    )
  }

  // If initialized but no admin, show nothing (redirect is happening)
  return null
}
