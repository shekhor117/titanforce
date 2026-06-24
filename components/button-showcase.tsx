'use client'

import { useState } from 'react'
import { ButtonModern } from './button-modern'
import { Check, Loader2, ArrowRight, Eye, Zap } from 'lucide-react'

export function ButtonShowcase() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const [successStates, setSuccessStates] = useState<Record<string, boolean>>({})
  const [hoveredState, setHoveredState] = useState<string | null>(null)

  const toggleLoading = (id: string) => {
    setLoadingStates(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const triggerSuccess = (id: string) => {
    setLoadingStates(prev => ({
      ...prev,
      [id]: true
    }))
    setTimeout(() => {
      setLoadingStates(prev => ({
        ...prev,
        [id]: false
      }))
      setSuccessStates(prev => ({
        ...prev,
        [id]: true
      }))
    }, 1500)
    setTimeout(() => {
      setSuccessStates(prev => ({
        ...prev,
        [id]: false
      }))
    }, 3000)
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-100 to-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">Premium Button UI</h2>
          <p className="text-gray-600 text-lg">Showcase of elegant button states, variants, and interactive effects</p>
        </div>

        {/* Default & Hover States - Main Section */}
        <div className="mb-16 bg-white rounded-2xl p-12 shadow-lg border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Default & Hover States</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <ButtonModern variant="light" size="md">Default</ButtonModern>
              <p className="text-sm text-gray-600 mt-4">Light variant</p>
            </div>
            <div className="flex flex-col items-center">
              <ButtonModern variant="primary" size="md" glow="soft">Hover with glow</ButtonModern>
              <p className="text-sm text-gray-600 mt-4">Dark with glow effect</p>
            </div>
            <div className="flex flex-col items-center">
              <ButtonModern variant="primary" size="md">Hover</ButtonModern>
              <p className="text-sm text-gray-600 mt-4">Dark variant standard</p>
            </div>
          </div>
        </div>

        {/* Variants Section */}
        <div className="mb-16 bg-white rounded-2xl p-12 shadow-lg border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Variants & Colors</h3>
          <div className="flex flex-wrap gap-6 justify-center">
            <ButtonModern variant="light" size="md">Light</ButtonModern>
            <ButtonModern variant="default" size="md">Default</ButtonModern>
            <ButtonModern variant="primary" size="md">Primary</ButtonModern>
            <ButtonModern variant="secondary" size="md">Secondary</ButtonModern>
            <ButtonModern variant="success" size="md">Success</ButtonModern>
            <ButtonModern variant="destructive" size="md">Destructive</ButtonModern>
            <ButtonModern variant="outline" size="md">Outline</ButtonModern>
            <ButtonModern variant="ghost" size="md">Ghost</ButtonModern>
          </div>
        </div>

        {/* Active & Disabled States Section */}
        <div className="mb-16 bg-white rounded-2xl p-12 shadow-lg border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Active & Disabled States</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <ButtonModern variant="light" size="md" state="active">Active</ButtonModern>
              <p className="text-sm text-gray-600 mt-4">Light active state</p>
            </div>
            <div className="flex flex-col items-center">
              <ButtonModern variant="primary" size="md" state="active">Active</ButtonModern>
              <p className="text-sm text-gray-600 mt-4">Dark active state</p>
            </div>
            <div className="flex flex-col items-center">
              <ButtonModern variant="primary" size="md" disabled>Disabled</ButtonModern>
              <p className="text-sm text-gray-600 mt-4">Disabled state</p>
            </div>
          </div>
        </div>

        {/* Shadow Effects Section */}
        <div className="mb-16 bg-white rounded-2xl p-12 shadow-lg border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Shadow Effects</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <ButtonModern variant="light" size="md" shadow="inset">Everted inset shadow</ButtonModern>
              <p className="text-sm text-gray-600 mt-4">Inset shadow variant</p>
            </div>
            <div className="flex flex-col items-center">
              <ButtonModern variant="primary" size="md" shadow="premium">Premium Shadow</ButtonModern>
              <p className="text-sm text-gray-600 mt-4">Premium elevated shadow</p>
            </div>
            <div className="flex flex-col items-center">
              <ButtonModern variant="secondary" size="md" shadow="soft">Soft Shadow</ButtonModern>
              <p className="text-sm text-gray-600 mt-4">Subtle soft shadow</p>
            </div>
          </div>
        </div>

        {/* Loading & Success States */}
        <div className="mb-16 bg-white rounded-2xl p-12 shadow-lg border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Loading & Success States</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <ButtonModern
                variant="primary"
                size="md"
                isLoading={loadingStates['loading1']}
                onClick={() => toggleLoading('loading1')}
              >
                {loadingStates['loading1'] ? 'Loading' : 'Loaded'}
              </ButtonModern>
              <p className="text-sm text-gray-600 mt-4">Click to toggle loading</p>
            </div>
            <div className="flex flex-col items-center">
              <ButtonModern
                variant="primary"
                size="md"
                isLoading={loadingStates['loading2']}
                onClick={() => triggerSuccess('loading2')}
              >
                {loadingStates['loading2'] ? 'Processing' : 'Process'}
              </ButtonModern>
              <p className="text-sm text-gray-600 mt-4">Loading then success</p>
            </div>
            <div className="flex flex-col items-center">
              <ButtonModern
                variant="success"
                size="md"
                isSuccess={successStates['success1']}
                onClick={() => setSuccessStates(prev => ({
                  ...prev,
                  'success1': !prev['success1']
                }))}
              >
                {successStates['success1'] ? 'Success' : 'Submit'}
              </ButtonModern>
              <p className="text-sm text-gray-600 mt-4">Success state</p>
            </div>
          </div>
        </div>

        {/* Special Effects Section */}
        <div className="mb-16 bg-white rounded-2xl p-12 shadow-lg border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Special Effects & Variants</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <ButtonModern variant="primary" size="md" icon={<Eye className="w-4 h-4" />}>
                Hover with glow
              </ButtonModern>
              <p className="text-sm text-gray-600 mt-4">Glow effect on hover</p>
            </div>
            <div className="flex flex-col items-center">
              <ButtonModern variant="neumorphic" size="md">
                Hyper-neumorphic
              </ButtonModern>
              <p className="text-sm text-gray-600 mt-4">Neumorphic design</p>
            </div>
            <div className="flex flex-col items-center">
              <ButtonModern variant="success" size="md" icon={<Check className="w-4 h-4" />}>
                Hyper-reawaay
              </ButtonModern>
              <p className="text-sm text-gray-600 mt-4">Success with icon</p>
            </div>
          </div>
        </div>

        {/* Glow Effects Showcase */}
        <div className="mb-16 bg-white rounded-2xl p-12 shadow-lg border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Glow Effects</h3>
          <div className="flex flex-wrap gap-6 justify-center">
            <ButtonModern variant="primary" size="md" glow="none">No Glow</ButtonModern>
            <ButtonModern variant="primary" size="md" glow="soft">Soft Glow</ButtonModern>
            <ButtonModern variant="primary" size="md" glow="strong">Strong Glow</ButtonModern>
            <ButtonModern variant="primary" size="md" glow="warmGlow">Warm Glow</ButtonModern>
          </div>
        </div>

        {/* Combined Effects Showcase */}
        <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Combined Effects & Icons</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col items-center">
              <ButtonModern 
                variant="primary" 
                glow="strong" 
                shadow="premium"
                icon={<Check className="w-4 h-4" />}
                iconPosition="left"
              >
                Confirmed
              </ButtonModern>
              <p className="text-xs text-gray-600 mt-4 text-center">Premium + Glow</p>
            </div>
            <div className="flex flex-col items-center">
              <ButtonModern 
                variant="secondary" 
                shadow="inset"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
                size="lg"
              >
                Next
              </ButtonModern>
              <p className="text-xs text-gray-600 mt-4 text-center">Inset Shadow</p>
            </div>
            <div className="flex flex-col items-center">
              <ButtonModern 
                variant="success" 
                glow="soft"
                size="md"
                icon={<Zap className="w-4 h-4" />}
                iconPosition="left"
              >
                Power Up
              </ButtonModern>
              <p className="text-xs text-gray-600 mt-4 text-center">Success + Glow</p>
            </div>
            <div className="flex flex-col items-center">
              <ButtonModern 
                variant="outline" 
                glow="subtle"
                size="md"
              >
                Explore
              </ButtonModern>
              <p className="text-xs text-gray-600 mt-4 text-center">Outline Style</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
