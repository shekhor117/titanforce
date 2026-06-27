"use client"

import { useLanguage } from "@/lib/language-context"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, Check, Loader2, AlertCircle } from "lucide-react"
import { PageEntrance } from '@/components/page-entrance'

export default function CheckoutPage() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const router = useRouter()
  const { items, getTotalPrice, getSubtotal, getTax, getShipping, clearCart } = useCart()

  const [isProcessing, setIsProcessing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: ""
  })

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <AlertCircle className="w-16 h-16 text-foreground/30 mb-4" />
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {isBn ? "কার্ট খালি" : "Cart is Empty"}
        </h1>
        <p className="text-foreground/60 mb-8">
          {isBn ? "চেকআউট করার জন্য কার্টে পণ্য যোগ করুন" : "Add items to cart before checking out"}
        </p>
        <Link
          href="/shop"
          className="neo-btn px-primary py-primary bg-primary text-foreground rounded-lg hover:bg-primary/80 transition-colors flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5 rotate-180" />
          {isBn ? "শপে ফিরুন" : "Back to Shop"}
        </Link>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      setError(isBn ? "সব ফিল্ড পূরণ করুন" : "Please fill all required fields")
      return
    }

    if (!formData.cardNumber || !formData.expiry || !formData.cvv) {
      setError(isBn ? "সব পেমেন্ট তথ্য পূরণ করুন" : "Please fill all payment details")
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock successful payment
      const orderId = `TF-${Date.now()}`
      setOrderPlaced(true)
      
      // Clear cart after successful order
      setTimeout(() => {
        clearCart()
      }, 3000)
    } catch (err) {
      setError(isBn ? "পেমেন্ট ব্যর্থ হয়েছে" : "Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-green-500/20 border border-green-500/50 rounded-full p-4 mb-4"
        >
          <Check className="w-16 h-16 text-green-400" />
        </motion.div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          {isBn ? "অর্ডার সফল!" : "Order Successful!"}
        </h1>
        <p className="text-foreground/60 text-lg mb-8 text-center max-w-md">
          {isBn 
            ? "আপনার অর্ডার সফলভাবে প্রক্রিয়া করা হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।"
            : "Your order has been placed successfully. We'll contact you soon with delivery details."
          }
        </p>
        <div className="mb-8 text-center">
          <p className="text-foreground/60">{isBn ? "অর্ডার আইডি" : "Order ID"}</p>
          <p className="text-2xl font-bold text-primary">TF-{Date.now()}</p>
        </div>
        <Link
          href="/"
          className="neo-btn px-primary py-primary bg-primary text-foreground rounded-lg hover:bg-primary/80 transition-colors"
        >
          {isBn ? "হোমে ফিরুন" : "Back to Home"}
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-secondary bg-background/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/cart" className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span>{isBn ? "কার্টে ফিরুন" : "Back to Cart"}</span>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">{isBn ? "চেকআউট" : "Checkout"}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            {/* Shipping Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-secondary rounded-lg p-6"
            >
              <h2 className="text-xl font-bold text-foreground mb-4">
                {isBn ? "ডেলিভারি তথ্য" : "Delivery Information"}
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder={isBn ? "সম্পূর্ণ নাম" : "Full Name"}
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="neo-input w-full px-4 py-2 bg-background rounded-lg text-foreground placeholder-foreground/40 focus:outline-none transition-colors"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder={isBn ? "ইমেইল" : "Email"}
                  value={formData.email}
                  onChange={handleInputChange}
                  className="neo-input w-full px-4 py-2 bg-background rounded-lg text-foreground placeholder-foreground/40 focus:outline-none transition-colors"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder={isBn ? "ফোন নম্বর" : "Phone Number"}
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="neo-input w-full px-4 py-2 bg-background rounded-lg text-foreground placeholder-foreground/40 focus:outline-none transition-colors"
                  required
                />
                <textarea
                  name="address"
                  placeholder={isBn ? "পূর্ণ ঠিকানা" : "Full Address"}
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="neo-input w-full px-4 py-2 bg-background rounded-lg text-foreground placeholder-foreground/40 focus:outline-none transition-colors"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder={isBn ? "শহর" : "City"}
                    value={formData.city}
                    onChange={handleInputChange}
                    className="neo-input w-full px-4 py-2 bg-background rounded-lg text-foreground placeholder-foreground/40 focus:outline-none transition-colors"
                  />
                  <input
                    type="text"
                    name="postalCode"
                    placeholder={isBn ? "পোস্টাল কোড" : "Postal Code"}
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="neo-input w-full px-4 py-2 bg-background rounded-lg text-foreground placeholder-foreground/40 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </motion.div>

            {/* Payment Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-secondary rounded-lg p-6"
            >
              <h2 className="text-xl font-bold text-foreground mb-4">
                {isBn ? "পেমেন্ট তথ্য" : "Payment Information"}
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="cardName"
                  placeholder={isBn ? "কার্ড ধারকের নাম" : "Cardholder Name"}
                  value={formData.cardName}
                  onChange={handleInputChange}
                  className="neo-input w-full px-4 py-2 bg-background rounded-lg text-foreground placeholder-foreground/40 focus:outline-none transition-colors"
                  required
                />
                <input
                  type="text"
                  name="cardNumber"
                  placeholder={isBn ? "কার্ড নম্বর" : "Card Number"}
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  maxLength={16}
                  className="neo-input w-full px-4 py-2 bg-background rounded-lg text-foreground placeholder-foreground/40 focus:outline-none transition-colors font-mono"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/YY"
                    value={formData.expiry}
                    onChange={handleInputChange}
                    maxLength={5}
                    className="neo-input w-full px-4 py-2 bg-background rounded-lg text-foreground placeholder-foreground/40 focus:outline-none transition-colors font-mono"
                    required
                  />
                  <input
                    type="text"
                    name="cvv"
                    placeholder="CVV"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    maxLength={3}
                    className="neo-input w-full px-4 py-2 bg-background rounded-lg text-foreground placeholder-foreground/40 focus:outline-none transition-colors font-mono"
                    required
                  />
                </div>
              </div>
            </motion.div>

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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="neo-btn neo-btn-primary neo-btn neo-btn-primary w-full px-4 py-2 bg-primary text-foreground font-bold rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isBn ? "প্রক্রিয়া করছে..." : "Processing..."}
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  {isBn ? "অর্ডার সম্পূর্ণ করুন" : "Complete Order"}
                </>
              )}
            </button>
          </form>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-secondary rounded-lg p-6 h-fit sticky top-20"
          >
            <h2 className="text-xl font-bold text-foreground mb-4">
              {isBn ? "অর্ডার সারসংক্ষেপ" : "Order Summary"}
            </h2>

            <div className="space-y-3 mb-4 pb-4 border-b border-primary/20">
              {items.map(item => (
                <div key={item.cartId} className="flex justify-between text-sm text-foreground/80">
                  <span>{item.name} x{item.quantity}</span>
                  <span>৳{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-4 pb-4 border-b border-primary/20">
              <div className="flex justify-between text-foreground">
                <span>{isBn ? "সাবটোটাল" : "Subtotal"}</span>
                <span>৳{getSubtotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-foreground">
                <span>{isBn ? "কর" : "Tax"}</span>
                <span>৳{getTax().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-foreground">
                <span>{isBn ? "ডেলিভারি" : "Shipping"}</span>
                <span>৳{getShipping().toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold text-foreground mb-6">
              <span>{isBn ? "মোট" : "Total"}</span>
              <span className="text-primary">৳{getTotalPrice().toLocaleString()}</span>
            </div>

            <p className="text-xs text-foreground/60 text-center">
              {isBn ? "সব লেনদেন সুরক্ষিত এবং এনক্রিপ্ট করা" : "All transactions are secure and encrypted"}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
