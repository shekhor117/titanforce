"use client"

import { useLanguage } from "@/lib/language-context"
import { useAdmin } from "@/lib/admin-context"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Package, ShoppingCart, DollarSign } from "lucide-react"
import StoreDataService from "@/lib/store-data-service"
import { PageEntrance } from '@/components/page-entrance'

export default function StoreSalesAnalyticsPage() {
  const { language } = useLanguage()
  const { admin } = useAdmin()
  const isBn = language === "bn"

  const [analytics, setAnalytics] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    revenueByStatus: { delivered: 0, shipped: 0, pending: 0 },
    monthlyRevenue: 0,
  })

  useEffect(() => {
    const data = StoreDataService.getStoreAnalytics()
    setAnalytics(data)
  }, [])

  const stats = [
    {
      label: isBn ? "মোট বিক্রয়" : "Total Sales",
      value: `৳${analytics.totalSales.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      label: isBn ? "মোট অর্ডার" : "Total Orders",
      value: analytics.totalOrders,
      icon: ShoppingCart,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: isBn ? "গড় অর্ডার মূল্য" : "Average Order Value",
      value: `৳${analytics.averageOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      icon: TrendingUp,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      label: isBn ? "মোট পণ্য" : "Total Products",
      value: analytics.totalProducts,
      icon: Package,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "বিক্রয় বিশ্লেষণ" : "Sales Analytics"}
        </h1>
        <p className="text-foreground/60 text-sm mt-2">
          {isBn ? "আপনার স্টোরের পারফরম্যান্স এবং বিক্রয় মেট্রিক্স" : "Your store performance and sales metrics"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-lg p-6 ${stat.bgColor} neo-input border/50 transition-colors`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-foreground/60 text-sm font-medium mb-2">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color} opacity-50`} />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Revenue Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-secondary rounded-lg p-8 neo-input border"
      >
        <h2 className={`text-2xl font-bold text-foreground mb-6 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "রাজস্ব বিবরণ" : "Revenue Breakdown"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-background rounded-lg neo-input border">
            <p className="text-foreground/60 text-sm mb-2">{isBn ? "ডেলিভার করা অর্ডার" : "Delivered Orders"}</p>
            <p className="text-3xl font-bold text-green-400 mb-2">
              ৳{analytics.revenueByStatus.delivered.toLocaleString()}
            </p>
            <div className="w-full bg-background rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{
                  width: `${
                    analytics.totalSales === 0 ? 0 : (analytics.revenueByStatus.delivered / analytics.totalSales) * 100
                  }%`,
                }}
              />
            </div>
          </div>

          <div className="p-6 bg-background rounded-lg neo-input border">
            <p className="text-foreground/60 text-sm mb-2">{isBn ? "প্রেরিত অর্ডার" : "Shipped Orders"}</p>
            <p className="text-3xl font-bold text-purple-400 mb-2">
              ৳{analytics.revenueByStatus.shipped.toLocaleString()}
            </p>
            <div className="w-full bg-background rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all"
                style={{
                  width: `${
                    analytics.totalSales === 0 ? 0 : (analytics.revenueByStatus.shipped / analytics.totalSales) * 100
                  }%`,
                }}
              />
            </div>
          </div>

          <div className="p-6 bg-background rounded-lg neo-input border">
            <p className="text-foreground/60 text-sm mb-2">{isBn ? "অপেক্ষমাণ অর্ডার" : "Pending Orders"}</p>
            <p className="text-3xl font-bold text-yellow-400 mb-2">
              ৳{analytics.revenueByStatus.pending.toLocaleString()}
            </p>
            <div className="w-full bg-background rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full transition-all"
                style={{
                  width: `${
                    analytics.totalSales === 0 ? 0 : (analytics.revenueByStatus.pending / analytics.totalSales) * 100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Inventory Alert */}
      {analytics.lowStockProducts > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-6"
        >
          <h3 className="font-bold text-yellow-400 mb-2">{isBn ? "ইনভেন্টরি সতর্কতা" : "Inventory Alert"}</h3>
          <p className="text-foreground/80 text-sm">
            {isBn
              ? `${analytics.lowStockProducts} পণ্যের স্টক কম। সময়মতো পুনঃঅর্ডার করুন।`
              : `${analytics.lowStockProducts} products have low stock. Order more soon.`}
          </p>
        </motion.div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary rounded-lg p-8 neo-input border"
        >
          <h3 className={`text-lg font-bold text-foreground mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "মাসিক রাজস্ব" : "Monthly Revenue"}
          </h3>
          <p className="text-4xl font-bold text-primary">৳{analytics.monthlyRevenue.toLocaleString()}</p>
          <p className="text-foreground/60 text-sm mt-2">
            {isBn ? "এই মাসের মোট বিক্রয়" : "Total sales this month"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary rounded-lg p-8 neo-input border"
        >
          <h3 className={`text-lg font-bold text-foreground mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "কর্মক্ষমতা সারসংক্ষেপ" : "Performance Summary"}
          </h3>
          <div className="space-y-2 text-sm">
            <p className="text-foreground/80">
              {isBn ? "গড় অর্ডার মূল্য:" : "Average order value:"}{" "}
              <span className="text-primary font-bold">
                ৳{analytics.averageOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </p>
            <p className="text-foreground/80">
              {isBn ? "সমাপ্ত অর্ডার:" : "Completed orders:"}{" "}
              <span className="text-green-400 font-bold">{analytics.totalOrders}</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
