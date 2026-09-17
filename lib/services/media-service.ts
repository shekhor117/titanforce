import { uploadFileToSupabase, deleteFileFromSupabase } from '@/lib/supabase-storage'
const BUCKET_NAME = 'app-files'

function toFile(file: File, folder: string) {
  const safeName = file.name.replace(/[^a-z0-9.]/gi, '')
  return new File([file], `${folder}/${safeName}`, { type: file.type })
}

function extractStoragePath(url: string) {
  const marker = `/object/sign/${BUCKET_NAME}/`
  const publicMarker = `/object/public/${BUCKET_NAME}/`
  const index = url.indexOf(marker)
  const publicIndex = url.indexOf(publicMarker)
  if (index >= 0) return decodeURIComponent(url.slice(index + marker.length).split('?')[0])
  if (publicIndex >= 0) return decodeURIComponent(url.slice(publicIndex + publicMarker.length).split('?')[0])
  return url
}

export interface MediaUploadResponse {
  url: string
  filename: string
  size: number
  uploadedAt: string
}

// Upload image to Vercel Blob
export async function uploadMedia(file: File, folder: string = 'cms-media'): Promise<MediaUploadResponse> {
  if (!file) {
    throw new Error('No file provided')
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only JPEG, PNG, WebP, and GIF images are allowed')
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error('File size must be less than 10MB')
  }

  try {
    const result = await uploadFileToSupabase(toFile(file, folder), {
      featureName: folder,
    })
    if (!result.success || !result.signedUrl) throw new Error(result.error || 'Upload failed')

    return {
      url: result.signedUrl,
      filename: result.fileName || file.name,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    }
  } catch (error) {
    throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Delete media from Vercel Blob
export async function deleteMedia(url: string): Promise<void> {
  try {
    const result = await deleteFileFromSupabase(extractStoragePath(url))
    if (!result.success) throw new Error(result.error || 'Delete failed')
  } catch (error) {
    throw new Error(`Failed to delete image: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Validate slug format
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Check if slug is unique (basic implementation)
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(slug)
}
