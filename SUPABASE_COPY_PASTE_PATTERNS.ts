// ============================================================================
// SUPABASE INTEGRATION - COPY & PASTE PATTERNS
// Use these code snippets directly in your components
// ============================================================================

// ============================================================================
// 1. FETCH & DISPLAY PLAYERS
// ============================================================================

'use client'
import { useEffect, useState } from 'react'
import { getPlayers } from '@/lib/supabase-crud'

export function PlayersList() {
  const [players, setPlayers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data, error } = await getPlayers()
        if (error) throw error
        setPlayers(data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetch()
  }, [])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {players.map(player => (
        <div key={player.id}>
          #{player.jersey} - {player.position}
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// 2. CREATE PLAYER WITH FORM
// ============================================================================

'use client'
import { useState } from 'react'
import { createPlayer } from '@/lib/supabase-crud'
import { useAuth } from '@/lib/auth-hook'

export function AddPlayerForm() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    jersey: '',
    position: '',
    age: '',
    address: '',
    foot: 'Right',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      setError('Not logged in')
      return
    }

    try {
      setLoading(true)
      const { data, error: err } = await createPlayer({
        user_id: user.id,
        jersey: parseInt(formData.jersey),
        position: formData.position,
        age: parseInt(formData.age),
        address: formData.address,
        foot: formData.foot,
      })

      if (err) throw err
      alert('Player created!')
      setFormData({ jersey: '', position: '', age: '', address: '', foot: 'Right' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      
      <input
        type="number"
        placeholder="Jersey #"
        value={formData.jersey}
        onChange={(e) => setFormData({ ...formData, jersey: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Position"
        value={formData.position}
        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Age"
        value={formData.age}
        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Address"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
      />
      <select
        value={formData.foot}
        onChange={(e) => setFormData({ ...formData, foot: e.target.value })}
      >
        <option value="Right">Right</option>
        <option value="Left">Left</option>
        <option value="Both">Both</option>
      </select>

      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Player'}
      </button>
    </form>
  )
}

// ============================================================================
// 3. UPDATE PLAYER STATS
// ============================================================================

'use client'
import { updatePlayer } from '@/lib/supabase-crud'

export function UpdatePlayerStats({ playerId, currentStats }) {
  const handleUpdateGoals = async () => {
    const newGoals = (currentStats.goals || 0) + 1
    
    const { data, error } = await updatePlayer(playerId, {
      goals: newGoals
    })

    if (error) {
      console.error('Error:', error)
      return
    }

    console.log('Updated:', data)
    // Refresh your UI here
  }

  return (
    <button onClick={handleUpdateGoals}>
      Add Goal (Current: {currentStats.goals || 0})
    </button>
  )
}

// ============================================================================
// 4. DELETE PLAYER
// ============================================================================

'use client'
import { deletePlayer } from '@/lib/supabase-crud'

export function DeletePlayerButton({ playerId, playerName }) {
  const handleDelete = async () => {
    if (!confirm(`Delete ${playerName}?`)) return

    try {
      const { error } = await deletePlayer(playerId)
      if (error) throw error
      alert('Player deleted!')
      // Refresh your list here
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  return (
    <button onClick={handleDelete} className="text-red-500">
      Delete
    </button>
  )
}

// ============================================================================
// 5. FETCH MATCHES
// ============================================================================

'use client'
import { useEffect, useState } from 'react'
import { getMatches } from '@/lib/supabase-crud'

export function MatchesList() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data, error } = await getMatches()
        if (error) throw error
        setMatches(data || [])
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  if (loading) return <div>Loading matches...</div>

  return (
    <div>
      {matches.map(match => (
        <div key={match.id}>
          <h3>Titan Force vs {match.opponent}</h3>
          <p>{match.match_date} at {match.location}</p>
          <p>Status: {match.status}</p>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// 6. CREATE MATCH
// ============================================================================

'use client'
import { useState } from 'react'
import { createMatch } from '@/lib/supabase-crud'
import { useAuth } from '@/lib/auth-hook'

export function CreateMatchForm() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    opponent: '',
    match_date: '',
    location: '',
    status: 'upcoming',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await createMatch({
        opponent: formData.opponent,
        match_date: formData.match_date,
        location: formData.location,
        status: formData.status,
        created_by: user.id,
      })

      if (error) throw error
      alert('Match created!')
      setFormData({ opponent: '', match_date: '', location: '', status: 'upcoming' })
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Opponent"
        value={formData.opponent}
        onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
        required
      />
      <input
        type="datetime-local"
        value={formData.match_date}
        onChange={(e) => setFormData({ ...formData, match_date: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Location"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        required
      />
      <select
        value={formData.status}
        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
      >
        <option value="upcoming">Upcoming</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Match'}
      </button>
    </form>
  )
}

// ============================================================================
// 7. FETCH & DISPLAY NEWS
// ============================================================================

'use client'
import { useEffect, useState } from 'react'
import { getPublishedNews, getNewsComments } from '@/lib/supabase-crud'

export function NewsFeed() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data, error } = await getPublishedNews()
        if (error) throw error
        setPosts(data || [])
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  if (loading) return <div>Loading news...</div>

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <div key={post.id} className="border p-4 rounded">
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <small>{new Date(post.created_at).toLocaleDateString()}</small>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// 8. ADD COMMENT TO NEWS
// ============================================================================

'use client'
import { useState } from 'react'
import { addNewsComment } from '@/lib/supabase-crud'
import { useAuth } from '@/lib/auth-hook'

export function AddCommentForm({ postId }) {
  const { user } = useAuth()
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user || !comment.trim()) return

    try {
      setLoading(true)
      const { data, error } = await addNewsComment(postId, comment, user.id)
      
      if (error) throw error
      alert('Comment added!')
      setComment('')
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <div>Please log in to comment</div>

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        placeholder="Add your comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  )
}

// ============================================================================
// 9. MANAGE FAN FAVORITES
// ============================================================================

'use client'
import { useState } from 'react'
import { addFanFavorite, removeFanFavorite, getFanFavorites } from '@/lib/supabase-crud'
import { useAuth } from '@/lib/auth-hook'

export function FavoriteButton({ playerId, playerName }) {
  const { user } = useAuth()
  const [isFavorite, setIsFavorite] = useState(false)

  const handleToggleFavorite = async () => {
    if (!user) {
      alert('Please log in')
      return
    }

    try {
      if (isFavorite) {
        const { error } = await removeFanFavorite(user.id, playerId)
        if (error) throw error
        setIsFavorite(false)
      } else {
        const { error } = await addFanFavorite(user.id, playerId)
        if (error) throw error
        setIsFavorite(true)
      }
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  return (
    <button
      onClick={handleToggleFavorite}
      className={isFavorite ? 'text-red-500' : 'text-gray-500'}
    >
      {isFavorite ? '❤️' : '🤍'} {playerName}
    </button>
  )
}

// ============================================================================
// 10. REAL-TIME UPDATES (OPTIONAL)
// ============================================================================

'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function RealtimePlayers() {
  const [players, setPlayers] = useState([])
  const supabase = createClient()

  useEffect(() => {
    // Subscribe to all changes on player_profiles table
    const subscription = supabase
      .channel('player-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'player_profiles'
        },
        (payload) => {
          console.log('Player changed:', payload)
          
          if (payload.eventType === 'INSERT') {
            setPlayers(prev => [...prev, payload.new])
          } else if (payload.eventType === 'UPDATE') {
            setPlayers(prev =>
              prev.map(p => p.id === payload.new.id ? payload.new : p)
            )
          } else if (payload.eventType === 'DELETE') {
            setPlayers(prev => prev.filter(p => p.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div>
      <h2>Live Players ({players.length})</h2>
      {players.map(player => (
        <div key={player.id}>#{player.jersey} - {player.position}</div>
      ))}
    </div>
  )
}

// ============================================================================
// END OF COPY-PASTE PATTERNS
// ============================================================================
