'use client'

import { ButtonModern } from '@/components/button-modern'
import { Zap, Heart, Wind, Loader } from 'lucide-react'

export default function NeumorphicAnimationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            Neumorphic Animations
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Smooth, sophisticated animations for premium neumorphic design. Experience fluid transitions, subtle depth effects, and interactive feedback.
          </p>
        </div>

        {/* Button Animations */}
        <section className="mb-16 neumorphic-container">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Button Animations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Pulse Animation */}
            <div className="flex flex-col items-center">
              <ButtonModern
                variant="primary"
                size="lg"
                animated="pulse"
              >
                Pulse Effect
              </ButtonModern>
              <p className="text-sm text-gray-600 mt-4">Rhythmic glow pulse</p>
            </div>

            {/* Bounce Animation */}
            <div className="flex flex-col items-center">
              <ButtonModern
                variant="success"
                size="lg"
                animated="bounce"
              >
                Bounce Effect
              </ButtonModern>
              <p className="text-sm text-gray-600 mt-4">Continuous bounce</p>
            </div>

            {/* Glow Animation */}
            <div className="flex flex-col items-center">
              <ButtonModern
                variant="primary"
                size="lg"
                animated="glow"
              >
                Glow Effect
              </ButtonModern>
              <p className="text-sm text-gray-600 mt-4">Luminous glow</p>
            </div>

            {/* Float Animation */}
            <div className="flex flex-col items-center">
              <ButtonModern
                variant="primary"
                size="lg"
                animated="float"
              >
                Float Effect
              </ButtonModern>
              <p className="text-sm text-gray-600 mt-4">Gentle floating</p>
            </div>

            {/* Wiggle Animation */}
            <div className="flex flex-col items-center">
              <ButtonModern
                variant="primary"
                size="lg"
                animated="wiggle"
              >
                Wiggle Effect
              </ButtonModern>
              <p className="text-sm text-gray-600 mt-4">Playful wiggle</p>
            </div>

            {/* Hover Lift */}
            <div className="flex flex-col items-center">
              <ButtonModern
                variant="neumorphic"
                size="lg"
                animated="hover"
              >
                Hover Lift
              </ButtonModern>
              <p className="text-sm text-gray-600 mt-4">Elevates on hover</p>
            </div>
          </div>
        </section>

        {/* Element Animations */}
        <section className="mb-16 neumorphic-container">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Element Animations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pulse Card */}
            <div className="neumorphic-card neu-animate-pulse p-8 text-center">
              <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pulse Animation</h3>
              <p className="text-gray-600">Smooth rhythmic pulse effect on elements</p>
            </div>

            {/* Glow Card */}
            <div className="neumorphic-card neu-animate-glow p-8 text-center">
              <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Glow Animation</h3>
              <p className="text-gray-600">Luminous glow effect with brightness variation</p>
            </div>

            {/* Float Card */}
            <div className="neumorphic-card neu-animate-float p-8 text-center">
              <Wind className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Float Animation</h3>
              <p className="text-gray-600">Gentle floating motion creates lightness</p>
            </div>

            {/* Bounce Card */}
            <div className="neumorphic-card neu-animate-bounce p-8 text-center">
              <Loader className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Bounce Animation</h3>
              <p className="text-gray-600">Playful bounce effect for emphasis</p>
            </div>
          </div>
        </section>

        {/* CSS Classes Reference */}
        <section className="neumorphic-container">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">CSS Classes Reference</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-3">Button Animations</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><code className="bg-gray-200 px-2 py-1 rounded">neu-animate-pulse</code></li>
                <li><code className="bg-gray-200 px-2 py-1 rounded">neu-animate-bounce</code></li>
                <li><code className="bg-gray-200 px-2 py-1 rounded">neu-animate-glow</code></li>
                <li><code className="bg-gray-200 px-2 py-1 rounded">neu-animate-float</code></li>
                <li><code className="bg-gray-200 px-2 py-1 rounded">neu-animate-wiggle</code></li>
              </ul>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-3">Hover Effects</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><code className="bg-gray-200 px-2 py-1 rounded">neu-hover-lift</code></li>
                <li><code className="bg-gray-200 px-2 py-1 rounded">neu-hover-glow</code></li>
                <li><code className="bg-gray-200 px-2 py-1 rounded">neu-hover-pulse</code></li>
              </ul>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-3">Entrance/Exit</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><code className="bg-gray-200 px-2 py-1 rounded">neu-enter</code></li>
                <li><code className="bg-gray-200 px-2 py-1 rounded">neu-exit</code></li>
                <li><code className="bg-gray-200 px-2 py-1 rounded">neu-animate-wiggle</code></li>
              </ul>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-3">Usage Example</h3>
              <pre className="text-xs text-gray-700 overflow-auto">
{`<div className="neu-animate-pulse">
  Pulsing content
</div>`}
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
