'use client'

import { createClient } from '@/lib/supabase/client'

export interface StoreProduct {
  id: string
  name: string
  description: string
  category: string
  price: number
  imageUrl: string
  sizes: string[]
  colors: string[]
  stock: number
  rating?: number
  reviews?: number
  features?: string[]
  sku?: string
  variants?: Record<string, any>[]
  createdAt?: Date
}

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  customerAddress?: string
  items: Array<{
    productId: string
    name: string
    size: string
    color: string
    quantity: number
    price: number
  }>
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface JerseyOrderItem {
  id?: string
  playerId?: string
  playerName?: string
  playerNumber?: number
  kitType: 'Home' | 'Away' | 'Third'
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL'
  badgeType: 'Champions Gold' | 'Premier Silver' | 'Classic Bronze'
  hasLeaguePatch: boolean
  customName?: string
  customNumber?: number
  quantity: number
  priceUSD: number
  priceBDT: number
}

export interface JerseyOrder {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  jerseyItems: JerseyOrderItem[]
  subtotalUSD: number
  subtotalBDT: number
  tax: number
  shipping: number
  totalUSD: number
  totalBDT: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod: string
  currency: 'USD' | 'BDT'
  notes?: string
  createdAt?: Date
  updatedAt?: Date
}

class StoreDataService {
  async getProducts(): Promise<StoreProduct[]> {
    try {
      const supabase = createClient()
      if (!supabase) return []

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return (data || []).map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category,
        price: parseFloat(p.price),
        imageUrl: p.image_url || '',
        sizes: p.sizes || [],
        colors: p.colors || [],
        stock: p.total_stock || 0,
        rating: p.rating ? parseFloat(p.rating) : undefined,
        reviews: p.reviews || 0,
        features: p.features || [],
        sku: p.sku,
        variants: p.variants || [],
        createdAt: p.created_at ? new Date(p.created_at) : undefined
      }))
    } catch (error) {
      console.error('Error fetching products:', error)
      return []
    }
  }

  async getProductById(id: string): Promise<StoreProduct | undefined> {
    try {
      const supabase = createClient()
      if (!supabase) return undefined

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (!data) return undefined

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        category: data.category,
        price: parseFloat(data.price),
        imageUrl: data.image_url || '',
        sizes: data.sizes || [],
        colors: data.colors || [],
        stock: data.total_stock || 0,
        rating: data.rating ? parseFloat(data.rating) : undefined,
        reviews: data.reviews || 0,
        features: data.features || [],
        sku: data.sku,
        variants: data.variants || [],
        createdAt: data.created_at ? new Date(data.created_at) : undefined
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      return undefined
    }
  }

  async getProductsByCategory(category: string): Promise<StoreProduct[]> {
    try {
      const supabase = createClient()
      if (!supabase) return []

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })

      if (error) throw error

      return (data || []).map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category,
        price: parseFloat(p.price),
        imageUrl: p.image_url || '',
        sizes: p.sizes || [],
        colors: p.colors || [],
        stock: p.total_stock || 0,
        rating: p.rating ? parseFloat(p.rating) : undefined,
        reviews: p.reviews || 0,
        features: p.features || [],
        sku: p.sku,
        variants: p.variants || [],
        createdAt: p.created_at ? new Date(p.created_at) : undefined
      }))
    } catch (error) {
      console.error('Error fetching products by category:', error)
      return []
    }
  }

  async searchProducts(query: string): Promise<StoreProduct[]> {
    try {
      const supabase = createClient()
      if (!supabase) return []

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (error) throw error

      return (data || []).map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category,
        price: parseFloat(p.price),
        imageUrl: p.image_url || '',
        sizes: p.sizes || [],
        colors: p.colors || [],
        stock: p.total_stock || 0,
        rating: p.rating ? parseFloat(p.rating) : undefined,
        reviews: p.reviews || 0,
        features: p.features || [],
        sku: p.sku,
        variants: p.variants || [],
        createdAt: p.created_at ? new Date(p.created_at) : undefined
      }))
    } catch (error) {
      console.error('Error searching products:', error)
      return []
    }
  }

  async filterProducts(filters: {
    category?: string
    minPrice?: number
    maxPrice?: number
    size?: string
    color?: string
  }): Promise<StoreProduct[]> {
    try {
      const supabase = createClient()
      if (!supabase) return []

      let query = supabase.from('products').select('*')

      if (filters.category) {
        query = query.eq('category', filters.category)
      }

      if (filters.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice)
      }

      if (filters.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice)
      }

      if (filters.size) {
        query = query.contains('sizes', [filters.size])
      }

      if (filters.color) {
        query = query.contains('colors', [filters.color])
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error

      return (data || []).map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category,
        price: parseFloat(p.price),
        imageUrl: p.image_url || '',
        sizes: p.sizes || [],
        colors: p.colors || [],
        stock: p.total_stock || 0,
        rating: p.rating ? parseFloat(p.rating) : undefined,
        reviews: p.reviews || 0,
        features: p.features || [],
        sku: p.sku,
        variants: p.variants || [],
        createdAt: p.created_at ? new Date(p.created_at) : undefined
      }))
    } catch (error) {
      console.error('Error filtering products:', error)
      return []
    }
  }

  async getRelatedProducts(productId: string, limit: number = 4): Promise<StoreProduct[]> {
    try {
      const product = await this.getProductById(productId)
      if (!product) return []

      const supabase = createClient()
      if (!supabase) return []

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .neq('id', productId)
        .eq('category', product.category)
        .limit(limit)

      if (error) throw error

      return (data || []).map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category,
        price: parseFloat(p.price),
        imageUrl: p.image_url || '',
        sizes: p.sizes || [],
        colors: p.colors || [],
        stock: p.total_stock || 0,
        rating: p.rating ? parseFloat(p.rating) : undefined,
        reviews: p.reviews || 0,
        features: p.features || [],
        sku: p.sku,
        variants: p.variants || [],
        createdAt: p.created_at ? new Date(p.created_at) : undefined
      }))
    } catch (error) {
      console.error('Error fetching related products:', error)
      return []
    }
  }

  async getFeaturedProducts(limit: number = 6): Promise<StoreProduct[]> {
    try {
      const supabase = createClient()
      if (!supabase) return []

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .gte('rating', 4.5)
        .order('rating', { ascending: false })
        .limit(limit)

      if (error) throw error

      return (data || []).map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category,
        price: parseFloat(p.price),
        imageUrl: p.image_url || '',
        sizes: p.sizes || [],
        colors: p.colors || [],
        stock: p.total_stock || 0,
        rating: p.rating ? parseFloat(p.rating) : undefined,
        reviews: p.reviews || 0,
        features: p.features || [],
        sku: p.sku,
        variants: p.variants || [],
        createdAt: p.created_at ? new Date(p.created_at) : undefined
      }))
    } catch (error) {
      console.error('Error fetching featured products:', error)
      return []
    }
  }

  async getNewArrivals(limit: number = 6): Promise<StoreProduct[]> {
    try {
      const supabase = createClient()
      if (!supabase) return []

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return (data || []).map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category,
        price: parseFloat(p.price),
        imageUrl: p.image_url || '',
        sizes: p.sizes || [],
        colors: p.colors || [],
        stock: p.total_stock || 0,
        rating: p.rating ? parseFloat(p.rating) : undefined,
        reviews: p.reviews || 0,
        features: p.features || [],
        sku: p.sku,
        variants: p.variants || [],
        createdAt: p.created_at ? new Date(p.created_at) : undefined
      }))
    } catch (error) {
      console.error('Error fetching new arrivals:', error)
      return []
    }
  }

  async addProduct(product: Omit<StoreProduct, 'id' | 'createdAt'>): Promise<StoreProduct | null> {
    try {
      const supabase = createClient()
      if (!supabase) return null

      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            name: product.name,
            description: product.description,
            category: product.category,
            price: product.price,
            image_url: product.imageUrl,
            sizes: product.sizes,
            colors: product.colors,
            total_stock: product.stock,
            rating: product.rating,
            reviews: product.reviews,
            features: product.features,
            sku: product.sku,
            variants: product.variants
          }
        ])
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        category: data.category,
        price: parseFloat(data.price),
        imageUrl: data.image_url || '',
        sizes: data.sizes || [],
        colors: data.colors || [],
        stock: data.total_stock || 0,
        rating: data.rating ? parseFloat(data.rating) : undefined,
        reviews: data.reviews || 0,
        features: data.features || [],
        sku: data.sku,
        variants: data.variants || [],
        createdAt: data.created_at ? new Date(data.created_at) : undefined
      }
    } catch (error) {
      console.error('Error adding product:', error)
      return null
    }
  }

  async updateProduct(id: string, updates: Partial<StoreProduct>): Promise<StoreProduct | null> {
    try {
      const supabase = createClient()
      if (!supabase) return null

      const updateData: Record<string, unknown> = {}
      if (updates.name) updateData.name = updates.name
      if (updates.description) updateData.description = updates.description
      if (updates.category) updateData.category = updates.category
      if (updates.price) updateData.price = updates.price
      if (updates.imageUrl) updateData.image_url = updates.imageUrl
      if (updates.sizes) updateData.sizes = updates.sizes
      if (updates.colors) updateData.colors = updates.colors
      if (updates.stock !== undefined) updateData.total_stock = updates.stock
      if (updates.rating !== undefined) updateData.rating = updates.rating
      if (updates.reviews !== undefined) updateData.reviews = updates.reviews
      if (updates.features) updateData.features = updates.features
      if (updates.sku) updateData.sku = updates.sku
      if (updates.variants) updateData.variants = updates.variants

      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        category: data.category,
        price: parseFloat(data.price),
        imageUrl: data.image_url || '',
        sizes: data.sizes || [],
        colors: data.colors || [],
        stock: data.total_stock || 0,
        rating: data.rating ? parseFloat(data.rating) : undefined,
        reviews: data.reviews || 0,
        features: data.features || [],
        sku: data.sku,
        variants: data.variants || [],
        createdAt: data.created_at ? new Date(data.created_at) : undefined
      }
    } catch (error) {
      console.error('Error updating product:', error)
      return null
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const supabase = createClient()
      if (!supabase) return false

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting product:', error)
      return false
    }
  }

  async updateStock(productId: string, quantity: number): Promise<boolean> {
    try {
      const product = await this.getProductById(productId)
      if (!product) return false

      return (await this.updateProduct(productId, { stock: product.stock + quantity })) !== null
    } catch (error) {
      console.error('Error updating stock:', error)
      return false
    }
  }

  // Order management methods
  async getOrders(): Promise<Order[]> {
    try {
      const supabase = createClient()
      if (!supabase) return []

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return (data || []).map(o => ({
        id: o.id,
        orderNumber: o.order_number,
        customerName: o.customer_name,
        customerEmail: o.customer_email,
        customerPhone: o.customer_phone,
        customerAddress: o.customer_address,
        items: o.items || [],
        subtotal: parseFloat(o.subtotal),
        tax: parseFloat(o.tax),
        shipping: parseFloat(o.shipping),
        total: parseFloat(o.total),
        status: o.status,
        paymentMethod: o.payment_method,
        createdAt: o.created_at ? new Date(o.created_at) : undefined,
        updatedAt: o.updated_at ? new Date(o.updated_at) : undefined
      }))
    } catch (error) {
      console.error('Error fetching orders:', error)
      return []
    }
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    try {
      const supabase = createClient()
      if (!supabase) return undefined

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (!data) return undefined

      return {
        id: data.id,
        orderNumber: data.order_number,
        customerName: data.customer_name,
        customerEmail: data.customer_email,
        customerPhone: data.customer_phone,
        customerAddress: data.customer_address,
        items: data.items || [],
        subtotal: parseFloat(data.subtotal),
        tax: parseFloat(data.tax),
        shipping: parseFloat(data.shipping),
        total: parseFloat(data.total),
        status: data.status,
        paymentMethod: data.payment_method,
        createdAt: data.created_at ? new Date(data.created_at) : undefined,
        updatedAt: data.updated_at ? new Date(data.updated_at) : undefined
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      return undefined
    }
  }

  async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order | null> {
    try {
      const supabase = createClient()
      if (!supabase) return null

      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            order_number: order.orderNumber,
            customer_name: order.customerName,
            customer_email: order.customerEmail,
            customer_phone: order.customerPhone,
            customer_address: order.customerAddress,
            items: order.items,
            subtotal: order.subtotal,
            tax: order.tax,
            shipping: order.shipping,
            total: order.total,
            status: order.status,
            payment_method: order.paymentMethod
          }
        ])
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        orderNumber: data.order_number,
        customerName: data.customer_name,
        customerEmail: data.customer_email,
        customerPhone: data.customer_phone,
        customerAddress: data.customer_address,
        items: data.items || [],
        subtotal: parseFloat(data.subtotal),
        tax: parseFloat(data.tax),
        shipping: parseFloat(data.shipping),
        total: parseFloat(data.total),
        status: data.status,
        paymentMethod: data.payment_method,
        createdAt: data.created_at ? new Date(data.created_at) : undefined,
        updatedAt: data.updated_at ? new Date(data.updated_at) : undefined
      }
    } catch (error) {
      console.error('Error creating order:', error)
      return null
    }
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
    try {
      const supabase = createClient()
      if (!supabase) return null

      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        orderNumber: data.order_number,
        customerName: data.customer_name,
        customerEmail: data.customer_email,
        customerPhone: data.customer_phone,
        customerAddress: data.customer_address,
        items: data.items || [],
        subtotal: parseFloat(data.subtotal),
        tax: parseFloat(data.tax),
        shipping: parseFloat(data.shipping),
        total: parseFloat(data.total),
        status: data.status,
        paymentMethod: data.payment_method,
        createdAt: data.created_at ? new Date(data.created_at) : undefined,
        updatedAt: data.updated_at ? new Date(data.updated_at) : undefined
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      return null
    }
  }

  async getStoreStats() {
    try {
      const orders = await this.getOrders()
      const products = await this.getProducts()

      const totalSales = orders.reduce((sum, o) => sum + o.total, 0)
      const totalOrders = orders.length
      const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0
      const totalProducts = products.length

      return {
        totalSales,
        totalOrders,
        averageOrderValue,
        totalProducts
      }
    } catch (error) {
      console.error('Error fetching store stats:', error)
      return {
        totalSales: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        totalProducts: 0
      }
    }
  }

  // Jersey Order Methods
  async getJerseyOrders(): Promise<JerseyOrder[]> {
    try {
      const supabase = createClient()
      if (!supabase) return []

      const { data, error } = await supabase
        .from('jersey_orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return (data || []).map(o => this.mapJerseyOrder(o))
    } catch (error) {
      console.error('[v0] Error fetching jersey orders:', error)
      return []
    }
  }

  async getJerseyOrderById(id: string): Promise<JerseyOrder | undefined> {
    try {
      const supabase = createClient()
      if (!supabase) return undefined

      const { data, error } = await supabase
        .from('jersey_orders')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (!data) return undefined

      return this.mapJerseyOrder(data)
    } catch (error) {
      console.error('[v0] Error fetching jersey order:', error)
      return undefined
    }
  }

  async createJerseyOrder(order: Omit<JerseyOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<JerseyOrder | null> {
    try {
      const supabase = createClient()
      if (!supabase) return null

      const { data, error } = await supabase
        .from('jersey_orders')
        .insert({
          order_number: order.orderNumber,
          customer_name: order.customerName,
          customer_email: order.customerEmail,
          customer_phone: order.customerPhone,
          customer_address: order.customerAddress,
          jersey_items: order.jerseyItems,
          subtotal_usd: order.subtotalUSD,
          subtotal_bdt: order.subtotalBDT,
          tax: order.tax,
          shipping: order.shipping,
          total_usd: order.totalUSD,
          total_bdt: order.totalBDT,
          status: order.status,
          payment_method: order.paymentMethod,
          currency: order.currency,
          notes: order.notes || null
        })
        .select()
        .single()

      if (error) throw error

      return this.mapJerseyOrder(data)
    } catch (error) {
      console.error('[v0] Error creating jersey order:', error)
      return null
    }
  }

  async updateJerseyOrderStatus(id: string, status: JerseyOrder['status']): Promise<JerseyOrder | null> {
    try {
      const supabase = createClient()
      if (!supabase) return null

      const { data, error } = await supabase
        .from('jersey_orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return this.mapJerseyOrder(data)
    } catch (error) {
      console.error('[v0] Error updating jersey order status:', error)
      return null
    }
  }

  async deleteJerseyOrder(id: string): Promise<boolean> {
    try {
      const supabase = createClient()
      if (!supabase) return false

      const { error } = await supabase
        .from('jersey_orders')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('[v0] Error deleting jersey order:', error)
      return false
    }
  }

  private mapJerseyOrder(data: any): JerseyOrder {
    return {
      id: data.id,
      orderNumber: data.order_number,
      customerName: data.customer_name,
      customerEmail: data.customer_email,
      customerPhone: data.customer_phone,
      customerAddress: data.customer_address,
      jerseyItems: data.jersey_items || [],
      subtotalUSD: parseFloat(data.subtotal_usd),
      subtotalBDT: parseFloat(data.subtotal_bdt),
      tax: parseFloat(data.tax),
      shipping: parseFloat(data.shipping),
      totalUSD: parseFloat(data.total_usd),
      totalBDT: parseFloat(data.total_bdt),
      status: data.status,
      paymentMethod: data.payment_method,
      currency: data.currency,
      notes: data.notes,
      createdAt: data.created_at ? new Date(data.created_at) : undefined,
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined
    }
  }
}

export default new StoreDataService()

