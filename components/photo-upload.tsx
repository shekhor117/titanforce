"use client"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import Image from "next/image"

interface PhotoUploadProps {
  currentPhoto?: string
  onPhotoUpload: (url: string) => void
  isLoading?: boolean
}

export function PhotoUpload({ currentPhoto, onPhotoUpload, isLoading = false }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentPhoto || null)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

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

      // Create FormData and upload to Blob
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload-player-photo", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const { url } = await response.json()

      // Update preview
      setPreview(url)
      onPhotoUpload(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleRemovePhoto = () => {
    setPreview(null)
    onPhotoUpload("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
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
              alt="Player photo"
              fill
              className="object-cover"
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
