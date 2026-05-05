"use client"

import { useState, useRef } from "react"
import { useLanguage } from "@/lib/language-context"
import { Upload, X } from "lucide-react"
import Image from "next/image"
import { deleteFileFromSupabase } from "@/lib/supabase-storage"

interface MediaFile {
  id: string
  fileName: string
  signedUrl: string
  filePath: string
  uploadedAt: string
}

export default function AdminMedia() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])

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

        // Upload to Supabase Storage
        const formData = new FormData()
        formData.append("file", file)
        formData.append("featureName", "media-gallery")

        const response = await fetch("/api/upload-player-photo", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          setError(errorData.error || "Upload failed")
          continue
        }

        const { signedUrl, filePath, fileName } = await response.json()

        // Add to media list
        const newMedia: MediaFile = {
          id: Date.now().toString(),
          fileName,
          signedUrl,
          filePath,
          uploadedAt: new Date().toLocaleString(),
        }

        setMediaFiles((prev) => [newMedia, ...prev])
        console.log("[v0] Media uploaded:", filePath)
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

  const handleDeleteMedia = async (filePath: string, id: string) => {
    try {
      const result = await deleteFileFromSupabase(filePath)

      if (result.success) {
        setMediaFiles((prev) => prev.filter((m) => m.id !== id))
        console.log("[v0] Media deleted:", filePath)
      } else {
        setError(result.error || "Failed to delete file")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed")
    }
  }

  return (
    <div className="space-y-6">
      <h1
        className={`font-[var(--font-display)] text-3xl tracking-wider text-foreground ${
          isBn ? "font-[var(--font-bengali)]" : ""
        }`}
      >
        {isBn ? "মিডিয়া ব্যবস্থাপনা" : "Media Management"}
      </h1>

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
          <div className="text-4xl mb-4">📸</div>
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
            {uploading ? "Uploading..." : isBn ? "ফাইল চয়ন করুন" : "Choose Files"}
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
      {mediaFiles.length > 0 && (
        <div>
          <h2
            className={`text-xl font-semibold mb-4 text-foreground ${
              isBn ? "font-[var(--font-bengali)]" : ""
            }`}
          >
            {isBn ? "আপলোড করা ফাইলগুলি" : "Uploaded Files"} ({mediaFiles.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mediaFiles.map((media) => {
              const isImage = media.filePath.match(/\.(jpg|jpeg|png|gif|webp)$/i)
              const isVideo = media.filePath.match(/\.(mp4|webm|mov)$/i)

              return (
                <div
                  key={media.id}
                  className="rounded-lg border border-secondary overflow-hidden bg-card hover:shadow-lg transition"
                >
                  {/* Preview */}
                  <div className="relative w-full h-48 bg-secondary/20 flex items-center justify-center overflow-hidden">
                    {isImage ? (
                      <Image
                        src={media.signedUrl}
                        alt={media.fileName}
                        fill
                        className="object-cover"
                      />
                    ) : isVideo ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl">🎬</span>
                      </div>
                    ) : (
                      <span className="text-4xl">📄</span>
                    )}

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteMedia(media.filePath, media.id)}
                      className="absolute top-2 right-2 p-2 bg-red-500 rounded hover:bg-red-600 transition"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {media.fileName}
                    </p>
                    <p className="text-xs text-foreground/60">
                      {media.uploadedAt}
                    </p>
                    <p className="text-xs text-foreground/50 mt-1 truncate">
                      {media.filePath}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {mediaFiles.length === 0 && !uploading && (
        <div className="text-center py-8">
          <p
            className={`text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}
          >
            {isBn ? "কোনও ফাইল আপলোড করা হয়নি" : "No files uploaded yet"}
          </p>
        </div>
      )}
    </div>
  )
}
