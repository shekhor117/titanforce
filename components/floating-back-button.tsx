"use client"

import { useRouter } from "next/navigation"

export function FloatingBackButton() {
  const router = useRouter()

  const goBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  return (
    <button
      onClick={goBack}
      className="
        fixed top-4 left-4 z-50
        flex items-center justify-center
        w-10 h-10 md:w-12 md:h-12
        rounded-full
        bg-black/60 backdrop-blur-md
        border border-white/10
        hover:bg-white/10
        transition-all duration-300
        active:scale-95
      "
      aria-label="Go back"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 md:w-6 md:h-6 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  )
}
