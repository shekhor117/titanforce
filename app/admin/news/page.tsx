"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { Plus, Edit, Trash2, X } from "lucide-react"

interface NewsPost {
  id: string
  admin_id: string
  title: string
  content: string
  image_url?: string
  published: boolean
  created_at: string
}

export default function AdminNews() {
  const { language } = useLanguage()
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<NewsPost>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const isBn = language === "bn"

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/news-posts")
      if (!response.ok) throw new Error("Failed to fetch posts")
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error("[v0] Error loading posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSaving(true)
      const url = editingId ? `/api/news-posts` : `/api/news-posts`
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: editingId,
          title: formData.title,
          content: formData.content,
          imageUrl: formData.image_url,
          published: formData.published,
        }),
      })

      if (!response.ok) throw new Error("Failed to save post")
      resetForm()
      await fetchPosts()
    } catch (error) {
      console.error("[v0] Error saving post:", error)
      alert(isBn ? "ত্রুটি ঘটেছে" : "Error saving post")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm(isBn ? "এই পোস্ট মুছতে চান?" : "Delete this post?")) return

    try {
      const response = await fetch(`/api/news-posts?postId=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete post")
      await fetchPosts()
    } catch (error) {
      console.error("[v0] Error deleting post:", error)
    }
  }

  const handleEdit = (post: NewsPost) => {
    setFormData(post)
    setEditingId(post.id)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({})
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`font-[var(--font-display)] text-3xl tracking-wider text-foreground ${
              isBn ? "font-[var(--font-bengali)]" : ""
            }`}
          >
            {isBn ? "খবর ব্যবস্থাপনা" : "News Management"}
          </h1>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition ${
            isBn ? "font-[var(--font-bengali)]" : ""
          }`}
        >
          <Plus className="w-4 h-4" />
          {isBn ? "পোস্ট যোগ করুন" : "Add Post"}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="rounded-xl border-2 border-primary bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3
              className={`font-[var(--font-display)] text-xl tracking-wider ${
                isBn ? "font-[var(--font-bengali)]" : ""
              }`}
            >
              {editingId ? (isBn ? "পোস্ট সম্পাদনা করুন" : "Edit Post") : (isBn ? "নতুন পোস্ট" : "New Post")}
            </h3>
            <button onClick={resetForm} className="p-1 hover:bg-secondary rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder={isBn ? "শিরোনাম" : "Title"}
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground"
              required
            />

            <textarea
              placeholder={isBn ? "বিষয়বস্তু" : "Content"}
              value={formData.content || ""}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground h-40 resize-none"
              required
            />

            <input
              type="url"
              placeholder={isBn ? "ছবির URL" : "Image URL"}
              value={formData.image_url || ""}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent text-foreground"
            />

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published || false}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4"
              />
              <span className={`text-sm font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "প্রকাশিত" : "Published"}
              </span>
            </label>

            <button
              type="submit"
              disabled={isSaving}
              className={`w-full px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition ${
                isBn ? "font-[var(--font-bengali)]" : ""
              }`}
            >
              {isSaving ? (isBn ? "সংরক্ষণ করছে..." : "Saving...") : (isBn ? "সংরক্ষণ করুন" : "Save")}
            </button>
          </form>
        </div>
      )}

      {/* Posts List */}
      {isLoading ? (
        <div className="text-center py-8 text-foreground/60">{isBn ? "লোড হচ্ছে..." : "Loading..."}</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8 text-foreground/60">{isBn ? "কোন পোস্ট নেই" : "No posts"}</div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="rounded-xl border-2 border-secondary bg-card p-4 hover:border-primary transition">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className={`font-semibold text-lg text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {post.title}
                  </h3>
                  <p className={`text-sm text-foreground/60 mt-1 line-clamp-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {post.content}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs">
                    <span className={`text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                    <span
                      className={`px-2 py-1 rounded ${
                        post.published
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {post.published
                        ? isBn
                          ? "প্রকাশিত"
                          : "Published"
                        : isBn
                        ? "ড্র্যাফট"
                        : "Draft"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(post)}
                    className="p-2 rounded hover:bg-primary/20 transition text-primary"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 rounded hover:bg-red-500/20 transition text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
