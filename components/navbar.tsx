"use client"

import { Menu } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useSidebar } from "@/components/ui/sidebar"

export function Navbar() {
  const { setOpenMobile, toggleSidebar, state, isMobile } = useSidebar()

  const handleToggle = () => {
    if (isMobile) {
      setOpenMobile(true)
    } else {
      toggleSidebar()
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/70">
      <div className="px-4 py-3 flex items-center gap-4">
        <button
          className="p-2 text-foreground hover:bg-muted rounded-md transition-colors"
          onClick={handleToggle}
          aria-label={state === "collapsed" ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link href="/" className="flex items-center gap-2 group md:hidden">
          <Image
            src="/logo.png"
            alt="Titan Force FC Logo"
            width={36}
            height={36}
            className="object-contain group-hover:scale-110 transition-transform"
            priority
          />
          <h1
            className="font-[var(--font-display)] text-lg tracking-wider bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(107deg, #a71930 0%, #465fb1 100%)" }}
          >
            TITAN FORCE
          </h1>
        </Link>
      </div>
    </nav>
  )
}
