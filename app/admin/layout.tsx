"use client"

import { AdminProtectedRoute } from "@/components/admin-protected-route"
import { AdminSidebar } from "@/components/admin-sidebar"
import { ReactNode } from "react"

export default function AdminLayout({ children }: { children: ReactNode }) {
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
