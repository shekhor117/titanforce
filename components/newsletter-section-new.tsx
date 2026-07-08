'use client'

import { memo, useState } from "react"
import { motion } from "framer-motion"
import { EntranceReveal } from "@/components/entrance-reveal"
import { Mail, Check, AlertCircle } from "lucide-react"

function NewsletterSectionNewComponent() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setStatus('error')
      setMessage('Please enter your email')
      setTimeout(() => setStatus('idle'), 3000)
      return
    }

    setStatus('loading')
    
    try {
      // Simulated API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setStatus('success')
      setMessage('Successfully subscribed!')
      setEmail('')
      setTimeout(() => setStatus('idle'), 3000)
    } catch (error) {
      setStatus('error')
      setMessage('Failed to subscribe. Please try again.')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-black/30 to-blue-900/10 pointer-events-none" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-red-500/5 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"
          animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <EntranceReveal delay={0.1} duration={0.6} variant="fadeInUp">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-900/20 border border-red-500/30 mb-4">
              <Mail className="w-4 h-4 text-red-400" />
              <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-red-400">Stay Connected</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-wider mt-4 mb-4">
              Join Our Newsletter
            </h2>
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto">
              Get exclusive updates on matches, player news, and upcoming events. Be the first to know about everything Titan Force!
            </p>
          </div>
        </EntranceReveal>

        {/* Newsletter Form */}
        <EntranceReveal delay={0.2} duration={0.6} variant="fadeInUp">
          <motion.form
            onSubmit={handleSubmit}
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Form Container */}
            <div className="relative p-6 sm:p-8 rounded-lg bg-gradient-to-br from-card to-card/50 border border-red-500/30 overflow-hidden">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10">
                {/* Input Group */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'loading'}
                    className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-card border border-red-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-all disabled:opacity-50"
                  />
                  <motion.button
                    type="submit"
                    disabled={status === 'loading'}
                    className="neo-btn-primary px-6 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-bold tracking-widest uppercase rounded-lg whitespace-nowrap disabled:opacity-50"
                    whileHover={{ scale: status !== 'loading' ? 1.05 : 1 }}
                    whileTap={{ scale: status !== 'loading' ? 0.95 : 1 }}
                  >
                    {status === 'loading' ? (
                      <span className="flex items-center gap-2">
                        <motion.div
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                        Subscribing...
                      </span>
                    ) : status === 'success' ? (
                      <span className="flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        Subscribed
                      </span>
                    ) : (
                      'Subscribe'
                    )}
                  </motion.button>
                </div>

                {/* Status Message */}
                <AnimatePresence>
                  {status === 'success' && (
                    <motion.div
                      className="flex items-center gap-2 text-sm text-green-400"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Check className="w-4 h-4" />
                      {message}
                    </motion.div>
                  )}
                  {status === 'error' && (
                    <motion.div
                      className="flex items-center gap-2 text-sm text-red-400"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <AlertCircle className="w-4 h-4" />
                      {message}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Info Text */}
                <p className="text-xs text-gray-500 mt-4 text-center">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </div>
            </div>
          </motion.form>
        </EntranceReveal>

        {/* Benefits */}
        <EntranceReveal delay={0.4} duration={0.6} variant="fadeInUp">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 sm:mt-12 text-center">
            {[
              { title: 'Match Updates', desc: 'Live scores and highlights' },
              { title: 'Exclusive News', desc: 'Behind-the-scenes content' },
              { title: 'Special Offers', desc: 'Member-only promotions' }
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                className="p-4 rounded-lg bg-card/30 border border-red-500/10"
                whileHover={{ y: -2 }}
              >
                <p className="text-sm font-bold text-red-400 mb-1">{benefit.title}</p>
                <p className="text-xs text-gray-500">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </EntranceReveal>
      </div>
    </section>
  )
}

// Animation helper - import from framer-motion
import { AnimatePresence } from "framer-motion"

export const NewsletterSection = memo(NewsletterSectionNewComponent)
