"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ReactNode } from "react"

interface TransitionLinkProps {
  href: string
  children: ReactNode
  className?: string
}

export function TransitionLink({ href, children, className }: TransitionLinkProps) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    // Navigate instantly without delay
    router.push(href)
  }

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  )
}
