'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { WebsiteSidebar } from '@/components/website-sidebar'
import { Footer } from '@/components/footer'
import { ArrowLeft, Loader, MapPin, Clock, Users, Activity, Trophy, BarChart3, TrendingUp } from 'lucide-react'
import { useMatches } from '@/lib/use-data-store'
import type { Match } from '@/lib/data-service'
import { useLanguage } from '@/lib/language-context'

interface TabType {
  id: string
  label: string
  labelBn: string
}

const TABS: TabType[] = [
  { id: 'overview', label: 'Overview', labelBn: 'সামগ্রিক' },
  { id: 'stats', label: 'Statistics', labelBn: 'পরিসংখ্যান' },
  { id: 'lineups', label: 'Lineups', labelBn: 'লাইনআপ' },
  { id: 'events', label: 'Match Events', labelBn: 'ম্যাচ ইভেন্ট' },
  { id: 'ratings', label: 'Player Ratings', labelBn: 'খেলোয়াড় রেটিং' },
]

export default function MatchDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const matchId = params.id as string
  const { matches: realMatches, loading } = useMatches()
  const { language, t } = useLanguage()
  const isBn = language === 'bn'

  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!loading) {
      const match = realMatches.find(m => m.id === matchId)
      if (match) {
        setSelectedMatch(match)
      }
    }
  }, [matchId, realMatches, loading])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-foreground/60">{isBn ? 'ম্যাচ বিবরণ লোড করা হচ্ছে...' : 'Loading match details...'}</p>
        </div>
      </div>
    )
  }

  if (!selectedMatch) {
    return (
      <div className="min-h-screen bg-background">
        <WebsiteSidebar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:ml-64">
          <div className="text-center">
            <p className="text-foreground/60 mb-6">{isBn ? 'ম্যাচ পাওয়া যায়নি' : 'Match not found'}</p>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {isBn ? 'ফিরে যান' : 'Go Back'}
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const getStatusBadge = () => {
    if (selectedMatch.status === 'live') {
      return { text: isBn ? 'লাইভ' : 'LIVE', bg: 'bg-red-600', pulse: true }
    }
    if (selectedMatch.status === 'completed') {
      if (selectedMatch.result === 'W') return { text: isBn ? 'জয়' : 'WIN', bg: 'bg-emerald-600', pulse: false }
      if (selectedMatch.result === 'L') return { text: isBn ? 'পরাজয়' : 'LOSS', bg: 'bg-red-600', pulse: false }
      return { text: isBn ? 'ড্র' : 'DRAW', bg: 'bg-yellow-600', pulse: false }
    }
    return { text: isBn ? 'আসন্ন' : 'UPCOMING', bg: 'bg-blue-600', pulse: false }
  }

  const badge = getStatusBadge()

  return (
    <div className="min-h-screen bg-background">
      <WebsiteSidebar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:ml-64">
        {/* Back Button */}
        <div className="py-6 border-b border-secondary/20">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            {isBn ? 'ফিরে যান' : 'Back'}
          </button>
        </div>

        {/* Hero Section */}
        <div className="py-8 sm:py-12 border-b border-secondary/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
            <div>
              <p className="text-sm text-foreground/60 mb-2 uppercase tracking-wide">
                {selectedMatch.date} {selectedMatch.time && `• ${selectedMatch.time}`}
              </p>
              {selectedMatch.venue && (
                <p className="text-sm text-foreground/60 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {selectedMatch.venue}
                </p>
              )}
            </div>
            <div className={`px-4 py-2 rounded-full font-bold uppercase tracking-widest text-white text-xs ${badge.bg} ${badge.pulse ? 'animate-pulse' : ''} w-fit`}>
              {badge.text}
            </div>
          </div>

          {/* Main Match Display */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 items-center">
            {/* Home Team */}
            <div className="text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white font-black text-3xl sm:text-4xl">{selectedMatch.home?.substring(0, 2).toUpperCase()}</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1">{selectedMatch.home}</h2>
              <p className="text-xs text-foreground/60">{isBn ? 'হোম' : 'Home'}</p>
            </div>

            {/* Score */}
            <div className="text-center">
              <div className="mb-4">
                <p className="text-6xl sm:text-7xl md:text-8xl font-black text-primary tracking-tighter">
                  {selectedMatch.home_score ?? '-'}
                </p>
                <p className="text-2xl text-foreground/30 -mt-2">:</p>
                <p className="text-6xl sm:text-7xl md:text-8xl font-black text-primary tracking-tighter">
                  {selectedMatch.away_score ?? '-'}
                </p>
              </div>
              <p className="text-xs uppercase tracking-widest text-foreground/60 font-semibold">
                {selectedMatch.status === 'completed' ? (isBn ? 'চূড়ান্ত' : 'FINAL') : selectedMatch.status === 'live' ? 'LIVE' : isBn ? 'সময়সূচী' : 'SCHEDULE'}
              </p>
            </div>

            {/* Away Team */}
            <div className="text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white font-black text-3xl sm:text-4xl">{selectedMatch.away?.substring(0, 2).toUpperCase()}</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1">{selectedMatch.away}</h2>
              <p className="text-xs text-foreground/60">{isBn ? 'দূরবর্তী' : 'Away'}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-secondary/20 -mx-4 sm:mx-0 px-4 sm:px-0">
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <div className="flex gap-1 min-w-max">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 sm:px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-foreground/60 hover:text-foreground'
                  }`}
                >
                  {isBn ? tab.labelBn : tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="py-8 sm:py-12">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {/* Match Information */}
              <div className="neo-panel p-6 sm:p-8">
                <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-3">
                  <Activity className="w-5 h-5 text-primary" />
                  {isBn ? 'ম্যাচ তথ্য' : 'Match Information'}
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-secondary/20">
                    <span className="text-foreground/70">{isBn ? 'তারিখ' : 'Date'}</span>
                    <span className="font-medium text-foreground">{selectedMatch.date}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-secondary/20">
                    <span className="text-foreground/70">{isBn ? 'সময়' : 'Time'}</span>
                    <span className="font-medium text-foreground">{selectedMatch.time || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-secondary/20">
                    <span className="text-foreground/70">{isBn ? 'স্টেডিয়াম' : 'Venue'}</span>
                    <span className="font-medium text-foreground">{selectedMatch.venue || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-secondary/20">
                    <span className="text-foreground/70">{isBn ? 'স্থিতি' : 'Status'}</span>
                    <span className={`font-medium px-3 py-1 rounded-full text-sm ${badge.bg} text-white`}>
                      {badge.text}
                    </span>
                  </div>
                  {selectedMatch.tournament && (
                    <div className="flex justify-between items-center">
                      <span className="text-foreground/70">{isBn ? 'টুর্নামেন্ট' : 'Tournament'}</span>
                      <span className="font-medium text-foreground">{selectedMatch.tournament}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Match Goals */}
              <div className="neo-panel p-6 sm:p-8">
                <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-primary" />
                  {isBn ? 'গোল' : 'Goals'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-3">{selectedMatch.home} {isBn ? 'গোল' : 'Goals'}</p>
                    <div className="space-y-2">
                      {selectedMatch.homeGoals && selectedMatch.homeGoals.length > 0 ? (
                        selectedMatch.homeGoals.map((goal, i) => (
                          <div key={i} className="text-sm text-foreground/80 flex justify-between">
                            <span>{goal.player}</span>
                            <span className="text-foreground/50">{goal.minute}&apos;</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-foreground/50">{isBn ? 'কোন গোল নেই' : 'No goals'}</p>
                      )}
                    </div>
                  </div>
                  <div className="border-t border-secondary/20 pt-4">
                    <p className="text-sm font-semibold text-foreground mb-3">{selectedMatch.away} {isBn ? 'গোল' : 'Goals'}</p>
                    <div className="space-y-2">
                      {selectedMatch.awayGoals && selectedMatch.awayGoals.length > 0 ? (
                        selectedMatch.awayGoals.map((goal, i) => (
                          <div key={i} className="text-sm text-foreground/80 flex justify-between">
                            <span>{goal.player}</span>
                            <span className="text-foreground/50">{goal.minute}&apos;</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-foreground/50">{isBn ? 'কোন গোল নেই' : 'No goals'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === 'stats' && (
            <div className="neo-panel p-6 sm:p-8">
              <h3 className="text-lg font-bold text-foreground mb-8 flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-primary" />
                {isBn ? 'ম্যাচ পরিসংখ্যান' : 'Match Statistics'}
              </h3>
              <p className="text-foreground/60 text-center py-12">{isBn ? 'বিস্তারিত পরিসংখ্যান শীঘ্রই আসছে' : 'Detailed statistics coming soon'}</p>
            </div>
          )}

          {/* Lineups Tab */}
          {activeTab === 'lineups' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Home Lineup */}
              <div className="neo-panel p-6 sm:p-8">
                <h3 className="text-lg font-bold text-foreground mb-6">{selectedMatch.home} {isBn ? 'লাইনআপ' : 'Lineup'}</h3>
                <div className="space-y-2">
                  {selectedMatch.home_lineup && selectedMatch.home_lineup.length > 0 ? (
                    selectedMatch.home_lineup.map((player, i) => (
                      <div key={i} className="flex items-center justify-between py-3 px-4 bg-secondary/5 rounded-lg hover:bg-secondary/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-600/20 flex items-center justify-center text-sm font-bold text-emerald-600">
                            {player.number}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{player.player || player.name}</p>
                            <p className="text-xs text-foreground/50">{player.position}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-foreground/50 py-6 text-center">{isBn ? 'লাইনআপ উপলব্ধ নয়' : 'Lineup not available'}</p>
                  )}
                </div>
              </div>

              {/* Away Lineup */}
              <div className="neo-panel p-6 sm:p-8">
                <h3 className="text-lg font-bold text-foreground mb-6">{selectedMatch.away} {isBn ? 'লাইনআপ' : 'Lineup'}</h3>
                <div className="space-y-2">
                  {selectedMatch.away_lineup && selectedMatch.away_lineup.length > 0 ? (
                    selectedMatch.away_lineup.map((player, i) => (
                      <div key={i} className="flex items-center justify-between py-3 px-4 bg-secondary/5 rounded-lg hover:bg-secondary/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-600/20 flex items-center justify-center text-sm font-bold text-indigo-600">
                            {player.number}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{player.player || player.name}</p>
                            <p className="text-xs text-foreground/50">{player.position}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-foreground/50 py-6 text-center">{isBn ? 'লাইনআপ উপলব্ধ নয়' : 'Lineup not available'}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Match Events Tab */}
          {activeTab === 'events' && (
            <div className="neo-panel p-6 sm:p-8">
              <h3 className="text-lg font-bold text-foreground mb-8 flex items-center gap-3">
                <Activity className="w-5 h-5 text-primary" />
                {isBn ? 'ম্যাচ ইভেন্ট' : 'Match Events'}
              </h3>
              {selectedMatch.match_events && selectedMatch.match_events.length > 0 ? (
                <div className="space-y-4">
                  {selectedMatch.match_events.map((event, i) => (
                    <div key={i} className="flex items-start gap-4 pb-4 border-b border-secondary/20 last:border-b-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm">
                        {event.minute}&apos;
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{event.player}</p>
                        <p className="text-xs text-foreground/60">{event.type}</p>
                        <p className="text-xs text-foreground/50 mt-1">{event.team}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-foreground/50 py-12 text-center">{isBn ? 'ইভেন্ট উপলব্ধ নয়' : 'No events available'}</p>
              )}
            </div>
          )}

          {/* Player Ratings Tab */}
          {activeTab === 'ratings' && (
            <div className="neo-panel p-6 sm:p-8">
              <h3 className="text-lg font-bold text-foreground mb-8 flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                {isBn ? 'খেলোয়াড় রেটিং' : 'Player Ratings'}
              </h3>
              <p className="text-foreground/60 text-center py-12">{isBn ? 'খেলোয়াড় রেটিং শীঘ্রই আসবে' : 'Player ratings coming soon'}</p>
            </div>
          )}
        </div>
      </main>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  )
}
