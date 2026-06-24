'use client'

import React, { useState } from 'react'
import { ChevronRight, Settings } from 'lucide-react'

export function LiquidGlassFoundations() {
  const [activeBlur, setActiveBlur] = useState('Glass blur 24')
  const [permafrostValue, setPermafrostValue] = useState(50)
  const [highlightValue, setHighlightValue] = useState(12)

  const liquidGradients = [
    { id: 1, gradient: 'from-pink-300 via-orange-200 to-orange-400', glow: 'blur-3xl from-pink-400/40' },
    { id: 2, gradient: 'from-blue-300 via-cyan-200 to-blue-500', glow: 'blur-3xl from-blue-400/40' },
    { id: 3, gradient: 'from-blue-100 via-white to-blue-100 opacity-60', glow: 'blur-3xl from-blue-200/20' },
    { id: 4, gradient: 'from-purple-300 via-blue-300 to-cyan-300', glow: 'blur-3xl from-purple-400/40' },
    { id: 5, gradient: 'from-orange-300 via-amber-200 to-orange-300', glow: 'blur-3xl from-orange-400/40' },
    { id: 6, gradient: 'from-teal-300 via-cyan-200 to-teal-400', glow: 'blur-3xl from-teal-400/40' },
  ]

  const blurOptions = [
    { label: 'Glass blur 24', value: 24, color: 'from-cyan-200 to-blue-200' },
    { label: '4', value: 4, color: 'from-slate-200 to-slate-300' },
    { label: '12', value: 12, color: 'from-slate-300 to-slate-400' },
    { label: '16', value: 16, color: 'from-slate-400 to-slate-500' },
    { label: '2%', value: 2, color: 'from-slate-200 to-slate-300' },
    { label: '32', value: 32, color: 'from-slate-400 to-slate-500' },
    { label: 'Shadow soft', value: 8, color: 'from-slate-300 to-slate-400' },
  ]

  const radiusStyles = [
    { value: 16, color: 'from-blue-500 to-blue-600', label: '16' },
    { value: 10, color: 'from-green-500 to-green-600', label: '10' },
    { value: 20, color: 'from-orange-500 to-orange-600', label: '20' },
    { value: 24, color: 'from-purple-500 to-purple-600', label: '24' },
    { value: 7, color: 'from-gray-300 to-gray-400', label: '7' },
    { value: 24, color: 'from-gray-700 to-gray-800', label: '24' },
    { value: 24, color: 'from-gray-400 to-gray-500', icon: true, label: '⊕' },
  ]

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8 overflow-hidden relative">
      {/* Animated background blur */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Main glass card */}
        <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Liquid Glass Foundations</h1>
              <p className="text-blue-200 text-sm">liquid glass Glassbord</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm">Common O1team</span>
              <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Liquid glass gradient squares */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-3 gap-6 mb-8">
                {liquidGradients.map((item) => (
                  <div key={item.id} className="relative group">
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.glow} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    <div
                      className={`relative bg-gradient-to-br ${item.gradient} rounded-2xl aspect-square shadow-lg border border-white/20 hover:border-white/40 transition-all duration-300 transform group-hover:scale-105 cursor-pointer backdrop-blur-sm`}
                    />
                  </div>
                ))}
              </div>

              {/* Surface 01 section */}
              <div className="mb-8">
                <div className="flex items-baseline justify-between mb-4">
                  <h3 className="text-white font-semibold">Surface 01</h3>
                  <span className="text-gray-400 text-sm">Sizing</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {blurOptions.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveBlur(option.label)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        activeBlur === option.label
                          ? 'bg-gradient-to-r from-cyan-300 to-blue-300 text-slate-900 shadow-lg'
                          : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Radius Style section */}
              <div>
                <h3 className="text-white font-semibold mb-4">Radius Style</h3>
                <div className="flex flex-wrap gap-4">
                  {radiusStyles.map((style, idx) => (
                    <button
                      key={idx}
                      className={`w-14 h-14 rounded-full bg-gradient-to-br ${style.color} flex items-center justify-center text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all transform hover:scale-110 border border-white/20 relative group`}
                    >
                      {style.icon ? style.label : style.label}
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {style.value}px
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right sidebar controls */}
            <div className="flex flex-col gap-4">
              {/* Bluer Recipes button */}
              <button className="w-full px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium transition-all backdrop-blur-sm flex items-center justify-center gap-2">
                <span>Bluer Recipes</span>
              </button>

              {/* Corder RhLevels button */}
              <button className="w-full px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium transition-all backdrop-blur-sm">
                Corder RhLevels
              </button>

              {/* Permafrost slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Permafrost</span>
                  <span className="text-gray-400 text-xs">Sp9</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={permafrostValue}
                    onChange={(e) => setPermafrostValue(Number(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-full appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, rgb(34, 211, 238, 0.3) 0%, rgb(59, 130, 246, 0.3) ${permafrostValue}%, rgb(100, 116, 139, 0.2) ${permafrostValue}%, rgb(100, 116, 139, 0.2) 100%)`
                    }}
                  />
                </div>
              </div>

              {/* Highlight button */}
              <button className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-cyan-300/80 to-blue-300/80 hover:from-cyan-300 hover:to-blue-300 text-slate-900 font-medium transition-all backdrop-blur-sm border border-white/30 shadow-lg">
                Highlight {highlightValue}%
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, rgb(34, 211, 238), rgb(59, 130, 246));
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(34, 211, 238, 0.4);
          border: 2px solid rgba(255, 255, 255, 0.5);
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, rgb(34, 211, 238), rgb(59, 130, 246));
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(34, 211, 238, 0.4);
          border: 2px solid rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </section>
  )
}
