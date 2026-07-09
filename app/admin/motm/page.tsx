"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { useAdmin } from "@/lib/admin-context"
import { Trophy, Save, RefreshCw, Star, Edit2, Trash2, Plus, AlertCircle } from "lucide-react"
import { dataStore, MOTM } from "@/lib/data-store"
import { PageEntrance } from '@/components/page-entrance'
import { useDataStore } from "@/lib/use-data-store"

export default function AdminMotmPage() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const { admin } = useAdmin()
  const { players: playersData, matches: matchesData } = useDataStore()
  const [isClient, setIsClient] = useState(false)
  const [players, setPlayers] = useState<any[]>([])
  const [matches, setMatches] = useState<any[]>([])
  const [motms, setMOTMs] = useState<MOTM[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedMatch, setSelectedMatch] = useState<any>(null)
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null)
  const [matchRating, setMatchRating] = useState(7)
  const [stats, setStats] = useState({ goals: '', assists: '', passes: '', tackles: '', shotAccuracy: '' })
  const [notes, setNotes] = useState('')

  useEffect(() => {
    setIsClient(true)
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const playersResult = Array.isArray(playersData) ? playersData : []
      const matchesResult = Array.isArray(matchesData) ? matchesData : []
      const motmsResult = dataStore.getMOTMs()
      
      setPlayers(playersResult)
      setMatches(matchesResult)
      setMOTMs(motmsResult)
      
      if (matchesResult.length > 0) {
        setSelectedMatch(matchesResult[0])
      }
    } catch (err) {
      setError('Failed to load data')
    }
  }

  const handlePlayerSelect = (player: any) => {
    setSelectedPlayer(player)
  }

  const handleSave = () => {
    if (!selectedPlayer || !selectedMatch) {
      setError('Please select both a player and a match')
      return
    }

    try {
      if (editingId) {
        dataStore.updateMOTM(editingId, {
          matchId: selectedMatch.id,
          playerId: selectedPlayer.id,
          playerName: selectedPlayer.name,
          rating: matchRating,
          stats: {
            goals: stats.goals ? parseInt(stats.goals) : undefined,
            assists: stats.assists ? parseInt(stats.assists) : undefined,
            passes: stats.passes ? parseInt(stats.passes) : undefined,
            tackles: stats.tackles ? parseInt(stats.tackles) : undefined,
            shotAccuracy: stats.shotAccuracy || undefined
          },
          notes: notes || undefined
        })
      } else {
        dataStore.addMOTM({
          matchId: selectedMatch.id,
          playerId: selectedPlayer.id,
          playerName: selectedPlayer.name,
          rating: matchRating,
          stats: {
            goals: stats.goals ? parseInt(stats.goals) : undefined,
            assists: stats.assists ? parseInt(stats.assists) : undefined,
            passes: stats.passes ? parseInt(stats.passes) : undefined,
            tackles: stats.tackles ? parseInt(stats.tackles) : undefined,
            shotAccuracy: stats.shotAccuracy || undefined
          },
          notes: notes || undefined
        })
      }

      handleReset()
      loadData()
      setError(null)
    } catch (err) {
      setError('Failed to save MOTM')
    }
  }

  const handleEdit = (motm: MOTM) => {
    setSelectedPlayer({ id: motm.playerId, name: motm.playerName })
    setSelectedMatch(matches.find(m => m.id === motm.matchId) || matches[0])
    setMatchRating(motm.rating)
    setStats({
      goals: motm.stats?.goals?.toString() || '',
      assists: motm.stats?.assists?.toString() || '',
      passes: motm.stats?.passes?.toString() || '',
      tackles: motm.stats?.tackles?.toString() || '',
      shotAccuracy: motm.stats?.shotAccuracy || ''
    })
    setNotes(motm.notes || '')
    setEditingId(motm.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm(isBn ? 'Are you sure?' : 'Are you sure?')) {
      try {
        dataStore.deleteMOTM(id)
        loadData()
      } catch (err) {
        setError('Failed to delete MOTM')
      }
    }
  }

  const handleReset = () => {
    setSelectedPlayer(null)
    setMatchRating(7)
    setStats({ goals: '', assists: '', passes: '', tackles: '', shotAccuracy: '' })
    setNotes('')
    setEditingId(null)
    setShowForm(false)
    setError(null)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`font-[var(--font-display)] text-3xl tracking-wider text-foreground mb-2 flex items-center gap-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            <Trophy className="w-8 h-8 text-yellow-400" />
            {isBn ? "ম্যাচ অফ দ্য ম্যাচ" : "Man of the Match"}
          </h1>
          <p className={`text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "ম্যাচ রেটিং এবং সেরা খেলোয়াড় নির্বাচন করুন" : "Rate matches and select best player"}
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            {isBn ? "নতুন MOTM" : "New MOTM"}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-3 text-red-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {showForm && selectedMatch && (
        <div className="rounded-xl border-2 border-secondary bg-card p-6 space-y-6">
          <h2 className="text-xl font-bold">{editingId ? isBn ? "MOTM সম্পাদনা করুন" : "Edit MOTM" : isBn ? "নতুন MOTM যোগ করুন" : "Add New MOTM"}</h2>

          {/* Match Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">{isBn ? "ম্যাচ নির্বাচন করুন" : "Select Match"}</label>
            <select
              value={selectedMatch?.id || ''}
              onChange={(e) => setSelectedMatch(matches.find(m => m.id === e.target.value))}
              className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent"
            >
              {matches.map((match) => (
                <option key={match.id} value={match.id}>
                  {match.home} vs {match.away} - {match.date}
                </option>
              ))}
            </select>
          </div>

          {/* Player Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">{isBn ? "খেলোয়াড় নির্বাচন" : "Select Player"}</label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {players.map((player) => (
                <button
                  key={player.id}
                  onClick={() => handlePlayerSelect(player)}
                  className={`p-4 rounded-lg border-2 transition text-center ${
                    selectedPlayer?.id === player.id
                      ? "border-accent bg-accent/10"
                      : "border-secondary/50"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {selectedPlayer?.id === player.id && (
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    )}
                    <span className="font-bold text-accent">{player.num}</span>
                  </div>
                  <div className="font-semibold text-foreground text-xs">{player.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium mb-2">{isBn ? "রেটিং (1-10)" : "Rating (1-10)"}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={matchRating}
              onChange={(e) => setMatchRating(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-accent font-bold text-lg">{matchRating}/10</div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">{isBn ? "গোল" : "Goals"}</label>
              <input type="number" value={stats.goals} onChange={(e) => setStats({...stats, goals: e.target.value})} className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{isBn ? "সহায়তা" : "Assists"}</label>
              <input type="number" value={stats.assists} onChange={(e) => setStats({...stats, assists: e.target.value})} className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{isBn ? "পাস" : "Passes"}</label>
              <input type="number" value={stats.passes} onChange={(e) => setStats({...stats, passes: e.target.value})} className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{isBn ? "ট্যাকেল" : "Tackles"}</label>
              <input type="number" value={stats.tackles} onChange={(e) => setStats({...stats, tackles: e.target.value})} className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent" />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">{isBn ? "মন্তব্য" : "Notes"}</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent h-20 resize-none"
              placeholder={isBn ? "পারফরম্যান্স মন্তব্য..." : "Performance notes..."}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={handleSave} className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition">
              <Save className="w-4 h-4" />
              {editingId ? isBn ? "আপডেট করুন" : "Update" : isBn ? "সংরক্ষণ করুন" : "Save"}
            </button>
            <button onClick={handleReset} className="bg-secondary hover:bg-secondary/80 text-foreground px-6 py-2 rounded-lg flex items-center gap-2 transition">
              <RefreshCw className="w-4 h-4" />
              {isBn ? "বাতিল করুন" : "Cancel"}
            </button>
          </div>
        </div>
      )}

      {/* MOTM History */}
      <div>
        <h2 className={`text-xl font-bold mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>{isBn ? "সম্প্রতি সংযোজিত" : "Recent MOTM"}</h2>
        <div className="grid gap-4">
          {motms.length === 0 ? (
            <div className="text-center py-12 text-foreground/60">{isBn ? "কোন MOTM রেকর্ড নেই" : "No MOTM records yet"}</div>
          ) : (
            motms.slice().reverse().slice(0, 5).map((motm) => (
              <div key={motm.id} className="bg-card border-2 border-secondary rounded-lg p-4 flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <h3 className="font-bold text-foreground">{motm.playerName}</h3>
                    <span className="ml-auto text-accent font-bold">{motm.rating}/10</span>
                  </div>
                  {motm.notes && <p className="text-foreground/60 text-sm mt-1">{motm.notes}</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(motm)} className="p-2 hover:bg-secondary rounded-lg transition text-blue-400">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(motm.id)} className="p-2 hover:bg-secondary rounded-lg transition text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
