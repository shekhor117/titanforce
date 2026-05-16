// Store data service for managing products, orders, and inventory
import { mockJerseys } from './jersey-products'

export interface Order {
  id: string
  orderNumber: string
  customer: {
    name: string
    email: string
    phone: string
    address: string
  }
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
  paymentMethod: string
  createdAt: string
  updatedAt: string
}

export interface ProductVariant {
  size: string
  color: string
  stock: number
}

export interface AdminProduct {
  id: string
  name: string
  description: string
  category: string
  price: number
  image: string
  sizes: string[]
  colors: string[]
  variants: ProductVariant[]
  totalStock: number
  rating: number
  reviews: number
  features: string[]
  sku: string
  createdAt: string
  updatedAt: string
}

// Mock orders storage
let mockOrders: Order[] = [
  {
    id: 'order-1',
    orderNumber: 'TF-2026-001',
    customer: {
      name: 'Ahmed Rahman',
      email: 'ahmed@example.com',
      phone: '+880171234567',
      address: 'Dhaka, Bangladesh',
    },
    items: [
      {
        productId: 'jersey-1',
        name: 'Titan Force Home Jersey 2024',
        size: 'M',
        color: 'Navy',
        quantity: 1,
        price: 4999,
      },
    ],
    subtotal: 4999,
    tax: 750,
    shipping: 250,
    total: 5999,
    status: 'delivered',
    paymentMethod: 'Card',
    createdAt: '2026-05-15',
    updatedAt: '2026-05-17',
  },
  {
    id: 'order-2',
    orderNumber: 'TF-2026-002',
    customer: {
      name: 'Fatima Hassan',
      email: 'fatima@example.com',
      phone: '+880172234567',
      address: 'Chittagong, Bangladesh',
    },
    items: [
      {
        productId: 'jersey-2',
        name: 'Titan Force Away Jersey 2024',
        size: 'L',
        color: 'White',
        quantity: 2,
        price: 4999,
      },
      {
        productId: 'jersey-3',
        name: 'Training Jersey',
        size: 'M',
        color: 'Navy',
        quantity: 1,
        price: 2999,
      },
    ],
    subtotal: 12997,
    tax: 1949,
    shipping: 250,
    total: 15196,
    status: 'shipped',
    paymentMethod: 'Card',
    createdAt: '2026-05-16',
    updatedAt: '2026-05-17',
  },
]

// Store management functions
export class StoreDataService {
  // Product management
  static getProducts(): AdminProduct[] {
    return mockJerseys as any
  }

  static getProductById(id: string): AdminProduct | null {
    return (mockJerseys as any).find((p: any) => p.id === id) || null
  }

  static updateProduct(id: string, updates: Partial<AdminProduct>): AdminProduct {
    const products = mockJerseys as any
    const index = products.findIndex((p: any) => p.id === id)
    if (index === -1) {
      throw new Error('Product not found')
    }
    products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() }
    return products[index]
  }

  static createProduct(product: Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt'>): AdminProduct {
    const newProduct: AdminProduct = {
      id: `jersey-${Date.now()}`,
      ...product,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    ;(mockJerseys as any).push(newProduct)
    return newProduct
  }

  static deleteProduct(id: string): void {
    const index = (mockJerseys as any).findIndex((p: any) => p.id === id)
    if (index === -1) {
      throw new Error('Product not found')
    }
    ;(mockJerseys as any).splice(index, 1)
  }

  // Order management
  static getOrders(): Order[] {
    return mockOrders
  }

  static getOrderById(id: string): Order | null {
    return mockOrders.find((o) => o.id === id) || null
  }

  static updateOrderStatus(id: string, status: Order['status']): Order {
    const order = mockOrders.find((o) => o.id === id)
    if (!order) {
      throw new Error('Order not found')
    }
    order.status = status
    order.updatedAt = new Date().toISOString()
    return order
  }

  static getOrderStats() {
    const orders = mockOrders
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
    const averageOrderValue = totalRevenue / totalOrders
    const pendingOrders = orders.filter((o) => o.status === 'pending').length
    const shippedOrders = orders.filter((o) => o.status === 'shipped').length
    const deliveredOrders = orders.filter((o) => o.status === 'delivered').length

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      pendingOrders,
      shippedOrders,
      deliveredOrders,
    }
  }

  // Inventory management
  static getLowStockProducts(threshold: number = 10): AdminProduct[] {
    return this.getProducts().filter((p) => p.totalStock <= threshold)
  }

  static updateInventory(productId: string, size: string, color: string, quantity: number): void {
    const product = this.getProductById(productId)
    if (!product) {
      throw new Error('Product not found')
    }
    const variant = product.variants.find((v) => v.size === size && v.color === color)
    if (!variant) {
      throw new Error('Variant not found')
    }
    variant.stock = quantity
    product.totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0)
    this.updateProduct(productId, product)
  }

  // Analytics
  static getStoreAnalytics() {
    const orders = mockOrders
    const products = this.getProducts()
    
    const totalSales = orders.reduce((sum, o) => sum + o.total, 0)
    const totalOrders = orders.length
    const averageOrderValue = totalSales / totalOrders || 0
    const totalProducts = products.length
    const lowStockProducts = this.getLowStockProducts().length

    // Calculate revenue by status
    const revenueByStatus = {
      delivered: orders
        .filter((o) => o.status === 'delivered')
        .reduce((sum, o) => sum + o.total, 0),
      shipped: orders
        .filter((o) => o.status === 'shipped')
        .reduce((sum, o) => sum + o.total, 0),
      pending: orders
        .filter((o) => o.status === 'pending')
        .reduce((sum, o) => sum + o.total, 0),
    }

    return {
      totalSales,
      totalOrders,
      averageOrderValue,
      totalProducts,
      lowStockProducts,
      revenueByStatus,
      monthlyRevenue: totalSales,
    }
  }
}

export default StoreDataService
