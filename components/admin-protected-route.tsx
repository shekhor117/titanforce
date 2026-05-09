"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAdmin } from "@/lib/admin-context"

export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { admin, isInitialized } = useAdmin()
  const router = useRouter()

  useEffect(() => {
    if (isInitialized && !admin) {
      router.push("/admin/login")
    }
  }, [admin, isInitialized, router])

  if (!isInitialized || !admin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="w-8 h-8 border-4 border-primary border-transparent border-t-primary rounded-full" />
          </div>
          <p className="mt-4 text-foreground/60">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
