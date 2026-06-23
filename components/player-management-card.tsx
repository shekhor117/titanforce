"use client"

import { Player } from "@/lib/data-store"
import { Edit2, Trash2, Trophy, Zap } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"

interface PlayerManagementCardProps {
  player: Player
  onEdit?: (player: Player) => void
  onDelete?: (playerId: string) => void
  showActions?: boolean
}

export function PlayerManagementCard({
  player,
  onEdit,
  onDelete,
  showActions = true,
}: PlayerManagementCardProps) {
  const { language } = useLanguage()
  const isBn = language === "bn"

  const getPositionColor = (cat: string) => {
    switch (cat) {
      case "GK":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30"
      case "DEF":
        return "bg-accent/20 text-accent border-accent/30"
      case "MID":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "FWD":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getCategory = (p: Player) => p.category || p.cat || "MID"

  return (
    <div className="group relative overflow-hidden rounded-lg border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-card/40 p-4 hover:border-primary/60 match-card-hover field-pattern transition-all">
      {/* Team highlight bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Jersey Number Badge */}
      <div className="absolute top-3 right-3 flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-primary/40 to-accent/30 border-2 border-primary/60">
        <span className="text-sm font-bold text-primary jersey-number">#{player.num}</span>
      </div>

      {/* Player Photo */}
      {player.image_url || player.photo ? (
        <div className="relative w-full h-40 mb-3 rounded-lg overflow-hidden bg-secondary/50 flex items-center justify-center flex-shrink-0">
          <Image
            src={player.image_url || player.photo || ""}
            alt={player.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="100vw"
          />
        </div>
      ) : (
        <div className="w-full h-40 mb-3 rounded-lg bg-gradient-to-br from-secondary/50 to-secondary/30 flex items-center justify-center flex-shrink-0">
          <span className="text-sm text-muted-foreground">{isBn ? "ছবি নেই" : "No Image"}</span>
        </div>
      )}

      {/* Player Info */}
      <div className="mb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground text-sm truncate">{player.name}</h4>
            <p className="text-xs text-foreground/60">{player.position || "Player"}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded border font-semibold flex-shrink-0 ${getPositionColor(getCategory(player))}`}>
            {getCategory(player)}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b border-primary/20">
        {/* Goals */}
        <div className="text-center p-2 rounded-lg bg-red-500/10 border border-red-500/20">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Zap className="w-3 h-3 text-red-400" />
          </div>
          <div className="text-sm font-bold text-red-400 score-display">{player.goals || 0}</div>
          <div className="text-xs text-foreground/50">{isBn ? "গোল" : "Goals"}</div>
        </div>

        {/* Assists */}
        <div className="text-center p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Trophy className="w-3 h-3 text-blue-400" />
          </div>
          <div className="text-sm font-bold text-blue-400 score-display">{player.assists || 0}</div>
          <div className="text-xs text-foreground/50">{isBn ? "সহায়তা" : "Assists"}</div>
        </div>

        {/* Rating */}
        <div className="text-center p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Trophy className="w-3 h-3 text-yellow-400" />
          </div>
          <div className="text-sm font-bold text-yellow-400 score-display">{player.rating?.toFixed(1) || "0.0"}</div>
          <div className="text-xs text-foreground/50">{isBn ? "রেটিং" : "Rating"}</div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-3">
        <span className={`inline-block text-xs px-2 py-1 rounded-full font-semibold ${
          player.status === "active"
            ? "bg-green-500/20 text-green-400 border border-green-500/30"
            : "bg-muted/50 text-muted-foreground border border-muted/30"
        }`}>
          {player.status === "active" ? (isBn ? "সক্রিয়" : "Active") : isBn ? "নিষ্ক্রিয়" : "Inactive"}
        </span>
      </div>

      {/* Action Buttons */}
      {showActions && (onEdit || onDelete) && (
        <div className="flex gap-2 pt-3 border-t border-primary/20">
          {onEdit && (
            <button
              onClick={() => onEdit(player)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary font-semibold text-xs uppercase tracking-wider transition-all"
            >
              <Edit2 className="w-4 h-4" />
              {isBn ? "সম্পাদনা" : "Edit"}
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(player.id)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-semibold text-xs uppercase tracking-wider transition-all"
            >
              <Trash2 className="w-4 h-4" />
              {isBn ? "মুছুন" : "Delete"}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
