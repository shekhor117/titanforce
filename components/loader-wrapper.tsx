"use client"

import { useEffect, useState } from "react"

export default function LoaderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const alreadyVisited = sessionStorage.getItem("titan-loader")

    // First visit
    if (!alreadyVisited) {
      setLoading(true)

      const timer = setTimeout(() => {
        setLoading(false)

        // Save session
        sessionStorage.setItem("titan-loader", "true")
      }, 1800)

      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold animate-pulse">
            TITAN FORCE
          </h1>
        </div>
      )}

      {children}
    </>
  )
}
