"use client"

import { useRouter } from "next/navigation"
import { CheckCircle2, Circle } from "lucide-react"

interface ProfileField {
  name: string
  completed: boolean
  label: string
  onClick?: () => void
  href?: string
}

interface ProfileCompletionProps {
  fields: ProfileField[]
  language?: "en" | "bn"
  onFieldClick?: (field: ProfileField) => void
  onCompleteClick?: () => void
}

export function ProfileCompletion({ fields, language = "en", onFieldClick, onCompleteClick }: ProfileCompletionProps) {
  const router = useRouter()
  const completedCount = fields.filter(f => f.completed).length
  const totalCount = fields.length
  const percentage = Math.round((completedCount / totalCount) * 100)
  const isBn = language === "bn"

  const handleFieldClick = (field: ProfileField) => {
    if (field.onClick) {
      field.onClick()
    } else if (field.href) {
      router.push(field.href)
    } else if (onFieldClick) {
      onFieldClick(field)
    }
  }

  const handleCompleteClick = () => {
    if (onCompleteClick) {
      onCompleteClick()
    } else {
      router.push("/dashboard/player/profile")
    }
  }

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
          <button
            key={field.name}
            onClick={() => handleFieldClick(field)}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/30 transition-all duration-200 text-left"
          >
            {field.completed ? (
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-foreground/40 flex-shrink-0" />
            )}
            <span className={`text-sm ${field.completed ? "text-foreground" : "text-foreground/60"} ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {field.label}
            </span>
          </button>
        ))}
      </div>

      {percentage < 100 && (
        <button
          onClick={handleCompleteClick}
          className="w-full mt-4 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition text-sm duration-200 transform hover:scale-105"
        >
          {isBn ? "প্রোফাইল সম্পূর্ণ করুন" : "Complete Profile"}
        </button>
      )}
    </div>
  )
}
