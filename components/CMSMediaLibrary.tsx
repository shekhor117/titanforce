'use client'

import React, { useState, useEffect } from 'react'
import { getCMSService, type CMSMedia } from '@/lib/cms-service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Upload, Copy } from 'lucide-react'
import Image from 'next/image'

export default function CMSMediaLibrary() {
  const service = getCMSService()
  const [media, setMedia] = useState<CMSMedia[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadMedia()
  }, [])

  const loadMedia = async () => {
    try {
      setLoading(true)
      const data = await service.getMediaLibrary(100)
      setMedia(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load media')
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const altText = prompt('Enter alt text for this image:')
      const newMedia = await service.uploadMedia(file, altText || '')
      setMedia([newMedia, ...media])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload media')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this media?')) return

    try {
      await service.deleteMedia(id)
      setMedia(media.filter((m) => m.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete media')
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    alert('URL copied to clipboard!')
  }

  const filteredMedia = media.filter((item) =>
    item.filename.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Media Library</h2>
        <label>
          <Button className="gap-2" disabled={uploading}>
            <Upload size={16} />
            {uploading ? 'Uploading...' : 'Upload Media'}
          </Button>
          <input
            type="file"
            className="hidden"
            onChange={handleUpload}
            accept="image/*,video/*"
          />
        </label>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Search */}
      <div>
        <Input
          placeholder="Search media..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Media Grid */}
      <div>
        {loading ? (
          <div className="text-center py-8 text-slate-600">Loading media...</div>
        ) : filteredMedia.length === 0 ? (
          <div className="text-center py-8 text-slate-600">
            No media found. Upload your first file to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMedia.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Media Preview */}
                <div className="relative w-full aspect-square bg-slate-100">
                  {item.file_type?.startsWith('image') ? (
                    <img
                      src={item.file_path}
                      alt={item.alt_text || item.filename}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <span>{item.file_type || 'File'}</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-3 space-y-2">
                  <div>
                    <p className="text-sm font-medium truncate">
                      {item.filename}
                    </p>
                    {item.alt_text && (
                      <p className="text-xs text-slate-600 mt-1">
                        Alt: {item.alt_text}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-1"
                      onClick={() => copyToClipboard(item.file_path)}
                    >
                      <Copy size={12} />
                      Copy URL
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
