'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export function WebsiteIntro() {
  const [isVisible, setIsVisible] = useState(true)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    // Auto-close the intro after 3.5 seconds
    const timer = setTimeout(() => {
      setIsClosing(true)
      setTimeout(() => setIsVisible(false), 600)
    }, 3500)

    // Allow user to click to close immediately
    const handleClick = () => {
      setIsClosing(true)
      setTimeout(() => setIsVisible(false), 300)
    }

    document.addEventListener('click', handleClick, { once: true })

    return () => {
      clearTimeout(timer)
      document.removeEventListener('click', handleClick)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-600 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-60" />
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
        {/* Logo Container */}
        <div className="animate-fade-up">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Animated glow background */}
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
            
            {/* Logo */}
            <div className="relative z-10 w-28 h-28">
              <Image
                src="/logos/titanforce-logo.svg"
                alt="TitanForce"
                fill
                className="object-contain filter drop-shadow-lg"
                priority
              />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="text-center space-y-2 animate-fade-up animation-delay-100">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            <span className="text-gradient-auto">TitanForce</span>
          </h1>
          <p className="text-muted-foreground text-lg">Unleash Your Potential</p>
        </div>

        {/* Loading indicator */}
        <div className="animate-fade-up animation-delay-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
          </div>
        </div>
      </div>

      {/* Click to skip text */}
      <div className="absolute bottom-8 text-center text-muted-foreground text-sm opacity-60 animate-fade-up animation-delay-300">
        Click anywhere to continue
      </div>
    </div>
  )
}
