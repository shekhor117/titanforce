'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useIntroStore } from '@/lib/stores/intro-store'

export function IntroSplash() {
  const { hasShown, setShown } = useIntroStore()
  const [show, setShow] = useState(false)

  const handleDismiss = () => {
    setShown()
    setShow(false)
  }

  useEffect(() => {
    if (!hasShown) {
      setShow(true)
      const timer = setTimeout(() => {
        setShown()
        setShow(false)
      }, 2800)
      return () => clearTimeout(timer)
    }
  }, [hasShown, setShown])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        handleDismiss()
      }
    }

    if (show) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [show])

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 overflow-hidden" onClick={handleDismiss}>
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-transparent to-accent/20" />

      <div className="relative z-10 flex flex-col items-center cursor-pointer">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/40 blur-3xl animate-intro-glow-1" />
          <div className="absolute inset-0 rounded-full bg-accent/30 blur-3xl animate-intro-glow-2" />

          <Image
            src="/logos/titanforce-logo.svg"
            alt="Titan Force Mulikandi"
            width={180}
            height={180}
            className="w-44 md:w-56 animate-intro-logo drop-shadow-[0_0_60px_rgba(167,25,48,0.8)]"
            priority
          />
        </div>

        <h1 className="mt-10 text-5xl md:text-7xl font-black tracking-[12px] text-white animate-intro-text font-[var(--font-display)]">
          TITAN FORCE
        </h1>

        <div className="mt-8 w-72 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-accent animate-intro-bar" />
        </div>

        <p className="mt-5 text-gray-400 tracking-[8px] text-sm animate-intro-loading font-semibold">
          LOADING
        </p>
      </div>
    </div>
  )
}
