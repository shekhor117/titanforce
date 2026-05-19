"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { Plus, Edit, Trash2, X, Save } from "lucide-react"
import { getDataService } from "@/lib/data-service"
import type { NewsItem } from "@/lib/data-service"

export default function AdminNews() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [showForm, setShowForm] = useState(false)
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null)
  const [news, setNews] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    category: "club" as "club" | "player" | "match" | "achievement",
    status: "draft" as "draft" | "published",
    featured: false,
    image: "",
  })

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    try {
      setIsLoading(true)
      const dataService = getDataService()
      const data = await dataService.getNewsItems()
      setNews(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("[v0] Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveNews = async () => {
    if (!formData.title || !formData.content) {
      alert(isBn ? "শিরোনাম এবং বিষয়বস্তু প্রয়োজন" : "Title and content required")
      return
    }

    try {
      const dataService = getDataService()
      const newsData = {
        title: formData.title,
        excerpt: formData.excerpt || formData.content.substring(0, 150),
        content: formData.content,
        author: formData.author || "Admin",
        category: formData.category,
        status: formData.status,
        featured: formData.featured,
        image: formData.image,
      }

      if (editingNews) {
        await dataService.updateNewsItem(editingNews.id, newsData)
      } else {
        await dataService.createNewsItem(newsData)
      }

      await loadNews()
      resetForm()
    } catch (error) {
      console.error("[v0] Error:", error)
    }
  }

  const handleDeleteNews = async (id: string) => {
    if (!confirm(isBn ? "নিশ্চিত?" : "Sure?")) return

    try {
      const dataService = getDataService()
      await dataService.deleteNewsItem(id)
      await loadNews()
    } catch (error) {
      console.error("[v0] Error:", error)
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
    setEditingNews(null)
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{isBn ? "খবর পরিচালনা" : "News"}</h1>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded"
          >
            <Plus className="w-4 h-4" /> {isBn ? "নতুন" : "Add"}
          </button>
        </div>

        {showForm && (
          <div className="bg-muted p-4 rounded-lg mb-6 space-y-3">
            <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-border rounded" />
            <textarea placeholder="Content" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} rows={5} className="w-full px-3 py-2 border border-border rounded" />
            <input type="text" placeholder="Author" value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} className="w-full px-3 py-2 border border-border rounded" />
            <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as any})} className="w-full px-3 py-2 border border-border rounded">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <div className="flex gap-2">
              <button onClick={handleSaveNews} className="flex-1 bg-green-600 text-white py-2 rounded">Save</button>
              <button onClick={resetForm} className="flex-1 bg-gray-600 text-white py-2 rounded">Cancel</button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {news.map(article => (
            <div key={article.id} className="border border-border rounded-lg p-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold">{article.title}</h3>
                  <p className="text-sm text-muted-foreground">{article.status}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingNews(article); setFormData({...formData, title: article.title, content: article.content}); setShowForm(true); }} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Edit</button>
                  <button onClick={() => handleDeleteNews(article.id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
