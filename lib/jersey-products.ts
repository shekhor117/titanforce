// Store products - loaded from Supabase database
// This file now fetches real product data instead of mock data

import { createClient } from "@/lib/supabase/client"

export interface StoreProduct {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: "home" | "away" | "training" | "retro" | "accessories"
  sizes: string[]
  colors: string[]
  stock: number
  rating: number
  reviews: number
  features: string[]
}

export interface CartItem extends StoreProduct {
  cartId: string
  quantity: number
  selectedSize: string
  selectedColor: string
}

/**
 * Fetch all store products from Supabase
 * Returns real product data from the store_products table
 */
export async function getStoreProducts(): Promise<StoreProduct[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("store_products")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false })

    if (error) {
      return []
    }

    return data || []
  } catch (error) {
    return []
  }
}

/**
 * Fetch a single product by ID from Supabase
 */
export async function getStoreProduct(id: string): Promise<StoreProduct | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("store_products")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      return null
    }

    return data
  } catch (error) {
    return null
  }
}

/**
 * @deprecated Use getStoreProduct instead - async version
 * This is kept for backward compatibility with client components
 */
export function getProductById(id: string): StoreProduct | null {
  // This is a placeholder - client components should use getStoreProduct with useEffect
  console.warn("[v0] getProductById is deprecated. Use getStoreProduct instead with useEffect or Server Component.")
  return null
}

/**
 * Search products by category
 */
export async function getProductsByCategory(
  category: string
): Promise<StoreProduct[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("store_products")
      .select("*")
      .eq("category", category)
      .eq("active", true)
      .order("created_at", { ascending: false })

    if (error) {
      return []
    }

    return data || []
  } catch (error) {
    return []
  }
}
