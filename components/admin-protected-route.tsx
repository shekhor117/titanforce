"use client"

import { useEffect, useState } from "react"
import { useAdmin } from "@/lib/admin-context"
import { useRouter, usePathname } from "next/navigation"

export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { admin, isInitialized } = useAdmin()
  const router = useRouter()
  const pathname = usePathname()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [hasTimedOut, setHasTimedOut] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client before using router
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Timeout for initialization - if it takes more than 10 seconds, assume not authenticated
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasTimedOut(true)
    }, 10000)
    
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isClient) return

    // Check if we're on a public admin page
    const isPublicPage = pathname?.includes("/admin-login") || 
                         pathname?.includes("/admin/signup") || 
                         pathname?.includes("/admin/forgot-password")

    // If initialization is complete, immediately proceed with redirect logic
    if (isInitialized) {
      if (!admin && !isRedirecting && !isPublicPage) {
        setIsRedirecting(true)
        router.push("/admin-login")
      }
      return
    }

    // Only redirect on timeout if still not initialized
    if (hasTimedOut && !admin && !isRedirecting && !isPublicPage) {
      setIsRedirecting(true)
      router.push("/admin-login")
    }
  }, [isClient, admin, isInitialized, hasTimedOut, isRedirecting, router, pathname])

  // If we have admin data, render immediately
  if (admin) {
    return <>{children}</>
  }

  // Show loading state while initializing
  if (!isInitialized && !hasTimedOut) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-foreground/60">Loading...</p>
        </div>
      </div>
    )
  }

  // If initialized/timed out but no admin, show nothing (redirect is happening)
  return null
}
