"use client"

import { useEffect, useRef } from "react"
import { useAdmin } from "@/lib/admin-context"
import { AdminRouteLoading } from "@/components/admin-loading-skeleton"
import { useRouter, usePathname } from "next/navigation"

export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { admin, isInitialized } = useAdmin()
  const router = useRouter()
  const pathname = usePathname()
  const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasRedirectedRef = useRef(false)

  useEffect(() => {
    if (hasRedirectedRef.current) return

    // Check if we're on a public admin page
    const isPublicPage = pathname?.includes("/admin/login") || 
                         pathname?.includes("/admin/signup") || 
                         pathname?.includes("/admin/forgot-password") ||
                         pathname?.includes("/admin/reset-password")

    // Only attempt redirect when initialization is complete AND we're not logged in
    if (isInitialized && !admin && !isPublicPage) {
      // Use a small delay to ensure router is fully initialized
      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current)
      
      redirectTimeoutRef.current = setTimeout(() => {
        try {
          hasRedirectedRef.current = true
          const next = pathname && pathname !== "/admin" ? `?next=${encodeURIComponent(pathname)}` : ""
          router.replace(`/admin/login${next}`)
        } catch {
          hasRedirectedRef.current = false
        }
      }, 0)
    }

    return () => {
      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current)
    }
  }, [admin, isInitialized, router, pathname])

  if (!isInitialized || !admin) {
    return <AdminRouteLoading />
  }

  return <>{children}</>
}
