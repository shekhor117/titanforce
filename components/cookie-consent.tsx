"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Cookie } from "lucide-react"

const CONSENT_COOKIE = "titanforce-cookie-consent"
const CONSENT_MAX_AGE = 60 * 60 * 24 * 180

type ConsentChoice = "accepted" | "rejected"

function saveConsent(choice: ConsentChoice) {
  document.cookie = `${CONSENT_COOKIE}=${choice}; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax; Secure`
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const hasConsent = document.cookie
      .split("; ")
      .some((cookie) => cookie.startsWith(`${CONSENT_COOKIE}=`))

    if (!hasConsent) {
      setIsVisible(true)
    }
  }, [])

  if (!isVisible) return null

  const chooseConsent = (choice: ConsentChoice) => {
    saveConsent(choice)
    setIsVisible(false)
  }

  return (
    <aside
      aria-label="Cookie preferences"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-h-[calc(100dvh-1.5rem)] max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card/95 p-4 text-card-foreground shadow-2xl backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:p-6"
    >
      <div className="flex items-start gap-4">
        <div className="hidden size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary sm:flex" aria-hidden="true">
          <Cookie data-icon="inline-start" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-lg uppercase tracking-wide sm:text-xl">We use cookies</h2>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            We use essential cookies to keep Titan Force running and optional analytics cookies to improve your experience. Read our{" "}
            <Link href="/cookie-policy" className="font-semibold text-primary underline-offset-4 hover:underline">
              Cookie Policy
            </Link>
            .
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:flex sm:justify-end">
            <button
              type="button"
              onClick={() => chooseConsent("rejected")}
              className="rounded-lg border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted"
            >
              Reject optional
            </button>
            <button
              type="button"
              onClick={() => chooseConsent("accepted")}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Accept all
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
