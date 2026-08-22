import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Search, 
  Trash2, 
  Edit2, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Minus, 
  X, 
  User, 
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Award,
  ArrowLeft,
  Heart,
  Star,
  MapPin,
  Calendar,
  Shield,
  Crown,
  Activity
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

// Types
type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'FWD';
type PlayerStatus = 'Active' | 'Injured' | 'Suspended' | 'active' | 'injured' | 'suspended';

interface Player {
  id: string;
  name: string;
  fullName: string;
  position: PlayerPosition;
  number: number;
  age: number;
  nationality: string;
  matches: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  rating: number;
  status: PlayerStatus;
  photo: string;
  dob?: string;
  joinDate?: string;
  season?: string;
  hometown?: string;
  preferredFoot?: 'Right' | 'Left' | 'Both';
  club?: string;
  minutesPlayed?: number;
  passAccuracy?: number;
  chancesCreated?: number;
  cleanSheets?: number;
  biography?: string;
  ratingVotes?: number;
  ratingValue?: number;
  isFavorite?: boolean;
  attributes?: {
    pace: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physical: number;
  };
  trophies?: Array<{ id: string; name: string; year: string }>;
  training?: Array<{ day: string; Fitness: number; Intensity: number; Speed: number; Strength: number }>;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const goalsObj = payload.find((p: any) => p.dataKey === 'goals');
    const assistsObj = payload.find((p: any) => p.dataKey === 'assists');
    const ratingObj = payload.find((p: any) => p.dataKey === 'rating');

    return (
      <div className="bg-slate-950/95 border border-slate-800 p-3.5 rounded-xl shadow-xl space-y-2 font-sans backdrop-blur-md">
        <p className="text-xs font-bold text-white border-b border-slate-800 pb-1.5">{label}</p>
        <div className="space-y-1 font-mono text-[11px]">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Rating:</span>
            <span className="font-bold text-amber-400">★ {ratingObj ? ratingObj.value : 0}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-emerald-400">Goals:</span>
            <span className="font-bold text-emerald-400">{goalsObj ? goalsObj.value : 0}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sky-400">Assists:</span>
            <span className="font-bold text-sky-400">{assistsObj ? assistsObj.value : 0}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

interface SquadManagerProps {
  players: Player[];
  onAddPlayer: (player: Player) => void;
  onUpdatePlayer: (player: Player) => void;
  onDeletePlayer: (playerId: string) => void;
}

const INITIAL_PLAYER_FORM = {
  id: '',
  name: '',
  position: 'MID' as PlayerPosition,
  number: 10,
  age: 24,
  nationality: '',
  matches: 0,
  goals: 0,
  assists: 0,
  yellowCards: 0,
  redCards: 0,
  rating: 7.2,
  status: 'Active' as PlayerStatus,
  photo: '',
  
  // Extended details with default placeholders
  fullName: '',
  dob: '',
  joinDate: '',
  season: '2024-2025',
  hometown: '',
  preferredFoot: 'Right' as 'Right' | 'Left' | 'Both',
  club: 'Apex United FC',
  minutesPlayed: 0,
  passAccuracy: 85,
  chancesCreated: 0,
  cleanSheets: 0,
  biography: '',
  ratingVotes: 1,
  ratingValue: 5.0,
  isFavorite: false,
  attributes: {
    pace: 80,
    shooting: 75,
    passing: 80,
    dribbling: 78,
    defending: 70,
    physical: 75
  },
  trophies: [] as Array<{ id: string; name: string; year: string }>,
  training: [
    { day: 'Mon', Fitness: 75, Intensity: 81, Speed: 70, Strength: 85 },
    { day: 'Tue', Fitness: 78, Intensity: 84, Speed: 72, Strength: 86 },
    { day: 'Wed', Fitness: 80, Intensity: 68, Speed: 75, Strength: 83 },
    { day: 'Thu', Fitness: 83, Intensity: 80, Speed: 78, Strength: 87 },
    { day: 'Fri', Fitness: 85, Intensity: 82, Speed: 80, Strength: 89 },
    { day: 'Sat', Fitness: 84, Intensity: 65, Speed: 78, Strength: 84 },
    { day: 'Sun', Fitness: 82, Intensity: 50, Speed: 76, Strength: 80 },
  ] as Array<{ day: string; Fitness: number; Intensity: number; Speed: number; Strength: number }>
};

const normalizePlayerData = (player: Player): any => {
  return {
    ...player,
    fullName: player.fullName || player.name,
    dob: player.dob || '10/12/2005',
    joinDate: player.joinDate || '04/20/2022',
    season: player.season || '2024-2025',
    hometown: player.hometown || 'Mulikandi, Sylhet',
    preferredFoot: player.preferredFoot || 'Right',
    club: player.club || 'Apex United FC',
    minutesPlayed: player.minutesPlayed !== undefined ? player.minutesPlayed : player.matches * 78,
    passAccuracy: player.passAccuracy !== undefined ? player.passAccuracy : 85,
    chancesCreated: player.chancesCreated !== undefined ? player.chancesCreated : Math.round(player.assists * 1.8),
    cleanSheets: player.cleanSheets !== undefined ? player.cleanSheets : (player.position === 'GK' ? 6 : player.position === 'DEF' ? 4 : 0),
    biography: player.biography || `Versatile player who can slot into defense or midfield. A true utility player with leadership qualities.`,
    ratingVotes: player.ratingVotes !== undefined ? player.ratingVotes : 1,
    ratingValue: player.ratingValue !== undefined ? player.ratingValue : 5.0,
    isFavorite: player.isFavorite || false,
    attributes: player.attributes || {
      pace: player.position === 'FWD' ? 88 : player.position === 'MID' ? 78 : player.position === 'DEF' ? 74 : 50,
      shooting: player.position === 'FWD' ? 84 : player.position === 'MID' ? 75 : player.position === 'DEF' ? 52 : 12,
      passing: player.position === 'FWD' ? 75 : player.position === 'MID' ? 84 : player.position === 'DEF' ? 72 : 55,
      dribbling: player.position === 'FWD' ? 85 : player.position === 'MID' ? 81 : player.position === 'DEF' ? 68 : 45,
      defending: player.position === 'FWD' ? 35 : player.position === 'MID' ? 68 : player.position === 'DEF' ? 88 : 15,
      physical: player.position === 'FWD' ? 78 : player.position === 'MID' ? 74 : player.position === 'DEF' ? 84 : 70,
    },
    trophies: player.trophies || [
      { id: 't-1', name: 'Daudpur Tournament Champion', year: '2026' }
    ],
    training: player.training || [
      { day: 'Mon', Fitness: 75, Intensity: 81, Speed: 70, Strength: 85 },
      { day: 'Tue', Fitness: 78, Intensity: 84, Speed: 72, Strength: 86 },
      { day: 'Wed', Fitness: 80, Intensity: 68, Speed: 75, Strength: 83 },
      { day: 'Thu', Fitness: 83, Intensity: 80, Speed: 78, Strength: 87 },
      { day: 'Fri', Fitness: 85, Intensity: 82, Speed: 80, Strength: 89 },
      { day: 'Sat', Fitness: 84, Intensity: 65, Speed: 78, Strength: 84 },
      { day: 'Sun', Fitness: 82, Intensity: 50, Speed: 76, Strength: 80 },
    ]
  };
};

export default function SquadManager({
  players,
  onAddPlayer,
  onUpdatePlayer,
  onDeletePlayer
}: SquadManagerProps) {
  // Query state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<string>('ALL');

  // Selected player for viewing detailed profile
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [formData, setFormData] = useState(INITIAL_PLAYER_FORM);
  const [formError, setFormError] = useState('');
  const [formTab, setFormTab] = useState<'general' | 'stats' | 'attributes' | 'trophies' | 'training'>('general');
  const [selectedTrainingDay, setSelectedTrainingDay] = useState<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'>('Mon');

  // Trophy add state handles
  const [trophyNameInput, setTrophyNameInput] = useState('');
  const [trophyYearInput, setTrophyYearInput] = useState('');

  const handleAddTrophy = () => {
    if (!trophyNameInput.trim() || !trophyYearInput.trim()) return;
    const newTrophy = {
      id: 't_' + Date.now().toString(),
      name: trophyNameInput.trim(),
      year: trophyYearInput.trim(),
    };
    setFormData(prev => ({
      ...prev,
      trophies: [...(prev.trophies || []), newTrophy]
    }));
    setTrophyNameInput('');
    setTrophyYearInput('');
  };

  const handleRemoveTrophy = (idToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      trophies: (prev.trophies || []).filter((t: any) => t.id !== idToRemove)
    }));
  };

  // Drag and drop / photo upload handling
  const [isDragging, setIsDragging] = useState(false);

  const handlePhotoFile = (file: File) => {
    if (!file) return;
    
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setFormError('Image size should be less than 2MB for storage efficiency.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target?.result as string;
      setFormData(prev => ({
        ...prev,
        photo: base64Data
      }));
    };
    reader.onerror = () => {
      setFormError('Error reading file. Please try another image.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handlePhotoFile(files[0]);
    }
  };

  // Filtering players
  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          player.nationality.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          player.number.toString() === searchTerm;
    const matchesPosition = selectedPosition === 'ALL' || player.position === selectedPosition;
    return matchesSearch && matchesPosition;
  });

  // KPI summaries
  const squadAverageRating = players.length > 0
    ? (players.reduce((sum, p) => sum + p.rating, 0) / players.length).toFixed(2)
    : '0.00';
  const totalSquadGoals = players.reduce((sum, p) => sum + p.goals, 0);
  const averageAge = players.length > 0
    ? (players.reduce((sum, p) => sum + p.age, 0) / players.length).toFixed(1)
    : '0';

  const handleOpenAddForm = () => {
    setFormTab('general');
    setFormData({ 
      ...INITIAL_PLAYER_FORM, 
      id: 'p_' + Date.now().toString(),
      attributes: { pace: 80, shooting: 75, passing: 80, dribbling: 78, defending: 70, physical: 75 },
      trophies: []
    });
    setEditingPlayerId(null);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (player: Player) => {
    setFormTab('general');
    const normalized = normalizePlayerData(player);
    setFormData({ ...normalized });
    setEditingPlayerId(player.id);
    setFormError('');
    setIsFormOpen(true);
  };

  // Stats adjusters
  const changeNumField = (field: 'matches' | 'goals' | 'assists' | 'yellowCards' | 'redCards' | 'number' | 'age', delta: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: Math.max(0, prev[field] + delta)
    }));
  };

  const handleSavePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Player name is required.');
      return;
    }
    if (!formData.nationality.trim()) {
      setFormError('Nationality is required.');
      return;
    }
    if (formData.number <= 0 || formData.number > 99) {
      setFormError('Player squad number must be between 1 and 99.');
      return;
    }

    // Check duplicate jersey number
    const duplicateNum = players.find(p => p.number === formData.number && p.id !== editingPlayerId);
    if (duplicateNum) {
      setFormError(`Jersey #${formData.number} is already assigned to ${duplicateNum.name}.`);
      return;
    }

    // Save
    if (editingPlayerId) {
      onUpdatePlayer(formData as Player);
    } else {
      onAddPlayer(formData as Player);
    }
    setIsFormOpen(false);
  };

  // Status color pill resolver
  const getStatusStyle = (status: PlayerStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-950 text-emerald-400 border border-emerald-800/50';
      case 'Injured':
        return 'bg-rose-950 text-rose-400 border border-rose-800/50';
      case 'Suspended':
        return 'bg-amber-950 text-amber-500 border border-amber-800/50';
    }
  };

  const activeProfilePlayer = players.find(p => p.id === selectedPlayerId);
  const normalizedProfile = activeProfilePlayer ? normalizePlayerData(activeProfilePlayer) : null;

  if (selectedPlayerId && normalizedProfile) {
    const weeklyTrainingData = Array.isArray(normalizedProfile.training)
      ? normalizedProfile.training
      : [];

    const avgFitness = weeklyTrainingData.length ? Math.round(weeklyTrainingData.reduce((acc: number, curr: any) => acc + curr.Fitness, 0) / weeklyTrainingData.length) : 0;
    const avgIntensity = weeklyTrainingData.length ? Math.round(weeklyTrainingData.reduce((acc: number, curr: any) => acc + curr.Intensity, 0) / weeklyTrainingData.length) : 0;
    const peakPerformance = weeklyTrainingData.length ? Math.max(...weeklyTrainingData.flatMap((t: any) => [t.Fitness, t.Intensity, t.Speed, t.Strength])) : 0;
    const activeSessions = weeklyTrainingData.filter((t: any) => t.Intensity > 35).length;

    const radarData = [
      { subject: 'Pace', A: normalizedProfile.attributes?.pace ?? 0, fullMark: 100 },
      { subject: 'Shooting', A: normalizedProfile.attributes?.shooting ?? 0, fullMark: 100 },
      { subject: 'Passing', A: normalizedProfile.attributes?.passing ?? 0, fullMark: 100 },
      { subject: 'Dribbling', A: normalizedProfile.attributes?.dribbling ?? 0, fullMark: 100 },
      { subject: 'Defending', A: normalizedProfile.attributes?.defending ?? 0, fullMark: 100 },
      { subject: 'Physical', A: normalizedProfile.attributes?.physical ?? 0, fullMark: 100 },
    ];

    const detailsList = [
      { label: 'Full Name', value: normalizedProfile.fullName },
      { label: 'Position', value: normalizedProfile.position },
      { label: 'Age', value: `${normalizedProfile.age} Years` },
      { label: 'Date of Birth', value: normalizedProfile.dob },
      { label: 'Join Date', value: normalizedProfile.joinDate },
      { label: 'Season', value: normalizedProfile.season },
      { label: 'Jersey Number', value: `#${normalizedProfile.number}` },
      { label: 'Hometown', value: normalizedProfile.hometown },
      { label: 'Preferred Foot', value: `${normalizedProfile.preferredFoot} Footed` },
      { label: 'Club', value: normalizedProfile.club },
      { label: 'Status', value: normalizedProfile.status },
    ];

    const seasonMetrics = [
      { label: 'Goals Scored', value: normalizedProfile.goals, max: 25 },
      { label: 'Assists Created', value: normalizedProfile.assists, max: 20 },
      { label: 'Appearances', value: normalizedProfile.matches, max: 35 },
      { label: 'Clean Sheets', value: normalizedProfile.cleanSheets || 0, max: 20 },
      { label: 'Minutes Played', value: normalizedProfile.minutesPlayed || 0, max: 3000, isRawValue: true },
      { label: 'Pass Accuracy', value: normalizedProfile.passAccuracy || 85, max: 100, isPercentage: true },
    ];

    const attrList = [
      { label: 'Pace', value: normalizedProfile.attributes?.pace || 80 },
      { label: 'Shooting', value: normalizedProfile.attributes?.shooting || 75 },
      { label: 'Passing', value: normalizedProfile.attributes?.passing || 80 },
      { label: 'Dribbling', value: normalizedProfile.attributes?.dribbling || 78 },
      { label: 'Defending', value: normalizedProfile.attributes?.defending || 70 },
      { label: 'Physical', value: normalizedProfile.attributes?.physical || 75 },
    ];

    const handleToggleFavorite = () => {
      const updated = {
        ...normalizedProfile,
        isFavorite: !normalizedProfile.isFavorite
      };
      onUpdatePlayer(updated);
    };

    const handleAddRatingVote = (selectedRating: number) => {
      const currentVotes = normalizedProfile.ratingVotes || 1;
      const currentValue = normalizedProfile.ratingValue || 5.0;
      const totalScore = (currentValue * currentVotes) + selectedRating;
      const newVotes = currentVotes + 1;
      const newAverage = parseFloat((totalScore / newVotes).toFixed(1));

      const updated = {
        ...normalizedProfile,
        ratingVotes: newVotes,
        ratingValue: newAverage
      };
      onUpdatePlayer(updated);
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6 pb-12"
      >
        {/* Navigation Action Strip */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <button
            onClick={() => setSelectedPlayerId(null)}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Squad List
          </button>
          
          <div className="flex gap-2.5">
            <button
              onClick={() => handleOpenEditForm(normalizedProfile)}
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-rose-700 hover:bg-rose-600 border border-rose-850 hover:border-rose-700 px-4 py-2 rounded-xl shadow-md cursor-pointer transition-all active:scale-[98%]"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit Player Profile
            </button>
          </div>
        </div>

        {/* Hero Header Card */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-rose-950/20 via-slate-900 to-slate-950 p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start text-center md:text-left">
            {/* Outline Photo Container */}
            <div className="relative w-36 h-36 rounded-2xl bg-slate-950 p-1 border-2 border-rose-500/80 shadow-2xl flex items-center justify-center overflow-hidden shrink-0">
              {normalizedProfile.photo ? (
                <img 
                  src={normalizedProfile.photo} 
                  alt={normalizedProfile.name} 
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-3xl font-black text-slate-500 select-none font-mono flex items-center justify-center bg-slate-900 w-full h-full rounded-xl">
                  {normalizedProfile.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            {/* Info and Ratings */}
            <div className="flex-1 space-y-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest font-black text-rose-500 uppercase">
                  {normalizedProfile.club || 'TITAN FORCE FC'}
                </span>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none mt-1 uppercase">
                  {normalizedProfile.name}
                </h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-3 text-xs text-slate-400 font-mono">
                  <span className="text-rose-500 font-black">#{normalizedProfile.number}</span>
                  <span className="text-slate-600">•</span>
                  <span className="bg-rose-950/40 text-rose-400 border border-rose-900/40 px-2 py-0.5 rounded font-bold uppercase text-[9px]">
                    {normalizedProfile.position}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span>{normalizedProfile.nationality}</span>
                  <span className="text-slate-600">•</span>
                  <span>{normalizedProfile.preferredFoot} Footed</span>
                </div>
              </div>

              {/* Voting Stars & Favorites Interactive Container */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3.5 pt-1">
                <div className="flex items-center gap-1.5 bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-slate-800">
                  <div className="flex gap-0.5" title="Click a star to submit your rating vote!">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleAddRatingVote(star)}
                        className="p-0.5 text-amber-400 hover:scale-120 transition-transform cursor-pointer"
                      >
                        <Star className={`w-3.5 h-3.5 ${star <= Math.round(normalizedProfile.ratingValue || 5.0) ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-200">
                    {(normalizedProfile.ratingValue || 5.0).toFixed(1)}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    ({normalizedProfile.ratingVotes || 1} votes)
                  </span>
                </div>

                <button
                  onClick={handleToggleFavorite}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    normalizedProfile.isFavorite 
                      ? 'bg-rose-500/10 border-rose-500/40 text-rose-400' 
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${normalizedProfile.isFavorite ? 'fill-rose-500 text-rose-400' : ''}`} />
                  <span>Favorite {normalizedProfile.isFavorite ? '1' : '0'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Core KPI Strip of 6 Performance metrics */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3.5">
          {[
            { label: 'APPEARANCES', val: normalizedProfile.matches },
            { label: 'GOALS', val: normalizedProfile.goals, valColor: 'text-emerald-400' },
            { label: 'ASSISTS', val: normalizedProfile.assists, valColor: 'text-sky-400' },
            { label: 'MINUTES', val: normalizedProfile.minutesPlayed || 0 },
            { label: 'PASS ACCURACY', val: `${normalizedProfile.passAccuracy || 85}%` },
            { label: 'CHANCES CREATED', val: normalizedProfile.chancesCreated || 0 }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800/80 rounded-xl p-4 text-center shadow-md space-y-1">
              <span className="text-[9px] font-mono font-bold text-slate-500 tracking-wider block">{item.label}</span>
              <h3 className={`text-2xl font-black ${item.valColor || 'text-white'} leading-tight font-mono`}>{item.val}</h3>
            </div>
          ))}
        </div>

        {/* Nested Detailed Row Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Column 1: Details and season charts */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Player Details Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Shield className="w-4 h-4 text-rose-500" />
                <h3 className="text-xs font-mono font-bold text-white tracking-widest uppercase">Player Details</h3>
              </div>
              <div className="space-y-2.5">
                {detailsList.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-slate-850/40 last:border-0">
                    <span className="text-slate-400 font-medium font-sans">{item.label}</span>
                    <span className={`font-semibold font-sans text-right ${item.label === 'Status' ? 'text-emerald-400' : 'text-slate-200'}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Season Stats Progress Meters */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Activity className="w-4 h-4 text-rose-500" />
                <h3 className="text-xs font-mono font-bold text-white tracking-widest uppercase">Season Stats Performance</h3>
              </div>
              <div className="space-y-3.5">
                {seasonMetrics.map((met, idx) => {
                  const percentage = Math.min(100, (met.value / met.max) * 100);
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-400 font-semibold">{met.label}</span>
                        <span className="text-rose-400 font-bold">
                          {met.isPercentage ? `${met.value}%` : met.value.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
                        <div 
                          className="h-full bg-gradient-to-r from-rose-700 to-rose-500 rounded-full transition-all duration-500" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Column 2: Biography, Attributes, Trophies, Analytics */}
          <div className="lg:col-span-7 space-y-6">

            {/* Biography */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <User className="w-4 h-4 text-rose-500" />
                <h3 className="text-xs font-mono font-bold text-white tracking-widest uppercase">Biography</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{normalizedProfile.biography}</p>
            </div>

            {/* Player Attributes Slider Grid */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Sparkles className="w-4 h-4 text-rose-500" />
                <h3 className="text-xs font-mono font-bold text-white tracking-widest uppercase">Player Attributes</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attrList.map((attr, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-medium font-sans">{attr.label}</span>
                      <span className="text-rose-400 font-mono font-bold">{attr.value}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
                      <div 
                        className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full transition-all duration-500" 
                        style={{ width: `${attr.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trophies Cabinet */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Crown className="w-4 h-4 text-rose-500" />
                <h3 className="text-xs font-mono font-bold text-white tracking-widest uppercase">Trophies Cabinet</h3>
              </div>
              {normalizedProfile.trophies && normalizedProfile.trophies.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {normalizedProfile.trophies.map((trophy: any, idx: number) => (
                    <div key={trophy.id || idx} className="bg-slate-950/40 border border-slate-850 rounded-xl p-3 flex items-center gap-3">
                      <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-900/20 shrink-0">
                        <Award className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-slate-200 truncate font-sans">{trophy.name}</h4>
                        <p className="text-[10px] text-slate-500 font-mono font-medium mt-0.5">{trophy.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center bg-slate-950/20 border border-slate-850 rounded-xl">
                  <p className="text-xs text-slate-500 italic">No historical club trophies registered for this player yet.</p>
                </div>
              )}
            </div>

            {/* Training Performance Dashboard */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-5">
              <div>
                <span className="text-[9px] font-mono font-bold text-rose-500 tracking-wider uppercase">ANALYTICS</span>
                <h3 className="text-sm font-bold text-white tracking-tight uppercase leading-snug mt-0.5">TRAINING PERFORMANCE</h3>
              </div>
              
              {/* Training KPIs Strip */}
              <div className="grid grid-cols-4 gap-3 border-b border-slate-800 pb-4">
                {[
                  { label: 'Avg Fitness', val: `${avgFitness}%` },
                  { label: 'Avg Intensity', val: `${avgIntensity}%` },
                  { label: 'Peak Performance', val: `${peakPerformance}%` },
                  { label: 'Sessions', val: `${activeSessions}` }
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-950/50 p-2 rounded-lg border border-slate-850 text-center">
                    <span className="text-[9px] font-mono text-slate-500 font-semibold block">{item.label}</span>
                    <span className="text-xs font-bold text-slate-200 font-mono block mt-1">{item.val}</span>
                  </div>
                ))}
              </div>

              {/* Dynamic Recharts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Chart 1: Fitness / Speed Progression Line */}
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-[9px] font-mono font-bold text-slate-400 block tracking-wide uppercase">WEEKLY TRAINING INTENSITY</span>
                    <div className="flex flex-wrap gap-2 text-[8px] font-mono tracking-wider font-bold">
                      <span className="flex items-center gap-1 text-rose-500"><span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>INT</span>
                      <span className="flex items-center gap-1 text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>FIT</span>
                      <span className="flex items-center gap-1 text-sky-400"><span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>SPD</span>
                      <span className="flex items-center gap-1 text-purple-400"><span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>STR</span>
                    </div>
                  </div>
                  <div className="h-44 bg-slate-950/50 rounded-xl border border-slate-850 p-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weeklyTrainingData}>
                        <XAxis dataKey="day" stroke="#64748b" fontSize={9} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={9} width={18} tickLine={false} domain={[20, 100]} />
                        <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', fontSize: 10 }} />
                        <Line type="monotone" dataKey="Intensity" name="Intensity" stroke="#f43f5e" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 4 }} />
                        <Line type="monotone" dataKey="Fitness" name="Fitness" stroke="#10b981" strokeWidth={1.5} dot={{ r: 1.5 }} />
                        <Line type="monotone" dataKey="Speed" name="Speed" stroke="#38bdf8" strokeWidth={1.5} dot={{ r: 1.5 }} />
                        <Line type="monotone" dataKey="Strength" name="Strength" stroke="#a855f7" strokeWidth={1.5} dot={{ r: 1.5 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 2: Skill Radar Chart */}
                <div className="space-y-2">
                  <span className="text-[9px] font-mono font-bold text-slate-400 block tracking-wide uppercase">SKILL PROFILE INTEGRATION</span>
                  <div className="h-44 bg-slate-950/50 rounded-xl border border-slate-850 p-1 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={mockRadarData}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={9} />
                        <Radar name={normalizedProfile.name} dataKey="A" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.35} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* KPI Highlight Header Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-slate-400 font-semibold uppercase tracking-wider">Average Roster Quality</p>
            <h3 className="text-3xl font-extrabold text-white mt-1 leading-none">{squadAverageRating}</h3>
            <span className="text-[11px] text-slate-500 mt-1.5 block">Overall team performance index</span>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <Award className="w-6 h-6 stroke-1.5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-slate-400 font-semibold uppercase tracking-wider">Total Season Goals</p>
            <h3 className="text-3xl font-extrabold text-white mt-1 leading-none">{totalSquadGoals} G</h3>
            <span className="text-[11px] text-slate-500 mt-1.5 block">Scored by current squad members</span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <TrendingUp className="w-6 h-6 stroke-1.5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-slate-400 font-semibold uppercase tracking-wider">Average Age Metric</p>
            <h3 className="text-3xl font-extrabold text-white mt-1 leading-none">{averageAge} yrs</h3>
            <span className="text-[11px] text-slate-500 mt-1.5 block">Balanced youth and experience ratio</span>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <Users className="w-6 h-6 stroke-1.5" />
          </div>
        </div>
      </div>

      {/* Visual Analytics Section */}
      <div id="squad_analytics_section" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-4">
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-tight font-sans flex items-center gap-2">
              <span className="p-1 px-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-800/30 rounded text-xs select-none font-mono">
                Performance Analytics
              </span>
              Squad Metrics Overview
            </h4>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">
              Comparing Goals, Assists, and Rating for the {filteredPlayers.length} filtered candidate(s)
            </p>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400 bg-slate-950/40 px-3 py-1.5 rounded-xl border border-slate-850/60 w-fit select-none">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
              <span>Goals</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-sky-500"></span>
              <span>Assists</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span>
              <span>Rating</span>
            </div>
          </div>
        </div>

        {filteredPlayers.length === 0 ? (
          <div className="h-[280px] bg-slate-950/30 border border-slate-800/50 rounded-xl flex flex-col items-center justify-center text-center p-6 space-y-2">
            <Users className="w-8 h-8 text-slate-600 stroke-1 animate-pulse" />
            <p className="text-xs font-semibold text-slate-400">No active metrics to compile</p>
            <p className="text-[10px] text-slate-500 max-w-xs">Adjust search keys or filter selections down below to populate analytic charts.</p>
          </div>
        ) : (
          <div className="bg-slate-950/20 rounded-xl p-4 overflow-x-auto custom-scrollbar border border-slate-950">
            <div 
              className="h-[280px]" 
              style={{ width: filteredPlayers.length > 8 ? `${filteredPlayers.length * 70}px` : '100%' }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredPlayers}
                  margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                  barGap={4}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#64748b" 
                    fontSize={10} 
                    tickLine={false}
                    axisLine={{ stroke: '#334155' }}
                    dy={10}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={10} 
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 'auto']}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(51, 65, 85, 0.15)' }} />
                  <Bar dataKey="goals" fill="#10b981" radius={[3, 3, 0, 0]} maxBarSize={20} />
                  <Bar dataKey="assists" fill="#0ea5e9" radius={[3, 3, 0, 0]} maxBarSize={20} />
                  <Bar dataKey="rating" fill="#f59e0b" radius={[3, 3, 0, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Main control and list block */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
        
        {/* Filtration & Search bar */}
        <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/30">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 flex-1">
            {/* Search label */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by name, number, country..."
                className="pl-9 pr-4 py-2 bg-slate-900 hover:bg-slate-850 focus:bg-slate-850 w-full md:w-80 rounded-xl border border-slate-800 outline-none focus:border-slate-700 text-slate-300 text-xs transition-all placeholder:text-slate-500 font-sans"
              />
            </div>

            {/* Position filter pillbox */}
            <div className="flex bg-slate-950/80 p-1.5 rounded-xl border border-slate-850 overflow-x-auto gap-1">
              {['ALL', 'GK', 'DEF', 'MID', 'FWD'].map((pos) => (
                <button
                  key={pos}
                  onClick={() => setSelectedPosition(pos)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider cursor-pointer transition-all ${
                    selectedPosition === pos
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleOpenAddForm}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-[98%] flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> Register Player
          </button>
        </div>

        {/* Players List Grid */}
        <div className="p-6">
          {filteredPlayers.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <span className="w-12 h-12 rounded-full border border-slate-800 bg-slate-950/40 text-slate-600 flex items-center justify-center mx-auto text-xl">
                👤
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-300">No players found</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Try adjusting your search criteria, selecting another position, or register a new team member.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredPlayers.map((player) => (
                  <motion.div
                    key={player.id}
                    layoutId={player.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                    className="bg-slate-950/40 border border-slate-800/80 rounded-xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between"
                  >
                    {/* Card Top: Number, Position, Photo, Name details */}
                    <div 
                      onClick={() => setSelectedPlayerId(player.id)}
                      className="p-5 space-y-4 cursor-pointer hover:bg-slate-900/20 transition-all flex-1"
                      title="Click to view detailed player profile dashboard"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/30">
                            #{player.number}
                          </span>
                          <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded ${
                            player.position === 'GK' ? 'bg-sky-950 text-sky-400 border border-sky-900/30' :
                            player.position === 'DEF' ? 'bg-indigo-950 text-indigo-400 border border-indigo-900/30' :
                            player.position === 'MID' ? 'bg-amber-950 text-amber-400 border border-amber-900/30' :
                            'bg-rose-950 text-rose-400 border border-rose-900/30'
                          }`}>
                            {player.position}
                          </span>
                        </div>
                        <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full ${getStatusStyle(player.status)}`}>
                          ● {player.status}
                        </span>
                      </div>

                      <div className="flex gap-4 items-center pt-1">
                        {/* Player Photo */}
                        <div className="relative w-16 h-16 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                          {player.photo ? (
                            <img 
                              src={player.photo} 
                              alt={player.name} 
                              className="w-full h-full object-cover animate-fade-in"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="text-base font-extrabold select-none text-slate-500 font-mono tracking-tighter flex items-center justify-center bg-slate-900 w-full h-full">
                              {player.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-bold text-slate-100 truncate font-sans leading-snug">
                            {player.name}
                          </h3>
                          <p className="text-[11px] text-slate-400 mt-1 font-mono">
                            {player.nationality}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5 font-sans">
                            {player.age} yrs old
                          </p>
                        </div>
                      </div>

                      {/* Stat Metrics Grid */}
                      <div className="grid grid-cols-4 gap-2 text-center pt-1 border-t border-slate-900">
                        <div className="bg-slate-900/40 p-2 rounded-lg border border-slate-900/50">
                          <span className="text-[9px] font-semibold text-slate-500 uppercase block font-mono">Matches</span>
                          <span className="text-xs font-bold text-slate-200 mt-1 block font-mono">{player.matches}</span>
                        </div>
                        <div className="bg-slate-900/40 p-2 rounded-lg border border-slate-900/50">
                          <span className="text-[9px] font-semibold text-slate-500 uppercase block font-mono">Goals</span>
                          <span className="text-xs font-bold text-slate-200 mt-1 block font-mono text-emerald-400">{player.goals}</span>
                        </div>
                        <div className="bg-slate-900/40 p-2 rounded-lg border border-slate-900/50">
                          <span className="text-[9px] font-semibold text-slate-500 uppercase block font-mono">Assists</span>
                          <span className="text-xs font-bold text-slate-200 mt-1 block font-mono text-sky-400">{player.assists}</span>
                        </div>
                        <div className="bg-slate-900/40 p-2 rounded-lg border border-slate-900/50">
                          <span className="text-[9px] font-semibold text-slate-500 uppercase block font-mono">Rating</span>
                          <span className="text-xs font-mono font-bold text-amber-400 mt-1 block">★ {player.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="p-3 bg-slate-900/30 border-t border-slate-850 flex gap-2">
                      <button
                        onClick={() => setSelectedPlayerId(player.id)}
                        className="flex-1 bg-emerald-950/40 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-900/30 text-[11px] font-bold py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5" /> View Profile
                      </button>
                      <button
                        onClick={() => handleOpenEditForm(player)}
                        className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg border border-slate-800 flex items-center justify-center transition-all cursor-pointer"
                        title="Edit Profile"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to deregister ${player.name}?`)) {
                            onDeletePlayer(player.id);
                          }
                        }}
                        className="p-1.5 hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 rounded-lg border border-slate-800 hover:border-rose-900/25 flex items-center justify-center transition-all cursor-pointer"
                        title="Deregister Player"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Roster Add / Edit Modal Drawer */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-5 border-b border-slate-800 bg-slate-950/40 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <User className="w-5 h-5" />
                  </span>
                  <h3 className="text-sm font-bold text-white uppercase font-sans">
                    {editingPlayerId ? 'Edit Player profile' : 'Register New Player'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
                     {/* Form Tab Controllers */}
              <div className="flex bg-slate-950/80 p-1 border-b border-slate-800 shrink-0">
                {(['general', 'stats', 'attributes', 'trophies', 'training'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setFormTab(tab)}
                    className={`flex-1 py-3 text-xs font-mono font-bold tracking-wider uppercase transition-all border-b-2 cursor-pointer ${
                      formTab === tab
                        ? 'border-rose-500 text-rose-400 bg-slate-900/40'
                        : 'border-transparent text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Form Content */}
              <form onSubmit={handleSavePlayer} className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
                
                {formError && (
                  <div className="p-3.5 bg-rose-950/60 text-xs text-rose-400 font-medium rounded-xl border border-rose-900/50 flex items-center gap-2 flex-shrink-0 animate-shake">
                    <AlertTriangle className="w-4.5 h-4.5" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* TAB 1: GENERAL INFO */}
                {formTab === 'general' && (
                  <div className="space-y-6">
                    {/* Photo Upload Section */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Player Profile Photo</label>
                      
                      <div className="flex flex-col sm:flex-row gap-4 items-center">
                        {/* Thumbnail Preview Area */}
                        <div className="w-24 h-24 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0 relative group">
                          {formData.photo ? (
                            <>
                              <img 
                                src={formData.photo} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, photo: '' }))}
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-rose-400 font-mono text-xs font-bold gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" /> Remove
                              </button>
                            </>
                          ) : (
                            <div className="text-slate-600 flex flex-col items-center justify-center text-[10px] font-mono gap-1">
                              <User className="w-8 h-8 text-slate-700" />
                              <span>No Photo</span>
                            </div>
                          )}
                        </div>

                        {/* Drag and Drop Zone */}
                        <div 
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          className={`flex-1 w-full h-24 rounded-2xl border border-dashed transition-all flex flex-col items-center justify-center p-4 text-center cursor-pointer ${
                            isDragging 
                              ? 'border-emerald-500 bg-emerald-500/5 text-emerald-400' 
                              : 'border-slate-800 bg-slate-950/30 hover:bg-slate-950/50 text-slate-400 hover:border-slate-700'
                          }`}
                          onClick={() => document.getElementById('player-photo-input')?.click()}
                        >
                          <input 
                            type="file"
                            id="player-photo-input"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files && files.length > 0) {
                                handlePhotoFile(files[0]);
                              }
                            }}
                          />
                          <Sparkles className={`w-5 h-5 mb-1.5 transition-colors ${isDragging ? 'text-emerald-400' : 'text-slate-500'}`} />
                          <p className="text-xs font-semibold text-slate-300">
                            {isDragging ? 'Drop Image Here' : 'Drag & drop player photo, or click to browse'}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-1 font-mono">
                            Supports PNG, JPG, WEBP (Max 2MB)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Player Name (Short)</label>
                        <input
                          type="text"
                          required
                          value={formData.name || ''}
                          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g. Marcus Sterling"
                          className="w-full bg-slate-950 border border-slate-800 outline-none focus:border-slate-700 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl font-sans transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Full Legal Name</label>
                        <input
                          type="text"
                          value={formData.fullName || ''}
                          onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                          placeholder="e.g. Marcus David Sterling"
                          className="w-full bg-slate-950 border border-slate-800 outline-none focus:border-slate-700 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl font-sans transition-all"
                        />
                      </div>
                    </div>

                    {/* Geography / Club */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Nationality</label>
                        <input
                          type="text"
                          required
                          value={formData.nationality || ''}
                          onChange={e => setFormData(prev => ({ ...prev, nationality: e.target.value }))}
                          placeholder="e.g. England"
                          className="w-full bg-slate-950 border border-slate-800 outline-none focus:border-slate-700 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl font-sans transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Hometown</label>
                        <input
                          type="text"
                          value={formData.hometown || ''}
                          onChange={e => setFormData(prev => ({ ...prev, hometown: e.target.value }))}
                          placeholder="e.g. Manchester, UK"
                          className="w-full bg-slate-950 border border-slate-800 outline-none focus:border-slate-700 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl font-sans transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Club Name</label>
                        <input
                          type="text"
                          value={formData.club || ''}
                          onChange={e => setFormData(prev => ({ ...prev, club: e.target.value }))}
                          placeholder="e.g. Apex United FC"
                          className="w-full bg-slate-950 border border-slate-800 outline-none focus:border-slate-700 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl font-sans transition-all"
                        />
                      </div>
                    </div>

                    {/* Timeline & Foot */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
                      <div className="space-y-1.5 col-span-2 md:col-span-1">
                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Preferred Foot</label>
                        <select
                          value={formData.preferredFoot || 'Right'}
                          onChange={e => setFormData(prev => ({ ...prev, preferredFoot: e.target.value as 'Right' | 'Left' | 'Both' }))}
                          className="w-full bg-slate-950 border border-slate-800 outline-none focus:border-slate-700 text-slate-200 text-xs px-2 py-2.5 rounded-xl font-mono tracking-wide"
                        >
                          <option value="Right">Right</option>
                          <option value="Left">Left</option>
                          <option value="Both">Both</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Date of Birth</label>
                        <input
                          type="text"
                          value={formData.dob || ''}
                          onChange={e => setFormData(prev => ({ ...prev, dob: e.target.value }))}
                          placeholder="e.g. 10/12/2005"
                          className="w-full bg-slate-950 border border-slate-800 outline-none focus:border-slate-700 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl font-sans transition-all text-center"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Join Date</label>
                        <input
                          type="text"
                          value={formData.joinDate || ''}
                          onChange={e => setFormData(prev => ({ ...prev, joinDate: e.target.value }))}
                          placeholder="e.g. 04/20/2022"
                          className="w-full bg-slate-950 border border-slate-800 outline-none focus:border-slate-700 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl font-sans transition-all text-center"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Active Season</label>
                        <input
                          type="text"
                          value={formData.season || ''}
                          onChange={e => setFormData(prev => ({ ...prev, season: e.target.value }))}
                          placeholder="e.g. 2024-2025"
                          className="w-full bg-slate-950 border border-slate-800 outline-none focus:border-slate-700 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl font-sans transition-all text-center"
                        />
                      </div>

                      <div className="space-y-1.5 col-span-2 md:col-span-1">
                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Health Status</label>
                        <select
                          value={formData.status || 'Active'}
                          onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as PlayerStatus }))}
                          className="w-full bg-slate-950 border border-slate-800 outline-none focus:border-slate-700 text-slate-200 text-xs px-2 py-2.5 rounded-xl font-mono tracking-wide"
                        >
                          <option value="Active">🟢 Active</option>
                          <option value="Injured">🔴 Injured</option>
                          <option value="Suspended">🟡 Suspended</option>
                        </select>
                      </div>
                    </div>

                    {/* Biography */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Biography & Profile Summary</label>
                      <textarea
                        rows={3}
                        value={formData.biography || ''}
                        onChange={e => setFormData(prev => ({ ...prev, biography: e.target.value }))}
                        placeholder="Provide details about the player's history, traits, leadership capability, versatility..."
                        className="w-full bg-slate-950 border border-slate-800 outline-none focus:border-slate-700 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl font-sans transition-all resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 2: METRICS & SEASON STATS */}
                {formTab === 'stats' && (
                  <div className="space-y-6">
                    {/* Basic squad registrations */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b border-slate-820">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Jersey Number</label>
                        <div className="flex bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                          <button type="button" onClick={() => changeNumField('number', -1)} className="px-2.5 hover:bg-slate-900 border-r border-slate-800 text-slate-400">-</button>
                          <input
                            type="number"
                            min="1"
                            max="99"
                            value={formData.number}
                            onChange={e => setFormData(prev => ({ ...prev, number: parseInt(e.target.value) || 1 }))}
                            className="w-full text-center bg-transparent outline-none text-slate-200 font-mono text-xs"
                          />
                          <button type="button" onClick={() => changeNumField('number', 1)} className="px-2.5 hover:bg-slate-900 border-l border-slate-800 text-slate-400">+</button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Age</label>
                        <div className="flex bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                          <button type="button" onClick={() => changeNumField('age', -1)} className="px-2.5 hover:bg-slate-900 border-r border-slate-800 text-slate-400">-</button>
                          <input
                            type="number"
                            min="15"
                            max="45"
                            value={formData.age}
                            onChange={e => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 24 }))}
                            className="w-full text-center bg-transparent outline-none text-slate-200 font-mono text-xs"
                          />
                          <button type="button" onClick={() => changeNumField('age', 1)} className="px-2.5 hover:bg-slate-900 border-l border-slate-800 text-slate-400">+</button>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-center">
                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Tactical Rating</label>
                        <input
                          type="number"
                          step="0.1"
                          min="3.0"
                          max="10.0"
                          value={formData.rating || 7.2}
                          onChange={e => setFormData(prev => ({ ...prev, rating: parseFloat(e.target.value) || 7.0 }))}
                          className="w-full text-center bg-slate-950 border border-slate-800 outline-none focus:border-slate-700 text-slate-200 font-mono text-xs py-2.5 rounded-xl mt-0.5"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Position Group</label>
                        <select
                          value={formData.position || 'MID'}
                          onChange={e => setFormData(prev => ({ ...prev, position: e.target.value as PlayerPosition }))}
                          className="w-full bg-slate-950 border border-slate-800 outline-none focus:border-slate-700 text-slate-200 text-xs px-2 py-2.5 rounded-xl font-mono tracking-wide"
                        >
                          <option value="GK">GK - Goalkeeper</option>
                          <option value="DEF">DEF - Defender</option>
                          <option value="MID">MID - Midfielder</option>
                          <option value="FWD">FWD - Forward</option>
                        </select>
                      </div>
                    </div>

                    {/* Core Counters */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase">Matches & Cards metrics</h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 flex flex-col items-center">
                          <span className="text-[9px] font-mono text-slate-500 font-semibold uppercase">Appearances</span>
                          <div className="flex items-center gap-1.5 mt-2">
                            <button type="button" onClick={() => changeNumField('matches', -1)} className="w-6 h-6 hover:bg-slate-900 border border-slate-800 rounded flex items-center justify-center text-slate-400">-</button>
                            <span className="text-sm font-bold text-slate-100 font-mono w-6 text-center">{formData.matches}</span>
                            <button type="button" onClick={() => changeNumField('matches', 1)} className="w-6 h-6 hover:bg-slate-900 border border-slate-800 rounded flex items-center justify-center text-slate-400">+</button>
                          </div>
                        </div>

                        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 flex flex-col items-center">
                          <span className="text-[9px] font-mono text-slate-500 font-semibold uppercase text-emerald-400">Goals</span>
                          <div className="flex items-center gap-1.5 mt-2">
                            <button type="button" onClick={() => changeNumField('goals', -1)} className="w-6 h-6 hover:bg-slate-900 border border-slate-800 rounded flex items-center justify-center text-slate-400">-</button>
                            <span className="text-sm font-bold text-slate-100 font-mono w-6 text-center text-emerald-400">{formData.goals}</span>
                            <button type="button" onClick={() => changeNumField('goals', 1)} className="w-6 h-6 hover:bg-slate-900 border border-slate-800 rounded flex items-center justify-center text-slate-400">+</button>
                          </div>
                        </div>

                        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 flex flex-col items-center">
                          <span className="text-[9px] font-mono text-slate-500 font-semibold uppercase text-sky-400">Assists</span>
                          <div className="flex items-center gap-1.5 mt-2">
                            <button type="button" onClick={() => changeNumField('assists', -1)} className="w-6 h-6 hover:bg-slate-900 border border-slate-800 rounded flex items-center justify-center text-slate-400">-</button>
                            <span className="text-sm font-bold text-slate-100 font-mono w-6 text-center text-sky-400">{formData.assists}</span>
                            <button type="button" onClick={() => changeNumField('assists', 1)} className="w-6 h-6 hover:bg-slate-900 border border-slate-800 rounded flex items-center justify-center text-slate-400">+</button>
                          </div>
                        </div>

                        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 flex flex-col items-center">
                          <span className="text-[9px] font-mono text-slate-500 font-semibold uppercase text-yellow-400">Yellows</span>
                          <div className="flex items-center gap-1.5 mt-2">
                            <button type="button" onClick={() => changeNumField('yellowCards', -1)} className="w-6 h-6 hover:bg-slate-900 border border-slate-800 rounded flex items-center justify-center text-slate-400">-</button>
                            <span className="text-sm font-bold text-slate-100 font-mono w-6 text-center text-yellow-400">{formData.yellowCards}</span>
                            <button type="button" onClick={() => changeNumField('yellowCards', 1)} className="w-6 h-6 hover:bg-slate-900 border border-slate-800 rounded flex items-center justify-center text-slate-400">+</button>
                          </div>
                        </div>

                        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 flex flex-col items-center">
                          <span className="text-[9px] font-mono text-slate-500 font-semibold uppercase text-rose-500">Reds</span>
                          <div className="flex items-center gap-1.5 mt-2">
                            <button type="button" onClick={() => changeNumField('redCards', -1)} className="w-6 h-6 hover:bg-slate-900 border border-slate-800 rounded flex items-center justify-center text-slate-400">-</button>
                            <span className="text-sm font-bold text-slate-100 font-mono w-6 text-center text-rose-500">{formData.redCards}</span>
                            <button type="button" onClick={() => changeNumField('redCards', 1)} className="w-6 h-6 hover:bg-slate-900 border border-slate-800 rounded flex items-center justify-center text-slate-400">+</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Advanced Metrics with inline state changes */}
                    <div className="space-y-3 pt-3 border-t border-slate-800">
                      <h4 className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase">Advanced Season Statistics</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Minutes Played</label>
                          <input
                            type="number"
                            min="0"
                            value={formData.minutesPlayed || 0}
                            onChange={e => setFormData(prev => ({ ...prev, minutesPlayed: parseInt(e.target.value) || 0 }))}
                            className="w-full bg-slate-950 border border-slate-800 outline-none focus:border-slate-700 text-slate-200 text-xs px-3 py-2.5 rounded-xl font-mono text-center"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Pass Accuracy (%)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={formData.passAccuracy || 85}
                            onChange={e => setFormData(prev => ({ ...prev, passAccuracy: Math.min(100, parseInt(e.target.value) || 0) }))}
                            className="w-full bg-slate-950 border border-slate-800 outline-none focus:border-slate-700 text-slate-200 text-xs px-3 py-2.5 rounded-xl font-mono text-center"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Chances Created</label>
                          <input
                            type="number"
                            min="0"
                            value={formData.chancesCreated || 0}
                            onChange={e => setFormData(prev => ({ ...prev, chancesCreated: parseInt(e.target.value) || 0 }))}
                            className="w-full bg-slate-950 border border-slate-800 outline-none focus:border-slate-700 text-slate-200 text-xs px-3 py-2.5 rounded-xl font-mono text-center"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Clean Sheets</label>
                          <input
                            type="number"
                            min="0"
                            value={formData.cleanSheets || 0}
                            onChange={e => setFormData(prev => ({ ...prev, cleanSheets: parseInt(e.target.value) || 0 }))}
                            className="w-full bg-slate-950 border border-slate-800 outline-none focus:border-slate-700 text-slate-200 text-xs px-3 py-2.5 rounded-xl font-mono text-center"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: ATTRIBUTES PERCENTAGES (0-100) */}
                {formTab === 'attributes' && (
                  <div className="space-y-5">
                    <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-850">
                      <p className="text-[11px] text-slate-400 leading-normal">
                        Configure the player's attributes percentages used to evaluate core positions and display radar/distribution metrics.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {[
                        { key: 'pace', label: 'Pace (Speed, Acceleration)' },
                        { key: 'shooting', label: 'Shooting (Finishing, Power)' },
                        { key: 'passing', label: 'Passing (Vision, Accuracy)' },
                        { key: 'dribbling', label: 'Dribbling (Agility, Control)' },
                        { key: 'defending', label: 'Defending (Awareness, Tackling)' },
                        { key: 'physical', label: 'Physical (Strength, Stamina)' }
                      ].map((item) => {
                        const attrsValue = formData.attributes || { pace: 80, shooting: 75, passing: 80, dribbling: 78, defending: 70, physical: 75 };
                        const currentValue = (attrsValue as any)[item.key] || 75;

                        return (
                          <div key={item.key} className="space-y-1.5 p-3.5 bg-slate-950/40 border border-slate-850 rounded-xl">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-mono text-[10px] font-bold text-slate-300 uppercase tracking-wide">{item.label}</span>
                              <span className="text-rose-400 font-bold font-mono text-sm">{currentValue}%</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={currentValue}
                                onChange={e => {
                                  const val = parseInt(e.target.value) || 0;
                                  setFormData(prev => ({
                                    ...prev,
                                    attributes: {
                                      ...(prev.attributes || { pace: 80, shooting: 75, passing: 80, dribbling: 78, defending: 70, physical: 75 }),
                                      [item.key]: val
                                    }
                                  }));
                                }}
                                className="flex-1 accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 4: TROPHIES CABINET */}
                {formTab === 'trophies' && (
                  <div className="space-y-5">
                    {/* Add Award Interface */}
                    <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-850 space-y-3">
                      <span className="text-[10px] font-mono font-bold text-rose-500 uppercase tracking-widest block">Add New Trophy / Achievement</span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-8 space-y-1">
                          <label className="text-[9px] font-mono font-bold text-slate-500 uppercase">Trophy Title</label>
                          <input
                            type="text"
                            value={trophyNameInput}
                            onChange={e => setTrophyNameInput(e.target.value)}
                            placeholder="e.g. Daudpur Tournament Champion"
                            className="w-full bg-slate-900 border border-slate-800 outline-none focus:border-slate-700 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl"
                          />
                        </div>
                        <div className="sm:col-span-3 space-y-1">
                          <label className="text-[9px] font-mono font-bold text-slate-500 uppercase">Season / Year</label>
                          <input
                            type="text"
                            value={trophyYearInput}
                            onChange={e => setTrophyYearInput(e.target.value)}
                            placeholder="e.g. 2026"
                            className="w-full bg-slate-900 border border-slate-800 outline-none focus:border-slate-700 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl text-center"
                          />
                        </div>
                        <div className="sm:col-span-1 flex items-end justify-center pb-0.5">
                          <button
                            type="button"
                            onClick={handleAddTrophy}
                            disabled={!trophyNameInput.trim() || !trophyYearInput.trim()}
                            className="p-2.5 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl transition-all cursor-pointer shadow"
                            title="Add Award"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Historical Trophy list inside form */}
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Cabinet Records ({(formData.trophies || []).length})</span>
                      
                      {(formData.trophies || []).length === 0 ? (
                        <div className="py-8 text-center bg-slate-950/20 border border-slate-850 border-dashed rounded-2xl">
                          <p className="text-xs text-slate-500 italic">No award records found on this player profile yet. Add one above.</p>
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-[30vh] overflow-y-auto custom-scrollbar pr-1">
                          {(formData.trophies || []).map((trophy: any) => (
                            <div key={trophy.id} className="bg-slate-950/40 p-3.5 border border-slate-850 rounded-xl flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-amber-500/10 text-amber-500 rounded-lg">
                                  <Award className="w-4 h-4" />
                                </div>
                                <div>
                                  <h4 className="text-xs font-bold text-slate-200">{trophy.name}</h4>
                                  <p className="text-[10px] text-slate-500 font-mono font-medium mt-0.5">{trophy.year}</p>
                                </div>
                              </div>
                              
                              <button
                                type="button"
                                onClick={() => handleRemoveTrophy(trophy.id)}
                                className="p-1.5 hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                                title="Delete Trophy"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 5: TRAINING PERFORMANCE EDIT SYSTEM */}
                {formTab === 'training' && (
                  <div className="space-y-5">
                    <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-850">
                      <p className="text-[11px] text-slate-400 leading-normal">
                        Edit this player's performance attributes for each day of the training week. This directly shapes the dynamic training metrics and chart visualizations in real-time.
                      </p>
                    </div>

                    {/* Day sub-tabs */}
                    <div className="flex bg-slate-950/80 p-0.5 rounded-xl border border-slate-800 overflow-x-auto shrink-0 scrollbar-none gap-1">
                      {(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const).map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setSelectedTrainingDay(day)}
                          className={`flex-1 min-w-[48px] py-2 text-xs font-mono font-bold transition-all rounded-lg cursor-pointer ${
                            selectedTrainingDay === day
                              ? 'bg-rose-500 text-white shadow-lg shadow-rose-950/30'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>

                    {/* Editor Sliders for Selected Day */}
                    <div className="space-y-4 p-4 bg-slate-950/30 rounded-2xl border border-slate-850">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <span className="text-[11px] font-mono font-black text-rose-500 uppercase tracking-widest">
                          {selectedTrainingDay}day Drill Metrics
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">Scale: 0 - 100%</span>
                      </div>

                      {[
                        { key: 'Fitness', label: 'Fitness & Conditioning', color: 'accent-emerald-500', colorText: 'text-emerald-400' },
                        { key: 'Intensity', label: 'Drill Intensity & Workrate', color: 'accent-rose-500', colorText: 'text-rose-400' },
                        { key: 'Speed', label: 'Sprint & Foot Speed (Speed)', color: 'accent-sky-500', colorText: 'text-sky-400' },
                        { key: 'Strength', label: 'Physique & Muscle Load (Strength)', color: 'accent-purple-500', colorText: 'text-purple-400' }
                      ].map((metric) => {
                        // Find current metric value for selection Day
                        const currentTrainingList = formData.training || [
                          { day: 'Mon', Fitness: 75, Intensity: 81, Speed: 70, Strength: 85 },
                          { day: 'Tue', Fitness: 78, Intensity: 84, Speed: 72, Strength: 86 },
                          { day: 'Wed', Fitness: 80, Intensity: 68, Speed: 75, Strength: 83 },
                          { day: 'Thu', Fitness: 83, Intensity: 80, Speed: 78, Strength: 87 },
                          { day: 'Fri', Fitness: 85, Intensity: 82, Speed: 80, Strength: 89 },
                          { day: 'Sat', Fitness: 84, Intensity: 65, Speed: 78, Strength: 84 },
                          { day: 'Sun', Fitness: 82, Intensity: 50, Speed: 76, Strength: 80 },
                        ];
                        const dayObj = currentTrainingList.find((t: any) => t.day === selectedTrainingDay) || {
                          day: selectedTrainingDay,
                          Fitness: 80,
                          Intensity: 80,
                          Speed: 80,
                          Strength: 80
                        };
                        const val = (dayObj as any)[metric.key] !== undefined ? (dayObj as any)[metric.key] : 80;

                        return (
                          <div key={metric.key} className="space-y-1.5 p-3 bg-slate-950/60 border border-slate-850 rounded-xl">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-mono text-[10px] font-bold text-slate-300 uppercase tracking-wide">{metric.label}</span>
                              <span className={`font-bold font-mono text-sm ${metric.colorText}`}>{val}%</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={val}
                                onChange={e => {
                                  const parsedVal = parseInt(e.target.value) || 0;
                                  // Update this day's metric
                                  const updatedTraining = currentTrainingList.map((t: any) => {
                                    if (t.day === selectedTrainingDay) {
                                      return { ...t, [metric.key]: parsedVal };
                                    }
                                    return t;
                                  });
                                  setFormData(prev => ({
                                    ...prev,
                                    training: updatedTraining
                                  }));
                                }}
                                className={`flex-1 ${metric.color} h-1.5 bg-slate-800 rounded-lg cursor-pointer`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Global Bottom Actions Panel */}
                <div className="pt-5 border-t border-slate-800 flex justify-end gap-3 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 bg-slate-950/40 border border-slate-800 hover:bg-slate-800 hover:text-white rounded-xl text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-emerald-900/10 transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" /> Save Team Profile
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
