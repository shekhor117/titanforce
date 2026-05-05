/**
 * Supabase Storage Utilities
 * Handles file uploads, deletions, and signed URLs for the app-files bucket
 * All files are stored in: ${auth.uid()}/${featureName}/${itemId}/${uuid}.${extension}
 */

import { createClient } from "@/lib/supabase/client"
import { v4 as uuidv4 } from "uuid"

const BUCKET_NAME = "app-files"
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

// ============================================================================
// File Upload Functions
// ============================================================================

/**
 * Upload a file to Supabase Storage
 * @param file - File to upload
 * @param featureName - Feature category (e.g., 'player-photos', 'news-images', 'covers')
 * @param itemId - Item ID (e.g., player-id, news-post-id)
 * @param userId - User ID for path organization
 * @returns { path: string, url: string } | { error: string }
 */
export async function uploadFile(
  file: File,
  featureName: string,
  itemId: string,
  userId: string
): Promise<{ path: string; signedUrl: string } | { error: string }> {
  try {
    // Validate file
    if (!file) {
      return { error: "No file provided" }
    }

    if (file.size > MAX_FILE_SIZE) {
      return { error: "File size must be less than 5MB" }
    }

    const supabase = createClient()

    // Get file extension
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "bin"

    // Create unique filename with UUID
    const fileName = `${uuidv4()}.${fileExt}`

    // Build path: ${userId}/${featureName}/${itemId}/${fileName}
    const filePath = `${userId}/${featureName}/${itemId}/${fileName}`

    console.log("[v0] Uploading file to:", filePath)

    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      console.error("[v0] Upload error:", uploadError)
      return { error: uploadError.message }
    }

    // Get signed URL (expires in 365 days)
    const { data: signedData, error: signError } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, 60 * 60 * 24 * 365)

    if (signError) {
      console.error("[v0] Signed URL error:", signError)
      return { error: signError.message }
    }

    return {
      path: filePath,
      signedUrl: signedData.signedUrl,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed"
    console.error("[v0] Upload exception:", message)
    return { error: message }
  }
}

/**
 * Upload a player photo
 * @param file - Image file
 * @param userId - Player user ID
 * @param playerId - Player profile ID
 * @returns { path: string, url: string } | { error: string }
 */
export async function uploadPlayerPhoto(
  file: File,
  userId: string,
  playerId: string
): Promise<{ path: string; signedUrl: string } | { error: string }> {
  // Validate image type
  if (!file.type.startsWith("image/")) {
    return { error: "File must be an image" }
  }

  return uploadFile(file, "player-photos", playerId, userId)
}

/**
 * Upload a news post image
 * @param file - Image file
 * @param userId - Admin user ID
 * @param newsPostId - News post ID
 * @returns { path: string, url: string } | { error: string }
 */
export async function uploadNewsImage(
  file: File,
  userId: string,
  newsPostId: string
): Promise<{ path: string; signedUrl: string } | { error: string }> {
  if (!file.type.startsWith("image/")) {
    return { error: "File must be an image" }
  }

  return uploadFile(file, "news-images", newsPostId, userId)
}

/**
 * Upload a team cover/banner image
 * @param file - Image file
 * @param userId - Admin user ID
 * @returns { path: string, url: string } | { error: string }
 */
export async function uploadTeamCover(
  file: File,
  userId: string
): Promise<{ path: string; signedUrl: string } | { error: string }> {
  if (!file.type.startsWith("image/")) {
    return { error: "File must be an image" }
  }

  return uploadFile(file, "team-covers", "main", userId)
}

/**
 * Upload a fan profile avatar
 * @param file - Image file
 * @param userId - Fan user ID
 * @returns { path: string, url: string } | { error: string }
 */
export async function uploadFanAvatar(
  file: File,
  userId: string
): Promise<{ path: string; signedUrl: string } | { error: string }> {
  if (!file.type.startsWith("image/")) {
    return { error: "File must be an image" }
  }

  return uploadFile(file, "fan-avatars", userId, userId)
}

// ============================================================================
// File Deletion Functions
// ============================================================================

/**
 * Delete a file from Supabase Storage
 * @param filePath - Full file path (e.g., ${userId}/${featureName}/${itemId}/${fileName})
 * @returns { success: boolean } | { error: string }
 */
export async function deleteFile(
  filePath: string
): Promise<{ success: boolean } | { error: string }> {
  try {
    const supabase = createClient()

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath])

    if (error) {
      console.error("[v0] Delete error:", error)
      return { error: error.message }
    }

    console.log("[v0] File deleted:", filePath)
    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delete failed"
    console.error("[v0] Delete exception:", message)
    return { error: message }
  }
}

// ============================================================================
// Signed URL Functions
// ============================================================================

/**
 * Get a signed URL for a file
 * @param filePath - Full file path
 * @param expiresIn - Expiration time in seconds (default: 1 year)
 * @returns { url: string } | { error: string }
 */
export async function getSignedUrl(
  filePath: string,
  expiresIn: number = 60 * 60 * 24 * 365
): Promise<{ url: string } | { error: string }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, expiresIn)

    if (error) {
      console.error("[v0] Signed URL error:", error)
      return { error: error.message }
    }

    return { url: data.signedUrl }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to get signed URL"
    console.error("[v0] Signed URL exception:", message)
    return { error: message }
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "bin"
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}

/**
 * Extract user ID from file path
 */
export function extractUserIdFromPath(filePath: string): string {
  return filePath.split("/")[0]
}

/**
 * Extract feature name from file path
 */
export function extractFeatureFromPath(filePath: string): string {
  return filePath.split("/")[1]
}
