'use client'

import { useState, useEffect } from 'react'
import { dataStore, NewsletterCampaign } from '@/lib/data-store'
import { useLanguage } from '@/lib/language-context'
import { Plus, Edit2, Trash2, Check, X, AlertCircle, Send, Mail } from 'lucide-react'

export default function NewsletterAdminPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [newsletters, setNewsletters] = useState<NewsletterCampaign[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    content: '',
    recipients: '',
    status: 'draft' as const,
    scheduledFor: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadNewsletters()
  }, [])

  const loadNewsletters = () => {
    try {
      const data = dataStore.getNewsletters()
      setNewsletters(data)
      setLoading(false)
    } catch (err) {
      setError('Failed to load newsletters')
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.subject.trim()) {
      setError('Title and subject are required')
      return
    }

    try {
      const recipientsList = formData.recipients
        .split(',')
        .map(r => r.trim())
        .filter(r => r.length > 0)

      if (editingId) {
        dataStore.updateNewsletter(editingId, {
          title: formData.title,
          subject: formData.subject,
          content: formData.content,
          recipients: recipientsList,
          status: formData.status,
          scheduledFor: formData.scheduledFor || undefined
        })
      } else {
        dataStore.addNewsletter({
          title: formData.title,
          subject: formData.subject,
          content: formData.content,
          recipients: recipientsList,
          status: formData.status,
          scheduledFor: formData.scheduledFor || undefined
        })
      }
      
      setFormData({
        title: '',
        subject: '',
        content: '',
        recipients: '',
        status: 'draft',
        scheduledFor: ''
      })
      setEditingId(null)
      setShowForm(false)
      setError(null)
      loadNewsletters()
    } catch (err) {
      setError('Failed to save newsletter')
    }
  }

  const handleEdit = (newsletter: NewsletterCampaign) => {
    setFormData({
      title: newsletter.title,
      subject: newsletter.subject,
      content: newsletter.content,
      recipients: newsletter.recipients.join(', '),
      status: newsletter.status,
      scheduledFor: newsletter.scheduledFor || ''
    })
    setEditingId(newsletter.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm(isBn ? 'Are you sure?' : 'Are you sure?')) {
      try {
        dataStore.deleteNewsletter(id)
        loadNewsletters()
      } catch (err) {
        setError('Failed to delete newsletter')
      }
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      title: '',
      subject: '',
      content: '',
      recipients: '',
      status: 'draft',
      scheduledFor: ''
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
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Mail className="w-8 h-8 text-blue-400" />
            {isBn ? 'Newsletter Campaigns' : 'Newsletter Campaigns'}
          </h1>
          <p className="text-foreground/60 mt-1">{isBn ? 'Manage email campaigns' : 'Manage email campaigns'}</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            {isBn ? 'New Campaign' : 'New Campaign'}
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
          <h2 className="text-xl font-bold">{editingId ? isBn ? 'Edit Campaign' : 'Edit Campaign' : isBn ? 'New Campaign' : 'New Campaign'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{isBn ? 'Title' : 'Title'} *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent"
                  placeholder={isBn ? 'e.g. Weekly Updates' : 'e.g. Weekly Updates'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{isBn ? 'Subject' : 'Subject'} *</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent"
                  placeholder={isBn ? 'e.g. Important Updates' : 'e.g. Important Updates'}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{isBn ? 'Content' : 'Content'}</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent h-32 resize-none"
                placeholder={isBn ? 'Newsletter content...' : 'Newsletter content...'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{isBn ? 'Recipients (comma-separated)' : 'Recipients (comma-separated)'}</label>
              <textarea
                value={formData.recipients}
                onChange={(e) => setFormData({...formData, recipients: e.target.value})}
                className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent h-24 resize-none font-mono text-xs"
                placeholder={isBn ? 'email1@example.com, email2@example.com' : 'email1@example.com, email2@example.com'}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{isBn ? 'Status' : 'Status'}</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                  className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent"
                >
                  <option value="draft">{isBn ? 'Draft' : 'Draft'}</option>
                  <option value="scheduled">{isBn ? 'Scheduled' : 'Scheduled'}</option>
                  <option value="sent">{isBn ? 'Sent' : 'Sent'}</option>
                </select>
              </div>
              {formData.status === 'scheduled' && (
                <div>
                  <label className="block text-sm font-medium mb-2">{isBn ? 'Schedule For' : 'Schedule For'}</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledFor}
                    onChange={(e) => setFormData({...formData, scheduledFor: e.target.value})}
                    className="w-full bg-secondary border border-secondary text-foreground px-3 py-2 rounded-lg focus:outline-none focus:border-accent"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition"
              >
                <Check className="w-4 h-4" />
                {editingId ? isBn ? 'Update' : 'Update' : isBn ? 'Create' : 'Create'}
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

      {/* Campaigns List */}
      <div className="grid gap-4">
        {newsletters.length === 0 ? (
          <div className="text-center py-12 text-foreground/60">
            <p>{isBn ? 'No campaigns yet' : 'No campaigns yet'}</p>
          </div>
        ) : (
          newsletters.map((newsletter) => (
            <div key={newsletter.id} className="bg-card border-2 border-secondary rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground">{newsletter.title}</h3>
                  <p className="text-foreground/60 mt-1">{newsletter.subject}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      newsletter.status === 'sent' ? 'bg-green-500/20 text-green-300' :
                      newsletter.status === 'scheduled' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-gray-500/20 text-gray-300'
                    }`}>
                      {newsletter.status}
                    </span>
                    <span className="text-xs text-foreground/40">{newsletter.recipients.length} recipients</span>
                    {newsletter.scheduledFor && (
                      <span className="text-xs text-accent">{new Date(newsletter.scheduledFor).toLocaleString()}</span>
                    )}
                  </div>
                  {newsletter.content && (
                    <p className="text-sm text-foreground/60 mt-2 line-clamp-2">{newsletter.content}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(newsletter)}
                    className="p-2 hover:bg-secondary rounded-lg transition text-blue-400 hover:text-blue-300"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(newsletter.id)}
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
