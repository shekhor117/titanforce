"use client"

import { useState, useRef, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { Upload, X, Trash2 } from "lucide-react"
import Image from "next/image"
import { getDataService } from "@/lib/data-service"
import type { MediaItem } from "@/lib/data-service"

export default function AdminMedia() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState<"all" | "photo" | "video">("all")
  const [mediaFiles, setMediaFiles] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadMedia()
  }, [])

  const loadMedia = async () => {
    try {
      setIsLoading(true)
      const dataService = getDataService()
      const media = await dataService.getMediaItems()
      setMediaFiles(Array.isArray(media) ? media : [])
      setError("")
    } catch (err) {
      console.error("[v0] Error loading media:", err)
      setError(isBn ? "ত্রুটি: মিডিয়া লোড করা যায়নি" : "Error: Could not load media")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const retryOperation = async (operation: () => Promise<any>, maxRetries = 3): Promise<any> => {
      for (let i = 0; i < maxRetries; i++) {
        try {
          return await operation()
        } catch (err) {
          if (i === maxRetries - 1) throw err
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
        }
      }
    }

    try {
      setUploading(true)
      setError("")
      const dataService = getDataService()

      for (const file of files) {
        // Validate file type (images and videos)
        const isImage = file.type.startsWith("image/")
        const isVideo = file.type.startsWith("video/")

        if (!isImage && !isVideo) {
          setError(isBn ? "শুধুমাত্র ছবি এবং ভিডিও ফাইল নির্বাচন করুন" : "Please select image or video files")
          continue
        }

        // Validate file size (max 50MB for videos, 5MB for images)
        const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024
        if (file.size > maxSize) {
          setError(`${file.name}: ${isBn ? "ফাইল অত্যধিক বড়" : "File too large"}`)
          continue
        }

        // Create a local URL for the file (in production, upload to Supabase Storage)
        const url = URL.createObjectURL(file)

        try {
          // Add to Supabase via DataService with retry logic
          await retryOperation(() => dataService.createMediaItem({
            title: file.name.replace(/\.[^/.]+$/, ""),
            type: isVideo ? "video" : "photo",
            url: url,
            category: "general",
            description: "",
          }))
        } catch (err) {
          console.error("[v0] Error creating media item:", err)
          setError(isBn ? "আইটেম যোগ করার সময় ত্রুটি" : "Error adding item")
        }
      }

      // Reload media list
      await loadMedia()
    } catch (err) {
      console.error("[v0] Error in file select:", err)
      setError(err instanceof Error ? err.message : (isBn ? "আপলোড ব্যর্থ" : "Upload failed"))
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDeleteMedia = async (id: string) => {
    if (!confirm(isBn ? "এই ফাইল মুছতে চান?" : "Delete this file?")) return
    
    try {
      const dataService = getDataService()
      await dataService.deleteMediaItem(id)
      await loadMedia()
    } catch (err) {
      console.error("[v0] Error deleting media:", err)
      setError(isBn ? "মুছতে ব্যর্থ" : "Failed to delete")
    }
  }

  const filteredMedia = filter === "all" 
    ? mediaFiles 
    : mediaFiles.filter(m => m.type === filter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1
          className={`font-[var(--font-display)] text-3xl tracking-wider text-foreground ${
            isBn ? "font-[var(--font-bengali)]" : ""
          }`}
        >
          {isBn ? "মিডিয়া ব্যবস্থাপনা" : "Media Management"}
        </h1>
        <div className="text-sm text-foreground/60">
          {mediaFiles.length} {isBn ? "ফাইল" : "files"}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Upload Section */}
      <div className="p-6 rounded-xl bg-card border-2 border-secondary">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          disabled={uploading || isLoading}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || isLoading}
          className={`w-full p-8 rounded-lg border-2 border-dashed transition flex flex-col items-center justify-center gap-2 ${
            uploading || isLoading
              ? "border-secondary/50 bg-secondary/20 text-foreground/50 cursor-not-allowed"
              : "border-primary hover:bg-primary/5 cursor-pointer"
          }`}
        >
          <Upload className="w-8 h-8" />
          <span className={`text-lg font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {uploading ? (isBn ? "আপলোড হচ্ছে..." : "Uploading...") : (isBn ? "ক্লিক করে ফাইল নির্বাচন করুন" : "Click to select files")}
          </span>
          <span className="text-xs text-foreground/60">{isBn ? "ছবি এবং ভিডিও সমর্থিত" : "Images and videos supported"}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "photo", "video"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg font-semibold transition text-sm ${
              filter === tab
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-secondary hover:border-primary/50"
            } ${isBn ? "font-[var(--font-bengali)]" : ""}`}
          >
            {tab === "all" ? (isBn ? "সব" : "All") : tab === "photo" ? (isBn ? "ছবি" : "Photos") : (isBn ? "ভিডিও" : "Videos")}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-foreground/60">{isBn ? "লোড হচ্ছে..." : "Loading..."}</div>
      ) : filteredMedia.length === 0 ? (
        <div className="text-center py-12 text-foreground/60">
          {isBn ? "এখনও কোনও মিডিয়া আপলোড করা হয়নি" : "No media uploaded yet"}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-lg overflow-hidden bg-secondary/50 border border-secondary hover:border-primary/50 transition"
            >
              {item.type === "photo" ? (
                <Image
                  src={item.url}
                  alt={item.title}
                  width={200}
                  height={200}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <video
                  src={item.url}
                  className="w-full h-40 object-cover bg-black"
                />
              )}

              {/* Overlay with info */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center p-2">
                <p className="text-xs text-white font-semibold text-center line-clamp-2 mb-2">
                  {item.title}
                </p>
                <button
                  onClick={() => handleDeleteMedia(item.id)}
                  className="mt-auto px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-semibold transition flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  {isBn ? "মুছুন" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
