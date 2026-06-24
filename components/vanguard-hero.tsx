'use client'

import { useState } from 'react'
import { ArrowUpRight, Award, Crown, X } from 'lucide-react'

export function VanguardHero() {
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = ['Projects', 'Studio', 'Offerings', 'Inquire']
  const stats = [
    { value: '250+', label: 'Brands Transformed' },
    { value: '95%', label: 'Client Retention' },
    { value: '10+', label: 'Years in the Game' },
  ]

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_154941_df1a96e1-a06f-450c-bd02-d863414cc1a0.mp4"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Navbar */}
        <nav className="px-6 sm:px-10 lg:px-16 py-5 lg:py-7 flex items-center justify-between">
          {/* Brand */}
          <div className="font-podium text-white font-bold uppercase tracking-wider text-2xl sm:text-3xl">
            VANGUARD
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="font-inter text-sm text-white/80 tracking-widest uppercase hover:text-white transition-colors"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Desktop CTA / Mobile Hamburger */}
          <div className="hidden md:flex items-center gap-4">
            <button className="border border-white/30 hover:border-white/60 px-6 py-3 text-xs tracking-widest uppercase hover:bg-white/10 transition-all flex items-center gap-2">
              GET IN TOUCH
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5"
          >
            <div className="w-6 h-0.5 bg-white transition-all" />
            <div className="w-6 h-0.5 bg-white transition-all" />
            <div className="w-4 h-0.5 bg-white transition-all" />
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-sm md:hidden transition-all duration-500 ${
            menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Menu Header */}
            <div className="px-6 sm:px-10 py-5 flex items-center justify-between border-b border-white/10">
              <div className="font-podium text-white font-bold uppercase tracking-wider text-2xl">
                VANGUARD
              </div>
              <button onClick={() => setMenuOpen(false)}>
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Menu Links */}
            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              {navLinks.map((link, i) => (
                <a
                  key={link}
                  href="#"
                  onClick={() => setMenuOpen(false)}
                  className="font-podium text-4xl sm:text-5xl text-white uppercase"
                  style={{
                    opacity: menuOpen ? 1 : 0,
                    transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                    transition: `all 0.5s ease-out`,
                    transitionDelay: menuOpen ? `${i * 0.08 + 0.1}s` : '0s',
                  }}
                >
                  {link}
                </a>
              ))}
              <button
                onClick={() => setMenuOpen(false)}
                className="border border-white/30 hover:border-white/60 px-6 py-3 text-xs tracking-widest uppercase hover:bg-white/10 transition-all flex items-center gap-2 mt-4"
                style={{
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.5s ease-out`,
                  transitionDelay: menuOpen ? `${navLinks.length * 0.08 + 0.1}s` : '0s',
                }}
              >
                GET IN TOUCH
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="flex-1 flex items-center px-6 sm:px-10 lg:px-16">
          <div className="max-w-2xl">
            {/* Tagline */}
            <div className="animate-fade-up flex items-center gap-2 mb-6 lg:mb-8">
              <Crown className="w-4 h-4 text-white/70" />
              <span className="font-inter text-xs sm:text-sm text-white/70 tracking-[0.3em] uppercase">
                World-Class Digital Collective
              </span>
            </div>

            {/* Main Heading */}
            <div className="animate-fade-up-delay-1 mb-6 lg:mb-8 leading-[0.92]">
              <h1 className="font-podium text-white uppercase tracking-tight text-[clamp(2.8rem,8vw,7rem)]">
                Design.
              </h1>
              <h1 className="font-podium text-white uppercase tracking-tight text-[clamp(2.8rem,8vw,7rem)]">
                Disrupt.
              </h1>
              <h1 className="font-podium text-white uppercase tracking-tight text-[clamp(2.8rem,8vw,7rem)]">
                Conquer.
              </h1>
            </div>

            {/* Subtext */}
            <div className="animate-fade-up-delay-2 mt-6 lg:mt-8">
              <p className="font-inter text-sm sm:text-base text-white/70 leading-relaxed max-w-md">
                We build fierce brand identities that don&apos;t just turn heads --{' '}
                <span className="text-white font-semibold">they lead.</span>
              </p>
            </div>

            {/* CTA Row */}
            <div className="animate-fade-up-delay-3 mt-8 lg:mt-10 flex flex-wrap items-center gap-4 sm:gap-6">
              <button className="group bg-black hover:bg-neutral-900 px-5 sm:px-7 py-3 sm:py-4 text-[11px] sm:text-xs font-inter tracking-widest uppercase text-white flex items-center gap-2 transition-all">
                SEE OUR WORK
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
              <div className="hidden sm:flex items-center gap-3">
                <Award className="w-8 h-8 text-white/50" />
                <div>
                  <p className="font-inter text-white/60 text-xs tracking-wider uppercase">Top-Rated</p>
                  <p className="font-inter text-white/60 text-xs tracking-wider uppercase">Brand Studio</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="animate-fade-up-delay-4 mt-8 sm:mt-10 lg:mt-14 flex flex-wrap gap-6 sm:gap-12 lg:gap-16">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-inter text-white text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                    {stat.value}
                  </p>
                  <p className="font-inter text-white/50 text-[9px] sm:text-xs tracking-widest uppercase mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
