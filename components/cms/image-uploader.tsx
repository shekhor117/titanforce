'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImageUploaderProps {
  onImageUpload: (file: File) => Promise<string>
  value?: string
  onChange: (url: string) => void
  onRemove?: () => void
}

export function ImageUploader({
  onImageUpload,
  value,
  onChange,
  onRemove,
}: ImageUploaderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setIsLoading(true)

    try {
      const url = await onImageUpload(file)
      onChange(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image')
    } finally {
      setIsLoading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setError(null)
      setIsLoading(true)

      try {
        const url = await onImageUpload(file)
        onChange(url)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to upload image')
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition ${
          isLoading
            ? 'border-gray-300 bg-gray-50'
            : 'border-gray-300 hover:border-primary hover:bg-primary/5'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isLoading}
          className="hidden"
        />

        {isLoading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-gray-600">Uploading image...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="w-8 h-8 mx-auto text-gray-400" />
            <div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                Choose Image
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                or drag and drop an image here
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Supported formats: JPEG, PNG, WebP, GIF (Max 10MB)
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Image Preview */}
      {value && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Preview</p>
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={value}
              alt="Upload preview"
              fill
              className="object-cover"
            />
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 break-all">{value}</p>
        </div>
      )}
    </div>
  )
}
