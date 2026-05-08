"use client"

import { useState, useRef } from "react"
import { useLanguage } from "@/lib/language-context"
import { Upload, X, Trash2 } from "lucide-react"
import Image from "next/image"
import { dataStore, MediaItem, useDataStore } from "@/lib/data-store"

export default function AdminMedia() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState<"all" | "photo" | "video">("all")

  // Get media from data store
  const mediaFiles = useDataStore(dataStore.getMedia, "media")

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    try {
      setUploading(true)
      setError("")

      for (const file of files) {
        // Validate file type (images and videos)
        const isImage = file.type.startsWith("image/")
        const isVideo = file.type.startsWith("video/")

        if (!isImage && !isVideo) {
          setError("Please select image or video files")
          continue
        }

        // Validate file size (max 50MB for videos, 5MB for images)
        const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024
        if (file.size > maxSize) {
          setError(`${file.name}: File too large`)
          continue
        }

        // Create a local URL for the file (in real app, upload to Supabase Storage)
        const localUrl = URL.createObjectURL(file)

        // Add to data store
        dataStore.addMedia({
          title: file.name.replace(/\.[^/.]+$/, ""),
          type: isVideo ? "video" : "photo",
          url: localUrl,
          thumbnail: isImage ? localUrl : undefined,
          category: "general",
          uploadDate: new Date().toLocaleDateString(),
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDeleteMedia = (id: string) => {
    if (!confirm(isBn ? "এই ফাইল মুছতে চান?" : "Delete this file?")) return
    dataStore.deleteMedia(id)
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

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "photo", "video"] as const).map((tab) => (
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
            {tab === "photo" && (isBn ? "ছবি" : "Photos")}
            {tab === "video" && (isBn ? "ভিডিও" : "Videos")}
          </button>
        ))}
      </div>

      {/* Upload Area */}
      <div className="rounded-xl border-2 border-dashed border-primary bg-card p-12 text-center hover:bg-primary/5 transition cursor-pointer">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full"
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3
            className={`text-xl font-semibold text-foreground mb-2 ${
              isBn ? "font-[var(--font-bengali)]" : ""
            }`}
          >
            {isBn ? "ছবি এবং ভিডিও আপলোড করুন" : "Upload Photos & Videos"}
          </h3>
          <p
            className={`text-foreground/60 mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}
          >
            {isBn
              ? "ম্যাচ এবং প্রশিক্ষণ ফটোগুলি এখানে আপলোড করুন"
              : "Upload match and training photos here"}
          </p>
          <span className={`inline-block px-6 py-3 rounded bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50 ${
            isBn ? "font-[var(--font-bengali)]" : ""
          }`}>
            {uploading ? (isBn ? "আপলোড হচ্ছে..." : "Uploading...") : (isBn ? "ফাইল চয়ন করুন" : "Choose Files")}
          </span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* Media Gallery */}
      {filteredMedia.length > 0 && (
        <div>
          <h2
            className={`text-xl font-semibold mb-4 text-foreground ${
              isBn ? "font-[var(--font-bengali)]" : ""
            }`}
          >
            {isBn ? "আপলোড করা ফাইলগুলি" : "Uploaded Files"} ({filteredMedia.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMedia.map((media) => (
              <div
                key={media.id}
                className="rounded-lg border-2 border-secondary overflow-hidden bg-card hover:border-primary transition group"
              >
                {/* Preview */}
                <div className="relative w-full aspect-square bg-secondary/20 flex items-center justify-center overflow-hidden">
                  {media.type === "photo" ? (
                    <Image
                      src={media.url}
                      alt={media.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/30">
                      <span className="text-4xl mb-2">🎬</span>
                      <span className="text-xs text-foreground/60">Video</span>
                    </div>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteMedia(media.id)}
                    className="absolute top-2 right-2 p-2 bg-red-500 rounded opacity-0 group-hover:opacity-100 hover:bg-red-600 transition"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                  
                  {/* Type Badge */}
                  <span className={`absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-semibold ${
                    media.type === "photo" 
                      ? "bg-blue-500/80 text-white" 
                      : "bg-purple-500/80 text-white"
                  }`}>
                    {media.type === "photo" ? (isBn ? "ছবি" : "Photo") : (isBn ? "ভিডিও" : "Video")}
                  </span>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {media.title}
                  </p>
                  <p className="text-xs text-foreground/60">
                    {media.uploadDate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredMedia.length === 0 && !uploading && (
        <div className="text-center py-12 text-foreground/60 rounded-xl border-2 border-secondary bg-card">
          <p className={isBn ? "font-[var(--font-bengali)]" : ""}>
            {isBn ? "কোনও ফাইল আপলোড করা হয়নি" : "No files uploaded yet"}
          </p>
          <p className={`text-sm mt-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "উপরে ক্লিক করে ফাইল আপলোড করুন" : "Click above to upload files"}
          </p>
        </div>
      )}
    </div>
  )
}
