"use client"

import { TransitionLink } from "@/components/transition-link"
import { TextReveal } from "@/components/text-reveal"
import { motion } from "framer-motion"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <div
          role="img"
          aria-label="Illustration of a football player sliding toward a soccer ball"
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
          style={{
            backgroundImage:
              "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20261005-212012-VuqlKBV1F1U24jJfSf4gmcYv7PyZxP.jpeg)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-background via-background/70 to-background/30 sm:to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(40,224,193,0.2),transparent_28%),radial-gradient(circle_at_18%_78%,rgba(255,77,90,0.18),transparent_32%)]" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-12 sm:pb-24 grid lg:grid-cols-[1.3fr_0.7fr] gap-8 lg:gap-10 min-h-[560px] sm:min-h-[680px]">
        <div className="flex flex-col justify-center">
          <motion.div 
            className="inline-flex items-center gap-2 text-primary text-[10px] sm:text-xs font-bold tracking-[0.4em] mb-4 sm:mb-6 w-fit"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            <span className="h-px w-6 sm:w-8 bg-accent" /> RISE LIKE TITANS
          </motion.div>
          
          <h1 className="font-display font-bold leading-[0.85]">
            <TextReveal 
              variant="characters"
              duration={0.03}
              staggerChildren={0.01}
              delay={0.2}
              className="block text-foreground text-[clamp(2.25rem,11vw,8rem)] tracking-[0.1em]"
            >
              TITAN FORCE
            </TextReveal>
            <TextReveal 
              variant="characters"
              duration={0.03}
              staggerChildren={0.01}
              delay={0.4}
              className="block text-primary text-[clamp(2.75rem,13vw,10rem)] tracking-[0.1em]"
            >
              MULIKANDI
            </TextReveal>
          </h1>
          
          <motion.p 
            className="mt-5 sm:mt-6 text-muted-foreground max-w-md text-sm leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
          >
            Pride of Mulikandi. Power of the Titans. We are more than a club. We are a legacy in the making.
          </motion.p>
          <motion.div 
            className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            viewport={{ once: true }}
          >
            <TransitionLink href="/team-squad" className="no-underline">
              <motion.button 
                className="neo-btn-primary neo-btn group inline-flex items-center gap-2 px-5 sm:px-6 py-3 text-[11px] sm:text-xs font-bold tracking-[0.2em]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                OUR PLAYER
              </motion.button>
            </TransitionLink>
            <TransitionLink href="/fixtures-results" className="no-underline">
              <motion.button 
                className="neo-btn inline-flex items-center gap-3 px-4 sm:px-5 py-3 text-[11px] sm:text-xs font-bold tracking-[0.2em]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                MATCHES
              </motion.button>
            </TransitionLink>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
