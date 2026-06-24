"use client"

import { useState } from "react"
import { Sparkles, Zap, Shield, Palette } from "lucide-react"

export function GlassNeumorphismShowcase() {
  const [activeTab, setActiveTab] = useState<"glass" | "neomorph" | "fusion">("glass")

  const glassExamples = [
    {
      title: "Premium Panel",
      description: "Ultra-smooth glass effect with blur and saturation",
      className: "glass-panel",
    },
    {
      title: "Accent Card",
      description: "Glassmorphism with primary color blend",
      className: "glass-card-accent",
    },
    {
      title: "Container",
      description: "Premium container with premium depth",
      className: "glass-container-premium",
    },
  ]

  const neumorphExamples = [
    {
      title: "Base Button",
      description: "Soft neumorphic button with subtle shadows",
      className: "neomorph-btn",
    },
    {
      title: "Card",
      description: "Neumorphic card with depth perception",
      className: "neomorph-card",
    },
    {
      title: "Convex Style",
      description: "Soft convex neumorphism effect",
      className: "neomorph-convex p-8",
    },
  ]

  const fusionExamples = [
    {
      title: "Modern Fusion",
      description: "Blend of glass and neumorphism",
      className: "fusion-modern",
    },
    {
      title: "Accent Fusion",
      description: "Fusion with primary color accent",
      className: "fusion-accent",
    },
  ]

  const examples = {
    glass: glassExamples,
    neomorph: neumorphExamples,
    fusion: fusionExamples,
  }

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-accent mb-6">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Modern Effects</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-wide">
            Glassmorphism & Neumorphism
          </h2>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            Experience modern design effects that blend glassmorphism, neumorphism, and contemporary UI trends for a premium football club experience.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {(["glass", "neomorph", "fusion"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold uppercase tracking-wider transition-all ${
                activeTab === tab
                  ? "glass-card-accent text-accent"
                  : "glass-card hover:text-accent/80"
              }`}
            >
              {tab === "glass" && "Glassmorphism"}
              {tab === "neomorph" && "Neumorphism"}
              {tab === "fusion" && "Hybrid Fusion"}
            </button>
          ))}
        </div>

        {/* Examples Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examples[activeTab].map((example, index) => (
            <div
              key={index}
              className="flex flex-col h-full"
            >
              {/* Example Card */}
              <div
                className={`${example.className} rounded-lg p-8 flex-1 flex flex-col justify-center items-center text-center hover:scale-105 transition-transform duration-300 cursor-pointer`}
              >
                <div className="mb-4">
                  {activeTab === "glass" && <Zap className="w-8 h-8 text-accent mx-auto" />}
                  {activeTab === "neomorph" && <Shield className="w-8 h-8 text-accent mx-auto" />}
                  {activeTab === "fusion" && <Palette className="w-8 h-8 text-accent mx-auto" />}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{example.title}</h3>
                <p className="text-xs text-foreground/60">{example.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Features Info */}
        <div className="mt-16 glass-panel rounded-xl p-8 md:p-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <h4 className="font-bold text-foreground mb-2">Glassmorphism</h4>
              <p className="text-sm text-foreground/60">Frosted glass effect with backdrop blur and transparency for a modern, premium feel.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h4 className="font-bold text-foreground mb-2">Neumorphism</h4>
              <p className="text-sm text-foreground/60">Soft shadows and highlights creating depth without borders, inspired by real-world surfaces.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Palette className="w-6 h-6 text-accent" />
              </div>
              <h4 className="font-bold text-foreground mb-2">Hybrid Fusion</h4>
              <p className="text-sm text-foreground/60">Perfect blend of both techniques for a unique, visually striking design language.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
