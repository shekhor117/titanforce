'use client'

import { ArrowRight, Play, Users, Trophy, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function SkiperLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/40 border-b border-border/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-lg">⚽</span>
            </div>
            <span className="font-display text-xl font-bold text-foreground">TITAN FORCE</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#players" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Squad
            </Link>
            <Link href="#gallery" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Gallery
            </Link>
            <Link href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Join Us
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center gap-2 mb-6 px-4 py-2 rounded-full glass-badge">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm text-foreground">Experience Elite Football</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-balance text-gradient-auto">
            Titan Force Rising
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-balance leading-relaxed">
            Join us on the journey of excellence. Where passion meets precision, and champions are forged in every match. The future of football starts now.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 group">
              Start Your Journey
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="border-border/40 hover:bg-card/50 gap-2">
              <Play className="w-4 h-4" />
              Watch Highlights
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="glass-card p-4 rounded-lg">
              <div className="text-2xl md:text-3xl font-bold text-accent">50+</div>
              <div className="text-xs md:text-sm text-muted-foreground">Players</div>
            </div>
            <div className="glass-card p-4 rounded-lg">
              <div className="text-2xl md:text-3xl font-bold text-accent">15</div>
              <div className="text-xs md:text-sm text-muted-foreground">Trophies Won</div>
            </div>
            <div className="glass-card p-4 rounded-lg">
              <div className="text-2xl md:text-3xl font-bold text-accent">100%</div>
              <div className="text-xs md:text-sm text-muted-foreground">Passion</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-card/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-balance">
              What Makes Us <span className="text-gradient-auto">Different</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We combine world-class training with cutting-edge technology to develop the next generation of football champions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Trophy,
                title: 'Elite Training',
                description: 'World-class coaching from international football legends'
              },
              {
                icon: Users,
                title: 'Community First',
                description: 'Build lasting connections with passionate football enthusiasts'
              },
              {
                icon: Zap,
                title: 'Performance Tech',
                description: 'Advanced analytics and AI-powered player development'
              },
              {
                icon: Trophy,
                title: 'Global Network',
                description: 'Connect with clubs and players worldwide'
              },
              {
                icon: Users,
                title: 'Mentorship Program',
                description: 'Learn from experienced professionals in the sport'
              },
              {
                icon: Zap,
                title: 'Innovation Hub',
                description: 'Latest tools and technology for competitive advantage'
              }
            ].map((feature, idx) => (
              <div key={idx} className="glass-3d-card p-6 rounded-xl group hover:glass-3d-card">
                <feature.icon className="w-10 h-10 text-accent mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Players Preview Section */}
      <section id="players" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-balance">
              Meet Our <span className="text-gradient-auto">Squad</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Exceptional talent from around the globe, united in pursuit of excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((player) => (
              <div key={player} className="glass-3d-card rounded-lg overflow-hidden group cursor-pointer">
                <div className="aspect-square bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center group-hover:from-primary/40 group-hover:to-accent/30 transition-all">
                  <div className="text-6xl">⚽</div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-foreground mb-1">Player {player}</h3>
                  <p className="text-sm text-muted-foreground mb-3">Forward</p>
                  <div className="flex gap-2">
                    <div className="flex-1 h-1 bg-border/30 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${70 + player * 5}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 gap-2">
              View Full Squad
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-balance">
            Ready to Join the Force?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you&apos;re a player, coach, or enthusiast, there&apos;s a place for you in the Titan Force family.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 group">
            Get Started Today
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 py-12 px-4 sm:px-6 lg:px-8 bg-background/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Follow</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Twitter</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Instagram</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">LinkedIn</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2026 Titan Force. All rights reserved.</p>
            <p>Built with passion for football</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
