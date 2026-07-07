'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import StoreDataService, { StoreProduct } from '@/lib/store-data-service'
import { ScrollProgressAnimation } from './scroll-progress-animation'

export function HomeShopLatest() {
  const [products, setProducts] = useState<StoreProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true)
      const data = await StoreDataService.getFeaturedProducts(6)
      setProducts(data || [])
      setIsLoading(false)
    }

    loadProducts()

    // Subscribe to realtime updates
    const unsubscribe = StoreDataService.subscribeToProducts((updatedProducts) => {
      setProducts(updatedProducts.slice(0, 6))
    }, (error) => {
    })

    return () => unsubscribe()
  }, [])

  return (
    <section className="py-12 md:py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-accent rounded-full" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground uppercase tracking-wider">
              Shop
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-accent hover:text-primary text-sm font-semibold flex items-center gap-2 transition-colors group"
          >
            View all products
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Featured Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-muted rounded-lg mb-3" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {products.map((product, idx) => (
              <ScrollProgressAnimation key={product.id} delay={idx * 0.06} animationType="scale">
              <Link
                key={product.id}
                href={`/shop/${product.id}`}
                className="group relative"
              >
                {/* Product Card */}
                <div className="neo-floating relative overflow-hidden">
                  {/* Product Image */}
                  <div className="relative w-full aspect-square bg-gradient-to-br from-red-900/40 to-black/60 overflow-hidden">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          // Show fallback if image fails to load
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : null}
                    {/* Fallback gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 to-black/60 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl text-red-500/20 font-bold mb-1">📦</div>
                        <p className="text-xs text-white/30">Product</p>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-3 bg-black/60 backdrop-blur-sm">
                    <h3 className="text-xs font-bold text-foreground group-hover:text-red-500 transition-colors line-clamp-2 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-red-500 font-bold">৳{product.price}</p>
                  </div>
                </div>
              </Link>
              </ScrollProgressAnimation>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/shop"
            className="neo-btn neo-btn-primary inline-flex items-center gap-2"
          >
            View all products
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
