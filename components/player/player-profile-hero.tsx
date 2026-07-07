'use client'

import Image from 'next/image'
import { Player } from '@/lib/data-service'
import { useLanguage } from '@/lib/language-context'

interface PlayerProfileHeroProps {
  player: Player
}

export function PlayerProfileHero({ player }: PlayerProfileHeroProps) {
  const { language } = useLanguage()
  const isBn = language === 'bn'

  return (
    <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-2xl">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      
      <div className="relative p-6 md:p-8 lg:p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Player Image */}
          <div className="flex justify-center md:col-span-1">
            <div className="relative w-48 sm:w-56 md:w-64 aspect-[3/4] rounded-2xl border-4 border-blue-400/50 overflow-hidden shadow-2xl">
              {player.image_url ? (
                <Image
                  src={player.image_url}
                  alt={player.full_name}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, (max-width: 1024px) 256px, 288px"
                  priority
                  quality={90}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                  <span className="text-6xl md:text-7xl font-bold text-slate-600">#{player.num}</span>
                </div>
              )}
            </div>
          </div>

          {/* Player Info */}
          <div className="md:col-span-2 flex flex-col justify-center text-white space-y-4">
            <div>
              <p className="text-sm md:text-base uppercase tracking-widest text-blue-300 font-semibold mb-2">
                {player.category === 'GK' ? 'Goalkeeper' : player.position}
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-wider drop-shadow-lg">
                {player.full_name.split(' ').slice(-1)[0]}
              </h1>
            </div>

            {/* Quick Info */}
            <div className="flex items-center gap-3 text-sm md:text-base text-white/90">
              <span className="px-3 py-1 bg-blue-500/30 rounded-lg border border-blue-400">Titan Force FC</span>
              <span className="text-white/70">•</span>
              <span>{player.position}</span>
              <span className="text-white/70">•</span>
              <span className="font-bold">#{player.num}</span>
            </div>

            {/* Player Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/10">
              <div>
                <p className="text-xs text-white/60 uppercase tracking-wider mb-1">{isBn ? 'জাতীয়তা' : 'Nationality'}</p>
                <p className="text-sm md:text-base font-semibold">{player.hometown || 'Bangladesh'}</p>
              </div>
              <div>
                <p className="text-xs text-white/60 uppercase tracking-wider mb-1">{isBn ? 'জন্ম তারিখ' : 'Date of Birth'}</p>
                <p className="text-sm md:text-base font-semibold">{player.dob || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-white/60 uppercase tracking-wider mb-1">{isBn ? 'উচ্চতা' : 'Height'}</p>
                <p className="text-sm md:text-base font-semibold">{player.height || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-white/60 uppercase tracking-wider mb-1">{isBn ? 'ওজন' : 'Weight'}</p>
                <p className="text-sm md:text-base font-semibold">{player.weight || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-white/60 uppercase tracking-wider mb-1">{isBn ? 'শক্তিশালী পা' : 'Strong Foot'}</p>
                <p className="text-sm md:text-base font-semibold">{player.strong_foot || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-white/60 uppercase tracking-wider mb-1">{isBn ? 'অবস্থান' : 'Position'}</p>
                <p className="text-sm md:text-base font-semibold">{player.position}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Jersey Number Badge */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6">
        <div className="w-16 h-20 md:w-20 md:h-28 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg border-2 border-blue-300">
          <span className="text-3xl md:text-5xl font-black text-white">{player.num}</span>
        </div>
      </div>
    </div>
  )
}
