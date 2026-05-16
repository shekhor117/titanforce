"use client"

import { useLanguage } from "@/lib/language-context"
import { useAdmin } from "@/lib/admin-context"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Eye, CheckCircle, Truck, Package, AlertCircle, Search } from "lucide-react"
import StoreDataService, { Order } from "@/lib/store-data-service"

export default function StoreOrdersPage() {
  const { language } = useLanguage()
  const { admin } = useAdmin()
  const isBn = language === "bn"

  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const statusLabels: Record<string, { bn: string; en: string; color: string }> = {
    pending: { bn: "অপেক্ষমাণ", en: "Pending", color: "bg-yellow-500/20 text-yellow-400" },
    processing: { bn: "প্রক্রিয়াকরণ", en: "Processing", color: "bg-blue-500/20 text-blue-400" },
    shipped: { bn: "প্রেরিত", en: "Shipped", color: "bg-purple-500/20 text-purple-400" },
    delivered: { bn: "ডেলিভার করা", en: "Delivered", color: "bg-green-500/20 text-green-400" },
    cancelled: { bn: "বাতিল", en: "Cancelled", color: "bg-red-500/20 text-red-400" },
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = () => {
    setIsLoading(true)
    const data = StoreDataService.getOrders()
    setOrders(data)
    setIsLoading(false)
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || order.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    StoreDataService.updateOrderStatus(orderId, newStatus)
    loadOrders()
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(StoreDataService.getOrderById(orderId))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "অর্ডার ব্যবস্থাপনা" : "Order Management"}
        </h1>
        <p className="text-foreground/60 text-sm mt-1">
          {isBn ? `মোট ${orders.length} অর্ডার` : `Total ${orders.length} orders`}
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
          <input
            type="text"
            placeholder={isBn ? "অর্ডার বা গ্রাহক অনুসন্ধান..." : "Search order or customer..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-secondary rounded-lg border border-primary/20 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-secondary rounded-lg border border-primary/20 text-foreground focus:outline-none focus:border-primary"
        >
          <option value="all">{isBn ? "সব স্ট্যাটাস" : "All Status"}</option>
          <option value="pending">{isBn ? "অপেক্ষমাণ" : "Pending"}</option>
          <option value="processing">{isBn ? "প্রক্রিয়াকরণ" : "Processing"}</option>
          <option value="shipped">{isBn ? "প্রেরিত" : "Shipped"}</option>
          <option value="delivered">{isBn ? "ডেলিভার করা" : "Delivered"}</option>
          <option value="cancelled">{isBn ? "বাতিল" : "Cancelled"}</option>
        </select>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-foreground/60">{isBn ? "লোড হচ্ছে..." : "Loading..."}</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-secondary rounded-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 text-foreground/40 mx-auto mb-4" />
          <p className="text-foreground/60">{isBn ? "কোনো অর্ডার নেই" : "No orders found"}</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4">
          {filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-secondary rounded-lg p-6 border border-primary/20 hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Package className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-bold text-foreground">{order.orderNumber}</p>
                    <p className="text-sm text-foreground/60">{order.customer.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-foreground">৳{order.total.toLocaleString()}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusLabels[order.status]?.color
                    }`}
                  >
                    {isBn ? statusLabels[order.status]?.bn : statusLabels[order.status]?.en}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              {selectedOrder?.id === order.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 pt-6 border-t border-primary/20 space-y-4"
                >
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">{isBn ? "পণ্য" : "Items"}</h4>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-foreground/80">
                            {item.name} ({item.size}/{item.color}) x{item.quantity}
                          </span>
                          <span className="text-foreground font-semibold">
                            ৳{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-background/50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-foreground/60 mb-1">{isBn ? "গ্রাহক" : "Customer"}</p>
                        <p className="text-sm font-semibold text-foreground">{order.customer.name}</p>
                        <p className="text-xs text-foreground/60">{order.customer.email}</p>
                        <p className="text-xs text-foreground/60">{order.customer.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-foreground/60 mb-1">{isBn ? "প্রেরণ ঠিকানা" : "Shipping Address"}</p>
                        <p className="text-xs text-foreground/80">{order.customer.address}</p>
                        <p className="text-xs text-foreground/60 mt-2">{isBn ? "তারিখ:" : "Date:"} {order.createdAt}</p>
                      </div>
                    </div>

                    <div className="border-t border-primary/20 pt-4 mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-foreground/60">{isBn ? "সাবটোটাল" : "Subtotal"}:</span>
                        <span className="text-foreground">৳{order.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-foreground/60">{isBn ? "কর" : "Tax"}:</span>
                        <span className="text-foreground">৳{order.tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-foreground/60">{isBn ? "শিপিং" : "Shipping"}:</span>
                        <span className="text-foreground">৳{order.shipping}</span>
                      </div>
                      <div className="border-t border-primary/20 pt-2 flex justify-between font-bold">
                        <span className="text-foreground">{isBn ? "মোট" : "Total"}:</span>
                        <span className="text-primary">৳{order.total.toLocaleString()}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-foreground/60 mb-2">{isBn ? "স্ট্যাটাস আপডেট" : "Update Status"}</p>
                      <div className="flex gap-2 flex-wrap">
                        {Object.entries(statusLabels).map(([status]) => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(order.id, status as Order["status"])}
                            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                              order.status === status
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary border border-primary/20 text-foreground hover:bg-primary/10"
                            }`}
                          >
                            {isBn ? statusLabels[status]?.bn : statusLabels[status]?.en}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
