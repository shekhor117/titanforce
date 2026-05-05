"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, MapPin, Calendar, Footprints, Trophy, Target, Users, Clock, Star, Award } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

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
    nationality: "Bangladesh",
    height: "5'10\"",
    weight: "70 kg",
    joinedDate: "2024",
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
    nationality: "Bangladesh",
    height: "5'11\"",
    weight: "72 kg",
    joinedDate: "2024",
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
    nationality: "Bangladesh",
    height: "5'9\"",
    weight: "68 kg",
    joinedDate: "2024",
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
    nationality: "Bangladesh",
    height: "6'0\"",
    weight: "75 kg",
    joinedDate: "2024",
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
    nationality: "Bangladesh",
    height: "5'8\"",
    weight: "65 kg",
    joinedDate: "2024",
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
    nationality: "Bangladesh",
    height: "5'7\"",
    weight: "62 kg",
    joinedDate: "2024",
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
    nationality: "Bangladesh",
    height: "5'9\"",
    weight: "68 kg",
    joinedDate: "2024",
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
    nationality: "Bangladesh",
    height: "5'10\"",
    weight: "70 kg",
    joinedDate: "2024",
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
    nationality: "Bangladesh",
    height: "5'8\"",
    weight: "64 kg",
    joinedDate: "2024",
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
    nationality: "Bangladesh",
    height: "5'11\"",
    weight: "73 kg",
    joinedDate: "2024",
    bio: "Versatile player who can slot into defense or midfield. A true utility player with leadership qualities.",
  },
]

export default function PlayerProfile() {
  const params = useParams()
  const playerNum = parseInt(params.number as string)
  const { language } = useLanguage()
  const isBn = language === "bn"

  const player = players.find((p) => p.num === playerNum)

  if (!player) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Player Not Found</h1>
          <Link href="/#squad" className="text-primary hover:text-primary/80">
            Go Back to Squad
          </Link>
        </div>
      </div>
    )
  }

  const careerStats = [
    { label: isBn ? "ম্যাচ" : "Appearances", value: "0", icon: Users },
    { label: isBn ? "গোল" : "Goals", value: player.goals.toString(), icon: Target },
    { label: isBn ? "অ্যাসিস্ট" : "Assists", value: player.assists.toString(), icon: Trophy },
    { label: isBn ? "মিনিট" : "Minutes", value: "0", icon: Clock },
  ]

  const seasonStats = [
    { label: isBn ? "প্রিমিয়ার ম্যাচ" : "League Matches", value: "0" },
    { label: isBn ? "কাপ ম্যাচ" : "Cup Matches", value: "0" },
    { label: isBn ? "হলুদ কার্ড" : "Yellow Cards", value: "0" },
    { label: isBn ? "লাল কার্ড" : "Red Cards", value: "0" },
    { label: isBn ? "ম্যান অফ দ্য ম্যাচ" : "Man of the Match", value: "0" },
  ]

  const playerDetails = [
    { label: isBn ? "জাতীয়তা" : "Nationality", value: player.nationality || "Bangladesh" },
    { label: isBn ? "জন্মস্থান" : "Place of Birth", value: player.hometown },
    { label: isBn ? "বয়স" : "Age", value: player.age.toString() },
    { label: isBn ? "উচ্চতা" : "Height", value: player.height || "N/A" },
    { label: isBn ? "ওজন" : "Weight", value: player.weight || "N/A" },
    { label: isBn ? "প্রিয় পা" : "Preferred Foot", value: player.foot },
    { label: isBn ? "যোগদান" : "Joined", value: player.joinedDate || "2024" },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section - Manchester United Style */}
      <section className="relative min-h-[70vh] md:min-h-[80vh] overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        
        {/* Large Jersey Number Background */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none select-none">
          <span className="font-[var(--font-display)] text-[40rem] leading-none font-black">
            {player.num}
          </span>
        </div>

        {/* Back Button */}
        <div className="relative z-20 pt-6 px-6 md:px-12">
          <Link
            href="/#squad"
            className="inline-flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className={`text-sm font-medium ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "দলে ফিরুন" : "Back to Squad"}
            </span>
          </Link>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-8 md:pt-16 pb-12">
          <div className="flex flex-col lg:flex-row items-center lg:items-end gap-8 lg:gap-16">
            
            {/* Player Image Area */}
            <div className="relative flex-shrink-0">
              <div className="relative w-64 h-80 md:w-80 md:h-96 lg:w-96 lg:h-[28rem]">
                {/* Player silhouette/placeholder */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-3xl overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center bg-secondary/30">
                    <div className="text-center">
                      <span className="font-[var(--font-display)] text-8xl md:text-9xl text-primary/80">
                        {player.num}
                      </span>
                      <div className="mt-2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-full inline-block">
                        {player.cat}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -bottom-4 -left-4 w-24 h-24 border-4 border-primary/30 rounded-full" />
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/20 rounded-full" />
              </div>
            </div>

            {/* Player Info */}
            <div className="flex-1 text-center lg:text-left">
              {/* Club Name */}
              <p className="uppercase tracking-[0.4em] text-primary text-xs md:text-sm font-semibold mb-4">
                Titan Force FC
              </p>

              {/* Player Name */}
              <div className="mb-6">
                <h1 className="font-[var(--font-display)] text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black uppercase leading-none text-foreground tracking-tight">
                  {player.name.toUpperCase()}
                </h1>
                <p className="text-foreground/60 text-lg md:text-xl mt-2 font-medium">
                  {player.fullName}
                </p>
              </div>

              {/* Quick Info Pills */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
                <span className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wider rounded-full">
                  #{player.num}
                </span>
                <span className="px-4 py-2 bg-secondary/50 text-foreground text-sm font-medium rounded-full border border-secondary">
                  {player.pos}
                </span>
                <span className="px-4 py-2 bg-secondary/50 text-foreground text-sm font-medium rounded-full border border-secondary flex items-center gap-2">
                  <span className="w-4 h-3 bg-green-600 rounded-sm" />
                  {player.nationality || "Bangladesh"}
                </span>
              </div>

              {/* Career Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {careerStats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-card/50 backdrop-blur-sm border border-secondary rounded-2xl p-4 md:p-6 text-center hover:border-primary/50 transition-colors"
                  >
                    <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                    <p className="font-[var(--font-display)] text-3xl md:text-4xl text-primary">
                      {stat.value}
                    </p>
                    <p className={`text-xs text-foreground/60 uppercase tracking-wider mt-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Player Details */}
          <div className="space-y-8">
            {/* Player Details Card */}
            <div className="bg-card border border-secondary rounded-3xl overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <h2 className={`text-lg font-bold text-primary-foreground uppercase tracking-wider ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "খেলোয়াড়ের তথ্য" : "Player Info"}
                </h2>
              </div>
              <div className="p-6 space-y-0">
                {playerDetails.map((detail, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center py-4 ${
                      index !== playerDetails.length - 1 ? "border-b border-secondary/50" : ""
                    }`}
                  >
                    <span className={`text-foreground/60 text-sm ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                      {detail.label}
                    </span>
                    <span className="text-foreground font-semibold text-sm">
                      {detail.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Season Statistics */}
            <div className="bg-card border border-secondary rounded-3xl overflow-hidden">
              <div className="bg-secondary px-6 py-4">
                <h2 className={`text-lg font-bold text-foreground uppercase tracking-wider ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "মৌসুম ২০২৫/২৬" : "Season 2025/26"}
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {seasonStats.map((stat, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className={`text-foreground/70 text-sm ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                      {stat.label}
                    </span>
                    <span className="font-[var(--font-display)] text-2xl text-primary">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Bio & More */}
          <div className="lg:col-span-2 space-y-8">
            {/* Biography */}
            <div className="bg-card border border-secondary rounded-3xl p-8">
              <h2 className={`text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                <Star className="w-6 h-6 text-primary" />
                {isBn ? "খেলোয়াড়ের জীবনী" : "Player Biography"}
              </h2>
              <p className={`text-foreground/80 leading-relaxed text-lg ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {player.bio}
              </p>
              <p className={`text-foreground/80 leading-relaxed text-lg mt-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn 
                  ? `${player.fullName} টাইটান ফোর্স এফসি-এর একজন গুরুত্বপূর্ণ খেলোয়াড়। তার দক্ষতা এবং নিষ্ঠা দলের জন্য অমূল্য।`
                  : `${player.fullName} has been an important member of Titan Force FC. His dedication and skill make him an invaluable asset to the team.`
                }
              </p>
            </div>

            {/* Player Attributes */}
            <div className="bg-card border border-secondary rounded-3xl p-8">
              <h2 className={`text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                <Award className="w-6 h-6 text-primary" />
                {isBn ? "খেলোয়াড়ের দক্ষতা" : "Player Attributes"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {[
                  { skill: isBn ? "গতি" : "Pace", value: player.cat === "GK" ? 45 : 78 },
                  { skill: isBn ? "শুটিং" : "Shooting", value: player.cat === "GK" ? 25 : player.cat === "FWD" ? 82 : 65 },
                  { skill: isBn ? "পাসিং" : "Passing", value: player.cat === "MID" ? 88 : 72 },
                  { skill: isBn ? "ড্রিবলিং" : "Dribbling", value: player.cat === "FWD" ? 85 : player.cat === "GK" ? 30 : 68 },
                  { skill: isBn ? "ডিফেন্স" : "Defending", value: player.cat === "DEF" || player.cat === "GK" ? 82 : 45 },
                  { skill: isBn ? "শারীরিক" : "Physical", value: 75 },
                ].map((attr, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className={`text-sm text-foreground/70 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {attr.skill}
                      </span>
                      <span className="text-sm font-bold text-primary">{attr.value}</span>
                    </div>
                    <div className="w-full h-2 bg-secondary/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                        style={{ width: `${attr.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Honours / Trophies */}
            <div className="bg-card border border-secondary rounded-3xl p-8">
              <h2 className={`text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                <Trophy className="w-6 h-6 text-primary" />
                {isBn ? "সম্মাননা" : "Honours"}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { title: isBn ? "দাউদপুর টুর্নামেন্ট চ্যাম্পিয়ন" : "Daudpur Tournament Champion", year: "2026" },
                  { title: isBn ? "লীগ চ্যাম্পিয়নশিপ" : "League Championship", year: "Coming Soon" },
                  { title: isBn ? "সেরা তরুণ খেলোয়াড়" : "Best Young Player", year: "Coming Soon" },
                ].map((trophy, index) => (
                  <div
                    key={index}
                    className="bg-secondary/30 border border-secondary/50 rounded-2xl p-5 text-center hover:border-primary/50 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/30 transition-colors">
                      <Trophy className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className={`font-semibold text-foreground text-sm ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                      {trophy.title}
                    </h3>
                    <p className="text-foreground/50 text-xs mt-1">{trophy.year}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Players */}
      <section className="bg-card border-t border-secondary py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className={`text-2xl md:text-3xl font-bold mb-8 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "অন্যান্য খেলোয়াড়" : "Other Players"}
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {players
              .filter((p) => p.num !== player.num)
              .slice(0, 5)
              .map((p) => (
                <Link
                  key={p.num}
                  href={`/player/${p.num}`}
                  className="bg-secondary/30 border border-secondary rounded-2xl p-4 text-center hover:border-primary/50 hover:-translate-y-1 transition-all group"
                >
                  <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                    <span className="font-[var(--font-display)] text-2xl text-primary">
                      {p.num}
                    </span>
                  </div>
                  <h3 className="font-[var(--font-display)] text-lg text-foreground tracking-wide">
                    {p.name.toUpperCase()}
                  </h3>
                  <p className="text-xs text-foreground/60 mt-1">{p.pos}</p>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}
