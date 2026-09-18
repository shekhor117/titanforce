"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { UserDashboard } from "@/components/user-dashboard"

export default function UserDashboardPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login")
  }, [isLoading, user, router])

  if (isLoading || !user) {
    return <div className="flex min-h-screen items-center justify-center bg-background"><div className="size-10 animate-spin rounded-full border-2 border-primary/30 border-t-primary" /></div>
  }

  return <UserDashboard />
}
