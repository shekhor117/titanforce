"use client"

import { useEffect, useState, useRef } from "react"
import { useAdmin } from "@/lib/admin-context"
import { useRouter, usePathname } from "next/navigation"

export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { admin, isInitialized } = useAdmin()
  const router = useRouter()
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hasRedirectedRef = useRef(false)

  // Ensure we're on the client before using router
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || hasRedirectedRef.current) return

    // Check if we're on a public admin page
    const isPublicPage = pathname?.includes("/admin/login") || 
                         pathname?.includes("/admin/signup") || 
                         pathname?.includes("/admin/forgot-password")

    // Only attempt redirect when initialization is complete AND we're not logged in
    if (isInitialized && !admin && !isPublicPage) {
      // Use a small delay to ensure router is fully initialized
      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current)
      
      redirectTimeoutRef.current = setTimeout(() => {
        try {
          hasRedirectedRef.current = true
          router.push("/admin/login")
        } catch (error) {
          console.error("[v0] Failed to redirect:", error)
          hasRedirectedRef.current = false
        }
      }, 0)
    }

    return () => {
      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current)
    }
  }, [isClient, admin, isInitialized, router, pathname])

  // If we have admin data, render immediately
  if (admin) {
    return <>{children}</>
  }

  // During initialization, show minimal loading
  if (!isInitialized && isClient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  // If client-side and initialized but no admin, redirect is happening
  if (isClient && isInitialized && !admin) {
    return null
  }

  // Server-side render: show nothing while hydrating
  return null
}
