'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { DataService, Player } from '@/lib/data-service'
import SquadManager from '@/components/SquadManager'
import { AlertCircle, Loader2 } from 'lucide-react'
import { put } from '@vercel/blob'
import { PageEntrance } from '@/components/page-entrance'

export default function SquadManagerAdminPage() {
  const { user, isLoading: authLoading } = useAuth()
  const { language } = useLanguage()
  const router = useRouter()
  const isBn = language === 'bn'

  const [players, setPlayers] = useState<Player[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dataService] = useState(() => new DataService())
  const [isSaving, setIsSaving] = useState(false)

  // Load players from Supabase on mount
  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.replace('/admin/login?next=%2Fadmin%2Fsquad-manager')
      return
    }

    loadPlayers()
  }, [authLoading, user, router])

  const loadPlayers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await dataService.getPlayers()
      
      // Convert Supabase player format to SquadManager format
      const convertedPlayers = data.map((p: Player) => ({
        id: p.id,
        name: p.name || p.full_name,
        fullName: p.full_name || p.name,
        position: p.position || p.category,
        number: p.num || 0,
        age: p.age || 24,
        nationality: p.nationality || 'Unknown',
        matches: p.appearances || p.premier_matches || 0,
        goals: p.goals || 0,
        assists: p.assists || 0,
        yellowCards: p.yellow_cards || 0,
        redCards: p.red_cards || 0,
        rating: p.average_rating || 7.0,
        status: (p.status || 'active') as any,
        photo: p.image_url || '',
        dob: p.date_of_birth || '',
        joinDate: p.join_date || '',
        season: p.season_year || '2024-2025',
        hometown: p.hometown || '',
        preferredFoot: (p.foot || 'Right') as 'Right' | 'Left' | 'Both',
        club: p.club || 'Titan Force',
        minutesPlayed: p.minutes_played || 0,
        passAccuracy: p.pass_accuracy || 85,
        chancesCreated: p.chances_created || 0,
        cleanSheets: p.clean_sheets || 0,
        biography: p.bio || '',
        ratingVotes: 1,
        ratingValue: p.average_rating || 7.0,
        isFavorite: false,
        attributes: {
          pace: p.pace || 80,
          shooting: p.shooting || 75,
          passing: p.passing || 80,
          dribbling: p.dribbling || 78,
          defending: p.defending || 70,
          physical: p.physical || 75,
        },
        trophies: [],
        training: [],
      }))
      setPlayers(convertedPlayers)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load players'
      setError(message)
      console.error('[v0] Error loading players:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddPlayer = async (newPlayer: any) => {
    try {
      setIsSaving(true)
      setError(null)

      // Upload photo if it's a data URL
      let photoUrl = newPlayer.photo
      if (newPlayer.photo?.startsWith('data:image')) {
        try {
          const blob = await fetch(newPlayer.photo).then(res => res.blob())
          const fileName = `player_${Date.now()}.${blob.type.split('/')[1]}`
          const result = await put(`squad/${fileName}`, blob, { access: 'public' })
          photoUrl = result.url
        } catch (uploadErr) {
          console.error('[v0] Photo upload failed:', uploadErr)
        }
      }

      // Convert to Supabase format and save
      const playerData: Omit<Player, 'id' | 'created_at' | 'updated_at'> = {
        name: newPlayer.name,
        full_name: newPlayer.fullName || newPlayer.name,
        num: newPlayer.number,
        position: newPlayer.position,
        category: newPlayer.position as any,
        age: newPlayer.age,
        nationality: newPlayer.nationality,
        goals: newPlayer.goals,
        assists: newPlayer.assists,
        image_url: photoUrl,
        status: newPlayer.status || 'active',
        bio: newPlayer.biography,
        clean_sheets: newPlayer.cleanSheets,
        appearances: newPlayer.matches,
        minutes_played: newPlayer.minutesPlayed,
        pass_accuracy: newPlayer.passAccuracy,
        chances_created: newPlayer.chancesCreated,
        yellow_cards: newPlayer.yellowCards,
        red_cards: newPlayer.redCards,
        average_rating: newPlayer.rating,
        pace: newPlayer.attributes?.pace,
        shooting: newPlayer.attributes?.shooting,
        passing: newPlayer.attributes?.passing,
        dribbling: newPlayer.attributes?.dribbling,
        defending: newPlayer.attributes?.defending,
        physical: newPlayer.attributes?.physical,
        date_of_birth: newPlayer.dob,
        join_date: newPlayer.joinDate,
        season_year: newPlayer.season,
        club: newPlayer.club,
        foot: newPlayer.preferredFoot,
        hometown: newPlayer.hometown,
      }

      const created = await dataService.createPlayer(playerData)
      
      // Add to local state
      setPlayers(prev => [...prev, {
        ...created,
        name: created.name || created.full_name,
      }])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add player'
      setError(message)
      console.error('[v0] Error adding player:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const normalizeCategory = (position: unknown): Player['category'] => {
    const value = String(position ?? '').trim().toUpperCase()
    if (value.includes('KEEP') || value === 'GK') return 'GK'
    if (value.includes('DEF') || value === 'CB' || value === 'LB' || value === 'RB') return 'DEF'
    if (value.includes('MID') || value === 'CM' || value === 'AM' || value === 'DM') return 'MID'
    return 'FWD'
  }

  const normalizeStatus = (status: unknown): Player['status'] => {
    const value = String(status ?? 'active').trim().toLowerCase()
    if (value === 'injured') return 'injured'
    if (value === 'suspended') return 'suspended'
    return 'active'
  }

  const handleUpdatePlayer = async (updatedPlayer: any) => {
    try {
      setIsSaving(true)
      setError(null)

      // Upload new photo if needed
      let photoUrl = updatedPlayer.photo
      if (updatedPlayer.photo?.startsWith('data:image')) {
        try {
          const blob = await fetch(updatedPlayer.photo).then(res => res.blob())
          const fileName = `player_${Date.now()}.${blob.type.split('/')[1]}`
          const result = await put(`squad/${fileName}`, blob, { access: 'public' })
          photoUrl = result.url
        } catch (uploadErr) {
          console.error('[v0] Photo upload failed:', uploadErr)
        }
      }

      // Update in Supabase
      const numberOrNull = (value: unknown) => {
        const number = Number(value)
        return Number.isFinite(number) ? number : null
      }
      const textOrNull = (value: unknown) => {
        const text = String(value ?? '').trim()
        return text || null
      }

      // Keep UI-only fields out of the database payload and normalize empty
      // values so updates match the players table regardless of edit source.
      const updates = {
        name: textOrNull(updatedPlayer.name) ?? 'Unnamed Player',
        full_name: textOrNull(updatedPlayer.fullName || updatedPlayer.name) ?? 'Unnamed Player',
        num: numberOrNull(updatedPlayer.number) ?? 0,
        position: textOrNull(updatedPlayer.position) ?? 'Forward',
        category: normalizeCategory(updatedPlayer.position),
        age: numberOrNull(updatedPlayer.age),
        nationality: textOrNull(updatedPlayer.nationality),
        goals: numberOrNull(updatedPlayer.goals) ?? 0,
        assists: numberOrNull(updatedPlayer.assists) ?? 0,
        image_url: textOrNull(photoUrl),
        status: normalizeStatus(updatedPlayer.status),
        bio: textOrNull(updatedPlayer.biography),
        clean_sheets: numberOrNull(updatedPlayer.cleanSheets),
        appearances: numberOrNull(updatedPlayer.matches),
        minutes_played: numberOrNull(updatedPlayer.minutesPlayed),
        pass_accuracy: numberOrNull(updatedPlayer.passAccuracy),
        chances_created: numberOrNull(updatedPlayer.chancesCreated),
        yellow_cards: numberOrNull(updatedPlayer.yellowCards),
        red_cards: numberOrNull(updatedPlayer.redCards),
        average_rating: numberOrNull(updatedPlayer.rating),
        pace: numberOrNull(updatedPlayer.attributes?.pace),
        shooting: numberOrNull(updatedPlayer.attributes?.shooting),
        passing: numberOrNull(updatedPlayer.attributes?.passing),
        dribbling: numberOrNull(updatedPlayer.attributes?.dribbling),
        defending: numberOrNull(updatedPlayer.attributes?.defending),
        physical: numberOrNull(updatedPlayer.attributes?.physical),
        date_of_birth: textOrNull(updatedPlayer.dob),
        join_date: textOrNull(updatedPlayer.joinDate),
        season_year: textOrNull(updatedPlayer.season),
        club: textOrNull(updatedPlayer.club),
        foot: textOrNull(updatedPlayer.preferredFoot) as Player['foot'],
        hometown: textOrNull(updatedPlayer.hometown),
      } as Partial<Player>

      const updated = await dataService.updatePlayer(String(updatedPlayer.id), updates)

      // Update in local state
      setPlayers(prev =>
        prev.map(p => (p.id === updatedPlayer.id ? { ...updated, name: updated.name || updated.full_name } : p))
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update player'
      setError(message)
      console.error('[v0] Error updating player:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeletePlayer = async (playerId: string) => {
    if (!confirm(isBn ? 'আপনি নিশ্চিত?' : 'Are you sure?')) return

    try {
      setIsSaving(true)
      setError(null)
      await dataService.deletePlayer(playerId)
      setPlayers(prev => prev.filter(p => p.id !== playerId))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete player'
      setError(message)
      console.error('[v0] Error deleting player:', err)
    } finally {
      setIsSaving(false)
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <PageEntrance delay={0.2} duration={0.6} variant="fadeInUp">
      <div className="min-h-screen bg-background">
      {error && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-destructive">{isBn ? 'ত্রুটি' : 'Error'}</p>
            <p className="text-sm text-destructive/80">{error}</p>
          </div>
        </div>
      )}

      {isSaving && (
        <div className="fixed top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg flex gap-2 items-center">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{isBn ? 'সংরক্ষণ করছে...' : 'Saving...'}</span>
        </div>
      )}

      <SquadManager
        players={players}
        onAddPlayer={handleAddPlayer}
        onUpdatePlayer={handleUpdatePlayer}
        onDeletePlayer={handleDeletePlayer}
      />
      </div>
    </PageEntrance>
  )
}
