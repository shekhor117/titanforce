'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { getDataService } from '@/lib/data-service'
import { PlayerPositionManager } from '@/components/admin/player-position-manager'
import type { Player } from '@/lib/data-service'

export default function PlayerEditPage() {
  const params = useParams()
  const router = useRouter()
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [player, setPlayer] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const playerId = parseInt(params.id as string)

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        setLoading(true)
        const service = getDataService()
        const players = await service.getPlayers()
        const found = players.find(p => p.num === playerId)
        if (found) {
          setPlayer(found)
        }
      } catch (err) {
        setError(isBn ? 'খেলোয়াড় লোড করতে ব্যর্থ' : 'Failed to load player')
      } finally {
        setLoading(false)
      }
    }

    fetchPlayer()
  }, [playerId, isBn])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!player) return
    const { name, value } = e.target
    
    // Handle numeric fields
    if (name.includes('_id') || name.includes('num') || name.includes('age') || name.includes('height') || name.includes('weight')) {
      setPlayer({
        ...player,
        [name]: value === '' ? null : parseInt(value),
      })
    } else {
      setPlayer({
        ...player,
        [name]: value,
      })
    }
  }

  const handleAttributeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!player) return
    const { name, value } = e.target
    setPlayer({
      ...player,
      [name]: value === '' ? null : parseInt(value),
    })
  }

  const handleSave = async () => {
    if (!player) return
    try {
      setSaving(true)
      setError(null)
      
      // Exclude positions array and clean NaN/invalid values
      const { positions, ...playerData } = player
      
      // Remove NaN values and keep only valid data
      const cleanedData = Object.fromEntries(
        Object.entries(playerData).filter(([, value]) => {
          if (value === null || value === undefined) return true
          if (typeof value === 'number' && isNaN(value)) return false
          return true
        })
      )
      
      const response = await fetch(`/api/admin/players/${player.num}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || (isBn ? 'আপডেট ব্যর্থ হয়েছে' : 'Failed to update player'))
      }

      setSuccess(true)
      setTimeout(() => {
        router.back()
      }, 2000)
    } catch (err) {
      console.error('[v0] Error saving player:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p>{isBn ? 'লোড হচ্ছে...' : 'Loading...'}</p>
        </div>
      </div>
    )
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{isBn ? 'খেলোয়াড় পাওয়া যায়নি' : 'Player not found'}</h1>
          <Link href="/admin/players" className="text-primary hover:underline">
            {isBn ? 'ফিরে যান' : 'Go back'}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-secondary/20 border-b border-secondary sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <Link
            href="/admin/players"
            className="neo-btn flex items-center gap-2 text-primary px-3 py-2 rounded"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isBn ? 'পিছনে' : 'Back'}</span>
          </Link>
          <h1 className="text-2xl font-bold">{isBn ? 'খেলোয়াড় সম্পাদনা করুন' : 'Edit Player'}</h1>
          <div></div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 text-red-400 rounded-lg border border-red-500/40">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/20 text-green-400 rounded-lg border border-green-500/40">
            {isBn ? 'সফলভাবে আপডেট হয়েছে!' : 'Player updated successfully!'}
          </div>
        )}

        <div className="space-y-8">
          {/* Basic Info */}
          <div className="neo-card p-6 md:p-8 rounded-2xl">
            <h2 className={`text-2xl font-bold mb-6 ${isBn ? 'font-[var(--font-bengali)]' : ''}`}>
              {isBn ? 'মৌলিক তথ্য' : 'Basic Information'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">{isBn ? 'পূর্ণ নাম' : 'Full Name'}</label>
                <input
                  type="text"
                  name="full_name"
                  value={player.full_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-secondary/30 border border-secondary/60 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">{isBn ? 'নাম' : 'Name'}</label>
                <input
                  type="text"
                  name="name"
                  value={player.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-secondary/30 border border-secondary/60 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">{isBn ? 'জার্সি সংখ্যা' : 'Jersey Number'}</label>
                <input
                  type="number"
                  name="num"
                  value={player.num}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-secondary/30 border border-secondary/60 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">{isBn ? 'অবস্থান' : 'Position'}</label>
                <input
                  type="text"
                  name="position"
                  value={player.position}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-secondary/30 border border-secondary/60 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">{isBn ? 'বয়স' : 'Age'}</label>
                <input
                  type="number"
                  name="age"
                  value={player.age || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-secondary/30 border border-secondary/60 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">{isBn ? 'শহর' : 'Hometown'}</label>
                <input
                  type="text"
                  name="hometown"
                  value={player.hometown || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-secondary/30 border border-secondary/60 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">{isBn ? 'জন্ম তারিখ' : 'Date of Birth'}</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={player.date_of_birth || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-secondary/30 border border-secondary/60 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">{isBn ? 'জাতীয়তা' : 'Nationality'}</label>
                <input
                  type="text"
                  name="nationality"
                  value={player.nationality || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-secondary/30 border border-secondary/60 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">{isBn ? 'উচ্চতা (সেমি)' : 'Height (cm)'}</label>
                <input
                  type="number"
                  name="height"
                  value={player.height || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., 194"
                  className="w-full px-4 py-3 bg-secondary/30 border border-secondary/60 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">{isBn ? 'ওজন (কেজি)' : 'Weight (kg)'}</label>
                <input
                  type="number"
                  name="weight"
                  value={player.weight || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., 88"
                  className="w-full px-4 py-3 bg-secondary/30 border border-secondary/60 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">{isBn ? 'শক্তিশালী পা' : 'Strong Foot'}</label>
                <select
                  name="strong_foot"
                  value={player.strong_foot || 'Right'}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-secondary/30 border border-secondary/60 rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="Right">{isBn ? 'ডান' : 'Right'}</option>
                  <option value="Left">{isBn ? 'বাম' : 'Left'}</option>
                  <option value="Both">{isBn ? 'উভয়' : 'Both'}</option>
                </select>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-semibold mb-2">{isBn ? 'জীবনী' : 'Biography'}</label>
              <textarea
                name="bio"
                value={player.bio || ''}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-secondary/30 border border-secondary/60 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Attributes */}
          <div className="neo-card p-6 md:p-8 rounded-2xl">
            <h2 className={`text-2xl font-bold mb-6 ${isBn ? 'font-[var(--font-bengali)]' : ''}`}>
              {isBn ? 'দক্ষতা' : 'Attributes'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { key: 'pace', label: isBn ? 'গতি' : 'Pace' },
                { key: 'shooting', label: isBn ? 'শুট' : 'Shooting' },
                { key: 'passing', label: isBn ? 'পাস' : 'Passing' },
                { key: 'dribbling', label: isBn ? 'ড্রিবলিং' : 'Dribbling' },
                { key: 'defending', label: isBn ? 'ডিফেন্ডিং' : 'Defending' },
                { key: 'physical', label: isBn ? 'শক্তি' : 'Physical' },
              ].map(attr => (
                <div key={attr.key}>
                  <label className="block text-sm font-semibold mb-2">
                    {attr.label} ({player[attr.key as keyof Player] || 0})
                  </label>
                  <input
                    type="range"
                    name={attr.key}
                    min="0"
                    max="100"
                    value={player[attr.key as keyof Player] || 0}
                    onChange={handleAttributeChange}
                    className="w-full h-2 bg-secondary/30 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className="neo-card p-6 md:p-8 rounded-2xl">
            <h2 className={`text-2xl font-bold mb-6 ${isBn ? 'font-[var(--font-bengali)]' : ''}`}>
              {isBn ? 'পরিসংখ্যান' : 'Statistics'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { key: 'goals', label: isBn ? 'গোল' : 'Goals' },
                { key: 'assists', label: isBn ? 'সহায়তা' : 'Assists' },
                { key: 'appearances', label: isBn ? 'ম্যাচ' : 'Appearances' },
                { key: 'minutes_played', label: isBn ? 'মিনিট' : 'Minutes Played' },
                { key: 'passes', label: isBn ? 'পাস' : 'Pass Accuracy' },
                { key: 'chances_created', label: isBn ? 'সুযোগ' : 'Chances Created' },
                { key: 'yellow_cards', label: isBn ? 'হলুদ কার্ড' : 'Yellow Cards' },
                { key: 'red_cards', label: isBn ? 'লাল কার্ড' : 'Red Cards' },
              ].map(stat => (
                <div key={stat.key}>
                  <label className="block text-sm font-semibold mb-2">{stat.label}</label>
                  <input
                    type="number"
                    name={stat.key}
                    value={player[stat.key as keyof Player] || 0}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-secondary/30 border border-secondary/60 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Position Manager */}
          <div className="neo-card p-6 md:p-8 rounded-2xl">
            <h2 className={`text-2xl font-bold mb-6 ${isBn ? 'font-[var(--font-bengali)]' : ''}`}>
              {isBn ? 'অবস্থান পরিচালনা' : 'Manage Positions'}
            </h2>
            <PlayerPositionManager playerNum={player.num} />
          </div>

          {/* Save Button */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 transition"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isBn ? 'সংরক্ষণ করুন' : 'Save Changes'}
                </>
              )}
            </button>
            <Link
              href="/admin/players"
              className="px-8 py-3 bg-secondary/30 text-foreground rounded-lg font-semibold hover:bg-secondary/60 transition"
            >
              {isBn ? 'বাতিল করুন' : 'Cancel'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
