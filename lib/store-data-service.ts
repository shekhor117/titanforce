'use client'

import { createClient } from '@/lib/supabase/client'
import { validateProduct, validateOrder } from '@/lib/validation'

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

class StoreDataService {
  private isTableNotFoundError(error: any): boolean {
    return error?.code === 'PGRST205' || error?.message?.includes('Could not find the table')
  }

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
      if (!this.isTableNotFoundError(error)) { console.error('Error fetching products:', error) }
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
      if (!this.isTableNotFoundError(error)) { console.error('Error fetching product:', error) }
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
      if (!this.isTableNotFoundError(error)) { console.error('Error fetching products by category:', error) }
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
      if (!this.isTableNotFoundError(error)) { console.error('Error searching products:', error) }
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
      if (!this.isTableNotFoundError(error)) { console.error('Error filtering products:', error) }
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
      if (!this.isTableNotFoundError(error)) { console.error('Error fetching related products:', error) }
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

      if (error) {
        // If table doesn't exist, return empty array gracefully
        if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
          console.debug("[v0] Products table not yet created")
          return []
        }
        throw error
      }

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
      // Check if this is a missing table error
      if (error?.code === 'PGRST205' || error?.message?.includes('Could not find the table')) {
        console.debug("[v0] Products table not yet created")
        return []
      }
      if (!this.isTableNotFoundError(error)) { console.error('Error fetching featured products:', error) }
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
      if (!this.isTableNotFoundError(error)) { console.error('Error fetching new arrivals:', error) }
      return []
    }
  }

  async addProduct(product: Omit<StoreProduct, 'id' | 'createdAt'>): Promise<StoreProduct | null> {
    try {
      // Validate product data
      const validation = validateProduct(product)
      if (!validation.isValid) {
        if (!this.isTableNotFoundError(error)) { console.error('[v0] Product validation failed:', validation.errors) }
        return null
      }

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
      if (!this.isTableNotFoundError(error)) { console.error('Error adding product:', error) }
      return null
    }
  }

  async updateProduct(id: string, updates: Partial<StoreProduct>): Promise<StoreProduct | null> {
    try {
      // Validate product data (partial updates are OK)
      const validation = validateProduct(updates)
      if (!validation.isValid) {
        if (!this.isTableNotFoundError(error)) { console.error('[v0] Product validation failed:', validation.errors) }
        return null
      }

      const supabase = createClient()
      if (!supabase) return null

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
      if (!this.isTableNotFoundError(error)) { console.error('Error updating product:', error) }
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
      if (!this.isTableNotFoundError(error)) { console.error('Error deleting product:', error) }
      return false
    }
  }

  async updateStock(productId: string, quantity: number): Promise<boolean> {
    try {
      const product = await this.getProductById(productId)
      if (!product) return false

      return (await this.updateProduct(productId, { stock: product.stock + quantity })) !== null
    } catch (error) {
      if (!this.isTableNotFoundError(error)) { console.error('Error updating stock:', error) }
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
      if (!this.isTableNotFoundError(error)) { console.error('Error fetching orders:', error) }
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
      if (!this.isTableNotFoundError(error)) { console.error('Error fetching order:', error) }
      return undefined
    }
  }

  async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order | null> {
    try {
      // Validate order data
      const validation = validateOrder(order)
      if (!validation.isValid) {
        if (!this.isTableNotFoundError(error)) { console.error('[v0] Order validation failed:', validation.errors) }
        return null
      }

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
      if (!this.isTableNotFoundError(error)) { console.error('Error creating order:', error) }
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
      if (!this.isTableNotFoundError(error)) { console.error('Error updating order status:', error) }
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
      const lowStockProducts = products.filter(p => p.stock <= 10).length

      const revenueByStatus = {
        delivered: orders
          .filter(o => o.status === 'delivered')
          .reduce((sum, o) => sum + o.total, 0),
        shipped: orders
          .filter(o => o.status === 'shipped')
          .reduce((sum, o) => sum + o.total, 0),
        pending: orders
          .filter(o => o.status === 'pending')
          .reduce((sum, o) => sum + o.total, 0)
      }

      return {
        totalSales,
        totalOrders,
        averageOrderValue,
        totalProducts,
        lowStockProducts,
        revenueByStatus,
        monthlyRevenue: totalSales
      }
    } catch (error) {
      if (!this.isTableNotFoundError(error)) { console.error('Error getting store stats:', error) }
      return {
        totalSales: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        totalProducts: 0,
        lowStockProducts: 0,
        revenueByStatus: { delivered: 0, shipped: 0, pending: 0 },
        monthlyRevenue: 0
      }
    }
  }

  async getLowStockProducts(threshold: number = 10): Promise<StoreProduct[]> {
    try {
      const products = await this.getProducts()
      return products.filter(p => p.stock <= threshold)
    } catch (error) {
      if (!this.isTableNotFoundError(error)) { console.error('Error getting low stock products:', error) }
      return []
    }
  }

  async updateInventory(productId: string, size: string, color: string, stock: number): Promise<boolean> {
    try {
      const product = await this.getProductById(productId)
      if (!product) return false

      // Update the variant stock
      const updatedVariants = (product.variants || []).map(v => {
        if (v.size === size && v.color === color) {
          return { ...v, stock }
        }
        return v
      })

      return (await this.updateProduct(productId, { variants: updatedVariants })) !== null
    } catch (error) {
      if (!this.isTableNotFoundError(error)) { console.error('Error updating inventory:', error) }
      return false
    }
  }

  // Realtime subscription for products - listen to admin changes
  subscribeToProducts(
    callback: (products: any[]) => void,
    onError?: (error: Error) => void
  ): () => void {
    try {
      const supabase = createClient()
      
      // Skip subscription if Supabase is not available
      if (!supabase) {
        return () => {}
      }
      
      // Wrap in try-catch to handle potential subscription errors
      try {
        const channel = supabase
          .channel('products-sync')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'store_products' },
            async () => {
              try {
                const products = await this.getProducts()
                callback(products)
              } catch (error) {
                // Silently fail subscription updates
              }
            }
          )
          .subscribe()

        return () => {
          supabase.removeChannel(channel)
        }
      } catch (subscriptionError) {
        // Silently fail if subscription setup fails
        return () => {}
      }
    } catch (error) {
      return () => {}
    }
  }
}

export default new StoreDataService()
