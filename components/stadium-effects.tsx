"use client"

import { useEffect, useState } from "react"

export function StadiumEffects() {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  useEffect(() => {
    // Create periodic ripple effects like stadium waves
    const interval = setInterval(() => {
      const newRipple = {
        id: Date.now(),
        x: Math.random() * 100,
        y: Math.random() * 100,
      }
      setRipples((prev) => [...prev, newRipple])

      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
      }, 2000)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute w-32 h-32 border-2 border-primary/20 rounded-full"
          style={{
            left: `${ripple.x}%`,
            top: `${ripple.y}%`,
            transform: "translate(-50%, -50%)",
            animation: "stadiumWave 2s ease-out forwards",
          }}
        />
      ))}

      <style jsx>{`
        @keyframes stadiumWave {
          0% {
            width: 0;
            height: 0;
            opacity: 0.6;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            width: 100%;
            height: 100%;
            opacity: 0;
          }
        }

        /* Stadium lights flicker effect */
        @keyframes stadiumLights {
          0%,
          100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
