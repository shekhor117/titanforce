"use client"

import { useLanguage } from "@/lib/language-context"
import { useAdmin } from "@/lib/admin-context"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Edit2, Trash2, Search, Filter, AlertCircle } from "lucide-react"
import StoreDataService, { AdminProduct } from "@/lib/store-data-service"
import { PageEntrance } from '@/components/page-entrance'

export default function StoreProductsPage() {
  const { language } = useLanguage()
  const { admin } = useAdmin()
  const isBn = language === "bn"

  const [products, setProducts] = useState<AdminProduct[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null)
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Home",
    price: 0,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Navy", "Gold"],
  })

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setIsLoading(true)
    const data = await StoreDataService.getProducts()
    setProducts(data as any)
    setIsLoading(false)
  }

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || p.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleDelete = async (id: string) => {
    if (window.confirm(isBn ? "আপনি কি নিশ্চিত?" : "Are you sure?")) {
      await StoreDataService.deleteProduct(id)
      await loadProducts()
    }
  }

  const handleEdit = (product: AdminProduct) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      sizes: product.sizes,
      colors: product.colors,
    })
    setShowForm(true)
  }

  const handleAdd = () => {
    setEditingProduct(null)
    setFormData({
      name: "",
      description: "",
      category: "Home",
      price: 0,
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: ["Navy", "Gold"],
    })
    setShowForm(true)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingProduct) {
        await StoreDataService.updateProduct(editingProduct.id, {
          ...formData,
          variants: editingProduct.variants,
          imageUrl: editingProduct.image,
          rating: editingProduct.rating,
          reviews: editingProduct.reviews,
          features: editingProduct.features,
          sku: editingProduct.sku,
        })
      } else {
        await StoreDataService.addProduct({
          ...formData,
          imageUrl: "/placeholder.jpg",
          rating: 0,
          reviews: 0,
          features: [],
          sku: `SKU-${Date.now()}`,
          variants: formData.colors.flatMap((color) =>
            formData.sizes.map((size) => ({ color, size, stock: 10 }))
          ),
          stock: formData.colors.length * formData.sizes.length * 10,
        })
      }
      await loadProducts()
      setShowForm(false)
    } catch (error) {
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "পণ্য ব্যবস্থাপনা" : "Product Management"}
          </h1>
          <p className="text-foreground/60 text-sm mt-1">
            {isBn ? `মোট ${products.length} পণ্য` : `Total ${products.length} products`}
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="neo-btn neo-btn-primary flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>{isBn ? "নতুন পণ্য" : "Add Product"}</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
          <input
            type="text"
            placeholder={isBn ? "পণ্য অনুসন্ধান..." : "Search products..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-secondary rounded-lg neo-input border text-foreground placeholder:text-foreground/40 focus:outline-none"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="neo-btn px-secondary py-secondary bg-secondary rounded-lg neo-input border text-foreground focus:outline-none"
        >
          <option value="all">{isBn ? "সব ক্যাটাগরি" : "All Categories"}</option>
          <option value="Home">{isBn ? "হোম জার্সি" : "Home"}</option>
          <option value="Away">{isBn ? "অ্যাওয়ে জার্সি" : "Away"}</option>
          <option value="Training">{isBn ? "প্রশিক্ষণ" : "Training"}</option>
          <option value="Retro">{isBn ? "রেট্রো" : "Retro"}</option>
        </select>
      </div>

      {/* Products Table */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-foreground/60">{isBn ? "লোড হচ্ছে..." : "Loading..."}</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-secondary rounded-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 text-foreground/40 mx-auto mb-4" />
          <p className="text-foreground/60">{isBn ? "কোনো পণ্য নেই" : "No products found"}</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-secondary rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-primary/10 border-b border-primary/20">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">{isBn ? "নাম" : "Name"}</th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">{isBn ? "ক্যাটাগরি" : "Category"}</th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">{isBn ? "মূল্য" : "Price"}</th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">{isBn ? "স্টক" : "Stock"}</th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">{isBn ? "রেটিং" : "Rating"}</th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">{isBn ? "অ্যাকশন" : "Action"}</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr
                    key={product.id}
                    className={`border-b border-primary/10 hover:bg-primary/5 transition-colors ${
                      index % 2 === 0 ? "bg-background/30" : "bg-background/60"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <span className="font-medium text-foreground">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground/80">{product.category}</td>
                    <td className="px-6 py-4 text-foreground font-semibold">৳{product.price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.totalStock > 20
                            ? "bg-green-500/20 text-green-400"
                            : product.totalStock > 5
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {product.totalStock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      ⭐ {product.rating.toFixed(1)} ({product.reviews})
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 hover:bg-primary/20 rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-primary" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:bg-red-500/20 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-secondary rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={`text-2xl font-bold text-foreground mb-6 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {editingProduct ? (isBn ? "পণ্য সম্পাদনা" : "Edit Product") : isBn ? "নতুন পণ্য" : "New Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {isBn ? "পণ্যের নাম" : "Product Name"}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 bg-background rounded-lg neo-input border text-foreground focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {isBn ? "ক্যাটাগরি" : "Category"}
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 bg-background rounded-lg neo-input border text-foreground focus:outline-none"
                  >
                    <option value="Home">{isBn ? "হোম জার্সি" : "Home"}</option>
                    <option value="Away">{isBn ? "অ্যাওয়ে জার্সি" : "Away"}</option>
                    <option value="Training">{isBn ? "প্রশিক্ষণ" : "Training"}</option>
                    <option value="Retro">{isBn ? "রেট্রো" : "Retro"}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {isBn ? "মূল্য (৳)" : "Price (৳)"}
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 bg-background rounded-lg neo-input border text-foreground focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {isBn ? "বর্ণনা" : "Description"}
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-background rounded-lg neo-input border text-foreground focus:outline-none"
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="neo-btn neo-btn-primary flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  {isBn ? "সংরক্ষণ" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="neo-btn neo-soft flex-1 px-4 py-2 bg-secondary neo-input border text-foreground rounded-lg hover:bg-primary/10 transition-colors font-medium"
                >
                  {isBn ? "বাতিল" : "Cancel"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
