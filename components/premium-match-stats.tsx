"use client"

export function PremiumMatchStats() {
  return (
    <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-black/40 to-black/60">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 uppercase tracking-wider">
          Premium Match Stats
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Ball Possession */}
          <div className="bg-gradient-to-br from-red-900/30 to-black/50 border border-red-500/20 rounded-lg p-8">
            <h3 className="text-sm uppercase tracking-widest text-slate-400 mb-6 font-bold">Ball Possession</h3>
            
            <div className="space-y-6">
              <div className="flex items-end justify-between gap-4">
                <span className="text-5xl font-bold text-red-500">63%</span>
                <div className="w-20 h-24 bg-gradient-to-t from-red-500 to-red-600 rounded-lg opacity-80"></div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span>Total Shots</span>
                    <span>9</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-red-500 rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span>Shots on Target</span>
                    <span>3</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-red-500 rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span>Passes</span>
                    <span>358</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span>Pass Accuracy</span>
                    <span>78%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-red-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full mt-8 py-3 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-white text-xs uppercase tracking-widest rounded transition-colors">
              View Full Stats
            </button>
          </div>

          {/* Last Match */}
          <div className="bg-gradient-to-br from-red-900/30 to-black/50 border border-red-500/20 rounded-lg p-8 flex flex-col">
            <h3 className="text-sm uppercase tracking-widest text-slate-400 mb-6 font-bold">Last Match</h3>
            
            <div className="flex-1 flex flex-col">
              {/* Team vs Team */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-red-600 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">TFM</span>
                  </div>
                  <span className="text-xs text-slate-400">TFM</span>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-white">3 - 1</p>
                  <p className="text-xs text-slate-400 mt-2">Warriors FC</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">WFC</span>
                  </div>
                  <span className="text-xs text-slate-400">Warriors</span>
                </div>
              </div>

              {/* Field Visualization */}
              <div className="flex-1 bg-gradient-to-b from-green-800/20 to-green-900/20 rounded-lg border border-green-500/20 p-4 mb-6 flex items-center justify-center">
                <div className="w-full h-32 bg-gradient-to-b from-green-700/30 to-green-800/30 rounded flex items-center justify-center relative">
                  <div className="absolute top-0 left-1/2 w-px h-full bg-white/20"></div>
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20"></div>
                  <span className="text-xs text-white/40">Field Visualization</span>
                </div>
              </div>

              {/* Attacking Zones */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase text-slate-400 font-bold mb-3">Attacking Zones</h4>
                <div className="flex gap-2 justify-between">
                  <div className="text-center flex-1">
                    <p className="text-2xl font-bold text-red-500">28%</p>
                    <p className="text-xs text-slate-400 mt-1">Left</p>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-2xl font-bold text-red-500">44%</p>
                    <p className="text-xs text-slate-400 mt-1">Center</p>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-2xl font-bold text-red-500">28%</p>
                    <p className="text-xs text-slate-400 mt-1">Right</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Players */}
          <div className="bg-gradient-to-br from-red-900/30 to-black/50 border border-red-500/20 rounded-lg p-8">
            <h3 className="text-sm uppercase tracking-widest text-slate-400 mb-6 font-bold">Top Players</h3>
            
            <div className="space-y-6">
              {[
                { name: "Rahim Uddin", position: "Striker", rating: "8.6" },
                { name: "Sabbir Hossain", position: "Midfielder", rating: "7" },
                { name: "Arif Ahmed", position: "Center Back", rating: "92%" },
                { name: "Rony Hasan", position: "Midfielder", rating: "5 Assists" },
              ].map((player, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-white font-bold text-sm">{player.name}</p>
                    <p className="text-xs text-slate-400">{player.position}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-500 font-bold">{player.rating}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-8 py-3 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-white text-xs uppercase tracking-widest rounded transition-colors">
              View All Players
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
