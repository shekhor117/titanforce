'use client'

import { useState } from "react"
import { X, ArrowLeft, Play, Cloud } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import type { Match } from "@/lib/data-service"
import { OverviewTab } from "./match-tabs/overview-tab"
import { StatsTab } from "./match-tabs/stats-tab"
import { TimelineTab } from "./match-tabs/timeline-tab"
import { LineupsTab } from "./match-tabs/lineups-tab"
import { PlayersTab } from "./match-tabs/players-tab"
import { StandingsTab } from "./match-tabs/standings-tab"
import { H2HTab } from "./match-tabs/h2h-tab"
import { NewsTab } from "./match-tabs/news-tab"

interface MatchDetailsProps {
  match: Match
  onClose?: () => void
  isModal?: boolean
}

export function MatchDetails({ match, onClose, isModal = false }: MatchDetailsProps) {
  const { isBn } = useLanguage()
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'timeline' | 'lineups' | 'players' | 'standings' | 'h2h' | 'news'>('overview')

  const tabs = [
    { id: 'overview' as const, label: isBn ? 'সংক্ষিপ্ত' : 'Overview' },
    { id: 'stats' as const, label: isBn ? 'পরিসংখ্যান' : 'Stats' },
    { id: 'timeline' as const, label: isBn ? 'সময়রেখা' : 'Timeline' },
    { id: 'lineups' as const, label: isBn ? 'লাইনআপ' : 'Lineups' },
    { id: 'players' as const, label: isBn ? 'খেলোয়াড়' : 'Players' },
    { id: 'standings' as const, label: isBn ? 'টেবিল' : 'Standings' },
    { id: 'h2h' as const, label: 'H2H' },
    { id: 'news' as const, label: isBn ? 'খবর' : 'News' },
  ]

  const getScoreDisplay = () => {
    if (match.home_score !== null && match.away_score !== null) {
      return `${match.home_score} - ${match.away_score}`
    }
    return 'vs'
  }

  const getStatusDisplay = () => {
    if (match.status === 'completed') return isBn ? 'চূড়ান্ত' : 'FT'
    if (match.status === 'live') return isBn ? 'লাইভ' : 'LIVE'
    return ''
  }

  const containerClass = isModal
    ? 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm'
    : 'min-h-screen bg-background'

  const contentClass = isModal
    ? 'relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg bg-background neo-panel'
    : 'w-full'

  return (
    <div className={containerClass} onClick={isModal ? onClose : undefined}>
      <div className={contentClass} onClick={(e) => isModal && e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 z-40 bg-gradient-to-b from-background to-background/95 border-b border-secondary/30">
          <div className="p-4 md:p-6">
            {/* Back Button (only for non-modal) */}
            {!isModal && onClose && (
              <button
                onClick={onClose}
                className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isBn ? 'ফিরে যান' : 'Back'}</span>
              </button>
            )}

            {/* Close Button (only for modal) */}
            {isModal && onClose && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Match Title */}
            <div className="text-center mb-4">
              <div className={`text-xs uppercase tracking-wider font-semibold text-primary mb-2 ${isBn ? 'font-[var(--font-bengali)]' : ''}`}>
                Premier League
              </div>
              <div className={`text-3xl md:text-4xl font-[var(--font-display)] tracking-wider mb-2 ${isBn ? 'font-[var(--font-bengali)]' : ''}`}>
                <span className="text-foreground">{match.home}</span>
                <span className="mx-3 text-primary font-bold">{getScoreDisplay()}</span>
                <span className="text-foreground">{match.away}</span>
              </div>
              <div className={`flex items-center justify-center gap-3 text-sm text-foreground/60 ${isBn ? 'font-[var(--font-bengali)]' : ''}`}>
                <span className="font-semibold">{getStatusDisplay()}</span>
                <span>•</span>
                <span>{match.venue}</span>
              </div>
            </div>

            {/* CTA Button */}
            {match.status === 'completed' && (
              <button className="w-full py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium flex items-center justify-center gap-2 mb-4">
                <Play className="w-4 h-4" />
                {isBn ? 'হাইলাইট দেখুন' : 'Watch Highlights'}
              </button>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="border-t border-secondary/30 overflow-x-auto">
            <div className="flex gap-1 px-4 md:px-6 py-2 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground/60 hover:bg-secondary/30'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4 md:p-6">
          {activeTab === 'overview' && <OverviewTab match={match} />}
          {activeTab === 'stats' && <StatsTab match={match} />}
          {activeTab === 'timeline' && <TimelineTab match={match} />}
          {activeTab === 'lineups' && <LineupsTab match={match} />}
          {activeTab === 'players' && <PlayersTab match={match} />}
          {activeTab === 'standings' && <StandingsTab match={match} />}
          {activeTab === 'h2h' && <H2HTab match={match} />}
          {activeTab === 'news' && <NewsTab match={match} />}
        </div>

        {/* Footer */}
        {match.status === 'completed' && (
          <div className="border-t border-secondary/30 p-4 md:p-6 bg-secondary/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6">
              <div className={`${isBn ? 'font-[var(--font-bengali)]' : ''}`}>
                <div className="text-foreground/60 text-xs uppercase tracking-wider mb-1">{isBn ? 'রেফারি' : 'Referee'}</div>
                <div className="font-medium text-foreground">Michael Oliver</div>
              </div>
              <div className={`${isBn ? 'font-[var(--font-bengali)]' : ''}`}>
                <div className="text-foreground/60 text-xs uppercase tracking-wider mb-1">{isBn ? 'স্টেডিয়াম' : 'Stadium'}</div>
                <div className="font-medium text-foreground">{match.venue}</div>
              </div>
              <div className={`${isBn ? 'font-[var(--font-bengali)]' : ''}`}>
                <div className="text-foreground/60 text-xs uppercase tracking-wider mb-1">{isBn ? 'দর্শক' : 'Attendance'}</div>
                <div className="font-medium text-foreground">60,200</div>
              </div>
              <div className={`${isBn ? 'font-[var(--font-bengali)]' : ''}`}>
                <div className="text-foreground/60 text-xs uppercase tracking-wider mb-1">{isBn ? 'আবহাওয়া' : 'Weather'}</div>
                <div className="flex items-center gap-1 font-medium text-foreground">
                  <Cloud className="w-4 h-4" />
                  18°C
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-foreground/60 border-t border-secondary/30 pt-4">
              <div className="font-semibold text-foreground">{isBn ? 'ম্যাচ তথ্য' : 'Match Facts'}</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-foreground text-xs">
                <div>• {isBn ? 'দলের খেলা' : 'Man of the Match'}: Mohamed Salah</div>
                <div>• {isBn ? 'দীর্ঘতম দখল' : 'Longest possession'}: 4m 32s</div>
                <div>• {isBn ? 'সবচেয়ে দ্রুত লক্ষ্য' : 'Fastest goal'}: 12m</div>
                <div>• {isBn ? 'সর্বোচ্চ গতি' : 'Highest speed'}: 33 km/h</div>
                <div>• {isBn ? 'বেশি পাস' : 'Most passes'}: 87</div>
                <div>• {isBn ? 'বেশি ট্যাকেল' : 'Most tackles'}: 9</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
