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
        <div className="mb-16 bg-card rounded-lg p-8 border border-border">
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
        <div className="mb-16 bg-card rounded-lg p-8 border border-border">
          <h3 className="text-2xl font-bold text-foreground mb-6">Sizes</h3>
          <div className="flex flex-wrap items-center gap-4">
            <ButtonModern size="sm">Small</ButtonModern>
            <ButtonModern size="md">Medium</ButtonModern>
            <ButtonModern size="lg">Large</ButtonModern>
          </div>
        </div>

        {/* States Section */}
        <div className="mb-16 bg-card rounded-lg p-8 border border-border">
          <h3 className="text-2xl font-bold text-foreground mb-6">States</h3>
          <div className="flex flex-wrap gap-4 items-start">
            <ButtonModern state="default">Default State</ButtonModern>
            <ButtonModern state="active">Active State</ButtonModern>
            <ButtonModern disabled>Disabled State</ButtonModern>
            <ButtonModern state="hover">Hover State</ButtonModern>
          </div>
        </div>

        {/* Glow Effects Section */}
        <div className="mb-16 bg-card rounded-lg p-8 border border-border">
          <h3 className="text-2xl font-bold text-foreground mb-6">Glow Effects</h3>
          <div className="flex flex-wrap gap-4">
            <ButtonModern variant="primary" glow="none">No Glow</ButtonModern>
            <ButtonModern variant="primary" glow="soft">Soft Glow</ButtonModern>
            <ButtonModern variant="primary" glow="strong">Strong Glow</ButtonModern>
          </div>
        </div>

        {/* Shadow Effects Section */}
        <div className="mb-16 bg-card rounded-lg p-8 border border-border">
          <h3 className="text-2xl font-bold text-foreground mb-6">Shadow Effects</h3>
          <div className="flex flex-wrap gap-4">
            <ButtonModern shadow="none">No Shadow</ButtonModern>
            <ButtonModern shadow="soft">Soft Shadow</ButtonModern>
            <ButtonModern shadow="inset">Inset Shadow</ButtonModern>
          </div>
        </div>

        {/* Loading State Section */}
        <div className="mb-16 bg-card rounded-lg p-8 border border-border">
          <h3 className="text-2xl font-bold text-foreground mb-6">Loading State</h3>
          <div className="flex flex-wrap gap-4">
            <ButtonModern
              variant="primary"
              isLoading={loadingStates['loading1']}
              onClick={() => toggleLoading('loading1')}
            >
              {loadingStates['loading1'] ? 'Loading...' : 'Start Loading'}
            </ButtonModern>
            <ButtonModern
              variant="primary"
              isLoading={loadingStates['loading2']}
              onClick={() => triggerSuccess('loading2')}
            >
              {loadingStates['loading2'] ? 'Processing...' : 'Process Action'}
            </ButtonModern>
          </div>
        </div>

        {/* Success State Section */}
        <div className="mb-16 bg-card rounded-lg p-8 border border-border">
          <h3 className="text-2xl font-bold text-foreground mb-6">Success State</h3>
          <div className="flex flex-wrap gap-4">
            <ButtonModern
              variant="success"
              isSuccess={successStates['success1']}
            >
              {successStates['success1'] ? 'Completed' : 'Success Button'}
            </ButtonModern>
            <ButtonModern
              variant="primary"
              isSuccess={successStates['success2']}
              onClick={() => setSuccessStates(prev => ({
                ...prev,
                'success2': !prev['success2']
              }))}
            >
              {successStates['success2'] ? 'Done' : 'Toggle Success'}
            </ButtonModern>
          </div>
        </div>

        {/* Icons Section */}
        <div className="mb-16 bg-card rounded-lg p-8 border border-border">
          <h3 className="text-2xl font-bold text-foreground mb-6">With Icons</h3>
          <div className="flex flex-wrap gap-4">
            <ButtonModern variant="primary" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
              Next Step
            </ButtonModern>
            <ButtonModern variant="success" icon={<Check className="w-4 h-4" />} iconPosition="left">
              Confirm
            </ButtonModern>
            <ButtonModern variant="primary" icon={<Loader2 className="w-4 h-4 animate-spin" />} iconPosition="left">
              Processing
            </ButtonModern>
          </div>
        </div>

        {/* Combined Effects Section */}
        <div className="bg-card rounded-lg p-8 border border-border">
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
