"use client"

import { AdminProtectedRoute } from "@/components/admin-protected-route"
import { AdminSidebar } from "@/components/admin-sidebar"
import { ReactNode } from "react"
import { usePathname } from "next/navigation"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  
  // List of paths that don't need admin protection
  const publicPaths = ["/admin-login", "/admin/login", "/admin/signup", "/admin/forgot-password", "/admin/reset-password"]
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
        <main className="flex-1 md:ml-64 p-4 md:p-8">
          {children}
        </main>
      </div>
    </AdminProtectedRoute>
  )
}
