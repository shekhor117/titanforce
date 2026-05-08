"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { Plus, Edit, Trash2, X, Save, Eye, EyeOff, Calendar } from "lucide-react"
import { PhotoUpload } from "@/components/photo-upload"
import { dataStore, NewsItem, useDataStore } from "@/lib/data-store"

export default function AdminNews() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [showForm, setShowForm] = useState(false)
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null)
  const [filter, setFilter] = useState<"all" | "draft" | "published">("all")
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    category: "club" as NewsItem["category"],
    status: "draft" as NewsItem["status"],
    featured: false,
    image: "",
  })

  // Get news from data store
  const news = useDataStore(dataStore.getNews, "news")

  const handleImageUpload = (data: { signedUrl: string; filePath: string }) => {
    setFormData((prev) => ({ ...prev, image: data.signedUrl }))
  }

  const handleImageDelete = () => {
    setFormData((prev) => ({ ...prev, image: "" }))
  }

  const handleSaveNews = () => {
    if (!formData.title || !formData.content) {
      alert(isBn ? "শিরোনাম এবং বিষয়বস্তু প্রয়োজন" : "Title and content are required")
      return
    }

    if (editingNews) {
      dataStore.updateNews(editingNews.id, {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        author: formData.author || "Admin",
        category: formData.category,
        status: formData.status,
        featured: formData.featured,
        image: formData.image,
      })
      setEditingNews(null)
    } else {
      dataStore.addNews({
        title: formData.title,
        excerpt: formData.excerpt || formData.content.substring(0, 150) + "...",
        content: formData.content,
        author: formData.author || "Admin",
        category: formData.category,
        status: formData.status,
        featured: formData.featured,
        image: formData.image,
        publishDate: new Date().toLocaleDateString(),
      })
    }
    
    resetForm()
  }

  const handleEditNews = (article: NewsItem) => {
    setEditingNews(article)
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      author: article.author,
      category: article.category,
      status: article.status,
      featured: article.featured,
      image: article.image || "",
    })
    setShowForm(true)
  }

  const handleDeleteNews = (newsId: string) => {
    if (!confirm(isBn ? "এই সংবাদ মুছতে চান?" : "Delete this news article?")) return
    dataStore.deleteNews(newsId)
  }

  const handleToggleStatus = (newsId: string) => {
    const article = news.find(n => n.id === newsId)
    if (article) {
      dataStore.updateNews(newsId, { 
        status: article.status === "published" ? "draft" : "published" 
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      author: "",
      category: "club",
      status: "draft",
      featured: false,
      image: "",
    })
    setShowForm(false)
    setEditingNews(null)
  }

  const filteredNews = filter === "all" ? news : news.filter(n => n.status === filter)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className={`font-[var(--font-display)] text-3xl tracking-wider text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "সংবাদ ব্যবস্থাপনা" : "News Management"}
        </h1>
        <button
          onClick={() => {
            resetForm()
            setShowForm(!showForm)
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
        >
          <Plus className="w-4 h-4" />
          {isBn ? "সংবাদ যোগ করুন" : "Add News"}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "published", "draft"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              filter === tab
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/30 text-foreground/60 hover:bg-secondary/50"
            }`}
          >
            {tab === "all" && (isBn ? "সব" : "All")}
            {tab === "published" && (isBn ? "প্রকাশিত" : "Published")}
            {tab === "draft" && (isBn ? "খসড়া" : "Draft")}
          </button>
        ))}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="rounded-xl border-2 border-primary bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-[var(--font-display)] text-xl tracking-wider ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {editingNews 
                ? (isBn ? "সংবাদ সম্পাদনা" : "Edit News")
                : (isBn ? "নতুন সংবাদ" : "New News Article")
              }
            </h3>
            <button onClick={resetForm} className="p-2 hover:bg-secondary/20 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "ছবি" : "Featured Image"}
              </label>
              <PhotoUpload
                currentPhoto={formData.image}
                currentFilePath=""
                onPhotoUpload={handleImageUpload}
                onPhotoDelete={handleImageDelete}
              />
            </div>
            <input
              type="text"
              placeholder={isBn ? "শিরোনাম" : "Title"}
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
            />
            <input
              type="text"
              placeholder={isBn ? "সংক্ষিপ্ত বিবরণ" : "Excerpt"}
              value={formData.excerpt}
              onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
              className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
            />
            <textarea
              placeholder={isBn ? "বিষয়বস্তু" : "Content"}
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
              rows={6}
              className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none resize-none"
            />
            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder={isBn ? "লেখক" : "Author"}
                value={formData.author}
                onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value as NewsItem["category"] }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              >
                <option value="club">{isBn ? "ক্লাব" : "Club"}</option>
                <option value="match">{isBn ? "ম্যাচ" : "Match"}</option>
                <option value="transfer">{isBn ? "ট্রান্সফার" : "Transfer"}</option>
                <option value="community">{isBn ? "কমিউনিটি" : "Community"}</option>
              </select>
              <select
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as NewsItem["status"] }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              >
                <option value="draft">{isBn ? "খসড়া" : "Draft"}</option>
                <option value="published">{isBn ? "প্রকাশিত" : "Published"}</option>
              </select>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                className="w-4 h-4 accent-primary"
              />
              <span className={isBn ? "font-[var(--font-bengali)]" : ""}>
                {isBn ? "ফিচার্ড নিউজ" : "Featured News"}
              </span>
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleSaveNews}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
              >
                <Save className="w-4 h-4" />
                {editingNews ? (isBn ? "আপডেট করুন" : "Update") : (isBn ? "সংরক্ষণ করুন" : "Save")}
              </button>
              <button
                onClick={resetForm}
                className={`px-4 py-2 rounded border-2 border-secondary hover:bg-secondary/10 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
              >
                {isBn ? "বাতিল" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* News List */}
      <div className="space-y-4">
        {filteredNews.map((article) => (
          <div key={article.id} className="rounded-xl border-2 border-secondary bg-card p-6 hover:border-primary transition">
            <div className="flex items-start gap-4">
              {article.image && (
                <img src={article.image} alt={article.title} className="w-24 h-24 rounded-lg object-cover flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-lg font-semibold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {article.title}
                      </h3>
                      {article.featured && (
                        <span className="px-2 py-0.5 rounded text-xs bg-yellow-500/20 text-yellow-400">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-foreground/60 mt-1 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-foreground/50">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {article.publishDate}
                      </span>
                      <span>{article.author}</span>
                      <span className="px-2 py-0.5 rounded bg-secondary/50 text-foreground/70">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      article.status === "published" 
                        ? "bg-green-500/20 text-green-400" 
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {article.status === "published" ? (isBn ? "প্রকাশিত" : "Published") : (isBn ? "খসড়া" : "Draft")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleToggleStatus(article.id)}
                  className={`p-2 rounded transition ${
                    article.status === "published" 
                      ? "hover:bg-yellow-500/20 text-yellow-400" 
                      : "hover:bg-green-500/20 text-green-400"
                  }`}
                  title={article.status === "published" ? (isBn ? "খসড়ায় ফেরত" : "Unpublish") : (isBn ? "প্রকাশ করুন" : "Publish")}
                >
                  {article.status === "published" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => handleEditNews(article)}
                  className="p-2 rounded hover:bg-primary/20 transition text-primary"
                  title={isBn ? "সম্পাদনা করুন" : "Edit"}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteNews(article.id)}
                  className="p-2 rounded hover:bg-red-500/20 transition text-red-400"
                  title={isBn ? "মুছুন" : "Delete"}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredNews.length === 0 && (
          <div className="text-center py-12 text-foreground/60 rounded-xl border-2 border-secondary bg-card">
            <p className={isBn ? "font-[var(--font-bengali)]" : ""}>
              {isBn ? "কোন সংবাদ পাওয়া যায়নি" : "No news articles found"}
            </p>
            <p className={`text-sm mt-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "নতুন সংবাদ যোগ করতে উপরের বোতাম ক্লিক করুন" : "Click the button above to add a news article"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
