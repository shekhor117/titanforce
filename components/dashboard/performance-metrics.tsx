"use client"

import { useRouter } from "next/navigation"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface MetricCard {
  id: string
  label: string
  value: string | number
  unit?: string
  change?: number
  changeType?: "increase" | "decrease"
  trend?: number[]
  onClick?: () => void
  href?: string
}

interface PerformanceMetricsProps {
  metrics: MetricCard[]
  language?: "en" | "bn"
  title?: string
  onMetricClick?: (metric: MetricCard) => void
}

export function PerformanceMetrics({ metrics, language = "en", title, onMetricClick }: PerformanceMetricsProps) {
  const router = useRouter()
  const isBn = language === "bn"

  const handleMetricClick = (metric: MetricCard) => {
    if (metric.onClick) {
      metric.onClick()
    } else if (metric.href) {
      router.push(metric.href)
    } else if (onMetricClick) {
      onMetricClick(metric)
    }
  }

  return (
    <div className="bg-card border-2 border-secondary rounded-xl p-6">
      {title && (
        <h3 className={`font-semibold text-foreground mb-6 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {title}
        </h3>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <button
            key={metric.id}
            onClick={() => handleMetricClick(metric)}
            className="p-4 rounded-lg bg-secondary/30 border border-secondary hover:shadow-lg hover:bg-secondary/50 transition-all duration-200 cursor-pointer text-left transform hover:scale-105"
          >
            <p className={`text-xs uppercase tracking-wider text-foreground/60 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {metric.label}
            </p>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-[var(--font-display)] text-primary">
                  {metric.value}
                </div>
                {metric.unit && (
                  <p className="text-xs text-foreground/60 mt-1">{metric.unit}</p>
                )}
              </div>
              {metric.change !== undefined && (
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded text-sm font-semibold ${
                    metric.changeType === "increase"
                      ? "bg-green-500/20 text-green-600 dark:text-green-400"
                      : "bg-red-500/20 text-red-600 dark:text-red-400"
                  }`}
                >
                  {metric.changeType === "increase" ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {metric.change}%
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
