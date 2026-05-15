"use client"

import { Player } from "@/lib/data-store"
import { useLanguage } from "@/lib/language-context"
import { ArrowUp, ArrowDown } from "lucide-react"
import { useState } from "react"

interface PlayerComparisonTableProps {
  players: Player[]
}

type SortKey =
  | "name"
  | "goals"
  | "assists"
  | "appearances"
  | "minutes_played"
  | "pass_accuracy"
  | "average_rating"

export function PlayerComparisonTable({ players }: PlayerComparisonTableProps) {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [sortKey, setSortKey] = useState<SortKey>("goals")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder("desc")
    }
  }

  const sortedPlayers = [...players].sort((a, b) => {
    let aVal: number | string = 0
    let bVal: number | string = 0

    switch (sortKey) {
      case "name":
        aVal = a.name
        bVal = b.name
        break
      case "goals":
        aVal = a.goals || 0
        bVal = b.goals || 0
        break
      case "assists":
        aVal = a.assists || 0
        bVal = b.assists || 0
        break
      case "appearances":
        aVal = a.appearances || 0
        bVal = b.appearances || 0
        break
      case "minutes_played":
        aVal = (a.minutes_played || a.minutes) || 0
        bVal = (b.minutes_played || b.minutes) || 0
        break
      case "pass_accuracy":
        aVal = (a.pass_accuracy || a.passAccuracy) || 0
        bVal = (b.pass_accuracy || b.passAccuracy) || 0
        break
      case "average_rating":
        aVal = (a.average_rating || a.averageRating) || 0
        bVal = (b.average_rating || b.averageRating) || 0
        break
    }

    if (typeof aVal === "string") {
      return sortOrder === "asc" ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal)
    }

    return sortOrder === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
  })

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <div className="w-4 h-4" />
    return sortOrder === "asc" ? (
      <ArrowUp className="w-4 h-4 text-primary" />
    ) : (
      <ArrowDown className="w-4 h-4 text-primary" />
    )
  }

  const getPositionColor = (cat: string) => {
    switch (cat) {
      case "GK":
        return "bg-amber-500/20 text-amber-400"
      case "DEF":
        return "bg-blue-500/20 text-blue-400"
      case "MID":
        return "bg-green-500/20 text-green-400"
      case "FWD":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  return (
    <div className="rounded-lg border-2 border-secondary bg-card/50 p-6 overflow-x-auto">
      <h3 className={`font-display text-lg tracking-wider text-foreground mb-4 ${isBn ? "font-bengali" : ""}`}>
        {isBn ? "খেলোয়াড় তুলনা" : "Player Comparison"}
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-secondary/50">
              <th className="text-left p-3 text-foreground/70 font-semibold cursor-pointer hover:text-foreground transition">
                <div className="flex items-center gap-2">
                  {isBn ? "খেলোয়াড়" : "Player"}
                  <SortIcon column="name" />
                </div>
              </th>
              <th className="text-right p-3 text-foreground/70 font-semibold cursor-pointer hover:text-foreground transition" onClick={() => handleSort("goals")}>
                <div className="flex items-center justify-end gap-2">
                  {isBn ? "গোল" : "Goals"}
                  <SortIcon column="goals" />
                </div>
              </th>
              <th className="text-right p-3 text-foreground/70 font-semibold cursor-pointer hover:text-foreground transition" onClick={() => handleSort("assists")}>
                <div className="flex items-center justify-end gap-2">
                  {isBn ? "সহায়তা" : "Assists"}
                  <SortIcon column="assists" />
                </div>
              </th>
              <th className="text-right p-3 text-foreground/70 font-semibold cursor-pointer hover:text-foreground transition" onClick={() => handleSort("appearances")}>
                <div className="flex items-center justify-end gap-2">
                  {isBn ? "উপস্থিতি" : "Apps"}
                  <SortIcon column="appearances" />
                </div>
              </th>
              <th className="text-right p-3 text-foreground/70 font-semibold cursor-pointer hover:text-foreground transition" onClick={() => handleSort("minutes")}>
                <div className="flex items-center justify-end gap-2">
                  {isBn ? "মিনিট" : "Minutes"}
                  <SortIcon column="minutes" />
                </div>
              </th>
              <th className="text-right p-3 text-foreground/70 font-semibold cursor-pointer hover:text-foreground transition" onClick={() => handleSort("passAccuracy")}>
                <div className="flex items-center justify-end gap-2">
                  {isBn ? "পাস %" : "Pass %"}
                  <SortIcon column="passAccuracy" />
                </div>
              </th>
              <th className="text-right p-3 text-foreground/70 font-semibold cursor-pointer hover:text-foreground transition" onClick={() => handleSort("averageRating")}>
                <div className="flex items-center justify-end gap-2">
                  {isBn ? "রেটিং" : "Rating"}
                  <SortIcon column="averageRating" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player) => (
              <tr
                key={player.id}
                className="border-b border-secondary/30 hover:bg-secondary/20 transition"
              >
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded font-semibold ${getPositionColor(player.cat)}`}>
                      {player.cat}
                    </span>
                    <div>
                      <div className="font-semibold text-foreground">{player.name}</div>
                      <div className="text-xs text-foreground/60">#{player.num}</div>
                    </div>
                  </div>
                </td>
                <td className="text-right p-3 font-semibold text-red-400">{player.goals || 0}</td>
                <td className="text-right p-3 font-semibold text-green-400">{player.assists || 0}</td>
                <td className="text-right p-3 font-semibold text-blue-400">{player.appearances || 0}</td>
                <td className="text-right p-3 font-semibold text-yellow-400">{player.minutes || 0}</td>
                <td className="text-right p-3 font-semibold text-purple-400">{player.passAccuracy || 0}%</td>
                <td className="text-right p-3 font-semibold text-primary">{(player.averageRating || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedPlayers.length === 0 && (
        <div className="text-center py-8 text-foreground/50">
          <p>{isBn ? "कोई खिलाड़ी नहीं मिला" : "No players found"}</p>
        </div>
      )}
    </div>
  )
}
