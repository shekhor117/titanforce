"use client"

import { useState, useEffect } from "react"

export default function LoaderWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("titan-visited")
    
    if (hasVisited) {
      setLoading(false)
      return
    }

    const timer = setTimeout(() => {
      setLoading(false)
      sessionStorage.setItem("titan-visited", "true")
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-red-600 animate-pulse tracking-wider">
            TITAN FORCE
          </h1>
          <div className="mt-4 flex justify-center gap-1">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
