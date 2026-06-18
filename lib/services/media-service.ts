import { put, del } from '@vercel/blob'

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
    const filename = `${folder}/${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, '')}`
    
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: true,
    })

    return {
      url: blob.url,
      filename: blob.filename,
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
    await del(url)
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
