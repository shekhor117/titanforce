'use client'

import { useState } from 'react'
import { ButtonModern } from './button-modern'
import { Check, Loader2, ArrowRight } from 'lucide-react'

export function ButtonShowcase() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const [successStates, setSuccessStates] = useState<Record<string, boolean>>({})

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
    <section className="py-16 px-4 bg-gradient-to-b from-background to-card/20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-2">Modern Button Component</h2>
          <p className="text-muted-foreground">Showcase of button states, variants, and effects</p>
        </div>

        {/* Variants Section */}
        <div className="mb-16 neo-card p-8">
          <h3 className="text-2xl font-bold text-foreground mb-6">Variants</h3>
          <div className="flex flex-wrap gap-4">
            <ButtonModern variant="default">Default</ButtonModern>
            <ButtonModern variant="primary">Primary</ButtonModern>
            <ButtonModern variant="secondary">Secondary</ButtonModern>
            <ButtonModern variant="success">Success</ButtonModern>
            <ButtonModern variant="destructive">Destructive</ButtonModern>
            <ButtonModern variant="outline">Outline</ButtonModern>
            <ButtonModern variant="ghost">Ghost</ButtonModern>
          </div>
        </div>

        {/* Sizes Section */}
        <div className="mb-16 neo-card p-8">
          <h3 className="text-2xl font-bold text-foreground mb-6">Sizes</h3>
        </div>

        {/* States Section */}
        <div className="mb-16 neo-card p-8">
          <h3 className="text-2xl font-bold text-foreground mb-6">States</h3>
        </div>

        {/* Glow Effects Section */}
        <div className="mb-16 neo-card p-8">
          <h3 className="text-2xl font-bold text-foreground mb-6">Glow Effects</h3>
        </div>

        {/* Shadow Effects Section */}
        <div className="mb-16 neo-card p-8">
          <h3 className="text-2xl font-bold text-foreground mb-6">Shadow Effects</h3>
        </div>

        {/* Loading State Section */}
        <div className="mb-16 neo-card p-8">
          <h3 className="text-2xl font-bold text-foreground mb-6">Loading State</h3>
        </div>

        {/* Success State Section */}
        <div className="mb-16 neo-card p-8">
          <h3 className="text-2xl font-bold text-foreground mb-6">Success State</h3>
        </div>

        {/* Icons Section */}
        <div className="mb-16 neo-card p-8">
          <h3 className="text-2xl font-bold text-foreground mb-6">With Icons</h3>
        </div>

        {/* Combined Effects Section */}
        <div className="neo-card p-8">
          <h3 className="text-2xl font-bold text-foreground mb-6">Combined Effects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ButtonModern 
              variant="primary" 
              glow="strong" 
              shadow="soft"
              icon={<Check className="w-4 h-4" />}
            >
              Primary with Glow
            </ButtonModern>
            <ButtonModern 
              variant="secondary" 
              shadow="inset"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Secondary with Inset
            </ButtonModern>
            <ButtonModern 
              variant="success" 
              glow="soft"
              size="lg"
            >
              Success Large
            </ButtonModern>
            <ButtonModern 
              variant="outline" 
              glow="strong"
              size="sm"
            >
              Outline Small
            </ButtonModern>
          </div>
        </div>
      </div>
    </section>
  )
}
