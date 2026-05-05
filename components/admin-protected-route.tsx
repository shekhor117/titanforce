"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAdmin } from "@/lib/admin-context"

export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { admin } = useAdmin()
  const router = useRouter()

  useEffect(() => {
    if (!admin) {
      router.push("/admin/login")
    }
  }, [admin, router])

  if (!admin) {
    return null
  }

  return <>{children}</>
}
