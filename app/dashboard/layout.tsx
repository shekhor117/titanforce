"use client"

import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { role: string }
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { language } = useLanguage()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  if (isLoading) return <div className="flex items-center justify-center h-screen">Loading...</div>
  if (!user) return null

  return <>{children}</>
}
