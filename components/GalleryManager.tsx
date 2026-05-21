import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Upload, 
  Plus, 
  Edit2, 
  Trash2, 
  Filter, 
  Calendar, 
  Sparkles, 
  Heart, 
  Eye, 
  X, 
  Save, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GalleryItem } from '../types';

interface GalleryManagerProps {
  items: GalleryItem[];
  onAddItem: (item: GalleryItem) => void;
  onUpdateItem: (item: GalleryItem) => void;
  onDeleteItem: (id: string) => void;
}

const PRESET_STOCK_IMAGES = [
  {
    title: 'Vibrant Stadium Sunset',
    category: 'Facilities' as GalleryCategory,
    url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop',
    desc: 'The home arena framed by a glowing orange and purple sunset twilight sky, stunning volumetric lighting.'
  },
  {
    title: 'Training Pitch Morning Dew',
    category: 'Training' as GalleryCategory,
    url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop',
    desc: 'Clean green grass in absolute focus with morning mist rising above the training complex pitch layout.'
  },
  {
    title: 'Golden Championship Cup',
    category: 'Matchday' as GalleryCategory,
    url: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=800&auto=format&fit=crop',
    desc: 'Prestige championship trophy sparkling under beams of golden stage lights with confettis.'
  },
  {
    title: 'Youth Training Cone Drills',
    category: 'Training' as GalleryCategory,
    url: 'https://images.unsplash.com/photo-1431324155629-1a6edd1dec8d?q=80&w=800&auto=format&fit=crop',
    desc: 'Neon orange cones positioned perfectly on the tactical grid for fast response dribbling drills.'
  },
  {
    title: 'Supporters Banner Choreography',
    category: 'Community' as GalleryCategory,
    url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop',
    desc: 'Tons of enthusiastic fans waving flags in emerald-green smokes celebrating final-whistle victory.'
  }
];

export default function GalleryManager({ 
  items, 
  onAddItem, 
  onUpdateItem, 
  onDeleteItem 
}: GalleryManagerProps) {
  
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Lightbox / Slide viewer State
  const [activeViewerItem, setActiveViewerItem] = useState<GalleryItem | null>(null);
  
  // Create / Edit Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  
  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<GalleryCategory>('Matchday');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formDate, setFormDate] = useState('');

  // Search and Category filter combination
  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openAddModal = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormCategory('Matchday');
    setFormDescription('');
    setFormImageUrl('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop');
    setFormDate(new Date().toISOString().substring(0, 10));
    setIsFormModalOpen(true);
  };

  const openEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormDescription(item.description);
    setFormImageUrl(item.imageUrl);
    setFormDate(item.date);
    setIsFormModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formImageUrl.trim() || !formDate) {
      alert('Missing required fields: Title, Image URL, and Date.');
      return;
    }

    if (editingItem) {
      // Update
      const updatedItem: GalleryItem = {
        ...editingItem,
        title: formTitle,
        category: formCategory,
        description: formDescription,
        imageUrl: formImageUrl,
        date: formDate
      };
      onUpdateItem(updatedItem);
    } else {
      // Add
      const newItem: GalleryItem = {
        id: 'g_' + Date.now(),
        title: formTitle,
        category: formCategory,
        description: formDescription,
        imageUrl: formImageUrl,
        date: formDate
      };
      onAddItem(newItem);
    }
    setIsFormModalOpen(false);
  };

  const selectPresetImage = (preset: typeof PRESET_STOCK_IMAGES[0]) => {
    setFormTitle(preset.title);
    setFormCategory(preset.category);
    setFormImageUrl(preset.url);
    setFormDescription(preset.desc);
  };

  return (
    <div id="gallery_manager_view" className="space-y-6">
      
      {/* Upper Dashboard Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase bg-emerald-950/40 border border-emerald-900/30 px-2.5 py-1 rounded-md select-none">
            Media Hub
          </span>
          <h2 className="text-xl font-bold tracking-tight text-white mt-3 font-sans">Club Gallery</h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Add, update, or preview high-fidelity press shots, facility highlights, and matchday imagery
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-950/20 active:scale-95 cursor-pointer leading-none"
        >
          <Plus className="w-4 h-4" /> Upload New Photo
        </button>
      </div>

      {/* Advanced Filter Toolbar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Categories filters */}
        <div className="lg:col-span-8 flex flex-wrap gap-2">
          {['All', 'Matchday', 'Training', 'Facilities', 'Community'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600/10 border-emerald-800 text-emerald-400'
                  : 'bg-slate-900/50 border-slate-850 hover:bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search queries input */}
        <div className="lg:col-span-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search titles & descriptions..."
            className="w-full bg-slate-900 border border-slate-850 text-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-600 font-mono transition-colors"
          />
        </div>
      </div>

      {/* Gallery Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-16 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500">
            <ImageIcon className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-white tracking-tight">No photographs match criteria</p>
            <p className="text-xs text-slate-500 font-mono">No files found with current search tags inside the virtual database</p>
          </div>
          <button
            onClick={openAddModal}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-slate-300 rounded-xl transition-colors cursor-pointer"
          >
            Create first photo entry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="group bg-slate-900 border border-slate-850/60 rounded-2xl overflow-hidden hover:border-slate-800 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Photo frame container */}
                <div className="relative aspect-video overflow-hidden bg-slate-950 cursor-pointer" onClick={() => setActiveViewerItem(item)}>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Category overlay */}
                  <span className="absolute top-3 left-3 px-2 py-1 bg-slate-950/80 border border-slate-800/80 text-[10px] font-bold font-mono uppercase text-emerald-400 rounded-lg backdrop-blur-sm shadow-md select-none">
                    {item.category}
                  </span>
                  
                  {/* Action overlays on hover */}
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <span className="p-2.5 bg-slate-900/90 hover:bg-slate-850 text-white rounded-xl border border-slate-800 shadow transition-all hover:scale-105">
                      <Eye className="w-4 h-4 text-emerald-400" />
                    </span>
                    <span className="text-[11px] text-white font-bold tracking-tight">Click to Expand</span>
                  </div>
                </div>

                {/* Info summary */}
                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 font-sans">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mx-5 py-3.5 border-t border-slate-850/60 flex items-center justify-between text-xs">
                <span className="text-[9px] font-mono text-slate-600 uppercase select-none">
                  ID: {item.id}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-950/15 rounded-xl border border-transparent hover:border-amber-900/40 transition-all cursor-pointer"
                    title="Edit/Update metadata or image link"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Permanently remove photograph "${item.title}"?`)) {
                        onDeleteItem(item.id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/15 rounded-xl border border-transparent hover:border-rose-900/40 transition-all cursor-pointer"
                    title="Delete Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox / Slide viewer Dialog */}
      <AnimatePresence>
        {activeViewerItem && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden max-w-4xl w-full flex flex-col shadow-2xl relative"
            >
              {/* Close Button */}
              <button 
                onClick={() => setActiveViewerItem(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-slate-950/60 hover:bg-slate-950 text-slate-300 hover:text-white rounded-full border border-slate-850 shadow transition-transform active:scale-95 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="aspect-video w-full bg-slate-950">
                <img
                  src={activeViewerItem.imageUrl}
                  alt={activeViewerItem.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 md:p-8 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-emerald-950/60 border border-emerald-900 text-[10px] font-mono font-bold text-emerald-400 rounded-lg">
                      {activeViewerItem.category}
                    </span>
                    <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {activeViewerItem.date}
                    </span>
                  </div>
                  <a 
                    href={activeViewerItem.imageUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1 border border-emerald-955 bg-emerald-950/20 px-2.5 py-1 rounded"
                  >
                    Open Image Link <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
                    {activeViewerItem.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed leading-7">
                    {activeViewerItem.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-850 flex justify-end gap-2 text-xs font-bold">
                  <button
                    onClick={() => {
                      const item = activeViewerItem;
                      setActiveViewerItem(null);
                      openEditModal(item);
                    }}
                    className="px-4 py-2 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850 rounded-xl mr-2 transition-all cursor-pointer"
                  >
                    Update / Make Edits
                  </button>
                  <button
                    onClick={() => setActiveViewerItem(null)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all cursor-pointer"
                  >
                    Close Viewer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create / Edit Form Modal Dialog */}
      <AnimatePresence>
        {isFormModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-850 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4.5 h-4.5 text-amber-400" />
                    <span>{editingItem ? 'Update Photo Settings' : 'Add New Photograph'}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-mono">Fill out metadata, link, or choose from themes</p>
                </div>
                <button
                  onClick={() => setIsFormModalOpen(false)}
                  className="p-1.5 bg-slate-950 text-slate-400 border border-slate-850 rounded-lg hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 custom-scrollbar flex-1">
                
                {/* AI / Presets suggestions */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold font-mono tracking-wider text-emerald-400 uppercase flex items-center gap-1.5 select-none">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" /> Stock Presets & AI Themes
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">Quickly swap contents</span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {PRESET_STOCK_IMAGES.map((preset, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => selectPresetImage(preset)}
                        className="text-left p-2.5 bg-slate-950 border border-slate-850 hover:border-emerald-800/80 rounded-xl transition-all hover:bg-slate-950/70 cursor-pointer space-y-1 group"
                      >
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900">
                          <img 
                            src={preset.url} 
                            alt={preset.title} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-200 block truncate group-hover:text-emerald-400 transition-colors leading-tight">{preset.title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-2 border-t border-slate-850/60">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Title */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-wider uppercase font-bold text-slate-400">Photo Title</label>
                      <input
                        type="text"
                        required
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="e.g. Apex United Trophy Lifting"
                        className="w-full bg-slate-950 border border-slate-850 px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-emerald-600 text-white"
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-wider uppercase font-bold text-slate-400">Category</label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value as GalleryCategory)}
                        className="w-full bg-slate-950 border border-slate-850 px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-emerald-600 text-white"
                      >
                        <option value="Matchday">Matchday</option>
                        <option value="Training">Training</option>
                        <option value="Facilities">Facilities</option>
                        <option value="Community">Community</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Direct Image URL input */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-wider uppercase font-bold text-slate-400">Image Asset URL</label>
                      <input
                        type="url"
                        required
                        value={formImageUrl}
                        onChange={(e) => setFormImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/photo..."
                        className="w-full bg-slate-950 border border-slate-850 px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-emerald-600 text-white font-mono"
                      />
                    </div>

                    {/* Date field */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-wider uppercase font-bold text-slate-400">Date Captured</label>
                      <input
                        type="date"
                        required
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-emerald-600 text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Photo description */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-wider uppercase font-bold text-slate-400 font-sans">Short Description</label>
                    <textarea
                      placeholder="Add historical context, specific players, event commentary etc."
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-950 border border-slate-850 p-3 text-xs rounded-xl focus:outline-none focus:border-emerald-600 text-white"
                    ></textarea>
                  </div>
                </div>

                {/* Submit area */}
                <div className="pt-4 border-t border-slate-850 flex items-center justify-between shrink-0 font-sans">
                  <div className="text-[10px] font-mono text-slate-500">
                    * Saved inside LocalStorage context
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsFormModalOpen(false)}
                      className="px-4 py-2 bg-slate-950 hover:bg-slate-850 text-slate-300 font-bold border border-slate-850 text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors shadow-lg shadow-emerald-900/10 cursor-pointer"
                    >
                      <Save className="w-4 h-4" /> Save Photo Update
                    </button>
                  </div>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
