'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, ArrowRight, Star, Zap } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { formatBDT } from '@/lib/currency'

export default function StorePage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'

  const storeCategories = [
    {
      id: 1,
      name: isBn ? 'জার্সি' : 'Jerseys',
      description: isBn ? 'কাস্টমাইজড জার্সি সব খেলোয়াড়দের সাথে' : 'Customized jerseys with all players',
      href: '/store/jerseys',
      icon: '👕',
      image: '/images/jersey-store.jpg',
      featured: true,
      price: isBn ? 'শুরু ৳4,950' : 'From ৳4,950',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 px-3 sm:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className={`font-[var(--font-display)] text-4xl sm:text-5xl lg:text-6xl tracking-wider mb-4 bg-clip-text text-transparent ${isBn ? 'font-[var(--font-bengali)]' : ''}`} style={{ backgroundImage: 'linear-gradient(107deg, #a71930 0%, #465fb1 100%)' }}>
              {isBn ? 'টাইটান ফোর্স স্টোর' : 'Titan Force Store'}
            </h1>
            <p className={`text-foreground/60 text-lg mb-8 max-w-2xl mx-auto ${isBn ? 'font-[var(--font-bengali)]' : ''}`}>
              {isBn ? 'আপনার প্রিয় খেলোয়াড়ের সাথে অফিসিয়াল জার্সি এবং মার্চেন্ডাইজ কিনুন' : 'Shop official jerseys and merchandise featuring your favorite players'}
            </p>
          </div>

          {/* Store Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {storeCategories.map((category) => (
              <Link
                key={category.id}
                href={category.href}
                className="group relative overflow-hidden rounded-xl border-2 border-primary/30 hover:border-primary transition-all bg-card hover:shadow-lg"
              >
                <div className="relative h-64 sm:h-72 overflow-hidden bg-muted">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      {category.icon}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className={`text-xl sm:text-2xl font-bold text-foreground mb-2 ${isBn ? 'font-[var(--font-bengali)]' : ''}`}>
                        {category.name}
                      </h3>
                      <p className={`text-sm text-foreground/60 ${isBn ? 'font-[var(--font-bengali)]' : ''}`}>
                        {category.description}
                      </p>
                    </div>
                    {category.featured && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-primary/20 text-primary rounded-full text-xs font-semibold whitespace-nowrap">
                        <Zap className="w-3 h-3" />
                        {isBn ? 'জনপ্রিয়' : 'Popular'}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`text-lg font-bold text-primary ${isBn ? 'font-[var(--font-bengali)]' : ''}`}>
                      {category.price}
                    </span>
                    <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 px-3 sm:px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-12 ${isBn ? 'font-[var(--font-bengali)]' : ''}`}>
            {isBn ? 'কেন আমাদের কিনবেন?' : 'Why Shop With Us?'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '⚽',
                title: isBn ? 'প্রকৃত খেলোয়াড়দের' : 'Real Players',
                desc: isBn ? 'সব খেলোয়াড়দের সাথে অফিসিয়াল জার্সি' : 'Official jerseys with all players',
              },
              {
                icon: '🎨',
                title: isBn ? 'কাস্টমাইজ করুন' : 'Customize',
                desc: isBn ? 'নিজের পছন্দমত নাম এবং নম্বর যোগ করুন' : 'Add your own name and number',
              },
              {
                icon: '💳',
                title: isBn ? 'সহজ পেমেন্ট' : 'Easy Payment',
                desc: isBn ? 'নিরাপদ চেকআউট BDT এ' : 'Secure checkout in BDT',
              },
              {
                icon: '🚚',
                title: isBn ? 'দ্রুত ডেলিভারি' : 'Fast Delivery',
                desc: isBn ? 'সারাদেশে দ্রুত ডেলিভারি' : 'Delivery across Bangladesh',
              },
              {
                icon: '⭐',
                title: isBn ? 'উচ্চ মানের' : 'Quality',
                desc: isBn ? 'প্রিমিয়াম ফ্যাব্রিক এবং প্রিন্টিং' : 'Premium fabric and printing',
              },
              {
                icon: '💰',
                title: isBn ? 'সাশ্রয়ী মূল্য' : 'Best Price',
                desc: isBn ? 'প্রতিযোগিতামূলক দামে সেরা মান' : 'Competitive prices for quality',
              },
            ].map((feature, idx) => (
              <div key={idx} className="p-6 rounded-lg border-2 border-primary/20 hover:border-primary/50 bg-background hover:bg-muted/50 transition-all text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className={`font-bold text-lg mb-2 ${isBn ? 'font-[var(--font-bengali)]' : ''}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm text-foreground/60 ${isBn ? 'font-[var(--font-bengali)]' : ''}`}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 px-3 sm:px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="p-8 sm:p-12 rounded-xl border-2 border-primary bg-gradient-to-br from-primary/10 to-primary/5">
            <h2 className={`text-2xl sm:text-3xl font-bold mb-4 ${isBn ? 'font-[var(--font-bengali)]' : ''}`}>
              {isBn ? 'আপনার প্রিয় জার্সি খুঁজে পান' : 'Find Your Favorite Jersey'}
            </h2>
            <p className={`text-foreground/60 mb-8 ${isBn ? 'font-[var(--font-bengali)]' : ''}`}>
              {isBn ? 'সমস্ত খেলোয়াড়ের কাস্টমাইজড জার্সি এখন উপলব্ধ' : 'Get customized jerseys for all players now'}
            </p>
            <Link
              href="/store/jerseys"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {isBn ? 'স্টোরে যান' : 'Go to Store'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
