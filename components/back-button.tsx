"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface BackButtonProps {
  className?: string
  variant?: "default" | "light" | "dark" | "neo"
}

export function BackButton({ className = "", variant = "default" }: BackButtonProps) {
  const router = useRouter()
  const { language } = useLanguage()
  const isBn = language === "bn"

  const handleBack = () => {
    router.back()
  }

  const variantStyles = {
    default: "bg-card/50 border-border/50 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary",
    light: "bg-white/10 border-white/20 text-white hover:bg-white hover:text-black hover:border-white",
    dark: "bg-black/20 border-black/30 text-foreground hover:bg-black hover:text-white hover:border-black",
    neo: "neo-btn",
  }

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95 ${variantStyles[variant]} ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      <span className={isBn ? "font-[var(--font-bengali)]" : ""}>
        {isBn ? "পিছনে" : "Back"}
      </span>
    </button>
  )
}
