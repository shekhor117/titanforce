import { createClient } from "@/lib/supabase/server"
import { checkAdminAuth } from "@/lib/admin-api-helper"
import { checkUploadRateLimit } from "@/lib/upload-rate-limit"
import { hasValidImageSignature, normalizeImage, SUPPORTED_IMAGE_TYPES } from "@/lib/image-security"
import { NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

const BUCKET_NAME = "app-files"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const itemId = formData.get("itemId") as string | null

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Validate file type
    if (!SUPPORTED_IMAGE_TYPES.includes(file.type as (typeof SUPPORTED_IMAGE_TYPES)[number])) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    const adminAuth = await checkAdminAuth(request)
    const isPrivileged = adminAuth.authorized
    if (!isPrivileged && itemId && itemId !== user.id) {
      return NextResponse.json({ error: "You cannot upload for this player" }, { status: 403 })
    }
    if (itemId && !/^[0-9a-f-]{36}$/i.test(itemId)) {
      return NextResponse.json({ error: "Invalid player identifier" }, { status: 400 })
    }
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
    const rateLimit = await checkUploadRateLimit(user.id, ip)
    if (!rateLimit.allowed || rateLimit.unavailable || !rateLimit.configured) {
      return NextResponse.json({ error: 'Too many upload requests. Please try again later.' }, { status: 429 })
    }

    // Generate unique filename
    const bytes = new Uint8Array(await file.arrayBuffer())
    if (!hasValidImageSignature(bytes, file.type)) return NextResponse.json({ error: "Invalid image file" }, { status: 400 })
    const normalized = await normalizeImage(bytes, file.type)
    const uniqueId = uuidv4()
    const fileName = `${uniqueId}.${normalized.extension}`

    // Build folder path: ${userId}/player-photos/${itemId}/${uuid}.${extension}
    const itemFolder = itemId ? `${itemId}/` : ""
    const filePath = `${user.id}/player-photos/${itemFolder}${fileName}`

    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, normalized.bytes, {
        contentType: normalized.contentType,
        cacheControl: "3600",
      })

    if (uploadError) {
      throw uploadError
    }


    // Get signed URL (valid for 1 hour)
    const { data: signedData, error: signedError } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, 3600)

    if (signedError) {
      throw signedError
    }

    return NextResponse.json({
      success: true,
      filePath: data.path,
      signedUrl: signedData?.signedUrl || "",
      fileName,
    })
  } catch (error) {
    console.error('[v0] Player photo upload failed:', error instanceof Error ? error.message : error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
