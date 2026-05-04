"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAdmin } from "@/lib/admin-context"

export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { admin, isLoading, isAdmin } = useAdmin()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (!admin || !isAdmin) {
      router.push("/auth/login")
    }
  }, [admin, isAdmin, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-foreground/60">Loading...</div>
      </div>
    )
  }

  if (!admin || !isAdmin) {
    return null
  }

  return <>{children}</>
}
