"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/language-context"
import { ShoppingBag, Plus, Minus, X, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Product {
  id: string
  name: { en: string; bn: string }
  description: { en: string; bn: string }
  price: number
  category: "jersey" | "training" | "accessories"
  images: string[]
  sizes?: string[]
  isNew?: boolean
  isBestseller?: boolean
}

interface CartItem {
  product: Product
  size?: string
  quantity: number
}

const products: Product[] = [
  {
    id: "home-jersey-24",
    name: { en: "Home Jersey 2024/25", bn: "হোম জার্সি ২০২৪/২৫" },
    description: {
      en: "Official Titan Force home jersey with breathable fabric and embroidered crest.",
      bn: "অফিসিয়াল টাইটান ফোর্স হোম জার্সি শ্বাসপ্রশ্বাসযোগ্য ফ্যাব্রিক এবং এমব্রয়ডারি ক্রেস্ট সহ।"
    },
    price: 2500,
    category: "jersey",
    images: ["/kit-store/home-jersey-front.jpg", "/kit-store/home-jersey-back.jpg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    isNew: true,
  },
  {
    id: "away-jersey-24",
    name: { en: "Away Jersey 2024/25", bn: "অ্যাওয়ে জার্সি ২০২৪/২৫" },
    description: {
      en: "Official Titan Force away jersey featuring the iconic black and gold design.",
      bn: "অফিসিয়াল টাইটান ফোর্স অ্যাওয়ে জার্সি আইকনিক কালো এবং সোনালি ডিজাইনে।"
    },
    price: 2500,
    category: "jersey",
    images: ["/kit-store/away-jersey-front.jpg", "/kit-store/away-jersey-back.jpg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "gk-jersey-24",
    name: { en: "Goalkeeper Jersey 2024/25", bn: "গোলকিপার জার্সি ২০২৪/২৫" },
    description: {
      en: "Official goalkeeper jersey with padded elbows for maximum protection.",
      bn: "অফিসিয়াল গোলকিপার জার্সি প্যাডেড এলবো সহ সর্বোচ্চ সুরক্ষার জন্য।"
    },
    price: 2800,
    category: "jersey",
    images: ["/kit-store/gk-jersey-front.jpg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "training-top",
    name: { en: "Training Top", bn: "ট্রেনিং টপ" },
    description: {
      en: "Lightweight training top with moisture-wicking technology.",
      bn: "হালকা ট্রেনিং টপ মইসচার-উইকিং প্রযুক্তি সহ।"
    },
    price: 1800,
    category: "training",
    images: ["/kit-store/training-top.jpg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    isBestseller: true,
  },
  {
    id: "training-pants",
    name: { en: "Training Pants", bn: "ট্রেনিং প্যান্ট" },
    description: {
      en: "Comfortable training pants with zippered pockets.",
      bn: "আরামদায়ক ট্রেনিং প্যান্ট জিপার পকেট সহ।"
    },
    price: 1500,
    category: "training",
    images: ["/kit-store/training-pants.jpg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "shorts",
    name: { en: "Match Shorts", bn: "ম্যাচ শর্টস" },
    description: {
      en: "Official match shorts with club crest embroidery.",
      bn: "অফিসিয়াল ম্যাচ শর্টস ক্লাব ক্রেস্ট এমব্রয়ডারি সহ।"
    },
    price: 1200,
    category: "training",
    images: ["/kit-store/shorts.jpg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "cap",
    name: { en: "Titan Force Cap", bn: "টাইটান ফোর্স ক্যাপ" },
    description: {
      en: "Adjustable cap with embroidered club logo.",
      bn: "এমব্রয়ডারি ক্লাব লোগো সহ অ্যাডজাস্টেবল ক্যাপ।"
    },
    price: 600,
    category: "accessories",
    images: ["/kit-store/cap.jpg"],
    isBestseller: true,
  },
  {
    id: "scarf",
    name: { en: "Supporter Scarf", bn: "সাপোর্টার স্কার্ফ" },
    description: {
      en: "Premium knitted scarf in club colors.",
      bn: "ক্লাব রঙে প্রিমিয়াম নিটেড স্কার্ফ।"
    },
    price: 500,
    category: "accessories",
    images: ["/kit-store/scarf.jpg"],
  },
  {
    id: "water-bottle",
    name: { en: "Water Bottle", bn: "ওয়াটার বোতল" },
    description: {
      en: "750ml insulated water bottle with club branding.",
      bn: "ক্লাব ব্র্যান্ডিং সহ ৭৫০মিলি ইনসুলেটেড ওয়াটার বোতল।"
    },
    price: 400,
    category: "accessories",
    images: ["/kit-store/water-bottle.jpg"],
  },
  {
    id: "backpack",
    name: { en: "Team Backpack", bn: "টিম ব্যাকপ্যাক" },
    description: {
      en: "Spacious backpack with multiple compartments and club logo.",
      bn: "একাধিক কম্পার্টমেন্ট এবং ক্লাব লোগো সহ প্রশস্ত ব্যাকপ্যাক।"
    },
    price: 1800,
    category: "accessories",
    images: ["/kit-store/backpack.jpg"],
    isNew: true,
  },
]

const storeTranslations = {
  en: {
    title: "KIT STORE",
    subtitle: "Official Merchandise",
    allProducts: "All Products",
    jerseys: "Jerseys",
    training: "Training Wear",
    accessories: "Accessories",
    new: "New",
    bestseller: "Bestseller",
    addToCart: "Add to Cart",
    selectSize: "Select Size",
    cart: "Cart",
    emptyCart: "Your cart is empty",
    total: "Total",
    checkout: "Checkout",
    continueShopping: "Continue Shopping",
    currency: "BDT",
    size: "Size",
    quantity: "Quantity",
    remove: "Remove",
    viewDetails: "View Details",
    close: "Close",
    itemAdded: "Item added to cart!",
    outOfStock: "Out of Stock",
  },
  bn: {
    title: "কিট স্টোর",
    subtitle: "অফিসিয়াল মার্চেন্ডাইজ",
    allProducts: "সব পণ্য",
    jerseys: "জার্সি",
    training: "ট্রেনিং পোশাক",
    accessories: "আনুষাঙ্গিক",
    new: "নতুন",
    bestseller: "বেস্টসেলার",
    addToCart: "কার্টে যোগ করুন",
    selectSize: "সাইজ নির্বাচন করুন",
    cart: "কার্ট",
    emptyCart: "আপনার কার্ট খালি",
    total: "মোট",
    checkout: "চেকআউট",
    continueShopping: "শপিং চালিয়ে যান",
    currency: "টাকা",
    size: "সাইজ",
    quantity: "পরিমাণ",
    remove: "সরান",
    viewDetails: "বিস্তারিত দেখুন",
    close: "বন্ধ করুন",
    itemAdded: "আইটেম কার্টে যোগ হয়েছে!",
    outOfStock: "স্টকে নেই",
  },
}

export default function KitStorePage() {
  const { language } = useLanguage()
  const t = storeTranslations[language]
  
  const [selectedCategory, setSelectedCategory] = useState<"all" | "jersey" | "training" | "accessories">("all")
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [notification, setNotification] = useState<string | null>(null)

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => p.category === selectedCategory)

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const addToCart = (product: Product, size?: string) => {
    const existingIndex = cart.findIndex(
      item => item.product.id === product.id && item.size === size
    )

    if (existingIndex >= 0) {
      const newCart = [...cart]
      newCart[existingIndex].quantity += 1
      setCart(newCart)
    } else {
      setCart([...cart, { product, size, quantity: 1 }])
    }

    setNotification(t.itemAdded)
    setTimeout(() => setNotification(null), 2000)
  }

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index))
  }

  const updateQuantity = (index: number, delta: number) => {
    const newCart = [...cart]
    newCart[index].quantity += delta
    if (newCart[index].quantity <= 0) {
      newCart.splice(index, 1)
    }
    setCart(newCart)
  }

  const categories = [
    { key: "all", label: t.allProducts },
    { key: "jersey", label: t.jerseys },
    { key: "training", label: t.training },
    { key: "accessories", label: t.accessories },
  ] as const

  return (
    <div className="min-h-screen bg-background stripe-bg">
      <Navbar />
      
      {/* Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg animate-fade-up">
          {notification}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-primary font-semibold tracking-widest uppercase mb-2">
            {t.subtitle}
          </p>
          <h1 className={`font-[var(--font-display)] text-5xl md:text-6xl text-foreground ${language === "bn" ? "font-[var(--font-bengali)]" : ""}`}>
            {t.title}
          </h1>
        </div>

        {/* Category Filter & Cart Button */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide transition-all ${
                  selectedCategory === cat.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground border-2 border-border hover:border-primary"
                } ${language === "bn" ? "font-[var(--font-bengali)]" : ""}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <Button
            onClick={() => setCartOpen(true)}
            variant="outline"
            className="relative border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            {t.cart}
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-card rounded-xl overflow-hidden border-2 border-border hover:border-primary transition-all card-glow"
            >
              {/* Product Image */}
              <div 
                className="relative aspect-square bg-muted cursor-pointer overflow-hidden"
                onClick={() => {
                  setSelectedProduct(product)
                  setCurrentImageIndex(0)
                  setSelectedSize("")
                }}
              >
                <Image
                  src={product.images[0]}
                  alt={product.name[language]}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                  {product.isNew && (
                    <Badge className="bg-primary text-primary-foreground">
                      {t.new}
                    </Badge>
                  )}
                  {product.isBestseller && (
                    <Badge className="bg-accent text-accent-foreground">
                      {t.bestseller}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className={`font-semibold text-foreground mb-1 line-clamp-1 ${language === "bn" ? "font-[var(--font-bengali)]" : ""}`}>
                  {product.name[language]}
                </h3>
                <p className="text-primary font-bold text-lg">
                  {t.currency} {product.price.toLocaleString()}
                </p>

                {/* Size Selector & Add to Cart */}
                <div className="mt-3 space-y-2">
                  {product.sizes && (
                    <Select onValueChange={(value) => {
                      const btn = document.getElementById(`add-btn-${product.id}`)
                      if (btn) btn.dataset.size = value
                    }}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t.selectSize} />
                      </SelectTrigger>
                      <SelectContent>
                        {product.sizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <Button
                    id={`add-btn-${product.id}`}
                    onClick={(e) => {
                      const size = (e.currentTarget as HTMLButtonElement).dataset.size
                      if (product.sizes && !size) {
                        return
                      }
                      addToCart(product, size)
                    }}
                    className="w-full bg-primary text-primary-foreground hover:opacity-90"
                  >
                    {t.addToCart}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className={`text-xl ${language === "bn" ? "font-[var(--font-bengali)]" : ""}`}>
              {selectedProduct?.name[language]}
            </DialogTitle>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Image Gallery */}
              <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                <Image
                  src={selectedProduct.images[currentImageIndex]}
                  alt={selectedProduct.name[language]}
                  fill
                  className="object-cover"
                />
                
                {selectedProduct.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((i) => 
                        i === 0 ? selectedProduct.images.length - 1 : i - 1
                      )}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-background/80 rounded-full hover:bg-background"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((i) => 
                        i === selectedProduct.images.length - 1 ? 0 : i + 1
                      )}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-background/80 rounded-full hover:bg-background"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                      {selectedProduct.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full ${
                            idx === currentImageIndex ? "bg-primary" : "bg-muted-foreground/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <div className="flex gap-2">
                  {selectedProduct.isNew && (
                    <Badge className="bg-primary text-primary-foreground">{t.new}</Badge>
                  )}
                  {selectedProduct.isBestseller && (
                    <Badge className="bg-accent text-accent-foreground">{t.bestseller}</Badge>
                  )}
                </div>

                <p className="text-primary font-bold text-2xl">
                  {t.currency} {selectedProduct.price.toLocaleString()}
                </p>

                <p className={`text-muted-foreground ${language === "bn" ? "font-[var(--font-bengali)]" : ""}`}>
                  {selectedProduct.description[language]}
                </p>

                {selectedProduct.sizes && (
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      {t.size}
                    </label>
                    <Select value={selectedSize} onValueChange={setSelectedSize}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t.selectSize} />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedProduct.sizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button
                  onClick={() => {
                    if (selectedProduct.sizes && !selectedSize) return
                    addToCart(selectedProduct, selectedSize)
                    setSelectedProduct(null)
                  }}
                  className="w-full bg-primary text-primary-foreground hover:opacity-90"
                  disabled={selectedProduct.sizes && !selectedSize}
                >
                  {t.addToCart}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cart Drawer */}
      <Dialog open={cartOpen} onOpenChange={setCartOpen}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              {t.cart}
            </DialogTitle>
          </DialogHeader>

          {cart.length === 0 ? (
            <div className="py-12 text-center">
              <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className={`text-muted-foreground ${language === "bn" ? "font-[var(--font-bengali)]" : ""}`}>
                {t.emptyCart}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Cart Items */}
              <div className="max-h-[400px] overflow-y-auto space-y-3">
                {cart.map((item, index) => (
                  <div key={`${item.product.id}-${item.size}`} className="flex gap-3 p-3 bg-muted rounded-lg">
                    <div className="relative w-16 h-16 bg-background rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name[language]}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium text-foreground text-sm line-clamp-1 ${language === "bn" ? "font-[var(--font-bengali)]" : ""}`}>
                        {item.product.name[language]}
                      </h4>
                      {item.size && (
                        <p className="text-xs text-muted-foreground">{t.size}: {item.size}</p>
                      )}
                      <p className="text-primary font-bold text-sm">
                        {t.currency} {item.product.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeFromCart(index)}
                        className="p-1 text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(index, -1)}
                          className="p-1 bg-background rounded hover:bg-primary hover:text-primary-foreground"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(index, 1)}
                          className="p-1 bg-background rounded hover:bg-primary hover:text-primary-foreground"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Total */}
              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className={`font-medium text-foreground ${language === "bn" ? "font-[var(--font-bengali)]" : ""}`}>
                    {t.total}
                  </span>
                  <span className="text-primary font-bold text-xl">
                    {t.currency} {cartTotal.toLocaleString()}
                  </span>
                </div>
                <Button className="w-full bg-primary text-primary-foreground hover:opacity-90 mb-2">
                  {t.checkout}
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-2 border-border"
                  onClick={() => setCartOpen(false)}
                >
                  {t.continueShopping}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
