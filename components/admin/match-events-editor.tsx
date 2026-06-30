'use client'

import { useState } from 'react'
import { Plus, X, Goal, AlertCircle, Repeat2 } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

interface Goal {
  player: string
  minute: number
  assist?: string
}

interface Event {
  type: 'goal' | 'card' | 'substitution' | 'var'
  minute: number
  team: 'home' | 'away'
  player: string
  card_color?: 'yellow' | 'red'
  assist?: string
  substitution_in?: string
  details?: string
}

interface MatchEventsEditorProps {
  goals: Goal[]
  events: Event[]
  homeTeam: string
  awayTeam: string
  onSave: (goals: Goal[], events: Event[]) => void
}

export function MatchEventsEditor({ goals, events, homeTeam, awayTeam, onSave }: MatchEventsEditorProps) {
  const { isBn } = useLanguage()
  const [localGoals, setLocalGoals] = useState<Goal[]>(goals || [])
  const [localEvents, setLocalEvents] = useState<Event[]>(events || [])
  const [newGoal, setNewGoal] = useState<Goal>({ player: '', minute: 0 })
  const [newEvent, setNewEvent] = useState<Event>({ type: 'card', minute: 0, team: 'home', player: '', card_color: 'yellow' })

  const addGoal = () => {
    if (newGoal.player.trim() && newGoal.minute > 0) {
      setLocalGoals([...localGoals, newGoal])
      setNewGoal({ player: '', minute: 0 })
    }
  }

  const addEvent = () => {
    if (newEvent.player.trim() && newEvent.minute >= 0) {
      setLocalEvents([...localEvents, newEvent])
      setNewEvent({ type: 'card', minute: 0, team: 'home', player: '', card_color: 'yellow' })
    }
  }

  const removeGoal = (idx: number) => {
    setLocalGoals(localGoals.filter((_, i) => i !== idx))
  }

  const removeEvent = (idx: number) => {
    setLocalEvents(localEvents.filter((_, i) => i !== idx))
  }

  return (
    <div className="space-y-6">
      {/* Goals Section */}
      <div className="space-y-3">
        <h3 className={`text-sm font-semibold text-primary uppercase ${isBn ? 'font-bengali' : ''}`}>
          {isBn ? 'গোল' : 'Goals'}
        </h3>

        <div className="space-y-2">
          {localGoals.map((goal, idx) => (
            <div key={idx} className="flex gap-2 items-center p-3 bg-secondary/30 rounded">
              <Goal className="w-4 h-4 text-primary" />
              <span className="flex-1 text-sm">{goal.player}</span>
              <span className="text-xs text-foreground/60">{goal.minute}'</span>
              {goal.assist && <span className="text-xs text-foreground/60">A: {goal.assist}</span>}
              <button onClick={() => removeGoal(idx)} className="p-1 hover:bg-destructive/20 rounded text-destructive">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="p-3 rounded border border-foreground/10 space-y-2">
          <input
            type="text"
            value={newGoal.player}
            onChange={(e) => setNewGoal({ ...newGoal, player: e.target.value })}
            placeholder={isBn ? 'খেলোয়াড়' : 'Player'}
            className="w-full px-3 py-2 rounded bg-secondary border border-foreground/10 text-sm"
          />
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              max="120"
              value={newGoal.minute}
              onChange={(e) => setNewGoal({ ...newGoal, minute: parseInt(e.target.value) })}
              placeholder={isBn ? 'মিনিট' : 'Minute'}
              className="w-20 px-3 py-2 rounded bg-secondary border border-foreground/10 text-sm"
            />
            <input
              type="text"
              value={newGoal.assist || ''}
              onChange={(e) => setNewGoal({ ...newGoal, assist: e.target.value })}
              placeholder={isBn ? 'সহায়তা (ঐচ্ছিক)' : 'Assist (optional)'}
              className="flex-1 px-3 py-2 rounded bg-secondary border border-foreground/10 text-sm"
            />
            <button
              onClick={addGoal}
              className="px-4 py-2 rounded bg-primary text-primary-foreground font-semibold hover:opacity-90"
            >
              {isBn ? 'যোগ করুন' : 'Add'}
            </button>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div className="space-y-3">
        <h3 className={`text-sm font-semibold text-primary uppercase ${isBn ? 'font-bengali' : ''}`}>
          {isBn ? 'ঘটনা' : 'Events'}
        </h3>

        <div className="space-y-2">
          {localEvents.map((event, idx) => (
            <div key={idx} className="flex gap-2 items-center p-3 bg-secondary/30 rounded text-sm">
              {event.type === 'card' && (
                <div className={`w-4 h-4 rounded ${event.card_color === 'red' ? 'bg-red-600' : 'bg-yellow-500'}`} />
              )}
              {event.type === 'substitution' && <Repeat2 className="w-4 h-4 text-blue-500" />}
              {event.type === 'var' && <AlertCircle className="w-4 h-4 text-orange-500" />}
              <span className="flex-1">{event.player}</span>
              <span className="text-xs text-foreground/60">{event.minute}'</span>
              <span className={`text-xs px-2 py-1 rounded ${event.team === 'home' ? 'bg-emerald-600/20 text-emerald-600' : 'bg-indigo-600/20 text-indigo-600'}`}>
                {event.team === 'home' ? homeTeam : awayTeam}
              </span>
              <button onClick={() => removeEvent(idx)} className="p-1 hover:bg-destructive/20 rounded text-destructive">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="p-3 rounded border border-foreground/10 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <select
              value={newEvent.type}
              onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
              className="px-3 py-2 rounded bg-secondary border border-foreground/10 text-sm"
            >
              <option value="card">{isBn ? 'কার্ড' : 'Card'}</option>
              <option value="goal">{isBn ? 'গোল' : 'Goal'}</option>
              <option value="substitution">{isBn ? 'প্রতিস্থাপন' : 'Substitution'}</option>
              <option value="var">{isBn ? 'ভার' : 'VAR'}</option>
            </select>
            <select
              value={newEvent.team}
              onChange={(e) => setNewEvent({ ...newEvent, team: e.target.value as 'home' | 'away' })}
              className="px-3 py-2 rounded bg-secondary border border-foreground/10 text-sm"
            >
              <option value="home">{homeTeam}</option>
              <option value="away">{awayTeam}</option>
            </select>
          </div>
          <input
            type="text"
            value={newEvent.player}
            onChange={(e) => setNewEvent({ ...newEvent, player: e.target.value })}
            placeholder={isBn ? 'খেলোয়াড়' : 'Player'}
            className="w-full px-3 py-2 rounded bg-secondary border border-foreground/10 text-sm"
          />
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              max="120"
              value={newEvent.minute}
              onChange={(e) => setNewEvent({ ...newEvent, minute: parseInt(e.target.value) })}
              placeholder={isBn ? 'মিনিট' : 'Minute'}
              className="w-20 px-3 py-2 rounded bg-secondary border border-foreground/10 text-sm"
            />
            {newEvent.type === 'card' && (
              <select
                value={newEvent.card_color}
                onChange={(e) => setNewEvent({ ...newEvent, card_color: e.target.value as 'yellow' | 'red' })}
                className="flex-1 px-3 py-2 rounded bg-secondary border border-foreground/10 text-sm"
              >
                <option value="yellow">{isBn ? 'হলুদ' : 'Yellow'}</option>
                <option value="red">{isBn ? 'লাল' : 'Red'}</option>
              </select>
            )}
            <button
              onClick={addEvent}
              className="px-4 py-2 rounded bg-primary text-primary-foreground font-semibold hover:opacity-90"
            >
              {isBn ? 'যোগ করুন' : 'Add'}
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => onSave(localGoals, localEvents)}
        className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
      >
        {isBn ? 'সংরক্ষণ করুন' : 'Save Events'}
      </button>
    </div>
  )
}
