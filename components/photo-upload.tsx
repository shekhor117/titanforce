"use client"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { uploadFile, deleteFile } from "@/lib/supabase-storage"

interface PhotoUploadProps {
  currentPhoto?: string
  currentPhotoPath?: string
  onPhotoUpload: (url: string, path: string) => void
  onPhotoDelete?: (path: string) => void
  isLoading?: boolean
  featureName: string // e.g., "player-photos", "news-images"
  itemId: string // e.g., player-id, news-post-id
}

export function PhotoUpload({
  currentPhoto,
  currentPhotoPath,
  onPhotoUpload,
  onPhotoDelete,
  isLoading = false,
  featureName,
  itemId,
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentPhoto || null)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB")
      return
    }

    try {
      setUploading(true)
      setError("")

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError("You must be logged in to upload files")
        setUploading(false)
        return
      }

      // Upload to Supabase Storage
      const result = await uploadFile(file, featureName, itemId, user.id)

      if ("error" in result) {
        setError(result.error)
        setUploading(false)
        return
      }

      // Delete old file if exists
      if (currentPhotoPath) {
        await deleteFile(currentPhotoPath)
      }

      // Update preview
      setPreview(result.signedUrl)
      onPhotoUpload(result.signedUrl, result.path)

      console.log("[v0] File uploaded successfully:", result.path)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleRemovePhoto = async () => {
    try {
      // Delete from storage if path exists
      if (currentPhotoPath) {
        await deleteFile(currentPhotoPath)
      }

      setPreview(null)
      onPhotoUpload("", "")

      if (onPhotoDelete && currentPhotoPath) {
        onPhotoDelete(currentPhotoPath)
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      console.log("[v0] Photo removed successfully")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove photo")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center gap-4">
        {/* Preview */}
        {preview ? (
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary">
            <Image
              src={preview}
              alt="Photo preview"
              fill
              className="object-cover"
              unoptimized={preview.includes("supabase")} // Signed URLs don't need optimization
            />
            <button
              type="button"
              onClick={handleRemovePhoto}
              disabled={uploading || isLoading}
              className="absolute top-0 right-0 p-1 bg-red-500 rounded-full hover:bg-red-600 transition disabled:opacity-50"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        ) : (
          <div className="w-32 h-32 rounded-full border-4 border-dashed border-primary/50 flex items-center justify-center bg-primary/5">
            <Upload className="w-8 h-8 text-primary/50" />
          </div>
        )}

        {/* Upload Button */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading || isLoading}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || isLoading}
          className="px-6 py-2 bg-primary text-primary-foreground rounded font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload Photo"}
        </button>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}
      </div>
    </div>
  )
}
