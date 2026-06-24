'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

// Featured products with details
const featuredProducts = [
  {
    id: 1,
    name: 'Home Jersey',
    price: '$1,299',
    image: '/products/home-jersey.jpg',
  },
  {
    id: 2,
    name: 'Away Jersey',
    price: '$1,299',
    image: '/products/away-jersey.jpg',
  },
  {
    id: 3,
    name: 'Training Kit',
    price: '$1,199',
    image: '/products/training-kit.jpg',
  },
  {
    id: 4,
    name: 'Winter Bundle',
    price: '$1,599',
    image: '/products/winter-bundle.jpg',
  },
  {
    id: 5,
    name: 'TFM Cap',
    price: '$19',
    image: '/products/tfm-cap.jpg',
  },
  {
    id: 6,
    name: 'Scarf',
    price: '$29',
    image: '/products/scarf.jpg',
  },
]

export function HomeShopLatest() {
  return (
    <section className="py-12 md:py-16 px-4 bg-black/40">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-accent rounded-full" />
            <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-wider">
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              href="/shop"
              className="group relative"
            >
              {/* Product Card */}
              <div className="relative overflow-hidden rounded-lg border border-red-500/20 hover:border-red-500/50 transition-all duration-300">
                {/* Product Image */}
                <div className="relative w-full aspect-square bg-gradient-to-br from-red-900/40 to-black/60 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      // Show fallback if image fails to load
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  {/* Fallback gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 to-black/60 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl text-red-500/20 font-bold mb-1">📦</div>
                      <p className="text-xs text-white/30">Product</p>
                    </div>
                  </div>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Product Info */}
                <div className="p-3 bg-black/60 backdrop-blur-sm">
                  <h3 className="text-xs font-bold text-white group-hover:text-red-500 transition-colors line-clamp-2 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-red-500 font-bold">{product.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-white text-sm uppercase tracking-widest rounded transition-all group"
          >
            View all products
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
