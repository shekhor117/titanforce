'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { uploadMedia, generateSlug } from '@/lib/services/media-service'
import * as eventService from '@/lib/services/event-service'
import { Plus, Trash2, Edit2, Save, X, Calendar } from 'lucide-react'

export function EventManager() {
  const [events, setEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentEvent, setCurrentEvent] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    event_type: 'match' as const,
    start_date: '',
    end_date: '',
    location: '',
    featured_image_url: '',
    featured_image_alt: '',
    status: 'draft' as const,
    opponent_name: '',
    match_time: '',
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEvents()
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  const loadEvents = async () => {
    setIsLoading(true)
    try {
      const result = await eventService.getEvents(1, 10, { upcoming: true })
      setEvents(result.events)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      if (!formData.title || !formData.slug || !formData.start_date) {
        setError('Title, slug, and start date are required')
        return
      }

      if (currentEvent) {
        const updated = await eventService.updateEvent(currentEvent.id, formData)
        setEvents(events.map((e) => (e.id === currentEvent.id ? updated : e)))
        setSuccess('Event updated')
      } else {
        const newEvent = await eventService.createEvent(formData)
        setEvents([...events, newEvent])
        setSuccess('Event created')
      }

      resetForm()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save event')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return
    try {
      await eventService.deleteEvent(id)
      setEvents(events.filter((e) => e.id !== id))
      setSuccess('Event deleted')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event')
    }
  }

  const handleEdit = (event: any) => {
    setCurrentEvent(event)
    setFormData({
      title: event.title,
      slug: event.slug,
      description: event.description || '',
      event_type: event.event_type,
      start_date: event.start_date?.split('T')[0] || '',
      end_date: event.end_date?.split('T')[0] || '',
      location: event.location || '',
      featured_image_url: event.featured_image_url || '',
      featured_image_alt: event.featured_image_alt || '',
      status: event.status,
      opponent_name: event.opponent_name || '',
      match_time: event.match_time || '',
    })
    setIsEditing(true)
  }

  const resetForm = () => {
    setIsEditing(false)
    setCurrentEvent(null)
    setFormData({
      title: '',
      slug: '',
      description: '',
      event_type: 'match',
      start_date: '',
      end_date: '',
      location: '',
      featured_image_url: '',
      featured_image_alt: '',
      status: 'draft',
      opponent_name: '',
      match_time: '',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Events & Matches</h2>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Event
          </Button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {success}
        </div>
      )}

      {isEditing ? (
        <div className="bg-white border rounded-lg p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {currentEvent ? 'Edit Event' : 'Create Event'}
            </h3>
            <button onClick={resetForm}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Event title"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })
              }}
              className="px-3 py-2 border rounded-lg"
            />
            <select
              value={formData.event_type}
              onChange={(e) => setFormData({ ...formData, event_type: e.target.value as any })}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="match">Match</option>
              <option value="tournament">Tournament</option>
              <option value="training">Training</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          {formData.event_type === 'match' && (
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Opponent name"
                value={formData.opponent_name}
                onChange={(e) => setFormData({ ...formData, opponent_name: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              />
              <input
                type="time"
                value={formData.match_time}
                onChange={(e) => setFormData({ ...formData, match_time: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              placeholder="Event location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              rows={4}
            />
          </div>

          <div className="flex justify-between items-center border-t pt-4">
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="cancelled">Cancelled</option>
              <option value="archived">Archived</option>
            </select>

            <div className="flex gap-2">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" />
                Save Event
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : events.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No events found</div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-sm"
              >
                <div className="flex-1 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(event.start_date).toLocaleDateString()} · {event.event_type}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(event)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(event.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
