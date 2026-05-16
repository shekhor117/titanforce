"use client"

import { useLanguage } from "@/lib/language-context"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Trash2, ShoppingCart, ChevronLeft, Plus, Minus } from "lucide-react"

export default function CartPage() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const router = useRouter()
  const { items, removeItem, updateQuantity, getTotalPrice, getSubtotal, getTax, getShipping, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <ShoppingCart className="w-16 h-16 text-foreground/30 mb-4" />
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {isBn ? "কার্ট খালি" : "Cart is Empty"}
        </h1>
        <p className="text-foreground/60 mb-8">
          {isBn ? "এখনও কোন পণ্য যোগ করেননি" : "You haven't added any jerseys yet"}
        </p>
        <Link
          href="/shop"
          className="px-6 py-3 bg-primary text-foreground rounded-lg hover:bg-primary/80 transition-colors flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5 rotate-180" />
          {isBn ? "শপে ফিরুন" : "Back to Shop"}
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-secondary bg-background/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/shop" className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors">
              <ChevronLeft className="w-5 h-5" />
              <span>{isBn ? "শপিং চালিয়ে যান" : "Continue Shopping"}</span>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">{isBn ? "আপনার কার্ট" : "Your Cart"}</h1>
            <div className="w-20" /> {/* Spacer */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div className="space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.cartId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-secondary rounded-lg p-4 sm:p-6 flex gap-4"
                >
                  {/* Image */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-background rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground text-lg mb-2">{item.name}</h3>
                    <div className="space-y-1 text-sm text-foreground/60 mb-4">
                      <p>{isBn ? "সাইজ" : "Size"}: <span className="text-foreground font-medium">{item.selectedSize}</span></p>
                      <p>{isBn ? "রঙ" : "Color"}: <span className="text-foreground font-medium">{item.selectedColor}</span></p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      {/* Price */}
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </p>
                        <p className="text-sm text-foreground/60">
                          ৳{item.price.toLocaleString()} x {item.quantity}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                          className="px-2 py-1 bg-background border border-primary/20 rounded hover:border-primary transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-bold text-foreground">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                          className="px-2 py-1 bg-background border border-primary/20 rounded hover:border-primary transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.cartId)}
                        className="text-red-400 hover:text-red-300 transition-colors p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-secondary rounded-lg p-6 h-fit sticky top-20"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {isBn ? "অর্ডার সারসংক্ষেপ" : "Order Summary"}
            </h2>

            <div className="space-y-4 mb-6 pb-6 border-b border-primary/20">
              <div className="flex justify-between text-foreground">
                <span>{isBn ? "সাবটোটাল" : "Subtotal"}</span>
                <span>৳{getSubtotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-foreground">
                <span>{isBn ? "কর" : "Tax"} (15%)</span>
                <span>৳{getTax().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-foreground">
                <span>{isBn ? "ডেলিভারি" : "Shipping"}</span>
                <span>৳{getShipping().toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between mb-6">
              <span className="text-lg font-bold text-foreground">{isBn ? "মোট" : "Total"}</span>
              <span className="text-2xl font-bold text-primary">৳{getTotalPrice().toLocaleString()}</span>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="w-full px-6 py-3 bg-primary text-foreground font-bold rounded-lg hover:bg-primary/80 transition-colors mb-3"
            >
              {isBn ? "চেকআউট" : "Checkout"}
            </button>

            <button
              onClick={() => router.push("/shop")}
              className="w-full px-6 py-3 bg-secondary border border-primary/20 text-foreground font-bold rounded-lg hover:border-primary transition-colors"
            >
              {isBn ? "শপিং চালিয়ে যান" : "Continue Shopping"}
            </button>

            <button
              onClick={() => clearCart()}
              className="w-full mt-4 px-6 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors rounded-lg text-sm"
            >
              {isBn ? "কার্ট পরিষ্কার করুন" : "Clear Cart"}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
