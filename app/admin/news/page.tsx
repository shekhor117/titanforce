"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { Plus, Edit, Trash2, X, Save, Eye, EyeOff, Calendar } from "lucide-react"
import { PhotoUpload } from "@/components/photo-upload"

interface NewsArticle {
  id: string
  title: string
  titleBn?: string
  content: string
  contentBn?: string
  image_url?: string
  status: "draft" | "published"
  created_at: string
  author: string
}

export default function AdminNews() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [showForm, setShowForm] = useState(false)
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null)
  const [filter, setFilter] = useState<"all" | "draft" | "published">("all")
  const [formData, setFormData] = useState({
    title: "",
    titleBn: "",
    content: "",
    contentBn: "",
    author: "",
    status: "draft" as NewsArticle["status"],
    image: { signedUrl: "", filePath: "" },
  })
  const [news, setNews] = useState<NewsArticle[]>([])

  const handleImageUpload = (data: { signedUrl: string; filePath: string }) => {
    setFormData((prev) => ({ ...prev, image: data }))
  }

  const handleImageDelete = () => {
    setFormData((prev) => ({ ...prev, image: { signedUrl: "", filePath: "" } }))
  }

  const handleSaveNews = () => {
    if (!formData.title || !formData.content) {
      alert(isBn ? "শিরোনাম এবং বিষয়বস্তু প্রয়োজন" : "Title and content are required")
      return
    }

    if (editingNews) {
      setNews(news.map(n => 
        n.id === editingNews.id 
          ? { 
              ...n,
              title: formData.title,
              titleBn: formData.titleBn,
              content: formData.content,
              contentBn: formData.contentBn,
              author: formData.author,
              status: formData.status,
              image_url: formData.image.signedUrl,
            } 
          : n
      ))
      setEditingNews(null)
    } else {
      const newArticle: NewsArticle = {
        id: Math.random().toString(36).substr(2, 9),
        title: formData.title,
        titleBn: formData.titleBn,
        content: formData.content,
        contentBn: formData.contentBn,
        author: formData.author || "Admin",
        status: formData.status,
        image_url: formData.image.signedUrl,
        created_at: new Date().toLocaleDateString(),
      }
      setNews([newArticle, ...news])
    }
    
    resetForm()
  }

  const handleEditNews = (article: NewsArticle) => {
    setEditingNews(article)
    setFormData({
      title: article.title,
      titleBn: article.titleBn || "",
      content: article.content,
      contentBn: article.contentBn || "",
      author: article.author,
      status: article.status,
      image: { signedUrl: article.image_url || "", filePath: "" },
    })
    setShowForm(true)
  }

  const handleDeleteNews = async (newsId: string) => {
    if (!confirm(isBn ? "এই সংবাদ মুছতে চান?" : "Delete this news article?")) return
    setNews(news.filter((n) => n.id !== newsId))
  }

  const handleToggleStatus = (newsId: string) => {
    setNews(news.map(n => 
      n.id === newsId 
        ? { ...n, status: n.status === "published" ? "draft" as const : "published" as const } 
        : n
    ))
  }

  const resetForm = () => {
    setFormData({
      title: "",
      titleBn: "",
      content: "",
      contentBn: "",
      author: "",
      status: "draft",
      image: { signedUrl: "", filePath: "" },
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
                currentPhoto={formData.image.signedUrl}
                currentFilePath={formData.image.filePath}
                onPhotoUpload={handleImageUpload}
                onPhotoDelete={handleImageDelete}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={isBn ? "শিরোনাম (ইংরেজি)" : "Title (English)"}
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              />
              <input
                type="text"
                placeholder={isBn ? "শিরোনাম (বাংলা)" : "Title (Bengali)"}
                value={formData.titleBn}
                onChange={(e) => setFormData((prev) => ({ ...prev, titleBn: e.target.value }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              />
            </div>
            <textarea
              placeholder={isBn ? "বিষয়বস্তু (ইংরেজি)" : "Content (English)"}
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
              rows={4}
              className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none resize-none"
            />
            <textarea
              placeholder={isBn ? "বিষয়বস্তু (বাংলা)" : "Content (Bengali)"}
              value={formData.contentBn}
              onChange={(e) => setFormData((prev) => ({ ...prev, contentBn: e.target.value }))}
              rows={4}
              className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none resize-none"
            />
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={isBn ? "লেখক" : "Author"}
                value={formData.author}
                onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as NewsArticle["status"] }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              >
                <option value="draft">{isBn ? "খসড়া" : "Draft"}</option>
                <option value="published">{isBn ? "প্রকাশিত" : "Published"}</option>
              </select>
            </div>
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
              {article.image_url && (
                <img src={article.image_url} alt={article.title} className="w-24 h-24 rounded-lg object-cover flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className={`text-lg font-semibold text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                      {isBn && article.titleBn ? article.titleBn : article.title}
                    </h3>
                    <p className="text-sm text-foreground/60 mt-1 line-clamp-2">
                      {isBn && article.contentBn ? article.contentBn : article.content}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-foreground/50">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {article.created_at}
                      </span>
                      <span>{article.author}</span>
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
