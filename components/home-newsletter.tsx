'use client'

import { useState } from 'react'
import { Mail, ArrowRight } from 'lucide-react'

export function HomeNewsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      // Simulate subscription - in production, send to API
      await new Promise(resolve => setTimeout(resolve, 1000))
      setStatus('success')
      setEmail('')
      setTimeout(() => setStatus('idle'), 3000)
    } catch (error) {
      setStatus('error')
    }
  }

  return (
    <section className="py-12 md:py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Text */}
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground uppercase tracking-wider mb-4">
              STAY UPDATED
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Subscribe to our newsletter and get the latest news, updates and match highlights.
            </p>
          </div>

          {/* Right Side - Form */}
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="neo-input flex-1"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="neo-btn neo-btn-primary flex items-center gap-2 group disabled:opacity-50"
            >
              {status === 'loading' ? 'Subscribing...' : 'SUBSCRIBE'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        {/* Status Messages */}
        {status === 'success' && (
          <div className="mt-4 p-4 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-sm text-center">
            Thank you for subscribing!
          </div>
        )}
        {status === 'error' && (
          <div className="mt-4 p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm text-center">
            Something went wrong. Please try again.
          </div>
        )}
      </div>
    </section>
  )
}
