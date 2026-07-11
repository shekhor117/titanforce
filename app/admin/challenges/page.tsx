'use client'

import { useState, useEffect } from 'react'
import { dataStore, Challenge } from '@/lib/data-store'
import { useLanguage } from '@/lib/language-context'
import { Plus, Edit2, Trash2, Check, X, AlertCircle } from 'lucide-react'

export default function ChallengesAdminPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    targetValue: 0,
    currentValue: 0,
    deadline: '',
    status: 'active' as 'active' | 'completed' | 'upcoming',
    category: 'team' as 'team' | 'player' | 'milestone',
    reward: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadChallenges()
  }, [])

  const loadChallenges = () => {
    try {
      const data = dataStore.getChallenges()
      setChallenges(data)
      setLoading(false)
    } catch (err) {
      setError('Failed to load challenges')
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      setError('Title is required')
      return
    }

    try {
      if (editingId) {
        dataStore.updateChallenge(editingId, {
          title: formData.title,
          description: formData.description,
          icon: formData.icon,
          targetValue: formData.targetValue ? parseInt(formData.targetValue) : undefined,
          currentValue: formData.currentValue ? parseInt(formData.currentValue) : undefined,
          deadline: formData.deadline || undefined,
          status: formData.status,
          category: formData.category,
          reward: formData.reward
        })
      } else {
        dataStore.addChallenge({
          title: formData.title,
          description: formData.description,
          icon: formData.icon,
          targetValue: formData.targetValue ? parseInt(formData.targetValue) : undefined,
          currentValue: formData.currentValue ? parseInt(formData.currentValue) : undefined,
          deadline: formData.deadline || undefined,
          status: formData.status,
          category: formData.category,
          reward: formData.reward
        })
      }
      
      setFormData({
        title: '',
        description: '',
        icon: '',
        targetValue: '',
        currentValue: '',
        deadline: '',
        status: 'active',
        category: 'team',
        reward: ''
      })
      setEditingId(null)
      setShowForm(false)
      setError(null)
      loadChallenges()
    } catch (err) {
      setError('Failed to save challenge')
    }
  }

  const handleEdit = (challenge: Challenge) => {
    setFormData({
      title: challenge.title,
      description: challenge.description,
      icon: challenge.icon || '',
      targetValue: challenge.targetValue?.toString() || '',
      currentValue: challenge.currentValue?.toString() || '',
      deadline: challenge.deadline || '',
      status: challenge.status,
      category: challenge.category,
      reward: challenge.reward || ''
    })
    setEditingId(challenge.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm(isBn ? 'Are you sure?' : 'Are you sure?')) {
      try {
        dataStore.deleteChallenge(id)
        loadChallenges()
      } catch (err) {
        setError('Failed to delete challenge')
      }
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      title: '',
      description: '',
      icon: '',
      targetValue: '',
      currentValue: '',
      deadline: '',
      status: 'active',
      category: 'team',
      reward: ''
    })
  }

  if (loading) {
    return <div className="p-6 text-center">{isBn ? 'Loading...' : 'Loading...'}</div>
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{isBn ? 'Challenges' : 'Challenges'}</h1>
          <p className="text-foreground/60 mt-1">{isBn ? 'Manage team challenges and goals' : 'Manage team challenges and goals'}</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            {isBn ? 'Add Challenge' : 'Add Challenge'}
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

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-card border-2 border-secondary rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold">{editingId ? isBn ? 'Edit Challenge' : 'Edit Challenge' : isBn ? 'Add Challenge' : 'Add Challenge'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{isBn ? 'Title' : 'Title'} *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent"
                  placeholder={isBn ? 'e.g. Score 10 Goals' : 'e.g. Score 10 Goals'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{isBn ? 'Category' : 'Category'}</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                  className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent"
                >
                  <option value="team">{isBn ? 'Team' : 'Team'}</option>
                  <option value="player">{isBn ? 'Player' : 'Player'}</option>
                  <option value="milestone">{isBn ? 'Milestone' : 'Milestone'}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{isBn ? 'Description' : 'Description'}</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent h-24 resize-none"
                placeholder={isBn ? 'Challenge details...' : 'Challenge details...'}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{isBn ? 'Target Value' : 'Target Value'}</label>
                <input
                  type="number"
                  value={formData.targetValue}
                  onChange={(e) => setFormData({...formData, targetValue: e.target.value})}
                  className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{isBn ? 'Current Value' : 'Current Value'}</label>
                <input
                  type="number"
                  value={formData.currentValue}
                  onChange={(e) => setFormData({...formData, currentValue: e.target.value})}
                  className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{isBn ? 'Deadline' : 'Deadline'}</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{isBn ? 'Status' : 'Status'}</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                  className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent"
                >
                  <option value="active">{isBn ? 'Active' : 'Active'}</option>
                  <option value="completed">{isBn ? 'Completed' : 'Completed'}</option>
                  <option value="upcoming">{isBn ? 'Upcoming' : 'Upcoming'}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{isBn ? 'Reward' : 'Reward'}</label>
                <input
                  type="text"
                  value={formData.reward}
                  onChange={(e) => setFormData({...formData, reward: e.target.value})}
                  className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent"
                  placeholder={isBn ? 'e.g. Trophy, Medal' : 'e.g. Trophy, Medal'}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition"
              >
                <Check className="w-4 h-4" />
                {editingId ? isBn ? 'Update' : 'Update' : isBn ? 'Add' : 'Add'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-secondary hover:bg-secondary/80 text-foreground px-6 py-2 rounded-lg flex items-center gap-2 transition"
              >
                <X className="w-4 h-4" />
                {isBn ? 'Cancel' : 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Challenges List */}
      <div className="grid gap-4">
        {challenges.length === 0 ? (
          <div className="text-center py-12 text-foreground/60">
            <p>{isBn ? 'No challenges yet' : 'No challenges yet'}</p>
          </div>
        ) : (
          challenges.map((challenge) => (
            <div key={challenge.id} className="bg-card border-2 border-secondary rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground">{challenge.title}</h3>
                  <p className="text-foreground/60 mt-1">{challenge.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      challenge.status === 'active' ? 'bg-green-500/20 text-green-300' :
                      challenge.status === 'completed' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {challenge.status}
                    </span>
                    <span className="text-xs text-foreground/40">{challenge.category}</span>
                    {challenge.targetValue && (
                      <span className="text-sm text-accent">{challenge.currentValue || 0} / {challenge.targetValue}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(challenge)}
                    className="p-2 hover:bg-secondary rounded-lg transition text-blue-400 hover:text-blue-300"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(challenge.id)}
                    className="p-2 hover:bg-secondary rounded-lg transition text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
