'use client'

import { useState } from 'react'
import { NeumorphicButton } from '@/components/neumorphic-button'
import { Heart, Zap, Check } from 'lucide-react'

export default function NeumorphicButtonShowcase() {
  const [loading, setLoading] = useState(false)

  const handleLoadingTest = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Neumorphic Buttons</h1>
          <p className="text-gray-600 text-lg">Premium neumorphic UI with convex and concave effects</p>
        </div>

        {/* Light Variant */}
        <section className="mb-16 bg-white rounded-2xl p-12 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Light Neumorphic</h2>
          <div className="flex flex-wrap gap-6">
            <NeumorphicButton variant="light" size="sm">Small</NeumorphicButton>
            <NeumorphicButton variant="light" size="md">Medium</NeumorphicButton>
            <NeumorphicButton variant="light" size="lg">Large</NeumorphicButton>
            <NeumorphicButton variant="light" size="xl">Extra Large</NeumorphicButton>
          </div>
        </section>

        {/* Dark Variant */}
        <section className="mb-16 bg-white rounded-2xl p-12 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Dark Neumorphic</h2>
          <div className="flex flex-wrap gap-6">
            <NeumorphicButton variant="dark" size="sm">Small</NeumorphicButton>
            <NeumorphicButton variant="dark" size="md">Medium</NeumorphicButton>
            <NeumorphicButton variant="dark" size="lg">Large</NeumorphicButton>
            <NeumorphicButton variant="dark" size="xl">Extra Large</NeumorphicButton>
          </div>
        </section>

        {/* Soft Variant */}
        <section className="mb-16 bg-white rounded-2xl p-12 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Soft Neumorphic</h2>
          <div className="flex flex-wrap gap-6">
            <NeumorphicButton variant="soft" size="sm">Subtle</NeumorphicButton>
            <NeumorphicButton variant="soft" size="md">Refined</NeumorphicButton>
            <NeumorphicButton variant="soft" size="lg">Elegant</NeumorphicButton>
            <NeumorphicButton variant="soft" size="xl">Premium</NeumorphicButton>
          </div>
        </section>

        {/* Bold Variant */}
        <section className="mb-16 bg-white rounded-2xl p-12 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Bold Neumorphic</h2>
          <div className="flex flex-wrap gap-6">
            <NeumorphicButton variant="bold" size="sm">Click Me</NeumorphicButton>
            <NeumorphicButton variant="bold" size="md">Action</NeumorphicButton>
            <NeumorphicButton variant="bold" size="lg">Submit</NeumorphicButton>
            <NeumorphicButton variant="bold" size="xl">Confirm</NeumorphicButton>
          </div>
        </section>

        {/* Concave Variant */}
        <section className="mb-16 bg-white rounded-2xl p-12 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Concave Neumorphic</h2>
          <div className="flex flex-wrap gap-6">
            <NeumorphicButton variant="concave" size="sm">Press In</NeumorphicButton>
            <NeumorphicButton variant="concave" size="md">Sunken</NeumorphicButton>
            <NeumorphicButton variant="concave" size="lg">Inset</NeumorphicButton>
            <NeumorphicButton variant="concave" size="xl">Embossed</NeumorphicButton>
          </div>
        </section>

        {/* With Icons */}
        <section className="mb-16 bg-white rounded-2xl p-12 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">With Icons</h2>
          <div className="flex flex-wrap gap-6">
            <NeumorphicButton variant="light" size="md" icon={<Heart className="w-4 h-4" />}>
              Favorite
            </NeumorphicButton>
            <NeumorphicButton variant="dark" size="md" icon={<Zap className="w-4 h-4" />} iconPosition="right">
              Power Up
            </NeumorphicButton>
            <NeumorphicButton variant="bold" size="md" icon={<Check className="w-4 h-4" />}>
              Complete
            </NeumorphicButton>
            <NeumorphicButton variant="soft" size="md" icon={<Heart className="w-4 h-4" />} iconPosition="right">
              Like
            </NeumorphicButton>
          </div>
        </section>

        {/* Effects */}
        <section className="mb-16 bg-white rounded-2xl p-12 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Effects</h2>
          <div className="flex flex-wrap gap-6">
            <NeumorphicButton variant="light" size="md" effect="none">
              No Effect
            </NeumorphicButton>
            <NeumorphicButton variant="dark" size="md" effect="glow">
              With Glow
            </NeumorphicButton>
            <NeumorphicButton variant="soft" size="md" effect="pulse">
              With Pulse
            </NeumorphicButton>
          </div>
        </section>

        {/* States */}
        <section className="mb-16 bg-white rounded-2xl p-12 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">States</h2>
          <div className="flex flex-wrap gap-6">
            <NeumorphicButton variant="light" size="md">
              Normal
            </NeumorphicButton>
            <NeumorphicButton variant="dark" size="md" disabled>
              Disabled
            </NeumorphicButton>
            <NeumorphicButton 
              variant="bold" 
              size="md" 
              isLoading={loading}
              onClick={handleLoadingTest}
            >
              {loading ? 'Processing...' : 'Click to Load'}
            </NeumorphicButton>
          </div>
        </section>
      </div>
    </div>
  )
}
