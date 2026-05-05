import { createClient } from "@/lib/supabase/client"
import { v4 as uuidv4 } from "uuid"

const BUCKET_NAME = "app-files"

interface UploadOptions {
  featureName: string
  itemId?: string
}

export async function uploadFileToSupabase(
  file: File,
  options: UploadOptions
) {
  try {
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("User not authenticated")
    }

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File size must be less than 5MB")
    }

    // Generate unique filename
    const fileExtension = file.name.split(".").pop() || "file"
    const uniqueId = uuidv4()
    const fileName = `${uniqueId}.${fileExtension}`

    // Build folder path: ${userId}/${featureName}/${itemId}/${uuid}.${extension}
    const itemFolder = options.itemId ? `${options.itemId}/` : ""
    const filePath = `${user.id}/${options.featureName}/${itemFolder}${fileName}`

    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      throw uploadError
    }

    // Get signed URL (valid for 1 year)
    const { data: signedData } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, 31536000) // 1 year

    return {
      success: true,
      filePath: data.path,
      signedUrl: signedData?.signedUrl || "",
      fileName: file.name,
    }
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    }
  }
}

export async function deleteFileFromSupabase(filePath: string) {
  try {
    const supabase = createClient()

    // Verify user owns this file
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("User not authenticated")
    }

    // Check if file path starts with user ID
    if (!filePath.startsWith(user.id)) {
      throw new Error("Unauthorized: Cannot delete files from other users")
    }

    // Delete from storage
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath])

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error("[v0] Delete error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Delete failed",
    }
  }
}

export async function getSignedUrl(filePath: string) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, 3600) // 1 hour

    if (error) {
      throw error
    }

    return { success: true, signedUrl: data.signedUrl }
  } catch (error) {
    console.error("[v0] Get signed URL error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get signed URL",
    }
  }
}
