"use client"

import { useLanguage } from "@/lib/language-context"
import { useAdmin } from "@/lib/admin-context"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, Edit2, Save, X } from "lucide-react"
import StoreDataService, { AdminProduct } from "@/lib/store-data-service"

export default function StoreInventoryPage() {
  const { language } = useLanguage()
  const { admin } = useAdmin()
  const isBn = language === "bn"

  const [products, setProducts] = useState<AdminProduct[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<AdminProduct[]>([])
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [editingVariants, setEditingVariants] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      loadInventory()
    } catch (err) {
      console.error("[v0] Error in inventory page:", err)
      setError(isBn ? "ডেটা লোড করতে ত্রুটি হয়েছে" : "Error loading data")
    }
  }, [])

  const loadInventory = () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = StoreDataService.getProducts()
      setProducts(Array.isArray(data) ? data : [])
      const lowStockData = StoreDataService.getLowStockProducts(10)
      setLowStockProducts(Array.isArray(lowStockData) ? lowStockData : [])
    } catch (err) {
      console.error("[v0] Error loading inventory:", err)
      setError(isBn ? "ইনভেন্টরি লোড করতে ব্যর্থ" : "Failed to load inventory")
      setProducts([])
      setLowStockProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditVariant = (product: AdminProduct) => {
    setEditingProduct(product.id)
    const variantMap: Record<string, number> = {}
    // Handle both variants array and size/color/stock combinations
    if (product.variants && Array.isArray(product.variants)) {
      product.variants.forEach((v) => {
        variantMap[`${v.size}-${v.color}`] = v.stock
      })
    } else if (product.sizes && product.colors) {
      // Build variants from sizes and colors if variants not available
      product.sizes.forEach(size => {
        product.colors.forEach(color => {
          variantMap[`${size}-${color}`] = 0
        })
      })
    }
    setEditingVariants(variantMap)
  }

  const handleVariantChange = (key: string, value: number) => {
    setEditingVariants((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSaveVariants = (product: AdminProduct) => {
    Object.entries(editingVariants).forEach(([key, stock]) => {
      const [size, color] = key.split("-")
      try {
        StoreDataService.updateInventory(product.id, size, color, stock)
      } catch (error) {
        console.error("[v0] Error updating inventory:", error)
      }
    })
    loadInventory()
    setEditingProduct(null)
  }

  const getStockStatus = (stock: number) => {
    if (stock > 20) return { label: isBn ? "পর্যাপ্ত" : "Adequate", color: "text-green-400", bg: "bg-green-500/10" }
    if (stock > 5) return { label: isBn ? "কম" : "Low", color: "text-yellow-400", bg: "bg-yellow-500/10" }
    return { label: isBn ? "খুব কম" : "Critical", color: "text-red-400", bg: "bg-red-500/10" }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "ইনভেন্টরি ব্যবস্থাপনা" : "Inventory Management"}
        </h1>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <div>
            <p className="text-red-400 font-semibold">{error}</p>
            <button
              onClick={() => loadInventory()}
              className="mt-2 text-sm text-red-300 hover:text-red-200 underline"
            >
              {isBn ? "পুনরায় চেষ্টা করুন" : "Try Again"}
            </button>
          </div>
        </div>
      )}

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-500/10 border-l-4 border-red-500 rounded-lg p-6"
        >
          <div className="flex gap-4">
            <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-red-400 mb-2">
                {isBn ? "কম স্টক সতর্কতা!" : "Low Stock Alert!"}
              </h3>
              <p className="text-sm text-foreground/80 mb-3">
                {isBn ? `${lowStockProducts.length} পণ্যের স্টক কম` : `${lowStockProducts.length} products have low stock`}
              </p>
              <div className="flex flex-wrap gap-2">
                {lowStockProducts.map((p) => (
                  <span key={p.id} className="px-3 py-1 bg-red-500/20 text-red-300 rounded text-xs font-semibold">
                    {p.name} ({p.totalStock})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Inventory Table */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-foreground/60">{isBn ? "লোড হচ্ছে..." : "Loading..."}</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-secondary rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-primary/10 border-b border-primary/20">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">{isBn ? "পণ্য" : "Product"}</th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">{isBn ? "মোট স্টক" : "Total Stock"}</th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">{isBn ? "স্ট্যাটাস" : "Status"}</th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">{isBn ? "অ্যাকশন" : "Action"}</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`border-b border-primary/10 ${index % 2 === 0 ? "bg-background/30" : "bg-background/60"}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div>
                          <p className="font-semibold text-foreground">{product.name}</p>
                          {(product as any).sku && <p className="text-xs text-foreground/60">{(product as any).sku}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-foreground text-lg">{(product as any).totalStock || (product as any).stock || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStockStatus((product as any).totalStock || (product as any).stock || 0).bg} ${
                          getStockStatus((product as any).totalStock || (product as any).stock || 0).color
                        }`}
                      >
                        {getStockStatus((product as any).totalStock || (product as any).stock || 0).label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleEditVariant(product)}
                        className="flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary rounded hover:bg-primary/30 transition-colors text-sm font-semibold"
                      >
                        <Edit2 className="w-4 h-4" />
                        {isBn ? "সম্পাদনা" : "Edit"}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Variant Editor Modal */}
      {editingProduct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setEditingProduct(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-secondary rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "ভেরিয়েন্ট স্টক সম্পাদনা" : "Edit Variant Stock"}
              </h2>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-2 hover:bg-primary/20 rounded transition-colors"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {editingVariants &&
                Object.entries(editingVariants).map(([key, value]) => {
                  return (
                    <div key={key} className="flex items-center gap-4 p-4 bg-background rounded-lg border border-primary/20">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground mb-1">
                          {key}
                        </p>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${getStockStatus(value || 0).bg} ${getStockStatus(value || 0).color}`}>
                          {getStockStatus(value || 0).label}
                        </span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={value || 0}
                        onChange={(e) => handleVariantChange(key, parseInt(e.target.value))}
                        className="w-20 px-3 py-2 bg-background border border-primary/20 rounded text-foreground text-right font-semibold focus:outline-none focus:border-primary"
                      />
                    </div>
                  )
                })}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => handleSaveVariants(products.find((p) => p.id === editingProduct)!)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                <Save className="w-4 h-4" />
                {isBn ? "সংরক্ষণ" : "Save"}
              </button>
              <button
                onClick={() => setEditingProduct(null)}
                className="flex-1 px-6 py-2 bg-secondary border border-primary/20 text-foreground rounded-lg hover:bg-primary/10 transition-colors font-medium"
              >
                {isBn ? "বাতিল" : "Cancel"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
