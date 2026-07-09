'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { ScrollAnimatedElement } from './scroll-animated-element'
import { Shield, Target, Zap } from 'lucide-react'

export function HomeAboutSection() {
  return (
    <section className="relative py-20 md:py-28 px-4 bg-gradient-to-b from-background to-card/20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-accent/8 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <ScrollAnimatedElement variant="fadeInLeft">
            <div>
              <motion.div 
                className="inline-flex items-center gap-2 text-accent text-xs font-bold tracking-widest mb-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
              >
                <span className="h-1 w-3 bg-accent rounded-full" />
                WHAT IS GOAL UNITED
              </motion.div>

              <motion.h2 
                className="text-4xl md:text-5xl font-black text-foreground mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                More Than Just a <span className="bg-gradient-to-r from-accent to-red-500 bg-clip-text text-transparent">Football Club</span>
              </motion.h2>

              <motion.p 
                className="text-lg text-muted-foreground mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                viewport={{ once: true }}
              >
                Goal United represents the fusion of passion, skill, and unwavering commitment. We&apos;re not just playing football; we&apos;re building a legacy that resonates with every supporter.
              </motion.p>

              {/* Features */}
              <div className="space-y-4">
                {[
                  { icon: Shield, label: 'Elite Training', desc: 'World-class facilities and coaching' },
                  { icon: Target, label: 'Strategic Excellence', desc: 'Precision-driven game strategies' },
                  { icon: Zap, label: 'High Performance', desc: 'Peak physical and mental conditioning' },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1, duration: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-accent/10">
                        <item.icon className="h-5 w-5 text-accent" />
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollAnimatedElement>

          {/* Right: Image with Energy Effect */}
          <ScrollAnimatedElement variant="fadeInRight">
            <motion.div 
              className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden group"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
            >
              {/* Energy glow background */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/30 to-red-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-transparent to-red-500/20 opacity-0 group-hover:opacity-75 transition-opacity duration-500" />
              
              {/* Image */}
              <Image
                src="/images/hero-bg-soccer.jpg"
                alt="Goal United squad in action"
                fill
                className="object-cover"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

              {/* Badge overlay */}
              <motion.div 
                className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-accent/20"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                viewport={{ once: true }}
              >
                <p className="text-accent text-sm font-bold tracking-wider mb-1">CHAMPION SQUAD</p>
                <p className="text-foreground text-sm">Built for excellence, destined for glory</p>
              </motion.div>
            </motion.div>
          </ScrollAnimatedElement>
        </div>
      </div>
    </section>
  )
}
