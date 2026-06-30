'use client'

import { useEffect, useState } from 'react'
import { MatchDetails } from './match-details'
import { Loader } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

interface MatchDetailsViewerProps {
  matchId: string
  isModal?: boolean
  onClose?: () => void
}

export function MatchDetailsViewer({ matchId, isModal = false, onClose }: MatchDetailsViewerProps) {
  const { isBn } = useLanguage()
  const [match, setMatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/matches/${matchId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch match')
        }

        const data = await response.json()
        setMatch(data)
        setError(null)
      } catch (err) {
        console.error('[v0] Error fetching match:', err)
        setError(err instanceof Error ? err.message : 'Failed to load match details')
      } finally {
        setLoading(false)
      }
    }

    fetchMatch()
  }, [matchId])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-2">
          <Loader className="w-6 h-6 animate-spin text-primary" />
          <p className={`text-sm text-foreground/60 ${isBn ? 'font-bengali' : ''}`}>
            {isBn ? 'লোডিং...' : 'Loading...'}
          </p>
        </div>
      </div>
    )
  }

  if (error || !match) {
    return (
      <div className="p-8 text-center">
        <p className={`text-foreground/60 ${isBn ? 'font-bengali' : ''}`}>
          {error || (isBn ? 'ম্যাচ খুঁজে পাওয়া যায়নি' : 'Match not found')}
        </p>
      </div>
    )
  }

  return <MatchDetails match={match} onClose={onClose} isModal={isModal} />
}
