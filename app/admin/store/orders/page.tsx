'use client'

import { useLanguage } from '@/lib/language-context'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Eye, CheckCircle, Truck, Package, AlertCircle, Search, Edit, Save, X, Phone, Mail, MapPin, Shirt } from 'lucide-react'
import { StoreDataService, JerseyOrder, Order } from '@/lib/store-data-service'
import { formatBDT, formatUSD } from '@/lib/currency'

export default function StoreOrdersPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'

  const [jerseyOrders, setJerseyOrders] = useState<JerseyOrder[]>([])
  const [regularOrders, setRegularOrders] = useState<Order[]>([])
  const [activeTab, setActiveTab] = useState<'jersey' | 'regular'>('jersey')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<JerseyOrder | Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const storeService = new StoreDataService()

  const statusLabels: Record<string, { bn: string; en: string; color: string }> = {
    pending: { bn: 'অপেক্ষমাণ', en: 'Pending', color: 'bg-yellow-500/20 text-yellow-400' },
    processing: { bn: 'প্রক্রিয়াকরণ', en: 'Processing', color: 'bg-blue-500/20 text-blue-400' },
    shipped: { bn: 'প্রেরিত', en: 'Shipped', color: 'bg-purple-500/20 text-purple-400' },
    delivered: { bn: 'ডেলিভার করা', en: 'Delivered', color: 'bg-green-500/20 text-green-400' },
    cancelled: { bn: 'বাতিল', en: 'Cancelled', color: 'bg-red-500/20 text-red-400' },
  }

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const [jerseyData, regularData] = await Promise.all([
        storeService.getJerseyOrders(),
        storeService.getOrders(),
      ])
      setJerseyOrders(jerseyData || [])
      setRegularOrders(regularData || [])
    } catch (err) {
      console.error('[v0] Error loading orders:', err)
      setError(isBn ? 'অর্ডার লোড করতে ব্যর্থ' : 'Failed to load orders')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: JerseyOrder['status']) => {
    try {
      const result = await storeService.updateJerseyOrderStatus(orderId, newStatus)
      if (result) {
        await loadData()
        if ('jerseyItems' in selectedOrder!) {
          setSelectedOrder(result)
        }
      }
    } catch (err) {
      console.error('[v0] Error updating status:', err)
      setError(isBn ? 'স্ট্যাটাস আপডেট করতে ব্যর্থ' : 'Failed to update status')
    }
  }

  const filteredOrders = (activeTab === 'jersey' ? jerseyOrders : regularOrders).filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold text-foreground ${isBn ? 'font-[var(--font-bengali)]' : ''}`}>
          {isBn ? 'অর্ডার ব্যবস্থাপনা' : 'Order Management'}
        </h1>
        <p className="text-foreground/60 text-sm mt-1">
          {isBn ? `জার্সি: ${jerseyOrders.length} | নিয়মিত: ${regularOrders.length}` : `Jersey: ${jerseyOrders.length} | Regular: ${regularOrders.length}`}
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <div>
            <p className="text-red-400 font-semibold">{error}</p>
            <button onClick={() => loadData()} className="mt-2 text-sm text-red-300 hover:text-red-200 underline">
              {isBn ? 'পুনরায় চেষ্টা করুন' : 'Try Again'}
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-primary/20">
        <button
          onClick={() => setActiveTab('jersey')}
          className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
            activeTab === 'jersey' ? 'border-primary text-primary' : 'border-transparent text-foreground/60 hover:text-foreground'
          }`}
        >
          <Shirt className="w-4 h-4 inline mr-2" />
          {isBn ? 'জার্সি অর্ডার' : 'Jersey Orders'}
        </button>
        <button
          onClick={() => setActiveTab('regular')}
          className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
            activeTab === 'regular' ? 'border-primary text-primary' : 'border-transparent text-foreground/60 hover:text-foreground'
          }`}
        >
          <Package className="w-4 h-4 inline mr-2" />
          {isBn ? 'সাধারণ অর্ডার' : 'Regular Orders'}
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
          <input
            type="text"
            placeholder={isBn ? 'অর্ডার বা গ্রাহক অনুসন্ধান...' : 'Search order or customer...'}
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
          <option value="all">{isBn ? 'সব স্ট্যাটাস' : 'All Status'}</option>
          <option value="pending">{isBn ? 'অপেক্ষমাণ' : 'Pending'}</option>
          <option value="processing">{isBn ? 'প্রক্রিয়াকরণ' : 'Processing'}</option>
          <option value="shipped">{isBn ? 'প্রেরিত' : 'Shipped'}</option>
          <option value="delivered">{isBn ? 'ডেলিভার করা' : 'Delivered'}</option>
          <option value="cancelled">{isBn ? 'বাতিল' : 'Cancelled'}</option>
        </select>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-foreground/60">{isBn ? 'লোড হচ্ছে...' : 'Loading...'}</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-secondary rounded-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 text-foreground/40 mx-auto mb-4" />
          <p className="text-foreground/60">{isBn ? 'কোনো অর্ডার নেই' : 'No orders found'}</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4">
          {filteredOrders.map((order) => {
            const isJersey = 'jerseyItems' in order
            const isSelected = selectedOrder?.id === order.id

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-secondary rounded-lg p-6 border border-primary/20 hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => setSelectedOrder(isSelected ? null : order)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {isJersey ? <Shirt className="w-6 h-6 text-primary" /> : <Package className="w-6 h-6 text-primary" />}
                    <div>
                      <p className="font-bold text-foreground">{order.orderNumber}</p>
                      <p className="text-sm text-foreground/60">{order.customerName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-foreground">
                      {isJersey ? formatBDT((order as JerseyOrder).totalBDT) : `৳${(order as Order).total.toLocaleString()}`}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusLabels[order.status]?.color}`}>
                      {isBn ? statusLabels[order.status]?.bn : statusLabels[order.status]?.en}
                    </span>
                  </div>
                </div>

                {/* Jersey Order Items */}
                {isSelected && isJersey && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 pt-6 border-t border-primary/20 space-y-4"
                  >
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">{isBn ? 'জার্সি' : 'Jerseys'}</h4>
                      <div className="space-y-3">
                        {(order as JerseyOrder).jerseyItems.map((item, idx) => (
                          <div key={idx} className="bg-background/50 rounded p-3">
                            <div className="flex justify-between mb-2">
                              <span className="font-semibold text-foreground">
                                {item.playerName} {item.customName && `(${item.customName})`}
                              </span>
                              <span className="text-primary font-bold">{formatBDT(item.priceBDT)}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-foreground/60">
                              <span>{isBn ? 'কিট:' : 'Kit:'} {item.kitType}</span>
                              <span>{isBn ? 'সাইজ:' : 'Size:'} {item.size}</span>
                              <span>{isBn ? 'ব্যাজ:' : 'Badge:'} {item.badgeType}</span>
                              <span>{isBn ? 'সংখ্যা:' : 'Qty:'} {item.quantity}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-background/50 rounded-lg p-4">
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-foreground/60">{isBn ? 'সাবটোটাল' : 'Subtotal'}:</span>
                          <span className="text-foreground">{formatBDT((order as JerseyOrder).subtotalBDT)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/60">{isBn ? 'কর' : 'Tax'}:</span>
                          <span className="text-foreground">{formatBDT((order as JerseyOrder).tax)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/60">{isBn ? 'শিপিং' : 'Shipping'}:</span>
                          <span className="text-foreground">{formatBDT((order as JerseyOrder).shipping)}</span>
                        </div>
                        <div className="border-t border-primary/20 pt-2 flex justify-between font-bold">
                          <span className="text-foreground">{isBn ? 'মোট' : 'Total'}:</span>
                          <span className="text-primary">{formatBDT((order as JerseyOrder).totalBDT)}</span>
                        </div>
                      </div>

                      <div className="bg-background/50 rounded p-3 mb-4 text-sm">
                        <p className="text-foreground/60 mb-2">{isBn ? 'গ্রাহক তথ্য' : 'Customer Info'}:</p>
                        <p className="text-foreground"><strong>{isBn ? 'নাম:' : 'Name:'}</strong> {order.customerName}</p>
                        <p className="text-foreground"><strong>{isBn ? 'ফোন:' : 'Phone:'}</strong> {order.customerPhone}</p>
                        <p className="text-foreground"><strong>{isBn ? 'ঠিকানা:' : 'Address:'}</strong> {order.customerAddress}</p>
                      </div>

                      <div>
                        <p className="text-xs text-foreground/60 mb-2">{isBn ? 'স্ট্যাটাস আপডেট' : 'Update Status'}</p>
                        <div className="flex gap-2 flex-wrap">
                          {Object.entries(statusLabels).map(([status]) => (
                            <button
                              key={status}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStatusChange(order.id, status as JerseyOrder['status'])
                              }}
                              className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                                order.status === status
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-secondary border border-primary/20 text-foreground hover:bg-primary/10'
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
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
