"use client"

import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface MetricCard {
  id: string
  label: string
  value: string | number
  unit?: string
  change?: number
  changeType?: "increase" | "decrease"
  trend?: number[]
}

interface PerformanceMetricsProps {
  metrics: MetricCard[]
  language?: "en" | "bn"
  title?: string
}

export function PerformanceMetrics({ metrics, language = "en", title }: PerformanceMetricsProps) {
  const isBn = language === "bn"

  return (
    <div className="bg-card border-2 border-secondary rounded-xl p-4 md:p-6">
      {title && (
        <h3 className={`font-semibold text-foreground mb-4 md:mb-6 text-sm md:text-base ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {title}
        </h3>
      )}

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="p-3 md:p-4 rounded-lg bg-secondary/30 border border-secondary hover:shadow-md transition"
          >
            <p className={`text-xs uppercase tracking-wider text-foreground/60 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {metric.label}
            </p>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl md:text-3xl font-[var(--font-display)] text-primary">
                  {metric.value}
                </div>
                {metric.unit && (
                  <p className="text-xs text-foreground/60 mt-1">{metric.unit}</p>
                )}
              </div>
              {metric.change !== undefined && (
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs md:text-sm font-semibold ${
                    metric.changeType === "increase"
                      ? "bg-green-500/20 text-green-600 dark:text-green-400"
                      : "bg-red-500/20 text-red-600 dark:text-red-400"
                  }`}
                >
                  {metric.changeType === "increase" ? (
                    <ArrowUpRight className="w-3 md:w-4 h-3 md:h-4" />
                  ) : (
                    <ArrowDownRight className="w-3 md:w-4 h-3 md:h-4" />
                  )}
                  {metric.change}%
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
