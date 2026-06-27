'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import TrophyDataService, { Trophy } from '@/lib/trophy-data-service'
import { useLanguage } from '@/lib/language-context'
import { Trash2, Star, Plus, X, ArrowLeft } from 'lucide-react'
import { PageEntrance } from '@/components/page-entrance'

export default function AdminTrophyPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const isBn = language === 'bn'

  const [trophies, setTrophies] = useState<Trophy[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [stats, setStats] = useState({ total: 0, featured: 0, byCategory: { league: 0, cup: 0, championship: 0, tournament: 0 } })
  const [isLoading, setIsLoading] = useState(true)

  const [formData, setFormData] = useState({
    name: '',
    year: new Date().getFullYear(),
    category: 'league' as 'league' | 'cup' | 'championship' | 'tournament',
    description: '',
    icon: '🏆',
    runners_up: '',
    featured: false,
  })

  useEffect(() => {
    loadTrophies()
  }, [])

  const loadTrophies = async () => {
    setIsLoading(true)
    const data = await TrophyDataService.getTrophies()
    const stats = await TrophyDataService.getTrophyStats()
    setTrophies(data)
    setStats(stats)
    setIsLoading(false)
  }

  const handleAddTrophy = async () => {
    if (!formData.name.trim()) {
      alert(isBn ? 'ট্রফির নাম প্রয়োজন' : 'Trophy name is required')
      return
    }

    try {
      if (editingId) {
        await TrophyDataService.updateTrophy(editingId, formData)
      } else {
        await TrophyDataService.addTrophy(formData)
      }

      await loadTrophies()
      resetForm()
    } catch (error) {
      console.error('[v0] Error saving trophy:', error)
      alert(isBn ? 'ট্রফি সংরক্ষণ ব্যর্থ' : 'Failed to save trophy')
    }
  }

  const handleDeleteTrophy = async (id: string) => {
    if (confirm(isBn ? 'এটি মুছে ফেলতে নিশ্চিত?' : 'Are you sure you want to delete this?')) {
      try {
        await TrophyDataService.deleteTrophy(id)
        await loadTrophies()
      } catch (error) {
        console.error('[v0] Error deleting trophy:', error)
        alert(isBn ? 'ট্রফি মোছা ব্যর্থ' : 'Failed to delete trophy')
      }
    }
  }

  const handleToggleFeatured = async (id: string) => {
    try {
      await TrophyDataService.toggleFeatured(id)
      await loadTrophies()
    } catch (error) {
      console.error('[v0] Error toggling featured:', error)
    }
  }

  const handleEditTrophy = (trophy: Trophy) => {
    setFormData({
      name: trophy.name,
      year: trophy.year,
      category: trophy.category,
      description: trophy.description,
      icon: trophy.icon,
      runners_up: trophy.runners_up || '',
      featured: trophy.featured || false,
    })
    setEditingId(trophy.id)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      year: new Date().getFullYear(),
      category: 'league',
      description: '',
      icon: '🏆',
      runners_up: '',
      featured: false,
    })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
            title={isBn ? 'ড্যাশবোর্ডে ফিরুন' : 'Back to Dashboard'}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{isBn ? 'ট্রফি পরিচালনা' : 'Manage Trophies'}</h1>
            <p className="text-muted-foreground mt-1">
              {isBn ? `মোট ${stats.total} ট্রফি` : `${stats.total} total trophies`}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="neo-btn neo-btn-primary flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {isBn ? 'নতুন যোগ করুন' : 'Add New'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 rounded-lg bg-card neo-soft border-border">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{isBn ? 'মোট' : 'Total'}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
        </div>
        <div className="p-4 rounded-lg bg-card neo-soft border-border">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{isBn ? 'বৈশিষ্ট্যযুক্ত' : 'Featured'}</p>
          <p className="text-2xl font-bold text-accent mt-1">{stats.featured}</p>
        </div>
        <div className="p-4 rounded-lg bg-card neo-soft border-border">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{isBn ? 'লিগ' : 'League'}</p>
          <p className="text-2xl font-bold text-primary mt-1">{stats.byCategory.league}</p>
        </div>
        <div className="p-4 rounded-lg bg-card neo-soft border-border">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{isBn ? 'কাপ' : 'Cup'}</p>
          <p className="text-2xl font-bold text-green-500 mt-1">{stats.byCategory.cup}</p>
        </div>
        <div className="p-4 rounded-lg bg-card neo-soft border-border">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{isBn ? 'চ্যাম্পিয়নশিপ' : 'Championship'}</p>
          <p className="text-2xl font-bold text-purple-500 mt-1">{stats.byCategory.championship}</p>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="p-6 rounded-lg bg-card neo-soft border-border space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{editingId ? (isBn ? 'ট্রফি সম্পাদনা' : 'Edit Trophy') : (isBn ? 'নতুন ট্রফি যোগ করুন' : 'Add New Trophy')}</h2>
            <button onClick={() => resetForm()} className="p-1 hover:bg-muted rounded transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder={isBn ? 'ট্রফির নাম' : 'Trophy name'}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-3 py-2 rounded-lg bg-background neo-soft border-border text-foreground placeholder-muted-foreground"
            />
            <input
              type="number"
              placeholder={isBn ? 'বছর' : 'Year'}
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              className="px-3 py-2 rounded-lg bg-background neo-soft border-border text-foreground placeholder-muted-foreground"
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="px-3 py-2 rounded-lg bg-background neo-soft border-border text-foreground"
            >
              <option value="league">{isBn ? 'লিগ' : 'League'}</option>
              <option value="cup">{isBn ? 'কাপ' : 'Cup'}</option>
              <option value="championship">{isBn ? 'চ্যাম্পিয়নশিপ' : 'Championship'}</option>
              <option value="tournament">{isBn ? 'টুর্নামেন্ট' : 'Tournament'}</option>
            </select>
            <input
              type="text"
              placeholder={isBn ? 'আইকন (ইমোজি)' : 'Icon (emoji)'}
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="px-3 py-2 rounded-lg bg-background neo-soft border-border text-foreground placeholder-muted-foreground text-2xl text-center"
            />
          </div>

          <input
            type="text"
            placeholder={isBn ? 'রানার আপ' : 'Runners up'}
            value={formData.runners_up}
            onChange={(e) => setFormData({ ...formData, runners_up: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-background neo-soft border-border text-foreground placeholder-muted-foreground"
          />

          <textarea
            placeholder={isBn ? 'বিবরণ' : 'Description'}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-background neo-soft border-border text-foreground placeholder-muted-foreground h-24"
          />

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm">{isBn ? 'বৈশিষ্ট্যযুক্ত' : 'Featured'}</span>
          </label>

          <button
            onClick={handleAddTrophy}
            className="neo-btn neo-btn-primary w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            {editingId ? (isBn ? 'আপডেট করুন' : 'Update') : (isBn ? 'যোগ করুন' : 'Add Trophy')}
          </button>
        </div>
      )}

      {/* Trophies List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trophies
          .sort((a, b) => b.year - a.year)
          .map((trophy) => (
            <div key={trophy.id} className="p-4 rounded-lg bg-card neo-soft border-border space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="text-4xl">{trophy.icon}</div>
                  <div>
                    <h3 className="font-bold text-foreground">{trophy.name}</h3>
                    <p className="text-sm text-muted-foreground">{trophy.year}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleFeatured(trophy.id)}
                    className={`p-2 rounded transition-colors ${trophy.featured ? 'bg-accent/20 text-accent' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
                  >
                    <Star className="w-4 h-4" fill={trophy.featured ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={() => handleEditTrophy(trophy)}
                    className="px-3 py-1 rounded text-sm bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                  >
                    {isBn ? 'সম্পাদনা' : 'Edit'}
                  </button>
                  <button
                    onClick={() => handleDeleteTrophy(trophy.id)}
                    className="p-2 rounded text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-foreground/70">{trophy.description}</p>
              {trophy.runners_up && (
                <p className="text-xs text-muted-foreground">
                  {isBn ? 'রানার আপ' : 'Runners up'}: {trophy.runners_up}
                </p>
              )}
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-muted text-muted-foreground">
                {trophy.category.charAt(0).toUpperCase() + trophy.category.slice(1)}
              </div>
            </div>
          ))}
      </div>

      {trophies.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>{isBn ? 'কোন ট্রফি নেই' : 'No trophies yet'}</p>
        </div>
      )}
    </div>
  )
}
