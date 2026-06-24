'use client'

import { useState } from 'react'

export function NeumorphicLandingSection() {
  const [selectedButtons, setSelectedButtons] = useState<number[]>([])

  const toggleButton = (index: number) => {
    setSelectedButtons(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  // Button configuration: 3 columns, 5 rows
  const buttonConfig = [
    { col: 'col-span-1', variant: 'light' },    // 0
    { col: 'col-span-1', variant: 'dark' },     // 1
    { col: 'col-span-1', variant: 'dark' },     // 2
    { col: 'col-span-1', variant: 'dark' },     // 3
    { col: 'col-span-2', variant: 'dark' },     // 4-5 (wide)
    { col: 'col-span-1', variant: 'light' },    // 6
    { col: 'col-span-1', variant: 'dark' },     // 7
    { col: 'col-span-2', variant: 'dark' },     // 8-9 (wide)
    { col: 'col-span-1', variant: 'light' },    // 10
    { col: 'col-span-1', variant: 'dark' },     // 11
    { col: 'col-span-2', variant: 'dark' },     // 12-13 (wide)
    { col: 'col-span-1', variant: 'dark' },     // 14
    { col: 'col-span-1', variant: 'dark' },     // 15
    { col: 'col-span-1', variant: 'gray' },     // 16
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Animated wavy element */}
          <svg
            className="absolute top-1/3 left-0 w-full h-96 opacity-40"
            viewBox="0 0 1200 400"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d4a574" />
                <stop offset="50%" stopColor="#c9956f" />
                <stop offset="100%" stopColor="#b8865f" />
              </linearGradient>
              <filter id="waveBlur">
                <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
              </filter>
            </defs>
            <path
              d="M0,200 Q300,100 600,200 T1200,200 L1200,400 L0,400 Z"
              fill="url(#waveGradient)"
              filter="url(#waveBlur)"
            />
            <path
              d="M0,250 Q300,150 600,250 T1200,250 L1200,400 L0,400 Z"
              fill="url(#waveGradient)"
              opacity="0.6"
              filter="url(#waveBlur)"
            />
          </svg>

          {/* Subtle blur circles */}
          <div className="absolute top-20 right-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Main card container */}
        <div className="relative z-10">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-2xl border border-white/50 p-8 md:p-12 backdrop-blur-sm">
            {/* Header */}
            <div className="mb-12 text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
                Premium Design System
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl">
                Explore our collection of neumorphic components and design tokens crafted for elegance and functionality.
              </p>
            </div>

            {/* Button grid */}
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              {buttonConfig.map((config, index) => (
                <button
                  key={index}
                  onClick={() => toggleButton(index)}
                  className={`${config.col} py-4 px-6 rounded-full font-semibold transition-all duration-300 transform ${
                    selectedButtons.includes(index) ? 'scale-95' : 'scale-100'
                  } ${
                    config.variant === 'light'
                      ? 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 shadow-[0_8px_16px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] border border-gray-200'
                      : config.variant === 'dark'
                      ? 'bg-gradient-to-br from-gray-600 to-gray-700 text-white shadow-[0_8px_16px_rgba(0,0,0,0.2),0_0_0_1px_rgba(255,255,255,0.1)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.3),0_0_20px_rgba(59,130,246,0.2)]'
                      : 'bg-gradient-to-br from-gray-400 to-gray-500 text-white shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.25)]'
                  }`}
                  aria-pressed={selectedButtons.includes(index)}
                >
                  <span className="text-sm md:text-base tracking-wide">
                    {index === 0 && 'Design'}
                    {index === 1 && 'Premium'}
                    {index === 2 && 'Neumorphic'}
                    {index === 3 && 'Elegant'}
                    {index === 4 && 'Interactive Components'}
                    {index === 6 && 'Modern'}
                    {index === 7 && 'Soft Shadows'}
                    {index === 8 && 'Smooth Transitions'}
                    {index === 10 && 'Quality'}
                    {index === 11 && 'Refined'}
                    {index === 12 && 'Premium Experience'}
                    {index === 14 && 'Beautiful'}
                    {index === 15 && 'Crafted'}
                    {index === 16 && 'Design'}
                  </span>
                </button>
              ))}
            </div>

            {/* Footer info */}
            <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
              <p>Carefully designed with attention to detail</p>
              <p className="mt-4 md:mt-0">Premium quality craftsmanship</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
