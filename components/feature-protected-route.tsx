"use client"

import { useEffect, useState } from "react"
import { useAdmin } from "@/lib/admin-context"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { Lock, ArrowLeft } from "lucide-react"

interface FeatureProtectedRouteProps {
  children: React.ReactNode
  featureName: string
  category: "tools" | "team"
}

export function FeatureProtectedRoute({
  children,
  featureName,
  category,
}: FeatureProtectedRouteProps) {
  const { admin, isInitialized } = useAdmin()
  const router = useRouter()
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [hasAccess, setHasAccess] = useState(false)
  const [showAccessDenied, setShowAccessDenied] = useState(false)

  // Check if user has admin or moderator access
  const isAuthorized = admin?.role === "admin" || admin?.role === "moderator"

  useEffect(() => {
    if (!isInitialized) return

    if (isAuthorized) {
      setHasAccess(true)
    } else {
      setShowAccessDenied(true)
      // Redirect to login after 3 seconds if not authorized
      const timer = setTimeout(() => {
        router.push("/admin-login")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [admin, isInitialized, isAuthorized, router])

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-foreground/60">{isBn ? "লোড করা হচ্ছে..." : "Loading..."}</p>
        </div>
      </div>
    )
  }

  // If user is authorized, render content
  if (hasAccess) {
    return <>{children}</>
  }

  // If initialized but not authorized, show access denied message
  if (showAccessDenied) {
    const categoryLabel = category === "tools" ? (isBn ? "উন্নত সরঞ্জাম" : "Advanced Tools") : (isBn ? "দলের বৈশিষ্ট্য" : "Team Features")
    
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            <div className="p-4 rounded-full bg-destructive/20">
              <Lock className="w-8 h-8 text-destructive" />
            </div>
          </div>
          
          <h1 className={`text-2xl font-bold text-foreground mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "অ্যাক্সেস নিষিদ্ধ" : "Access Denied"}
          </h1>
          
          <p className={`text-foreground/60 mb-6 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn 
              ? `এই ${categoryLabel} শুধুমাত্র অ্যাডমিনিস্ট্রেটরদের জন্য উপলব্ধ। অনুগ্রহ করে আপনার অ্যাডমিনদের সাথে যোগাযোগ করুন।`
              : `This ${categoryLabel} is only available for Administrators. Please contact your administrator.`
            }
          </p>

          <p className={`text-sm text-foreground/50 mb-6 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "আপনি শীঘ্রই লগইন পৃষ্ঠায় পুনঃনির্দেশিত হবেন..." : "You will be redirected to the login page..."}
          </p>

          <button
            onClick={() => router.push("/admin-login")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className={`text-sm font-semibold uppercase ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "লগইনে ফিরুন" : "Return to Login"}
            </span>
          </button>
        </div>
      </div>
    )
  }

  return null
}
