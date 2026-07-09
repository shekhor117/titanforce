'use client'

import { motion } from 'framer-motion'
import { Trophy, Users, Zap } from 'lucide-react'
import { ScrollAnimatedElement } from './scroll-animated-element'
import Image from 'next/image'

const challenges = [
  {
    icon: Trophy,
    title: 'Win Every Challenge',
    description: 'Competing at the highest level with unwavering focus',
    color: 'from-accent',
  },
  {
    icon: Zap,
    title: 'Unleash Your Potential',
    description: 'Pushing boundaries and breaking performance records',
    color: 'from-red-500',
  },
  {
    icon: Users,
    title: 'Build Championship Unity',
    description: 'United passion, collective excellence, shared glory',
    color: 'from-orange-500',
  },
]

export function HomeChallengesSection() {
  return (
    <section className="relative py-20 md:py-28 px-4 bg-gradient-to-b from-background to-card/30 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 right-20 w-96 h-96 bg-accent/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <ScrollAnimatedElement variant="fadeInUp">
          <div className="text-center mb-16">
            <motion.div 
              className="inline-flex items-center gap-2 text-accent text-xs font-bold tracking-widest mb-4"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              <span className="h-1 w-3 bg-accent rounded-full" />
              OUR CHALLENGES FOR ALL
            </motion.div>

            <motion.h2 
              className="text-4xl md:text-5xl font-black text-foreground mb-4 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              Collective <span className="bg-gradient-to-r from-accent to-red-500 bg-clip-text text-transparent">Goals & Vision</span>
            </motion.h2>

            <motion.p 
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              Every challenge is an opportunity to showcase our strength, unity, and commitment to excellence
            </motion.p>
          </div>
        </ScrollAnimatedElement>

        {/* Challenges Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {challenges.map((challenge, idx) => {
            const Icon = challenge.icon
            return (
              <ScrollAnimatedElement
                key={idx}
                variant="fadeInUp"
                delay={idx * 0.1}
              >
                <motion.div
                  className="group relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  {/* Gradient border */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${challenge.color} to-transparent rounded-xl blur opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
                  
                  <div className="relative bg-card/60 backdrop-blur-sm border border-accent/10 group-hover:border-accent/30 rounded-xl p-8 text-center transition-all duration-300 h-full flex flex-col">
                    {/* Icon */}
                    <motion.div 
                      className="mb-6 flex justify-center"
                      whileHover={{ scale: 1.15, rotate: 10 }}
                    >
                      <div className={`p-4 rounded-lg bg-gradient-to-br ${challenge.color} to-transparent`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-xl font-black text-foreground mb-3">{challenge.title}</h3>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1">{challenge.description}</p>

                    {/* Bottom accent line */}
                    <div className="mt-6 pt-6 border-t border-accent/10 group-hover:border-accent/30 transition-colors">
                      <motion.div
                        className="h-1 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ delay: idx * 0.15 + 0.3, duration: 0.6 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>
                </motion.div>
              </ScrollAnimatedElement>
            )
          })}
        </div>

        {/* Background image with overlay */}
        <ScrollAnimatedElement variant="fadeInUp">
          <motion.div 
            className="relative rounded-2xl overflow-hidden h-96 group"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/40 to-red-500/40 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <Image
              src="/images/hero-bg-soccer.jpg"
              alt="Team challenge in action"
              fill
              className="object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

            {/* Center text */}
            <motion.div 
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              viewport={{ once: true }}
            >
              <p className="text-accent text-xs font-bold tracking-widest mb-2">UNITED IN PURPOSE</p>
              <p className="text-3xl md:text-4xl font-black text-white max-w-2xl">
                Every Match, Every Moment, <span className="text-accent">One Goal</span>
              </p>
            </motion.div>
          </motion.div>
        </ScrollAnimatedElement>
      </div>
    </section>
  )
}
