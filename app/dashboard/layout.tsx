"use client"

import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, Suspense } from "react"
import { Clock, CheckCircle, XCircle, Home } from "lucide-react"
import Link from "next/link"

function DashboardContent({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading, profile } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { language } = useLanguage()
  const isBn = language === "bn"
  const isPending = searchParams.get("pending") === "true"

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={`text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "লোড হচ্ছে..." : "Loading..."}
          </p>
        </div>
      </div>
    )
  }

  if (!user) return null

  // Show pending approval message for players/partners
  if (isPending || (profile?.status === "pending" && profile?.role !== "fan")) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-card border-2 border-primary rounded-xl p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-yellow-500" />
            </div>
            
            <h1 className={`text-2xl font-[var(--font-display)] tracking-wider text-foreground mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "অনুমোদনের অপেক্ষায়" : "Pending Approval"}
            </h1>
            
            <p className={`text-foreground/70 mb-6 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn 
                ? "আপনার অ্যাকাউন্ট অ্যাডমিনের অনুমোদনের অপেক্ষায় রয়েছে। অনুমোদন হলে আপনাকে জানানো হবে।"
                : "Your account is awaiting admin approval. You will be notified once your account has been approved."
              }
            </p>

            <div className="bg-secondary/30 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className={`text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "অবস্থা" : "Status"}
                </span>
                <span className="flex items-center gap-2 text-yellow-500 font-semibold">
                  <Clock className="w-4 h-4" />
                  {isBn ? "অপেক্ষমান" : "Pending"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className={`text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "ভূমিকা" : "Role"}
                </span>
                <span className="text-primary font-semibold capitalize">
                  {profile?.role || "Player/Partner"}
                </span>
              </div>
            </div>

            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition font-semibold"
            >
              <Home className="w-5 h-5" />
              {isBn ? "হোমে ফিরুন" : "Back to Home"}
            </Link>
          </div>

          {/* Status Legend */}
          <div className="mt-6 bg-card/50 rounded-lg p-4 border border-secondary">
            <h3 className={`text-sm font-semibold text-foreground mb-3 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "অনুমোদন প্রক্রিয়া" : "Approval Process"}
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-yellow-500">
                <Clock className="w-4 h-4" />
                <span>{isBn ? "অপেক্ষমান - পর্যালোচনার অপেক্ষায়" : "Pending - Awaiting review"}</span>
              </div>
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle className="w-4 h-4" />
                <span>{isBn ? "অনুমোদিত - সম্পূর্ণ অ্যাক্সেস" : "Approved - Full access"}</span>
              </div>
              <div className="flex items-center gap-2 text-red-500">
                <XCircle className="w-4 h-4" />
                <span>{isBn ? "প্রত্যাখ্যান - অনুরোধ প্রত্যাখ্যাত" : "Rejected - Request denied"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

function DashboardFallback() {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-foreground/60">Loading...</p>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardContent>{children}</DashboardContent>
    </Suspense>
  )
}
