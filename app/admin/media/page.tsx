"use client"

import { useLanguage } from "@/lib/language-context"

export default function AdminMedia() {
  const { language } = useLanguage()
  const isBn = language === "bn"

  return (
    <div className="space-y-6">
      <h1 className={`font-[var(--font-display)] text-3xl tracking-wider text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
        {isBn ? "মিডিয়া ব্যবস্থাপনা" : "Media Management"}
      </h1>

      <div className="rounded-xl border-2 border-dashed border-primary bg-card p-12 text-center">
        <div className="text-4xl mb-4">📸</div>
        <h3 className={`text-xl font-semibold text-foreground mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "ছবি এবং ভিডিও আপলোড করুন" : "Upload Photos & Videos"}
        </h3>
        <p className={`text-foreground/60 mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "ম্যাচ এবং প্রশিক্ষণ ফটোগুলি এখানে আপলোড করুন" : "Upload match and training photos here"}
        </p>
        <button className={`px-6 py-3 rounded bg-primary text-primary-foreground hover:opacity-90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "ফাইল চয়ন করুন" : "Choose Files"}
        </button>
      </div>
    </div>
  )
}
