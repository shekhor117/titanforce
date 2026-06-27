"use client"

import { useLanguage } from "@/lib/language-context"
import { useCart } from "@/lib/cart-context"
import { useRouter, useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Star, ShoppingCart, Check, ChevronLeft, AlertCircle } from "lucide-react"
import StoreDataService, { StoreProduct } from "@/lib/store-data-service"
import { PageEntrance } from '@/components/page-entrance'

export default function ProductDetailPage() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const [product, setProduct] = useState<StoreProduct | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true)
      const data = await StoreDataService.getProductById(productId)
      setProduct(data || null)
      setIsLoading(false)
    }
    loadProduct()
  }, [productId])

  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const [error, setError] = useState("")

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60">{isBn ? "লোড হচ্ছে..." : "Loading..."}</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {isBn ? "পণ্য পাওয়া যায়নি" : "Product Not Found"}
          </h1>
          <button
            onClick={() => router.push("/shop")}
            className="neo-btn px-primary py-primary bg-primary text-foreground rounded-lg hover:bg-primary/80 transition-colors"
          >
            {isBn ? "শপে ফিরুন" : "Back to Shop"}
          </button>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    setError("")

    if (!selectedSize) {
      setError(isBn ? "সাইজ নির্বাচন করুন" : "Please select a size")
      return
    }

    if (!selectedColor) {
      setError(isBn ? "রঙ নির্বাচন করুন" : "Please select a color")
      return
    }

    addItem(product, quantity, selectedSize, selectedColor)
    setIsAdded(true)

    setTimeout(() => {
      setIsAdded(false)
      setSelectedSize("")
      setSelectedColor("")
      setQuantity(1)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-secondary bg-background/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="neo-btn flex items-center gap-2 text-foreground px-3 py-2 rounded transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>{isBn ? "ফিরে যান" : "Back"}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Image */}
          <div className="bg-secondary rounded-lg overflow-hidden h-96 lg:h-full flex items-center justify-center">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Category */}
            <div>
              <span className="neo-btn neo-btn-primary px-4 py-2 bg-primary/20 text-primary text-sm font-medium rounded-full neo-input/30">
                {product.category.toUpperCase()}
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{product.name}</h1>
              <p className="text-foreground/60 text-lg">{product.description}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-foreground/30"}`}
                  />
                ))}
              </div>
              <span className="text-foreground/60">
                {product.rating} ({product.reviews} {isBn ? "রিভিউ" : "reviews"})
              </span>
            </div>

            {/* Price */}
            <div className="text-4xl font-bold text-primary">
              ৳{product.price.toLocaleString()}
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-bold text-foreground mb-3">
                {isBn ? "বৈশিষ্ট্যসমূহ" : "Features"}
              </h3>
              <ul className="space-y-2">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-foreground/80">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-bold text-foreground mb-3">
                {isBn ? "সাইজ নির্বাচন করুন" : "Select Size"}
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-3 rounded-lg font-bold transition-colors ${
                      selectedSize === size
                        ? "bg-primary text-foreground"
                        : "bg-secondary neo-input border text-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-lg font-bold text-foreground mb-3">
                {isBn ? "রঙ নির্বাচন করুন" : "Select Color"}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                      selectedColor === color
                        ? "bg-primary text-foreground"
                        : "bg-secondary neo-input border text-foreground"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-bold text-foreground mb-3">
                {isBn ? "পরিমাণ" : "Quantity"}
              </h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="neo-btn px-secondary py-secondary bg-secondary neo-input border rounded-lg hover:bg-background transition-colors"
                >
                  −
                </button>
                <span className="text-2xl font-bold text-foreground w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="neo-btn px-secondary py-secondary bg-secondary neo-input border rounded-lg hover:bg-background transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Add to Cart Button */}
            <motion.button
              onClick={handleAddToCart}
              animate={isAdded ? { scale: 0.95 } : { scale: 1 }}
              className={`w-full py-3 rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-2 ${
                isAdded
                  ? "bg-green-500 text-white"
                  : "bg-primary text-foreground hover:bg-primary/80"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-6 h-6" />
                  {isBn ? "যোগ করা হয়েছে!" : "Added to Cart!"}
                </>
              ) : (
                <>
                  <ShoppingCart className="w-6 h-6" />
                  {isBn ? "কার্টে যোগ করুন" : "Add to Cart"}
                </>
              )}
            </motion.button>

            {/* Stock Info */}
            <div className="p-4 bg-secondary rounded-lg">
              <p className={`text-sm font-medium ${product.stock > 10 ? "text-green-400" : product.stock > 0 ? "text-orange-400" : "text-red-400"}`}>
                {product.stock > 0 
                  ? isBn 
                    ? `${product.stock} টি উপলব্ধ` 
                    : `${product.stock} in stock`
                  : isBn
                    ? "স্টক নেই"
                    : "Out of stock"
                }
              </p>
            </div>
          </div>
        </motion.div>

        {/* Related Products */}
        <div className="mt-16 pt-8 border-t border-secondary">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            {isBn ? "অন্যান্য জার্সি" : "More Jerseys"}
          </h2>
          {/* Related products component can be added here */}
        </div>
      </div>
    </div>
  )
}
