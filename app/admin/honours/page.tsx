'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import HonourDataService, { Honour } from '@/lib/honour-data-service'
import { useLanguage } from '@/lib/language-context'
import { Trash2, Star, Plus, X, ArrowLeft } from 'lucide-react'
import { PageEntrance } from '@/components/page-entrance'

export default function AdminHonourPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const isBn = language === 'bn'

  const [honours, setHonours] = useState<Honour[]>([])
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
    loadHonours()
  }, [])

  const loadHonours = async () => {
    setIsLoading(true)
    const data = await HonourDataService.getHonours()
    const stats = await HonourDataService.getHonourStats()
    setHonours(data)
    setStats(stats)
    setIsLoading(false)
  }

  const handleAddHonour = async () => {
    if (!formData.name.trim()) {
      alert(isBn ? 'সম্মাননার নাম প্রয়োজন' : 'Honour name is required')
      return
    }

    try {
      if (editingId) {
        await HonourDataService.updateHonour(editingId, formData)
      } else {
        await HonourDataService.addHonour(formData)
      }

      await loadHonours()
      resetForm()
    } catch (error) {
      console.error('[v0] Error saving honour:', error)
      alert(isBn ? 'সম্মাননা সংরক্ষণ ব্যর্থ' : 'Failed to save honour')
    }
  }

  const handleDeleteHonour = async (id: string) => {
    if (confirm(isBn ? 'এটি মুছে ফেলতে নিশ্চিত?' : 'Are you sure you want to delete this?')) {
      try {
        await HonourDataService.deleteHonour(id)
        await loadHonours()
      } catch (error) {
        console.error('[v0] Error deleting honour:', error)
        alert(isBn ? 'সম্মাননা মোছা ব্যর্থ' : 'Failed to delete honour')
      }
    }
  }

  const handleToggleFeatured = async (id: string) => {
    try {
      await HonourDataService.toggleFeatured(id)
      await loadHonours()
    } catch (error) {
      console.error('[v0] Error toggling featured:', error)
    }
  }

  const handleEditHonour = (honour: Honour) => {
    setFormData({
      name: honour.name,
      year: honour.year,
      category: honour.category,
      description: honour.description,
      icon: honour.icon,
      runners_up: honour.runners_up || '',
      featured: honour.featured || false,
    })
    setEditingId(honour.id)
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
    <PageEntrance delay={0.2} duration={0.6} variant="fadeInUp">
      <div className="min-h-screen bg-background text-foreground p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-primary hover:text-primary/80 transition mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isBn ? 'ফিরে যান' : 'Back'}</span>
              </button>
              <h1 className="text-4xl font-bold">{isBn ? 'সম্মাননা ব্যবস্থাপনা' : 'Manage Honours'}</h1>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="neo-btn flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold"
            >
              <Plus className="w-5 h-5" />
              <span>{isBn ? 'নতুন সম্মাননা' : 'Add Honour'}</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="neo-card p-6 rounded-2xl text-center">
              <p className="text-foreground/60 text-sm mb-2">{isBn ? 'মোট সম্মাননা' : 'Total Honours'}</p>
              <p className="text-3xl font-bold text-primary">{stats.total}</p>
            </div>
            <div className="neo-card p-6 rounded-2xl text-center">
              <p className="text-foreground/60 text-sm mb-2">{isBn ? 'বৈশিষ্ট্য' : 'Featured'}</p>
              <p className="text-3xl font-bold text-yellow-400">{stats.featured}</p>
            </div>
            <div className="neo-card p-6 rounded-2xl text-center">
              <p className="text-foreground/60 text-sm mb-2">{isBn ? 'লীগ' : 'League'}</p>
              <p className="text-3xl font-bold text-green-400">{stats.byCategory.league}</p>
            </div>
            <div className="neo-card p-6 rounded-2xl text-center">
              <p className="text-foreground/60 text-sm mb-2">{isBn ? 'কাপ' : 'Cup'}</p>
              <p className="text-3xl font-bold text-blue-400">{stats.byCategory.cup}</p>
            </div>
          </div>

          {/* Form */}
          {showForm && (
            <div className="neo-card p-8 rounded-2xl mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{editingId ? (isBn ? 'সম্মাননা সম্পাদনা' : 'Edit Honour') : (isBn ? 'নতুন সম্মাননা যোগ করুন' : 'Add New Honour')}</h2>
                <button onClick={resetForm} className="text-foreground/60 hover:text-foreground">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <input
                  type="text"
                  placeholder={isBn ? 'সম্মাননার নাম' : 'Honour Name'}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="px-4 py-3 bg-secondary/30 border border-secondary/60 rounded-lg focus:outline-none focus:border-primary"
                />
                <input
                  type="number"
                  placeholder={isBn ? 'বছর' : 'Year'}
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="px-4 py-3 bg-secondary/30 border border-secondary/60 rounded-lg focus:outline-none focus:border-primary"
                />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="px-4 py-3 bg-secondary/30 border border-secondary/60 rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="league">{isBn ? 'লীগ' : 'League'}</option>
                  <option value="cup">{isBn ? 'কাপ' : 'Cup'}</option>
                  <option value="championship">{isBn ? 'চ্যাম্পিয়নশিপ' : 'Championship'}</option>
                  <option value="tournament">{isBn ? 'টুর্নামেন্ট' : 'Tournament'}</option>
                </select>
                <input
                  type="text"
                  placeholder={isBn ? 'আইকন (ইমোজি)' : 'Icon (Emoji)'}
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="px-4 py-3 bg-secondary/30 border border-secondary/60 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              <textarea
                placeholder={isBn ? 'বর্ণনা' : 'Description'}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-secondary/30 border border-secondary/60 rounded-lg focus:outline-none focus:border-primary mb-6"
              />

              <input
                type="text"
                placeholder={isBn ? 'রানার-আপ' : 'Runners-up'}
                value={formData.runners_up}
                onChange={(e) => setFormData({ ...formData, runners_up: e.target.value })}
                className="w-full px-4 py-3 bg-secondary/30 border border-secondary/60 rounded-lg focus:outline-none focus:border-primary mb-6"
              />

              <div className="flex items-center gap-4 mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span>{isBn ? 'বৈশিষ্ট্য হিসেবে প্রদর্শন করুন' : 'Show as featured'}</span>
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddHonour}
                  className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
                >
                  {editingId ? (isBn ? 'আপডেট করুন' : 'Update') : (isBn ? 'যোগ করুন' : 'Add')}
                </button>
                <button
                  onClick={resetForm}
                  className="flex-1 bg-secondary/30 text-foreground py-3 rounded-lg font-semibold hover:bg-secondary/60 transition"
                >
                  {isBn ? 'বাতিল করুন' : 'Cancel'}
                </button>
              </div>
            </div>
          )}

          {/* Honours List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {honours.map((honour) => (
                <div key={honour.id} className="neo-card p-6 rounded-2xl group hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{honour.icon}</div>
                    <button
                      onClick={() => handleToggleFeatured(honour.id)}
                      className={`p-2 rounded transition ${honour.featured ? 'bg-yellow-500/20 text-yellow-400' : 'bg-secondary/30 text-foreground/60'}`}
                    >
                      <Star className="w-5 h-5" />
                    </button>
                  </div>

                  <h3 className="text-lg font-bold mb-2">{honour.name}</h3>
                  <p className="text-sm text-foreground/60 mb-4">{honour.year}</p>
                  <p className="text-sm text-foreground/70 mb-4">{honour.description}</p>

                  {honour.runners_up && (
                    <p className="text-xs text-foreground/60 mb-4">
                      {isBn ? 'রানার-আপ: ' : 'Runners-up: '}{honour.runners_up}
                    </p>
                  )}

                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => handleEditHonour(honour)}
                      className="flex-1 bg-primary/20 text-primary py-2 rounded font-semibold hover:bg-primary/40 transition"
                    >
                      {isBn ? 'সম্পাদনা' : 'Edit'}
                    </button>
                    <button
                      onClick={() => handleDeleteHonour(honour.id)}
                      className="flex-1 bg-red-500/20 text-red-400 py-2 rounded font-semibold hover:bg-red-500/40 transition"
                    >
                      {isBn ? 'মুছুন' : 'Delete'}
                    </button>
                  </div>
                  <button
                    onClick={() => router.push(`/admin/honours/${honour.id}/players`)}
                    className="w-full bg-secondary/30 text-foreground py-2 rounded font-semibold hover:bg-secondary/60 transition text-sm"
                  >
                    {isBn ? '✏️ খেলোয়াড় পরিচালনা করুন' : '✏️ Manage Players'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {!isLoading && honours.length === 0 && (
            <div className="text-center py-12">
              <p className="text-foreground/60 text-lg">{isBn ? 'কোনো সম্মাননা নেই' : 'No honours yet'}</p>
            </div>
          )}
        </div>
      </div>
    </PageEntrance>
  )
}
