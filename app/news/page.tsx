"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { createClient } from "@/lib/supabase/client"
import { Send, Trash2 } from "lucide-react"

interface Comment {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  profiles: {
    id: string
    full_name: string
    photo_url?: string
  }
}

interface NewsPost {
  id: string
  admin_id: string
  title: string
  content: string
  image_url?: string
  published: boolean
  created_at: string
  profiles: {
    id: string
    full_name: string
    photo_url?: string
  }
}

export default function NewsPage() {
  const { language } = useLanguage()
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [comments, setComments] = useState<Record<string, Comment[]>>({})
  const [commentContent, setCommentContent] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const isBn = language === "bn"
  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setCurrentUser(user?.id || null)
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/news-posts?published=true")
        if (!response.ok) throw new Error("Failed to fetch posts")
        const data = await response.json()
        setPosts(data)
      } catch (error) {
        console.error("[v0] Error loading posts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const fetchComments = async (postId: string) => {
    try {
      const response = await fetch(`/api/news-comments?postId=${postId}`)
      if (!response.ok) throw new Error("Failed to fetch comments")
      const data = await response.json()
      setComments((prev) => ({ ...prev, [postId]: data }))
    } catch (error) {
      console.error("[v0] Error loading comments:", error)
    }
  }

  const handlePostComment = async (postId: string) => {
    if (!currentUser || !commentContent[postId]?.trim()) return

    try {
      const response = await fetch("/api/news-comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          content: commentContent[postId],
        }),
      })

      if (!response.ok) throw new Error("Failed to post comment")
      setCommentContent((prev) => ({ ...prev, [postId]: "" }))
      await fetchComments(postId)
    } catch (error) {
      console.error("[v0] Error posting comment:", error)
    }
  }

  const handleDeleteComment = async (commentId: string, postId: string) => {
    if (!window.confirm(isBn ? "মন্তব্য মুছতে চান?" : "Delete comment?")) return

    try {
      const response = await fetch(`/api/news-comments?commentId=${commentId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete comment")
      await fetchComments(postId)
    } catch (error) {
      console.error("[v0] Error deleting comment:", error)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-12 px-4 border-b-2 border-secondary">
        <div className="max-w-4xl mx-auto">
          <h1
            className={`font-[var(--font-display)] text-5xl tracking-wider text-foreground mb-2 ${
              isBn ? "font-[var(--font-bengali)]" : ""
            }`}
          >
            {isBn ? "খবর" : "News"}
          </h1>
          <p className={`text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "টাইটান ফোর্সের সর্বশেষ খবর এবং আপডেট" : "Latest news and updates from Titan Force"}
          </p>
        </div>
      </section>

      {/* News Feed */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {isLoading ? (
            <div className="text-center py-12 text-foreground/60">
              {isBn ? "লোড হচ্ছে..." : "Loading..."}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 text-foreground/60">
              {isBn ? "কোন খবর নেই" : "No news available"}
            </div>
          ) : (
            posts.map((post) => (
              <article
                key={post.id}
                className="rounded-xl border-2 border-secondary bg-card p-6 hover:border-primary transition"
              >
                {/* Post Header */}
                <div className="mb-4">
                  <h2
                    className={`font-[var(--font-display)] text-2xl tracking-wider text-foreground mb-2 ${
                      isBn ? "font-[var(--font-bengali)]" : ""
                    }`}
                  >
                    {post.title}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-foreground/60">
                    {post.profiles?.photo_url && (
                      <img
                        src={post.profiles.photo_url}
                        alt={post.profiles.full_name}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span>{post.profiles?.full_name}</span>
                    <span>•</span>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Post Image */}
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-80 object-cover rounded-lg mb-4"
                  />
                )}

                {/* Post Content */}
                <p className={`text-foreground/80 mb-6 whitespace-pre-wrap ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {post.content}
                </p>

                {/* Comments Section */}
                <div className="border-t border-secondary pt-6">
                  <h3
                    className={`font-semibold text-lg mb-4 ${
                      isBn ? "font-[var(--font-bengali)]" : ""
                    }`}
                  >
                    {isBn ? "মন্তব্য" : "Comments"} ({comments[post.id]?.length || 0})
                  </h3>

                  {/* Comments List */}
                  <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                    {comments[post.id]?.map((comment) => (
                      <div
                        key={comment.id}
                        className="p-3 rounded bg-secondary/20 flex items-start justify-between gap-3"
                      >
                        <div className="flex-1">
                          <div className="font-semibold text-sm text-foreground">
                            {comment.profiles?.full_name}
                          </div>
                          <p
                            className={`text-sm text-foreground/70 ${
                              isBn ? "font-[var(--font-bengali)]" : ""
                            }`}
                          >
                            {comment.content}
                          </p>
                        </div>
                        {currentUser === comment.user_id && (
                          <button
                            onClick={() => handleDeleteComment(comment.id, post.id)}
                            className="p-1 hover:bg-red-500/20 rounded transition text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Comment Input */}
                  {currentUser ? (
                    <div
                      className="flex gap-2"
                      onFocus={() => {
                        if (!comments[post.id]) {
                          fetchComments(post.id)
                        }
                      }}
                    >
                      <input
                        type="text"
                        placeholder={isBn ? "মন্তব্য লিখুন..." : "Write a comment..."}
                        value={commentContent[post.id] || ""}
                        onChange={(e) =>
                          setCommentContent((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handlePostComment(post.id)
                          }
                        }}
                        className="flex-1 px-3 py-2 rounded border-2 border-secondary bg-transparent text-foreground text-sm"
                      />
                      <button
                        onClick={() => handlePostComment(post.id)}
                        className="p-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className={`text-sm text-foreground/60 italic ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                      {isBn ? "মন্তব্য করতে লগইন করুন" : "Login to comment"}
                    </div>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  )
}
