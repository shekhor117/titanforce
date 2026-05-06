"use client"

import Link from "next/link"
import { useTransition } from "@/lib/transition-context"
import { ReactNode } from "react"

interface TransitionLinkProps {
  href: string
  children: ReactNode
  className?: string
}

export function TransitionLink({ href, children, className }: TransitionLinkProps) {
  const { startTransition } = useTransition()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    startTransition()

    // Clear the visited flag so loader shows again
    sessionStorage.removeItem("titan-visited")

    // Wait for fade out animation to complete, then navigate
    setTimeout(() => {
      window.location.href = href
    }, 300)
  }

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  )
}
