'use client'

interface SkillBarProps {
  label: string
  value: number
  max?: number
  showLabel?: boolean
  animated?: boolean
  color?: 'primary' | 'accent' | 'success'
  size?: 'sm' | 'md' | 'lg'
}

export function SkillBar({
  label,
  value,
  max = 100,
  showLabel = true,
  animated = true,
  color = 'primary',
  size = 'md',
}: SkillBarProps) {
  const percentage = Math.min((value / max) * 100, 100)

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }

  const colorClasses = {
    primary: 'bg-primary',
    accent: 'bg-accent',
    success: 'bg-green-500',
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5 sm:mb-2">
        <label className="text-xs sm:text-sm font-medium text-foreground/80">{label}</label>
        {showLabel && <span className="text-xs sm:text-sm font-semibold text-primary">{value}%</span>}
      </div>

      {/* Background bar */}
      <div className={`w-full ${sizeClasses[size]} bg-secondary/50 rounded-full overflow-hidden`}>
        {/* Filled bar with animation */}
        <div
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full transition-all duration-500 ${
            animated ? 'ease-out' : ''
          }`}
          style={{
            width: animated ? `${percentage}%` : `${percentage}%`,
          }}
        >
          {/* Shine effect */}
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
        </div>
      </div>
    </div>
  )
}
