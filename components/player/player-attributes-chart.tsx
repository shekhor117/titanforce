'use client'

import { Player } from '@/lib/data-service'
import { useLanguage } from '@/lib/language-context'

interface PlayerAttributesChartProps {
  player: Player
}

export function PlayerAttributesChart({ player }: PlayerAttributesChartProps) {
  const { language } = useLanguage()
  const isBn = language === 'bn'

  const attributes = [
    { key: 'pace', label: isBn ? 'গতি' : 'Pace', value: player.pace || 0 },
    { key: 'shooting', label: isBn ? 'শুট' : 'Shooting', value: player.shooting || 0 },
    { key: 'passing', label: isBn ? 'পাস' : 'Passing', value: player.passing || 0 },
    { key: 'dribbling', label: isBn ? 'ড্রিবলিং' : 'Dribbling', value: player.dribbling || 0 },
    { key: 'defending', label: isBn ? 'ডিফেন্ডিং' : 'Defending', value: player.defending || 0 },
    { key: 'physical', label: isBn ? 'শক্তি' : 'Physical', value: player.physical || 0 },
  ]

  return (
    <div className="neo-card p-6 md:p-8 rounded-2xl">
      <h3 className={`text-xl md:text-2xl font-bold text-foreground mb-6 uppercase tracking-wider ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
        {isBn ? 'বৈশিষ্ট্য' : 'Attributes'}
      </h3>

      <div className="space-y-5">
        {attributes.map((attr) => (
          <div key={attr.key} className="space-y-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm md:text-base font-semibold text-foreground/90">{attr.label}</span>
              <span className="text-sm md:text-base font-bold text-primary">{attr.value}</span>
            </div>
            <div className="w-full bg-secondary/30 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((attr.value / 100) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Overall Rating */}
      <div className="mt-8 pt-6 border-t border-secondary/30">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-foreground">{isBn ? 'সামগ্রিক রেটিং' : 'Overall Rating'}</span>
          <div className="flex items-center gap-2">
            <div className="text-3xl font-black text-primary">{Math.round((attributes.reduce((a, b) => a + b.value, 0) / attributes.length) || 0)}</div>
            <span className="text-sm text-foreground/60">/100</span>
          </div>
        </div>
      </div>
    </div>
  )
}
