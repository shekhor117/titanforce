"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { PlayerRating } from "@/components/player-rating"

// Player photos mapping
const playerPhotos: Record<number, string> = {
  1: "/players/player-1.png",
  3: "/players/player-3.png",
  4: "/players/player-4.png",
  5: "/players/player-5.png",
  6: "/players/player-6.png",
  7: "/players/player-7.png",
  8: "/players/player-8.png",
  9: "/players/player-9.png",
  11: "/players/player-11.png",
  17: "/players/player-17.png",
}

// Player data from squad
const players = [
  {
    num: 1,
    name: "Shuronjit",
    fullName: "Shuronjit Biswas",
    pos: "Goalkeeper",
    cat: "GK",
    age: 17,
    hometown: "Mulikandi, Sylhet",
    foot: "Right",
    goals: 0,
    assists: 0,
    cleanSheets: 0,
    bio: "A commanding presence in goal with excellent reflexes and shot-stopping ability. The last line of defense for Titan Force.",
  },
  {
    num: 3,
    name: "Srijon",
    fullName: "Srijon Roy",
    pos: "CB / RB",
    cat: "DEF",
    age: 21,
    hometown: "Mulikandi, Sylhet",
    foot: "Right",
    goals: 0,
    assists: 0,
    bio: "Versatile defender who can play both center-back and right-back. Known for his pace and recovery runs.",
  },
  {
    num: 4,
    name: "Akash",
    fullName: "Akash Roy",
    pos: "CB / LB",
    cat: "DEF",
    age: 17,
    hometown: "Mulikandi, Sylhet",
    foot: "Right",
    goals: 0,
    assists: 0,
    bio: "Strong left-footed defender with excellent aerial ability. A rock at the back for the team.",
  },
  {
    num: 5,
    name: "Akash",
    fullName: "Akash Roy",
    pos: "CB / CDM",
    cat: "DEF",
    age: 19,
    hometown: "Mulikandi, Sylhet",
    foot: "Both",
    goals: 0,
    assists: 0,
    bio: "The defensive anchor who can drop back or push forward. Great at breaking up opposition attacks.",
  },
  {
    num: 6,
    name: "Sujon",
    fullName: "Sujon Roy",
    pos: "CAM",
    cat: "MID",
    age: 20,
    hometown: "Mulikandi, Sylhet",
    foot: "Right",
    goals: 0,
    assists: 0,
    bio: "Creative playmaker with excellent vision and passing range. The engine of Titan Force's attack.",
  },
  {
    num: 7,
    name: "Shuvo",
    fullName: "Shuvo Roy",
    pos: "LW / RW / CAM",
    cat: "FWD",
    age: 19,
    hometown: "Mulikandi, Sylhet",
    foot: "Right",
    goals: 0,
    assists: 0,
    bio: "Explosive winger with pace to burn. Can play on either flank and loves to cut inside to shoot.",
  },
  {
    num: 8,
    name: "Sojib",
    fullName: "Sojib Roy",
    pos: "CM / CAM",
    cat: "MID",
    age: 20,
    hometown: "Mulikandi, Sylhet",
    foot: "Right",
    goals: 0,
    assists: 0,
    bio: "Box-to-box midfielder who covers every blade of grass. Combines work rate with technical quality.",
  },
  {
    num: 9,
    name: "Sajon",
    fullName: "Sajon Biswas",
    pos: "ST / CF",
    cat: "FWD",
    age: 17,
    hometown: "Mulikandi, Sylhet",
    foot: "Right",
    goals: 0,
    assists: 0,
    bio: "Clinical striker with a natural instinct for goal. The team's top scorer and focal point of the attack.",
  },
  {
    num: 11,
    name: "Kourov",
    fullName: "Kourov Chakroborty",
    pos: "LW / ST",
    cat: "FWD",
    age: 18,
    hometown: "Mulikandi, Sylhet",
    foot: "Right",
    goals: 0,
    assists: 0,
    bio: "Tricky left winger who can also play as a second striker. Dangerous in one-on-one situations.",
  },
  {
    num: 17,
    name: "Shekhor",
    fullName: "Shekhor Mohan Roy",
    pos: "CB / CM / CDM",
    cat: "DEF",
    age: 20,
    hometown: "Mulikandi, Sylhet",
    foot: "Right",
    goals: 0,
    assists: 0,
    bio: "Versatile player who can slot into defense or midfield. A true utility player with leadership qualities.",
  },
]

export default function PlayerProfile() {
  const params = useParams()
  const router = useRouter()
  const playerNum = parseInt(params.number as string)
  const { language } = useLanguage()
  const isBn = language === "bn"

  const player = players.find((p) => p.num === playerNum)

  if (!player) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Player Not Found</h1>
          <Link href="/players" className="text-primary hover:text-primary/80">
            Go Back to Squad
          </Link>
        </div>
      </div>
    )
  }

  const stats = [
    { title: "Appearances", value: "0" },
    { title: "Goals", value: player.goals.toString() },
    { title: "Assists", value: player.assists.toString() },
    { title: "Minutes", value: "0" },
    { title: "Pass Accuracy", value: "92%" },
    { title: "Chances Created", value: "0" },
  ]

  const seasonStats = [
    { label: "Premier Matches", value: "0" },
    { label: "Cup Matches", value: "0" },
    { label: "Yellow Cards", value: "0" },
    { label: "Red Cards", value: "0" },
    { label: "Man of the Match", value: "0" },
    { label: "Average Rating", value: "0" },
  ]

  const trophies = [
    { name: "Daudpur Tournament Champion", year: "2026" },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .card {
          transition: all 0.3s ease;
        }

        .card:hover {
          transform: scale(1.02);
        }

        .zoom {
          animation: zoom 10s infinite alternate ease-in-out;
        }

        @keyframes zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }

        /* Hide scrollbar while maintaining scrollability */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(220, 38, 38, 0.3);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(220, 38, 38, 0.5);
        }
      `}</style>

      {/* Back Button */}
      <div className="bg-secondary/20 border-b border-secondary">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
            <span className={isBn ? "font-[var(--font-bengali)]" : ""}>
              {isBn ? "পিছনে" : "Back"}
            </span>
          </button>
        </div>
      </div>

      {/* HERO */}
      <section className="relative bg-gradient-to-b from-secondary/30 to-black/20 border-b border-secondary">
        <div
          className="absolute inset-0 w-full h-full opacity-30 zoom"
          style={{
            background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
          {/* Image Section - Full Width on Mobile */}
          <div className="flex flex-col md:flex-row md:items-end gap-0 md:gap-6 lg:gap-8">
            {/* Image Container - Spans full width on mobile */}
            {playerPhotos[player.num] ? (
              <div className="w-full md:w-auto md:flex-shrink-0 py-6 sm:py-8 md:py-10 flex justify-center md:justify-start">
                <div className="w-48 sm:w-56 md:w-64 lg:w-72 rounded-3xl border-4 sm:border-4 md:border-4 border-primary shadow-2xl card overflow-hidden">
                  <div className="relative aspect-square">
                    <Image
                      src={playerPhotos[player.num]}
                      alt={player.fullName}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 640px) 85vw, (max-width: 1024px) 60vw, 40vw"
                      priority
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full md:w-auto md:flex-shrink-0 py-6 sm:py-8 md:py-10 flex justify-center md:justify-start">
                <div className="w-48 sm:w-56 md:w-64 lg:w-72 rounded-3xl border-4 sm:border-4 md:border-4 border-primary shadow-2xl card bg-secondary/30 flex items-center justify-center aspect-square">
                  <span className="font-[var(--font-display)] text-7xl sm:text-8xl md:text-9xl text-primary">
                    #{player.num}
                  </span>
                </div>
              </div>
            )}

            {/* Text Content */}
            <div className="flex-1 pb-6 sm:pb-8 md:pb-10 px-0 md:px-0">
              <p className="uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/60 text-xs sm:text-sm mb-1 sm:mb-2">
                Titan Force FC
              </p>

              <h1 className="font-[var(--font-display)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-tight text-white mb-3 sm:mb-4">
                {player.fullName.split(" ")[0]}
              </h1>

              <div className={`flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6 text-xs sm:text-sm text-white/70 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                <span className="text-primary font-bold flex-shrink-0">#{player.num}</span>
                <span className="truncate">{player.pos}</span>
                <span className="flex-shrink-0">Bangladesh</span>
                <span className="truncate">{player.foot} Footed</span>
              </div>
              
              {/* Player Rating - Viewers can rate */}
              <div className="mt-3 sm:mt-4 md:mt-6">
                <PlayerRating 
                  playerId={player.num.toString()} 
                  playerName={player.fullName}
                  size="lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
        {stats.map((item, index) => (
          <div
            key={index}
            className="card bg-secondary/20 border border-secondary rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg"
          >
            <p className={`text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {item.title}
            </p>
            <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl md:text-4xl text-primary mt-2 sm:mt-3">
              {item.value}
            </h2>
          </div>
        ))}
      </section>

      {/* MAIN CONTENT */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 pb-12 sm:pb-16 md:pb-20">
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {/* Player Details */}
          <div className="card bg-secondary/20 border border-secondary rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
            <h2 className={`text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 md:mb-8 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "খেলোয়াড়ের বিবরণ" : "Player Details"}
            </h2>

            <div className={`space-y-3 sm:space-y-4 text-sm sm:text-base text-foreground/80 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {[
                ["Full Name", player.fullName],
                ["Position", player.pos],
                ["Age", player.age.toString()],
                ["Jersey Number", player.num.toString()],
                ["Hometown", player.hometown],
                ["Preferred Foot", player.foot],
                ["Club", "Titan Force FC"],
                ["Status", "Active"],
              ].map(([label, value], index) => (
                <div key={index} className="flex justify-between border-b border-secondary/30 pb-2 sm:pb-3">
                  <span className="text-foreground/60 flex-shrink-0">{label}</span>
                  <span className="text-foreground font-semibold text-right ml-2">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Season Stats */}
          <div className="card bg-secondary/20 border border-secondary rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
            <h2 className={`text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 md:mb-8 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "মৌসুমী পরিসংখ্যান" : "Season Stats"}
            </h2>

            <div className={`space-y-3 sm:space-y-4 text-sm sm:text-base ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {[
                ["Goals", player.goals],
                ["Assists", player.assists],
                ["Appearances", player.cleanSheets],
                ["Clean Sheets", player.cleanSheets],
                ["Minutes Played", "1,250"],
                ["Pass Accuracy", "92%"],
              ].map(([title, value], index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1.5 sm:mb-2">
                    <span className="text-foreground/60 text-xs sm:text-sm">{title}</span>
                    <span className="font-bold text-primary text-xs sm:text-sm">{value}</span>
                  </div>
                  <div className="w-full h-2 bg-secondary/50 rounded-full overflow-hidden">
                    <div className="w-4/5 h-full bg-primary rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
          {/* Biography */}
          <div className="card bg-secondary/20 border border-secondary rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
            <h2 className={`text-lg sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 md:mb-6 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "জীবনী" : "Biography"}
            </h2>
            <p className={`text-foreground/80 leading-relaxed sm:leading-7 md:leading-8 text-sm sm:text-base md:text-lg ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {player.bio}
            </p>
          </div>

          {/* Player Attributes */}
          <div className="card bg-secondary/20 border border-secondary rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
            <h2 className={`text-lg sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "খেলোয়াড়ের বৈশিষ্ট্য" : "Player Attributes"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {[
                ["Pace", "84%"],
                ["Shooting", "81%"],
                ["Passing", "92%"],
                ["Dribbling", "89%"],
                ["Defending", "64%"],
                ["Physical", "76%"],
              ].map(([skill, value], index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1.5 sm:mb-2 text-xs sm:text-sm">
                    <span>{skill}</span>
                    <span>{value}</span>
                  </div>
                  <div className="w-full h-2 sm:h-3 bg-secondary/50 rounded-full">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: value }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trophies */}
          <div className="card bg-secondary/20 border border-secondary rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
            <h2 className={`text-lg sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "ট্রফি" : "Trophies"}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {trophies.map((trophy, i) => (
                <div
                  key={i}
                  className="card bg-secondary/30 border border-secondary rounded-lg sm:rounded-2xl p-3 sm:p-4 md:p-6 text-center"
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">🏆</div>
                  <h3 className={`font-bold text-xs sm:text-sm md:text-base ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {trophy.name}
                  </h3>
                  <p className="text-foreground/50 mt-1 sm:mt-2 text-xs sm:text-sm">{trophy.year}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
