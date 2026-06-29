'use client'

import type { Match } from '@/lib/data-service'
import { useLanguage } from '@/lib/language-context'

interface LineupsTabProps {
  match: Match
}

export function LineupsTab({ match }: LineupsTabProps) {
  const { isBn } = useLanguage()

  const formations = ['4-3-3', '4-2-3-1', '3-5-2', '5-3-2']

  return (
    <div className="space-y-6">
      {match.home_lineup || match.away_lineup ? (
        <>
          {/* Formation Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="neo-panel p-6 text-center">
              <div className="text-sm uppercase tracking-wider text-foreground/60 mb-2">{match.home}</div>
              <div className="text-2xl font-bold text-emerald-400">{formations[0]}</div>
            </div>
            <div className="neo-panel p-6 text-center">
              <div className="text-sm uppercase tracking-wider text-foreground/60 mb-2">{match.away}</div>
              <div className="text-2xl font-bold text-indigo-400">{formations[1]}</div>
            </div>
          </div>

          {/* Lineups */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Home Lineup */}
            {match.home_lineup && match.home_lineup.length > 0 && (
              <div className="neo-panel p-6">
                <h3 className="text-sm uppercase tracking-wider font-semibold text-primary mb-4">
                  {match.home} {isBn ? 'একাদশ' : 'XI'}
                </h3>
                <div className="space-y-2">
                  {match.home_lineup.map((player, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors group cursor-pointer">
                      <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:shadow-lg transition-all">
                        <span className="text-white font-bold text-xs">{player.number}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-foreground truncate">
                          {player.player || player.name}
                        </div>
                        <div className="text-xs text-foreground/60 uppercase tracking-wider">
                          {player.position}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Away Lineup */}
            {match.away_lineup && match.away_lineup.length > 0 && (
              <div className="neo-panel p-6">
                <h3 className="text-sm uppercase tracking-wider font-semibold text-primary mb-4">
                  {match.away} {isBn ? 'একাদশ' : 'XI'}
                </h3>
                <div className="space-y-2">
                  {match.away_lineup.map((player, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors group cursor-pointer">
                      <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:shadow-lg transition-all">
                        <span className="text-white font-bold text-xs">{player.number}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-foreground truncate">
                          {player.player || player.name}
                        </div>
                        <div className="text-xs text-foreground/60 uppercase tracking-wider">
                          {player.position}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Substitutes */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="neo-panel p-6">
              <h3 className="text-sm uppercase tracking-wider font-semibold text-primary mb-4">
                {isBn ? 'বিকল্প' : 'Substitutes'} - {match.home}
              </h3>
              <div className="space-y-2">
                {['Backup GK', 'Sub Defender 1', 'Sub Defender 2', 'Sub Midfielder', 'Sub Forward'].map((sub, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/10 text-foreground/50">
                    <div className="w-8 h-8 rounded bg-emerald-600/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xs">{i + 12}</span>
                    </div>
                    <div className="text-sm">{sub}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="neo-panel p-6">
              <h3 className="text-sm uppercase tracking-wider font-semibold text-primary mb-4">
                {isBn ? 'বিকল্প' : 'Substitutes'} - {match.away}
              </h3>
              <div className="space-y-2">
                {['Backup GK', 'Sub Defender 1', 'Sub Defender 2', 'Sub Midfielder', 'Sub Forward'].map((sub, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/10 text-foreground/50">
                    <div className="w-8 h-8 rounded bg-indigo-600/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xs">{i + 12}</span>
                    </div>
                    <div className="text-sm">{sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="neo-panel p-12 text-center">
          <p className="text-foreground/60">{isBn ? 'লাইনআপ পাওয়া যায়নি' : 'Lineups not available'}</p>
        </div>
      )}
    </div>
  )
}
