import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Plus, 
  X, 
  MapPin, 
  User, 
  Clock, 
  Play, 
  Square, 
  Check, 
  Trash2, 
  PlusCircle, 
  Goal, 
  Activity, 
  Award, 
  Users,
  Shield, 
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { Fixture, FixtureStatus, FixtureEvent, Player, FixtureEventType } from '../types';

interface FixtureManagerProps {
  fixtures: Fixture[];
  players: Player[];
  onAddFixture: (fixture: Fixture) => void;
  onUpdateFixture: (fixture: Fixture) => void;
  onDeleteFixture: (fixtureId: string) => void;
}

const INITIAL_FIXTURE_FORM = {
  id: '',
  homeTeam: '',
  awayTeam: '',
  homeLogoColor: 'bg-emerald-600',
  awayLogoColor: 'bg-indigo-600',
  homeScore: 0,
  awayScore: 0,
  date: '',
  time: '',
  status: 'Upcoming' as FixtureStatus,
  referee: '',
  stadium: '',
  events: [] as FixtureEvent[]
};

export default function FixtureManager({
  fixtures,
  players,
  onAddFixture,
  onUpdateFixture,
  onDeleteFixture
}: FixtureManagerProps) {
  // Query filters
  const [filter, setFilter] = useState<string>('ALL');

  // Form setups
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FIXTURE_FORM);
  const [formError, setFormError] = useState('');

  // Event Adding State for a specific Live match
  const [activeLiveEventFixtureId, setActiveLiveEventFixtureId] = useState<string | null>(null);
  const [eventFormData, setEventFormData] = useState({
    type: 'goal' as FixtureEventType,
    minute: 45,
    team: 'home' as 'home' | 'away',
    playerName: '',
    assistantName: ''
  });

  // Filter fixtures logic
  const filteredFixtures = fixtures.filter(f => {
    if (filter === 'ALL') return true;
    return f.status === filter;
  });

  const handleOpenAddFixture = () => {
    setFormData({
      ...INITIAL_FIXTURE_FORM,
      id: 'f_' + Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      time: '19:45'
    });
    setFormError('');
    setIsFormOpen(true);
  };

  const handleSaveFixture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.homeTeam.trim() || !formData.awayTeam.trim()) {
      setFormError('Both Home and Away team names are required.');
      return;
    }
    if (formData.homeTeam === formData.awayTeam) {
      setFormError('A team cannot play against itself.');
      return;
    }
    if (!formData.stadium.trim()) {
      setFormError('Stadium/Venue is required.');
      return;
    }
    if (!formData.date || !formData.time) {
      setFormError('Date and time are required.');
      return;
    }

    onAddFixture(formData as Fixture);
    setIsFormOpen(false);
  };

  const changeMatchStatus = (fixture: Fixture, newStatus: FixtureStatus) => {
    const updated: Fixture = {
      ...fixture,
      status: newStatus,
      // Default live scores if they were undefined
      homeScore: newStatus !== 'Upcoming' ? (fixture.homeScore ?? 0) : undefined,
      awayScore: newStatus !== 'Upcoming' ? (fixture.awayScore ?? 0) : undefined
    };
    onUpdateFixture(updated);
  };

  const handleOpenAddEvent = (fixtureId: string) => {
    setActiveLiveEventFixtureId(fixtureId);
    setEventFormData({
      type: 'goal',
      minute: 45,
      team: 'home',
      playerName: players[0]?.name || '',
      assistantName: ''
    });
  };

  const submitLiveMatchEvent = (fixture: Fixture) => {
    if (!eventFormData.playerName.trim()) {
      alert('Event action requires a player name.');
      return;
    }

    const newEvent: FixtureEvent = {
      id: 'e_' + Date.now().toString(),
      type: eventFormData.type,
      minute: eventFormData.minute,
      team: eventFormData.team,
      playerName: eventFormData.playerName,
      assistantName: eventFormData.type === 'goal' && eventFormData.assistantName.trim() 
        ? eventFormData.assistantName 
        : undefined
    };

    // Calculate score change
    let hScore = fixture.homeScore ?? 0;
    let aScore = fixture.awayScore ?? 0;

    if (eventFormData.type === 'goal') {
      if (eventFormData.team === 'home') hScore += 1;
      else aScore += 1;
    } else if (eventFormData.type === 'own-goal') {
      // Own goal goes to the OPPOSITE team score!
      if (eventFormData.team === 'home') aScore += 1; // home player scores OG -> away scores +1
      else hScore += 1;
    }

    const updatedFixture: Fixture = {
      ...fixture,
      homeScore: hScore,
      awayScore: aScore,
      events: [...(fixture.events || []), newEvent]
    };

    onUpdateFixture(updatedFixture);
    setActiveLiveEventFixtureId(null);
  };

  const handleDeleteEvent = (fixture: Fixture, eventId: string) => {
    const eventToDelete = fixture.events.find(e => e.id === eventId);
    let hScore = fixture.homeScore ?? 0;
    let aScore = fixture.awayScore ?? 0;

    if (eventToDelete && eventToDelete.type === 'goal') {
      if (eventToDelete.team === 'home') hScore = Math.max(0, hScore - 1);
      else aScore = Math.max(0, aScore - 1);
    } else if (eventToDelete && eventToDelete.type === 'own-goal') {
      if (eventToDelete.team === 'home') aScore = Math.max(0, aScore - 1);
      else hScore = Math.max(0, hScore - 1);
    }

    const updated: Fixture = {
      ...fixture,
      homeScore: hScore,
      awayScore: aScore,
      events: fixture.events.filter(e => e.id !== eventId)
    };

    onUpdateFixture(updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Filters and Schedule Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        
        {/* State filters */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850 self-start md:self-auto">
          {['ALL', 'Upcoming', 'Live', 'Finished'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === st
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <button
          onClick={handleOpenAddFixture}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-[98%] flex items-center justify-center gap-2 cursor-pointer"
        >
          <Calendar className="w-4 h-4" /> Schedule New Match
        </button>
      </div>

      {/* Main Fixtures List */}
      <div className="space-y-4">
        {filteredFixtures.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center space-y-3">
            <span className="w-12 h-12 rounded-full border border-slate-850 bg-slate-950/40 text-slate-600 flex items-center justify-center mx-auto text-xl">
              ⚽
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-300">No fixtures matches listed</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                No games match your selected filters. Create a new league match above to populate the agenda.
              </p>
            </div>
          </div>
        ) : (
          filteredFixtures.map((fixture) => (
            <div 
              key={fixture.id}
              className={`bg-slate-900 border rounded-xl overflow-hidden shadow-sm transition-colors ${
                fixture.status === 'Live' ? 'border-rose-900/60 bg-gradient-to-br from-slate-900 to-rose-950/10' : 'border-slate-800'
              }`}
            >
              {/* Fixture Info bar */}
              <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-950/40 flex justify-between items-center text-xs">
                <div className="flex items-center gap-4 text-slate-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-500" /> {fixture.date} @ {fixture.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" /> {fixture.stadium}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-mono">Ref: {fixture.referee}</span>
                  {fixture.status === 'Upcoming' && <span className="bg-blue-900/30 text-blue-400 border border-blue-900/20 rounded px-2 py-0.5 font-mono font-semibold text-[10px]">UPCOMING</span>}
                  {fixture.status === 'Live' && <span className="bg-rose-950 text-rose-400 border border-rose-900 rounded px-2 py-0.5 font-mono font-bold text-[10px] animate-pulse">LIVE NOW</span>}
                  {fixture.status === 'Finished' && <span className="bg-slate-800 text-slate-300 border border-slate-700 rounded px-2 py-0.5 font-mono font-semibold text-[10px]">FINISHED</span>}
                </div>
              </div>

              {/* Scoreboard Block */}
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* Score panel */}
                <div className="flex-1 grid grid-cols-3 items-center gap-3">
                  {/* Home Team */}
                  <div className="flex items-center justify-end gap-3.5">
                    <span className="text-xs md:text-sm font-bold text-slate-200 text-right truncate">
                      {fixture.homeTeam}
                    </span>
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white flex-shrink-0 ${fixture.homeLogoColor}`}>
                      {fixture.homeTeam.substring(0,2).toUpperCase()}
                    </span>
                  </div>

                  {/* Score Number Display */}
                  <div className="flex justify-center">
                    {fixture.status === 'Upcoming' ? (
                      <span className="text-xs font-mono font-bold text-slate-500 bg-slate-950 border border-slate-850 px-3 py-1 rounded">
                        VS
                      </span>
                    ) : (
                      <div className="flex items-center gap-2 text-2xl font-black font-mono text-white tracking-widest bg-slate-950/80 px-4 py-1.5 rounded-xl border border-slate-850/80">
                        <span>{fixture.homeScore ?? 0}</span>
                        <span className="text-slate-600">:</span>
                        <span>{fixture.awayScore ?? 0}</span>
                      </div>
                    )}
                  </div>

                  {/* Away Team */}
                  <div className="flex items-center justify-start gap-3.5">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white flex-shrink-0 ${fixture.awayLogoColor}`}>
                      {fixture.awayTeam.substring(0,2).toUpperCase()}
                    </span>
                    <span className="text-xs md:text-sm font-bold text-slate-200 text-left truncate">
                      {fixture.awayTeam}
                    </span>
                  </div>
                </div>

                {/* Match actions console */}
                <div className="flex flex-wrap md:flex-nowrap gap-2 justify-center md:border-l md:border-slate-800/80 md:pl-5">
                  {fixture.status === 'Upcoming' && (
                    <button
                      onClick={() => changeMatchStatus(fixture, 'Live')}
                      className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow active:scale-95 transition-all cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Kick-Off
                    </button>
                  )}

                  {fixture.status === 'Live' && (
                    <>
                      <button
                        onClick={() => handleOpenAddEvent(fixture.id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 shadow active:scale-95 transition-all cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" /> Log Event
                      </button>
                      <button
                        onClick={() => changeMatchStatus(fixture, 'Finished')}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 shadow active:scale-95 transition-all cursor-pointer"
                      >
                        <Square className="w-3.5 h-3.5 fill-current" /> Full-Time
                      </button>
                    </>
                  )}

                  {fixture.status === 'Finished' && (
                    <button
                      onClick={() => changeMatchStatus(fixture, 'Live')}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs py-2 px-3 rounded-lg border border-slate-700 active:scale-95 transition-all cursor-pointer"
                    >
                      Re-open Live
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (confirm('Delete this fixture permanently?')) {
                        onDeleteFixture(fixture.id);
                      }
                    }}
                    className="p-2 hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 rounded-lg border border-slate-800 hover:border-rose-900/20 flex items-center justify-center transition-all cursor-pointer"
                    title="Delete Fixture"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>

              {/* Event timeline timeline (only draw if finished or live with events) */}
              {fixture.events && fixture.events.length > 0 && (
                <div className="px-5 py-3 border-t border-slate-850 bg-slate-950/20 space-y-2">
                  <span className="text-[10px] font-mono font-semibold text-slate-500 tracking-wider">CHRONOLOGICAL PROTOCOLS</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {fixture.events.map((event) => (
                      <div 
                        key={event.id}
                        className="flex items-center justify-between text-xs text-slate-300 bg-slate-950/45 p-2 rounded-lg border border-slate-850"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] bg-indigo-950/40 text-indigo-400 px-1.5 py-0.5 border border-indigo-900/40 rounded">
                            {event.minute}&apos;
                          </span>
                          <span className="font-semibold text-slate-200">{event.playerName}</span>
                          <span className="text-slate-500 font-mono text-[10px]">({event.team === 'home' ? 'Home' : 'Away'})</span>
                          {event.assistantName && <span className="text-[10px] text-slate-500">A: {event.assistantName}</span>}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-500 font-mono uppercase bg-slate-900 px-2 py-0.5 border border-slate-800/80 rounded">
                            {event.type}
                          </span>
                          <button
                            onClick={() => handleDeleteEvent(fixture, event.id)}
                            className="p-1 hover:bg-rose-950/45 text-slate-500 hover:text-rose-400 rounded"
                            title="Remove event"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Event Adding Drawer Drawer */}
              <AnimatePresence>
                {activeLiveEventFixtureId === fixture.id && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-5 border-t border-slate-850 bg-slate-950/50 space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                        <Activity className="w-4 h-4 animate-pulse" /> Register New Game Protocol
                      </h4>
                      <button 
                        onClick={() => setActiveLiveEventFixtureId(null)}
                        className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs text-slate-300">
                      
                      {/* Event Type */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-500 uppercase">Trigger Event</label>
                        <select
                          value={eventFormData.type}
                          onChange={e => setEventFormData(prev => ({ ...prev, type: e.target.value as FixtureEventType }))}
                          className="w-full bg-slate-900 border border-slate-800 outline-none p-2 rounded-lg text-slate-200"
                        >
                          <option value="goal">⚽ Goal Scored</option>
                          <option value="yellow">🟨 Yellow Card</option>
                          <option value="red">🟥 Red Card</option>
                          <option value="own-goal">⚽ Own Goal (OG)</option>
                          <option value="penalty">🥅 Penalty Goal</option>
                        </select>
                      </div>

                      {/* Team Side */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-500 uppercase">Scoring Side</label>
                        <select
                          value={eventFormData.team}
                          onChange={e => setEventFormData(prev => ({ ...prev, team: e.target.value as 'home' | 'away' }))}
                          className="w-full bg-slate-900 border border-slate-800 outline-none p-2 rounded-lg text-slate-200"
                        >
                          <option value="home">Home ({fixture.homeTeam})</option>
                          <option value="away">Away ({fixture.awayTeam})</option>
                        </select>
                      </div>

                      {/* Scorer Player select (if home team is our team we can pick from roster, or type if any) */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-500 uppercase">Performer Name</label>
                        {eventFormData.team === 'home' && fixture.homeTeam === 'Apex United FC' ? (
                          <select
                            value={eventFormData.playerName}
                            onChange={e => setEventFormData(prev => ({ ...prev, playerName: e.target.value }))}
                            className="w-full bg-slate-900 border border-slate-800 outline-none p-2 rounded-lg text-slate-200"
                          >
                            {players.map(p => (
                              <option key={p.id} value={p.name}>{p.name} (#{p.number})</option>
                            ))}
                          </select>
                        ) : eventFormData.team === 'away' && fixture.awayTeam === 'Apex United FC' ? (
                          <select
                            value={eventFormData.playerName}
                            onChange={e => setEventFormData(prev => ({ ...prev, playerName: e.target.value }))}
                            className="w-full bg-slate-900 border border-slate-800 outline-none p-2 rounded-lg text-slate-200"
                          >
                            {players.map(p => (
                              <option key={p.id} value={p.name}>{p.name} (#{p.number})</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={eventFormData.playerName}
                            onChange={e => setEventFormData(prev => ({ ...prev, playerName: e.target.value }))}
                            placeholder="Type player name"
                            className="w-full bg-slate-900 border border-slate-800 outline-none p-2 rounded-lg text-slate-200"
                          />
                        )}
                      </div>

                      {/* Assist/Minute */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-500 uppercase">Minute (1-120)</label>
                          <input
                            type="number"
                            min="1"
                            max="120"
                            value={eventFormData.minute}
                            onChange={e => setEventFormData(prev => ({ ...prev, minute: parseInt(e.target.value) || 45 }))}
                            className="w-full bg-slate-900 border border-slate-800 outline-none p-2 rounded-lg text-slate-200 text-center font-mono"
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => submitLiveMatchEvent(fixture)}
                            className="w-full bg-rose-600 hover:bg-rose-500 font-bold p-2 text-xs rounded-lg text-white font-sans text-center transition-all cursor-pointer shadow"
                          >
                            Submit
                          </button>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          ))
        )}
      </div>

      {/* Roster Add / Edit Modal Drawer */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-5 border-b border-slate-800 bg-slate-950/40 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Calendar className="w-5 h-5" />
                  </span>
                  <h3 className="text-sm font-bold text-white uppercase font-sans">
                    Schedule League Fixture
                  </h3>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveFixture} className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
                
                {formError && (
                  <div className="p-3.5 bg-rose-950/60 text-xs text-rose-400 font-medium rounded-xl border border-rose-900/50 flex items-center gap-2 flex-shrink-0">
                    <AlertTriangle className="w-4.5 h-4.5" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Team selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Home Side Name</label>
                    <input
                      type="text"
                      required
                      value={formData.homeTeam}
                      onChange={e => setFormData(prev => ({ ...prev, homeTeam: e.target.value }))}
                      placeholder="e.g. Apex United FC"
                      className="w-full bg-slate-950 border border-slate-800 outline-none focus:border-slate-700 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl font-sans"
                    />
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-500">Color badge:</span>
                      <select 
                        value={formData.homeLogoColor}
                        onChange={e => setFormData(prev => ({ ...prev, homeLogoColor: e.target.value }))}
                        className="text-[10px] bg-transparent border-none text-slate-400 focus:outline-none"
                      >
                        <option value="bg-emerald-600">Emerald Green</option>
                        <option value="bg-indigo-600">Indigo Blue</option>
                        <option value="bg-rose-600">Rose Red</option>
                        <option value="bg-amber-500">Amber Yellow</option>
                        <option value="bg-sky-500">Sky Blue</option>
                        <option value="bg-slate-600">Slate Gray</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Away Side Name</label>
                    <input
                      type="text"
                      required
                      value={formData.awayTeam}
                      onChange={e => setFormData(prev => ({ ...prev, awayTeam: e.target.value }))}
                      placeholder="e.g. Red Devils"
                      className="w-full bg-slate-950 border border-slate-800 outline-none focus:border-slate-700 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl font-sans"
                    />
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-500">Color badge:</span>
                      <select 
                        value={formData.awayLogoColor}
                        onChange={e => setFormData(prev => ({ ...prev, awayLogoColor: e.target.value }))}
                        className="text-[10px] bg-transparent border-none text-slate-400 focus:outline-none"
                      >
                        <option value="bg-indigo-600">Indigo Blue</option>
                        <option value="bg-emerald-600">Emerald Green</option>
                        <option value="bg-rose-600">Rose Red</option>
                        <option value="bg-amber-500">Amber Yellow</option>
                        <option value="bg-sky-500">Sky Blue</option>
                        <option value="bg-slate-600">Slate Gray</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Date & Time venue info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Stadium Venue</label>
                    <input
                      type="text"
                      required
                      value={formData.stadium}
                      onChange={e => setFormData(prev => ({ ...prev, stadium: e.target.value }))}
                      placeholder="e.g. Apex Arena"
                      className="w-full bg-slate-950 border border-slate-800 outline-none focus:border-slate-700 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Fixture Date</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 outline-none focus:border-slate-700 text-slate-200 text-xs px-2.5 py-2.5 rounded-xl font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Kick-off Time</label>
                    <input
                      type="time"
                      required
                      value={formData.time}
                      onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 outline-none focus:border-slate-700 text-slate-200 text-xs px-2.5 py-2.5 rounded-xl font-mono"
                    />
                  </div>
                </div>

                {/* Referee */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Match Referee Appointment</label>
                  <input
                    type="text"
                    required
                    value={formData.referee}
                    onChange={e => setFormData(prev => ({ ...prev, referee: e.target.value }))}
                    placeholder="e.g. Michael Oliver"
                    className="w-full bg-slate-950 border border-slate-800 outline-none focus:border-slate-700 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl"
                  />
                </div>

                {/* Actions Panel */}
                <div className="pt-5 border-t border-slate-800 flex justify-end gap-3 flex-shrink-0 font-sans">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 bg-slate-950/40 border border-slate-800 hover:bg-slate-800 hover:text-white rounded-xl text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" /> Save League Match
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
