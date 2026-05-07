"use client"

import { CheckCircle2, Circle } from "lucide-react"

interface ProfileField {
  name: string
  completed: boolean
  label: string
}

interface ProfileCompletionProps {
  fields: ProfileField[]
  language?: "en" | "bn"
}

export function ProfileCompletion({ fields, language = "en" }: ProfileCompletionProps) {
  const completedCount = fields.filter(f => f.completed).length
  const totalCount = fields.length
  const percentage = Math.round((completedCount / totalCount) * 100)
  const isBn = language === "bn"

  return (
    <div className="bg-card border-2 border-secondary rounded-xl p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className={`font-semibold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "প্রোফাইল সম্পূর্ণতা" : "Profile Completion"}
          </h3>
          <span className="text-sm font-semibold text-primary">{percentage}%</span>
        </div>
        <div className="w-full bg-secondary/30 rounded-full h-2">
          <div
            className="bg-primary rounded-full h-2 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {fields.map((field) => (
          <div key={field.name} className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/20 transition">
            {field.completed ? (
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-foreground/40 flex-shrink-0" />
            )}
            <span className={`text-sm ${field.completed ? "text-foreground" : "text-foreground/60"} ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {field.label}
            </span>
          </div>
        ))}
      </div>

      {percentage < 100 && (
        <button className="w-full mt-4 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-semibold transition text-sm">
          {isBn ? "প্রোফাইল সম্পূর্ণ করুন" : "Complete Profile"}
        </button>
      )}
    </div>
  )
}
