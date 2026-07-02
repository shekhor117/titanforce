'use client'

import { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  icon?: ReactNode
  percentage?: number
  trend?: 'up' | 'down' | 'neutral'
  description?: string
  animated?: boolean
  isBn?: boolean
}

export function StatCard({
  title,
  value,
  icon,
  percentage,
  trend,
  description,
  animated = true,
  isBn = false,
}: StatCardProps) {
  return (
    <div
      className={`group relative glass-card rounded-2xl p-5 sm:p-6 md:p-8 overflow-hidden transition-all duration-300 hover:shadow-xl ${
        animated ? 'hover-lift' : ''
      }`}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-primary/50 to-accent/50" />

      <div className="relative z-10">
        {/* Header with icon and trend */}
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          {icon && <div className="text-xl sm:text-2xl text-primary">{icon}</div>}
          {trend && (
            <span
              className={`text-xs font-bold px-2 py-1 rounded-full ${
                trend === 'up'
                  ? 'bg-green-500/20 text-green-400'
                  : trend === 'down'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-yellow-500/20 text-yellow-400'
              }`}
            >
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {percentage}%
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className={`text-xs sm:text-sm uppercase tracking-widest text-foreground/60 mb-2 sm:mb-3 ${
            isBn ? 'font-[var(--font-bengali)]' : ''
          }`}
        >
          {title}
        </h3>

        {/* Value - large and prominent */}
        <div className="mb-2 sm:mb-3">
          <p className="font-[var(--font-display)] text-3xl sm:text-4xl md:text-5xl font-bold text-primary">
            {value}
          </p>
        </div>

        {/* Description */}
        {description && (
          <p className={`text-xs sm:text-sm text-foreground/50 ${isBn ? 'font-[var(--font-bengali)]' : ''}`}>
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
