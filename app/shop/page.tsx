"use client"

import { useLanguage } from "@/lib/language-context"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ShoppingCart, Star, Filter, Search, ChevronRight } from "lucide-react"
import StoreDataService, { AdminProduct } from "@/lib/store-data-service"

export default function ShopPage() {
  const { language } = useLanguage()
  const { getTotalItems } = useCart()
  const isBn = language === "bn"
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "rating">("rating")
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const categories = [
    { id: "all", label: isBn ? "সব" : "All" },
    { id: "home", label: isBn ? "হোম" : "Home" },
    { id: "away", label: isBn ? "অ্যাওয়ে" : "Away" },
    { id: "training", label: isBn ? "প্রশিক্ষণ" : "Training" },
    { id: "retro", label: isBn ? "রেট্রো" : "Retro" }
  ]

  // Load products from Supabase with realtime updates
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true)
      const data = await StoreDataService.getProducts()
      setProducts(data || [])
      setIsLoading(false)
    }
    
    loadProducts()

    // Subscribe to realtime updates from admin panel
    const unsubscribe = StoreDataService.subscribeToProducts((updatedProducts) => {
      setProducts(updatedProducts)
    }, (error) => {
    })

    return () => unsubscribe()
  }, [])

  let filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description || "").toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Sort products
  if (sortBy === "price-asc") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price)
  } else if (sortBy === "price-desc") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price)
  } else if (sortBy === "rating") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-secondary bg-background/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors">
              <ChevronRight className="w-5 h-5 rotate-180" />
              <span>{isBn ? "ফিরে যান" : "Back"}</span>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">{isBn ? "জার্সি স্টোর" : "Jersey Store"}</h1>
            <Link
              href="/cart"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-foreground rounded-lg hover:bg-primary/80 transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline">{isBn ? "কার্ট" : "Cart"}</span>
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary rounded-lg p-6 mb-8"
        >
          <div className="space-y-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Search className="w-4 h-4 inline mr-2" />
                {isBn ? "খুঁজুন" : "Search"}
              </label>
              <input
                type="text"
                placeholder={isBn ? "জার্সি খুঁজুন..." : "Search jerseys..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                <Filter className="w-4 h-4 inline mr-2" />
                {isBn ? "ক্যাটাগরি" : "Category"}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === cat.id
                        ? "bg-primary text-foreground"
                        : "bg-background border border-primary/20 text-foreground hover:border-primary"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {isBn ? "সাজান" : "Sort By"}
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full md:w-48 px-4 py-2 bg-background border border-primary/20 rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
              >
                <option value="rating">{isBn ? "রেটিং" : "Rating"}</option>
                <option value="price-asc">{isBn ? "দাম: কম থেকে বেশি" : "Price: Low to High"}</option>
                <option value="price-desc">{isBn ? "দাম: বেশি থেকে কম" : "Price: High to Low"}</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/shop/${product.id}`}>
                  <div className="bg-secondary rounded-lg overflow-hidden hover:shadow-lg transition-shadow group h-full flex flex-col">
                    {/* Image */}
                    <div className="relative aspect-square bg-background overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 px-3 py-1 bg-primary text-foreground text-sm font-bold rounded-full">
                        ৳{product.price}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-bold text-foreground text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>

                      {/* Description */}
                      <p className="text-foreground/60 text-sm mb-4 line-clamp-2 flex-1">
                        {product.description}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-foreground/30"}`}
                            />
                          ))}
                        </div>
                        <span className="text-foreground/60 text-sm">
                          {product.rating} ({product.reviews} {isBn ? "রিভিউ" : "reviews"})
                        </span>
                      </div>

                      {/* Stock */}
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${product.stock > 10 ? "text-green-400" : "text-orange-400"}`}>
                          {product.stock > 0 ? (isBn ? "স্টক আছে" : "In Stock") : (isBn ? "স্টক নেই" : "Out of Stock")}
                        </span>
                        <span className="text-xs text-foreground/60">
                          ({product.stock} {isBn ? "বাকি" : "left"})
                        </span>
                      </div>

                      {/* Button */}
                      <button className="mt-4 w-full px-4 py-2 bg-primary text-foreground font-medium rounded-lg hover:bg-primary/80 transition-colors">
                        {isBn ? "দেখুন" : "View"}
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-foreground/60 text-lg">
              {isBn ? "কোন জার্সি পাওয়া যায়নি" : "No jerseys found"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
