'use client'

import React, { useState } from 'react'

export function NeumorphicCard() {
  const [activeButtons, setActiveButtons] = useState<Record<number, boolean>>({})

  const toggleButton = (index: number) => {
    setActiveButtons(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  // Button grid configuration - 3 columns, 5 rows with alternating styles
  const buttonGrid = [
    // Row 1
    { variant: 'light', size: 'small' },
    { variant: 'dark', size: 'small' },
    { variant: 'dark', size: 'large' },
    // Row 2
    { variant: 'dark', size: 'small' },
    { variant: 'light', size: 'medium' },
    { variant: 'light', size: 'medium' },
    // Row 3
    { variant: 'light', size: 'small' },
    { variant: 'dark', size: 'small' },
    { variant: 'dark', size: 'large' },
    // Row 4
    { variant: 'light', size: 'small' },
    { variant: 'dark', size: 'small' },
    { variant: 'dark', size: 'large' },
    // Row 5
    { variant: 'dark', size: 'small' },
    { variant: 'dark', size: 'small' },
    { variant: 'gray', size: 'large' },
  ]

  const getButtonClasses = (index: number, variant: string, size: string) => {
    const baseClasses = 'rounded-full transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer'
    
    let sizeClasses = ''
    if (size === 'small') sizeClasses = 'h-8 w-16'
    if (size === 'medium') sizeClasses = 'h-8 w-24'
    if (size === 'large') sizeClasses = 'h-8 w-48'

    let variantClasses = ''
    if (variant === 'light') {
      variantClasses = 'bg-gradient-to-br from-white to-gray-50 text-gray-800 shadow-[0_4px_12px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.8)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.8)]'
    } else if (variant === 'dark') {
      variantClasses = 'bg-gradient-to-br from-gray-600 to-gray-700 text-white shadow-[0_4px_12px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.3)]'
    } else if (variant === 'gray') {
      variantClasses = 'bg-gradient-to-br from-gray-400 to-gray-500 text-white shadow-[0_4px_12px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.25)]'
    }

    return `${baseClasses} ${sizeClasses} ${variantClasses} ${activeButtons[index] ? 'scale-95' : ''}`
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-100 to-gray-50 min-h-screen flex items-center justify-center">
      <div className="relative w-full max-w-2xl">
        {/* Main Card Container */}
        <div className="relative bg-gradient-to-br from-gray-50 via-gray-75 to-gray-100 rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)]">
          {/* Wavy Background Element */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <svg
              className="absolute top-1/3 -left-20 w-full h-64 opacity-30"
              viewBox="0 0 600 300"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#d4a574', stopOpacity: 0.4 }} />
                  <stop offset="50%" style={{ stopColor: '#e8c4a0', stopOpacity: 0.3 }} />
                  <stop offset="100%" style={{ stopColor: '#f5e6d3', stopOpacity: 0.1 }} />
                </linearGradient>
              </defs>
              <path
                d="M0,100 Q150,50 300,100 T600,100 L600,300 Q450,250 300,300 T0,300 Z"
                fill="url(#waveGradient)"
              />
              <path
                d="M0,120 Q150,80 300,120 T600,120 L600,300 Q450,260 300,320 T0,300 Z"
                fill="#d4a574"
                opacity="0.15"
              />
            </svg>
          </div>

          {/* Content Grid */}
          <div className="relative z-10 grid grid-cols-3 gap-4">
            {buttonGrid.map((button, index) => (
              <div
                key={index}
                className={button.size === 'large' ? 'col-span-2' : 'col-span-1'}
              >
                <button
                  onClick={() => toggleButton(index)}
                  className={getButtonClasses(index, button.variant, button.size)}
                  aria-label={`Button ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
