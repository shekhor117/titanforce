"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { CartItem, JerseyProduct } from "@/lib/jersey-products"

interface CartContextType {
  items: CartItem[]
  addItem: (product: JerseyProduct, quantity: number, size: string, color: string) => void
  removeItem: (cartId: string) => void
  updateQuantity: (cartId: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
  getSubtotal: () => number
  getTax: () => number
  getShipping: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const STORAGE_KEY = "titanforce-cart"
const TAX_RATE = 0.15 // 15% tax
const SHIPPING_COST = 250 // BDT

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch (e) {
        console.warn("Failed to load cart from localStorage")
      }
    }
    setIsInitialized(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    }
  }, [items, isInitialized])

  const addItem = (product: JerseyProduct, quantity: number, size: string, color: string) => {
    setItems(prevItems => {
      // Check if item with same product, size, and color already exists
      const existing = prevItems.find(
        item => item.id === product.id && item.selectedSize === size && item.selectedColor === color
      )

      if (existing) {
        // Update quantity if item exists
        return prevItems.map(item =>
          item.id === product.id && item.selectedSize === size && item.selectedColor === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      // Add new item
      return [
        ...prevItems,
        {
          ...product,
          cartId: `${product.id}-${size}-${color}-${Date.now()}`,
          quantity,
          selectedSize: size,
          selectedColor: color
        }
      ]
    })
  }

  const removeItem = (cartId: string) => {
    setItems(prevItems => prevItems.filter(item => item.cartId !== cartId))
  }

  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartId)
      return
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.cartId === cartId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }

  const getSubtotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const getTax = () => {
    return Math.round(getSubtotal() * TAX_RATE)
  }

  const getShipping = () => {
    return items.length > 0 ? SHIPPING_COST : 0
  }

  const getTotalPrice = () => {
    return getSubtotal() + getTax() + getShipping()
  }

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getTotalItems,
      getSubtotal,
      getTax,
      getShipping
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}
