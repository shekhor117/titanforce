"use client"

import { useRouter } from "next/navigation"

export function FloatingBackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="mb-10 border border-red-500 px-5 py-2 rounded-xl hover:bg-red-500/10 transition-colors duration-300"
      aria-label="Go back"
    >
      ← Back
    </button>
  )
}
