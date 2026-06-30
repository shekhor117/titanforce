"use client"

import { AdminProtectedRoute } from "@/components/admin-protected-route"
import { AdminSidebar } from "@/components/admin-sidebar"
import { ReactNode, useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // Handle global errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("[v0] Global error caught:", event.error)
      setHasError(true)
      setErrorMessage(event.error?.message || "An unexpected error occurred")
    }

    window.addEventListener("error", handleError)
    return () => window.removeEventListener("error", handleError)
  }, [])

  // List of paths that don't need admin protection
  const publicPaths = ["/admin/login", "/admin/signup", "/admin/forgot-password", "/admin/reset-password"]
  const isPublicPage = publicPaths.some(path => pathname === path || pathname?.startsWith(path + "/"))

  // If it's a public admin page, render without protection or sidebar
  if (isPublicPage) {
    return children
  }

  // Otherwise, protect with admin routes and show sidebar
  return (
    <AdminProtectedRoute>
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 md:ml-64 p-4 pt-16 md:pt-8 md:p-8">
          {hasError && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">Error Loading Page</p>
                  <p className="text-sm mt-1">{errorMessage}</p>
                </div>
                <button
                  onClick={() => {
                    setHasError(false)
                    window.location.reload()
                  }}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm font-medium"
                >
                  Reload
                </button>
              </div>
            </div>
          )}
          {children}
        </main>
      </div>
    </AdminProtectedRoute>
  )
}
