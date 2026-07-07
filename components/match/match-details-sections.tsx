'use client'

import { Match } from '@/lib/data-service'
import { useLanguage } from '@/lib/language-context'
import { Activity, Trophy, BarChart3, Users, TrendingUp } from 'lucide-react'

interface MatchDetailsSectionsProps {
  match: Match
  activeTab: string
}

export function MatchDetailsSections({ match, activeTab }: MatchDetailsSectionsProps) {
  const { language } = useLanguage()
  const isBn = language === 'bn'

  // Overview Tab
  if (activeTab === 'overview') {
    return (
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
              <span className="font-medium text-foreground">{match.date}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-secondary/20">
              <span className="text-foreground/70">{isBn ? 'সময়' : 'Time'}</span>
              <span className="font-medium text-foreground">{match.time || '-'}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-secondary/20">
              <span className="text-foreground/70">{isBn ? 'স্টেডিয়াম' : 'Venue'}</span>
              <span className="font-medium text-foreground">{match.venue || '-'}</span>
            </div>
            {match.season_year && (
              <div className="flex justify-between items-center">
                <span className="text-foreground/70">{isBn ? 'সিজন' : 'Season'}</span>
                <span className="font-medium text-foreground">{match.season_year}</span>
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
              <p className="text-sm font-semibold text-foreground mb-3">{match.home} {isBn ? 'গোল' : 'Goals'}</p>
              <div className="space-y-2">
                {match.goals && match.goals.filter((g: any) => g.team === match.home).length > 0 ? (
                  match.goals
                    .filter((g: any) => g.team === match.home)
                    .map((goal: any, i: number) => (
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
              <p className="text-sm font-semibold text-foreground mb-3">{match.away} {isBn ? 'গোল' : 'Goals'}</p>
              <div className="space-y-2">
                {match.goals && match.goals.filter((g: any) => g.team === match.away).length > 0 ? (
                  match.goals
                    .filter((g: any) => g.team === match.away)
                    .map((goal: any, i: number) => (
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
    )
  }

  // Statistics Tab
  if (activeTab === 'stats') {
    return (
      <div className="neo-panel p-6 sm:p-8">
        <h3 className="text-lg font-bold text-foreground mb-8 flex items-center gap-3">
          <BarChart3 className="w-5 h-5 text-primary" />
          {isBn ? 'ম্যাচ পরিসংখ্যান' : 'Match Statistics'}
        </h3>
        <p className="text-foreground/60 text-center py-12">
          {isBn ? 'বিস্তারিত পরিসংখ্যান শীঘ্রই আসছে' : 'Detailed statistics coming soon'}
        </p>
      </div>
    )
  }

  // Lineups Tab
  if (activeTab === 'lineups') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Home Lineup */}
        <div className="neo-panel p-6 sm:p-8">
          <h3 className="text-lg font-bold text-foreground mb-6">{match.home} {isBn ? 'লাইনআপ' : 'Lineup'}</h3>
          <div className="space-y-2">
            {match.home_lineup && match.home_lineup.length > 0 ? (
              match.home_lineup.map((player: any, i: number) => (
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
          <h3 className="text-lg font-bold text-foreground mb-6">{match.away} {isBn ? 'লাইনআপ' : 'Lineup'}</h3>
          <div className="space-y-2">
            {match.away_lineup && match.away_lineup.length > 0 ? (
              match.away_lineup.map((player: any, i: number) => (
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
    )
  }

  // Match Events Tab
  if (activeTab === 'events') {
    return (
      <div className="neo-panel p-6 sm:p-8">
        <h3 className="text-lg font-bold text-foreground mb-8 flex items-center gap-3">
          <Activity className="w-5 h-5 text-primary" />
          {isBn ? 'ম্যাচ ইভেন্ট' : 'Match Events'}
        </h3>
        {match.match_events && match.match_events.length > 0 ? (
          <div className="space-y-4">
            {match.match_events.map((event: any, i: number) => (
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
    )
  }

  // Player Ratings Tab
  if (activeTab === 'ratings') {
    return (
      <div className="neo-panel p-6 sm:p-8">
        <h3 className="text-lg font-bold text-foreground mb-8 flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-primary" />
          {isBn ? 'খেলোয়াড় রেটিং' : 'Player Ratings'}
        </h3>
        <p className="text-foreground/60 text-center py-12">
          {isBn ? 'খেলোয়াড় রেটিং শীঘ্রই আসবে' : 'Player ratings coming soon'}
        </p>
      </div>
    )
  }

  return null
}
