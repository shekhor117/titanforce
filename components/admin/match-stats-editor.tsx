'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/language-context'

interface MatchStats {
  home_possession?: number
  away_possession?: number
  home_shots?: number
  away_shots?: number
  home_shots_on_target?: number
  away_shots_on_target?: number
  home_big_chances?: number
  away_big_chances?: number
  home_corners?: number
  away_corners?: number
  home_offsides?: number
  away_offsides?: number
  home_fouls?: number
  away_fouls?: number
  home_yellow_cards?: number
  away_yellow_cards?: number
  home_red_cards?: number
  away_red_cards?: number
  home_pass_accuracy?: number
  away_pass_accuracy?: number
  home_passes?: number
  away_passes?: number
  home_tackles?: number
  away_tackles?: number
  home_saves?: number
  away_saves?: number
  home_xg?: number
  away_xg?: number
  home_win_probability?: number
  away_win_probability?: number
  draw_probability?: number
}

interface MatchStatsEditorProps {
  stats: MatchStats
  homeTeam: string
  awayTeam: string
  onSave: (stats: MatchStats) => void
}

export function MatchStatsEditor({ stats, homeTeam, awayTeam, onSave }: MatchStatsEditorProps) {
  const { isBn } = useLanguage()
  const [formData, setFormData] = useState<MatchStats>(stats)

  const handleChange = (field: keyof MatchStats, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value ? parseFloat(value) : undefined
    }))
  }

  const handleSave = () => {
    onSave(formData)
  }

  const statGroups = [
    {
      label: isBn ? 'মৌলিক পরিসংখ্যান' : 'Basic Stats',
      stats: [
        { key: 'home_possession', label: isBn ? 'দখল' : 'Possession (%)', max: 100 },
        { key: 'away_possession', label: isBn ? 'দখল' : 'Possession (%)' , max: 100 },
        { key: 'home_shots', label: isBn ? 'শট' : 'Shots', max: 50 },
        { key: 'away_shots', label: isBn ? 'শট' : 'Shots', max: 50 },
        { key: 'home_shots_on_target', label: isBn ? 'লক্ষ্যে শট' : 'Shots on Target', max: 20 },
        { key: 'away_shots_on_target', label: isBn ? 'লক্ষ্যে শট' : 'Shots on Target', max: 20 },
      ]
    },
    {
      label: isBn ? 'আক্রমণ' : 'Attack',
      stats: [
        { key: 'home_big_chances', label: isBn ? 'বড় সুযোগ' : 'Big Chances', max: 15 },
        { key: 'away_big_chances', label: isBn ? 'বড় সুযোগ' : 'Big Chances', max: 15 },
        { key: 'home_xg', label: isBn ? 'প্রত্যাশিত গোল' : 'xG', max: 5 },
        { key: 'away_xg', label: isBn ? 'প্রত্যাশিত গোল' : 'xG', max: 5 },
      ]
    },
    {
      label: isBn ? 'শৃঙ্খলা' : 'Discipline',
      stats: [
        { key: 'home_fouls', label: isBn ? 'ফাউল' : 'Fouls', max: 30 },
        { key: 'away_fouls', label: isBn ? 'ফাউল' : 'Fouls', max: 30 },
        { key: 'home_yellow_cards', label: isBn ? 'হলুদ কার্ড' : 'Yellow Cards', max: 10 },
        { key: 'away_yellow_cards', label: isBn ? 'হলুদ কার্ড' : 'Yellow Cards', max: 10 },
        { key: 'home_red_cards', label: isBn ? 'লাল কার্ড' : 'Red Cards', max: 5 },
        { key: 'away_red_cards', label: isBn ? 'লাল কার্ড' : 'Red Cards', max: 5 },
      ]
    },
    {
      label: isBn ? 'সম্ভাব্যতা' : 'Probability',
      stats: [
        { key: 'home_win_probability', label: `${homeTeam} ${isBn ? 'জেতার সম্ভাবনা' : 'Win %'}`, max: 100 },
        { key: 'away_win_probability', label: `${awayTeam} ${isBn ? 'জেতার সম্ভাবনা' : 'Win %'}`, max: 100 },
        { key: 'draw_probability', label: isBn ? 'ড্র সম্ভাবনা' : 'Draw %', max: 100 },
      ]
    }
  ]

  return (
    <div className="space-y-6">
      {statGroups.map((group, idx) => (
        <div key={idx} className="space-y-4">
          <h3 className={`text-sm font-semibold text-primary uppercase ${isBn ? 'font-bengali' : ''}`}>
            {group.label}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {group.stats.map((stat) => (
              <div key={stat.key}>
                <label className={`text-xs text-foreground/60 block mb-1 ${isBn ? 'font-bengali' : ''}`}>
                  {stat.label}
                </label>
                <input
                  type="number"
                  min="0"
                  max={stat.max}
                  step={stat.key.includes('probability') || stat.key.includes('accuracy') ? 0.1 : 1}
                  value={formData[stat.key as keyof MatchStats] ?? ''}
                  onChange={(e) => handleChange(stat.key as keyof MatchStats, e.target.value)}
                  className="w-full px-3 py-2 rounded bg-secondary border border-foreground/10 text-foreground text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex gap-2 pt-4">
        <button
          onClick={handleSave}
          className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        >
          {isBn ? 'সংরক্ষণ করুন' : 'Save Stats'}
        </button>
      </div>
    </div>
  )
}
