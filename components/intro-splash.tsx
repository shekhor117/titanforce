'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { useIntroStore } from '@/lib/stores/intro-store'

export function IntroSplash() {
  const { hasShown, setShown } = useIntroStore()
  const [show, setShow] = useState(false)

  const handleDismiss = useCallback(() => {
    setShown()
    setShow(false)
  }, [setShown])

  // Timer effect
  useEffect(() => {
    if (!hasShown) {
      setShow(true)
      const timer = setTimeout(() => {
        setShown()
        // Fade out smoothly before removing
        setTimeout(() => {
          setShow(false)
        }, 300)
      }, 2650)
      return () => clearTimeout(timer)
    }
  }, [hasShown, setShown])

  // Keyboard handler effect
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
  }, [show, handleDismiss])

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 overflow-hidden ${
        show ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{
        transition: 'opacity 0.3s ease-out',
        contain: 'layout style paint'
      }}
      onClick={handleDismiss}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-transparent to-accent/20" />

      <div className="relative z-10 flex flex-col items-center cursor-pointer" style={{ contain: 'layout style paint' }}>
        <div className="relative" style={{ contain: 'layout style paint' }}>
          <div className="absolute inset-0 rounded-full bg-primary/40 blur-3xl animate-intro-glow-1" style={{ contain: 'paint' }} />
          <div className="absolute inset-0 rounded-full bg-accent/30 blur-3xl animate-intro-glow-2" style={{ contain: 'paint' }} />

          <Image
            src="/logos/titanforce-logo.svg"
            alt="Titan Force Mulikandi"
            width={180}
            height={180}
            className="w-44 md:w-56 animate-intro-logo drop-shadow-[0_0_60px_rgba(167,25,48,0.8)]"
            priority
            loading="eager"
          />
        </div>

        <h1 className="mt-10 text-5xl md:text-7xl font-black tracking-[12px] text-white animate-intro-text font-[var(--font-display)]" style={{ contain: 'layout style paint' }}>
          TITAN FORCE
        </h1>

        <div className="mt-8 w-72 h-1.5 bg-white/10 rounded-full overflow-hidden" style={{ contain: 'layout style paint' }}>
          <div className="h-full bg-gradient-to-r from-primary to-accent animate-intro-bar" style={{ contain: 'paint' }} />
        </div>

        <p className="mt-5 text-gray-400 tracking-[8px] text-sm animate-intro-loading font-semibold" style={{ contain: 'layout style paint' }}>
          LOADING
        </p>
      </div>
    </div>
  )
}
