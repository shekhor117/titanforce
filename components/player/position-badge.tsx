'use client'

interface PositionBadgeProps {
  number: number
  position: string
  isPrimary: boolean
  x: number
  y: number
}

export function PositionBadge({ number, position, isPrimary, x, y }: PositionBadgeProps) {
  const bgColor = isPrimary ? 'bg-red-600 border-red-400' : 'bg-gray-600 border-gray-400'
  const shadowColor = isPrimary ? 'shadow-red-500/50' : 'shadow-gray-500/30'

  return (
    <div
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group`}
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full ${bgColor} border-3 shadow-lg ${shadowColor} flex flex-col items-center justify-center cursor-pointer hover:scale-110 transition-transform`}>
        <span className="text-white font-bold text-xs md:text-sm leading-none">#{number}</span>
        <span className="text-white text-xs opacity-75 font-medium">{position}</span>
      </div>
      {isPrimary && (
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  )
}
