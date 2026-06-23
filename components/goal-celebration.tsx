"use client"

import { useEffect, useState } from "react"

interface Particle {
  id: number
  x: number
  y: number
  duration: number
  delay: number
  size: number
}

export function GoalCelebration({ trigger = false }: { trigger?: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (!trigger) return

    setIsActive(true)

    // Create burst of particles
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
      duration: 1 + Math.random() * 0.5,
      delay: Math.random() * 0.2,
      size: 4 + Math.random() * 8,
    }))

    setParticles(newParticles)

    // Reset after animation
    const timer = setTimeout(() => {
      setIsActive(false)
      setParticles([])
    }, 2000)

    return () => clearTimeout(timer)
  }, [trigger])

  if (!isActive) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-gradient-to-b from-yellow-400 to-red-500 rounded-full"
          style={{
            left: "50%",
            top: "50%",
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animation: `goalBurst ${particle.duration}s ease-out forwards`,
            animationDelay: `${particle.delay}s`,
            "--tx": `${particle.x}px`,
            "--ty": `${particle.y}px`,
          } as React.CSSProperties & { "--tx": string; "--ty": string }}
        />
      ))}
      <style jsx>{`
        @keyframes goalBurst {
          0% {
            transform: translate(-50%, -50%) translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translate(var(--tx), var(--ty)) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
