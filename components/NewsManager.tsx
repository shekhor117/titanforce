import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Newspaper, 
  Plus, 
  X, 
  Eye, 
  MousePointerClick, 
  Calendar, 
  User, 
  Trash2, 
  CheckCircle, 
  Edit2, 
  AlertTriangle,
  Heart,
  ExternalLink,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { NewsArticle, NewsCategory } from '../types';

interface NewsManagerProps {
  articles: NewsArticle[];
  onAddArticle: (article: NewsArticle) => void;
  onUpdateArticle: (article: NewsArticle) => void;
  onDeleteArticle: (articleId: string) => void;
}

const INITIAL_ARTICLE_FORM = {
  id: '',
  title: '',
  category: 'Match Report' as NewsCategory,
  summary: '',
  content: '',
  author: '',
  date: '',
  status: 'Published' as 'Draft' | 'Published',
  views: 0,
  clicks: 0
};

export default function NewsManager({
  articles,
  onAddArticle,
  onUpdateArticle,
  onDeleteArticle
}: NewsManagerProps) {
  // Query Filters State
  const [filter, setFilter] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modal toggles
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeReaderArticle, setActiveReaderArticle] = useState<NewsArticle | null>(null);
  
  // Forms data
  const [formData, setFormData] = useState(INITIAL_ARTICLE_FORM);
  const [formError, setFormError] = useState('');
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

  // Filtering list
  const filteredArticles = articles.filter(art => {
    const matchesStatus = filter === 'ALL' || art.status === filter;
    const matchesCategory = selectedCategory === 'ALL' || art.category === selectedCategory;
    return matchesStatus && matchesCategory;
  });

  const handleOpenAddForm = () => {
    setFormData({
      ...INITIAL_ARTICLE_FORM,
      id: 'n_' + Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      author: 'Apex Media Relations'
    });
    setEditingArticleId(null);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (article: NewsArticle, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering open reader
    setFormData({ ...article });
    setEditingArticleId(article.id);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Article title is required.');
      return;
    }
    if (!formData.summary.trim()) {
      setFormError('Article summary/headline is required.');
      return;
    }
    if (!formData.content.trim()) {
      setFormError('Detailed content is required.');
      return;
    }

    if (editingArticleId) {
      onUpdateArticle(formData as NewsArticle);
    } else {
      onAddArticle(formData as NewsArticle);
    }
    setIsFormOpen(false);
  };

  const triggerArticlePublish = (article: NewsArticle, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateArticle({
      ...article,
      status: article.status === 'Published' ? 'Draft' : 'Published'
    });
  };

  // Simulates users reading and clicking on published news
  const simulateTraffic = (article: NewsArticle, e: React.MouseEvent) => {
    e.stopPropagation();
    const viewsMultiplier = Math.floor(Math.random() * 80) + 20;
    const clicksMultiplier = Math.floor(viewsMultiplier * (Math.random() * 0.4 + 0.1));
    
    onUpdateArticle({
      ...article,
      views: article.views + viewsMultiplier,
      clicks: article.clicks + clicksMultiplier
    });
  };

  const getCategoryTheme = (category: NewsCategory) => {
    switch (category) {
      case 'Match Report':
        return 'bg-emerald-950 text-emerald-400 border border-emerald-900/40';
      case 'Transfer Room':
        return 'bg-purple-950 text-purple-400 border border-purple-900/40';
      case 'Injury Update':
        return 'bg-rose-950 text-rose-400 border border-rose-900/40';
      case 'Club Announcement':
        return 'bg-sky-950 text-sky-400 border border-sky-900/40';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Control filtering row */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Status filters */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850">
            {['ALL', 'Published', 'Draft'].map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filter === st
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Category Select Filters */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs font-semibold px-3 py-2.5 rounded-xl outline-none text-slate-300 focus:border-slate-700 font-mono tracking-wide"
          >
            <option value="ALL">ALL CATEGORIES</option>
            <option value="Match Report">MATCH REPORTS</option>
            <option value="Transfer Room">TRANSFER WINDOW</option>
            <option value="Injury Update">INJURY HEALTH</option>
            <option value="Club Announcement">ANNOUNCEMENTS</option>
          </select>
        </div>

        <button
          onClick={handleOpenAddForm}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Newspaper className="w-4 h-4" /> Draft Press Article
        </button>
      </div>

      {/* Main articles listing */}
      {filteredArticles.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center space-y-3">
          <span className="w-12 h-12 rounded-full border border-slate-850 bg-slate-950/40 text-slate-600 flex items-center justify-center mx-auto text-xl">
            📰
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-300">No press stories configured</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Draft media statements, club transfers, medical reports or news headlines to broadcast to fans.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredArticles.map((article) => (
              <motion.div
                key={article.id}
                layoutId={article.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => setActiveReaderArticle(article)}
                className="bg-slate-900 border border-slate-800/85 hover:border-slate-700/80 rounded-2xl p-5 overflow-hidden flex flex-col justify-between space-y-4 hover:shadow-md hover:shadow-slate-950/20 cursor-pointer group transition-all"
              >
                {/* News tag, date and status */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`text-[9px] font-mono font-black px-2.5 py-1 rounded tracking-wider ${getCategoryTheme(article.category)}`}>
                      {article.category.toUpperCase()}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                      <span>{article.date}</span>
                      <span>●</span>
                      <span className={article.status === 'Published' ? 'text-emerald-500' : 'text-amber-500'}>
                        {article.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Title and summary */}
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 leading-snug transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed font-sans">
                      {article.summary}
                    </p>
                  </div>
                </div>

                {/* Footer specs - Author, interactive reader count, configure actions */}
                <div className="pt-4 border-t border-slate-850 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                    <User className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[130px]">{article.author}</span>
                  </div>

                  {/* Simulation read buttons & specs */}
                  <div className="flex items-center gap-3">
                    {article.status === 'Published' ? (
                      <div className="flex items-center gap-3.5 text-[10px] text-slate-500 font-mono">
                        <span className="flex items-center gap-1" title="Views">
                          <Eye className="w-3.5 h-3.5" /> {article.views}
                        </span>
                        <span className="flex items-center gap-1" title="Clicks">
                          <MousePointerClick className="w-3.5 h-3.5" /> {article.clicks}
                        </span>
                        
                        <button
                          onClick={(e) => simulateTraffic(article, e)}
                          className="text-[9px] bg-slate-950 hover:bg-slate-850 hover:text-emerald-400 text-slate-500 border border-slate-850 px-2 py-1 rounded transition-colors font-bold cursor-pointer"
                          title="Simulate active traffic"
                        >
                          +Simulate Reads
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] font-mono text-amber-500 bg-amber-950/20 px-2 py-0.5 border border-amber-900/30 rounded">
                        Draft Status
                      </span>
                    )}

                    {/* Operational controls */}
                    <div className="flex items-center gap-1 bg-slate-950 rounded-lg p-0.5 border border-slate-850">
                      <button
                        onClick={(e) => handleOpenEditForm(article, e)}
                        className="p-1 px-1.5 text-slate-400 hover:text-white rounded text-[10px] font-medium hover:bg-slate-900 transition-colors cursor-pointer"
                        title="Edit Article"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerArticlePublish(article, e);
                        }}
                        className={`p-1 px-1.5 rounded text-[10px] font-mono font-bold leading-none cursor-pointer ${
                          article.status === 'Published' 
                            ? 'text-rose-400 hover:bg-rose-950/20' 
                            : 'text-emerald-400 hover:bg-emerald-950/20'
                        }`}
                        title={article.status === 'Published' ? 'Unpublish to Draft' : 'Publish to Feed'}
                      >
                        {article.status === 'Published' ? 'Draft' : 'Publish'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Delete this article?')) {
                            onDeleteArticle(article.id);
                          }
                        }}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-900 transition-all cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Elegant Immersive Magazine Article Reader Modal */}
      <AnimatePresence>
        {activeReaderArticle && (
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setActiveReaderArticle(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
              onClick={e => e.stopPropagation()} // Avoid closing
            >
              <div className="p-5 border-b border-slate-850 flex justify-between items-center bg-slate-950/40">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <BookOpen className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">PRESS READER PREVIEW</span>
                </div>
                <button
                  onClick={() => setActiveReaderArticle(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Reader detailed content */}
              <div className="p-8 overflow-y-auto space-y-6 flex-1 custom-scrollbar max-w-2xl mx-auto">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-mono font-black px-2.5 py-1 rounded tracking-wider ${getCategoryTheme(activeReaderArticle.category)}`}>
                      {activeReaderArticle.category.toUpperCase()}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                      <span>{activeReaderArticle.date}</span>
                      <span>•</span>
                      <span>By {activeReaderArticle.author}</span>
                    </div>
                  </div>

                  <h1 className="text-xl md:text-2xl font-black font-sans text-white tracking-tight leading-snug">
                    {activeReaderArticle.title}
                  </h1>

                  {/* Summary Callout banner */}
                  <blockquote className="border-l-4 border-emerald-500 pl-4 py-1 bg-slate-950/40 rounded-r-xl pr-4 text-xs font-medium text-slate-300 italicLeading font-sans">
                    {activeReaderArticle.summary}
                  </blockquote>
                </div>

                {/* Substantial News Text representation */}
                <div className="text-slate-300 text-xs md:text-sm leading-relaxed space-y-4 font-sans border-t border-slate-850 pt-6">
                  {activeReaderArticle.content.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                {/* Simulated readers metrics block */}
                <div className="pt-6 border-t border-slate-850 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <div className="flex items-center gap-4">
                    <span>👥 {activeReaderArticle.views} Active Followers</span>
                    <span>🔗 {activeReaderArticle.clicks} Link clicks</span>
                  </div>
                  <div>
                    <span className={`px-2 py-0.5 rounded-full ${activeReaderArticle.status === 'Published' ? 'bg-emerald-990 text-emerald-400' : 'bg-amber-990 text-amber-500'}`}>
                      {activeReaderArticle.status}
                    </span>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* News Draft Edit Modal Drawer */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-5 border-b border-slate-800 bg-slate-950/40 flex justify-between items-center bg-slate-950/40 font-sans">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Newspaper className="w-5 h-5" />
                  </span>
                  <h3 className="text-sm font-bold text-white uppercase">
                    {editingArticleId ? 'Modify Press Article' : 'Draft Press Article'}
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
              <form onSubmit={handleSaveArticle} className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
                
                {formError && (
                  <div className="p-3.5 bg-rose-950/60 text-xs text-rose-400 font-medium rounded-xl border border-rose-900/50 flex items-center gap-2">
                    <AlertTriangle className="w-4.5 h-4.5" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Category & Title */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Article Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Apex United clinches champion crown"
                      className="w-full bg-slate-950 border border-slate-800 outline-none focus:border-slate-700 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Category Tag</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as NewsCategory }))}
                      className="w-full bg-slate-950 border border-slate-800 outline-none focus:border-slate-700 text-slate-200 text-xs px-2 py-2.5 rounded-xl font-mono"
                    >
                      <option value="Match Report">Match Report</option>
                      <option value="Transfer Room">Transfer Room</option>
                      <option value="Club Announcement">Club Announcement</option>
                      <option value="Injury Update">Injury Update</option>
                    </select>
                  </div>
                </div>

                {/* Subtitle/Summary */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Headline Summary</label>
                  <textarea
                    required
                    rows={2}
                    value={formData.summary}
                    onChange={e => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                    placeholder="Provide a quick 1-2 sentence hook for feed cards..."
                    className="w-full bg-slate-950 border border-slate-800 outline-none focus:border-slate-700 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl font-sans"
                  />
                </div>

                {/* Main Content */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Detailed Article Body</label>
                  <textarea
                    required
                    rows={6}
                    value={formData.content}
                    onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Expand story details. Use double returns for clean paragraphs..."
                    className="w-full bg-slate-950 border border-slate-800 outline-none focus:border-slate-700 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl font-sans"
                  />
                </div>

                {/* Author Selection, Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-850 pt-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Author / Source</label>
                    <input
                      type="text"
                      required
                      value={formData.author}
                      onChange={e => setFormData(prev => ({ ...prev, author: e.target.value }))}
                      placeholder="e.g. Club Journalist"
                      className="w-full bg-slate-950 border border-slate-800 outline-none focus:border-slate-700 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Publish Date</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 outline-none focus:border-slate-700 text-slate-200 text-xs px-3 py-2.5 rounded-xl font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Initial Status</label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as 'Draft' | 'Published' }))}
                      className="w-full bg-slate-950 border border-slate-800 outline-none focus:border-slate-700 text-slate-200 text-xs px-2 py-2.5 rounded-xl font-mono"
                    >
                      <option value="Published">Published immediately</option>
                      <option value="Draft">Save as Draft</option>
                    </select>
                  </div>
                </div>

                {/* Actions Panel */}
                <div className="pt-5 border-t border-slate-800 flex justify-end gap-3 flex-shrink-0 font-sans">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 bg-slate-950/40 border border-slate-800 hover:bg-slate-800 hover:text-white rounded-xl text-xs font-semibold text-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-650 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" /> Save Story
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
