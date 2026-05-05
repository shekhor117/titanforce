import { createClient } from "@/lib/supabase/server"
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
    if (!file.type.startsWith("image/")) {
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
      console.error("[v0] Upload error: User not authenticated")
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      )
    }

    // Generate unique filename
    const fileExtension = file.name.split(".").pop() || "jpg"
    const uniqueId = uuidv4()
    const fileName = `${uniqueId}.${fileExtension}`

    // Build folder path: ${userId}/player-photos/${itemId}/${uuid}.${extension}
    const itemFolder = itemId ? `${itemId}/` : ""
    const filePath = `${user.id}/player-photos/${itemFolder}${fileName}`

    // Convert file to buffer
    const buffer = await file.arrayBuffer()

    console.log("[v0] Uploading file:", { filePath, fileSize: file.size, contentType: file.type })

    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: "3600",
      })

    if (uploadError) {
      console.error("[v0] Storage upload error:", uploadError)
      throw uploadError
    }

    console.log("[v0] File uploaded successfully:", data.path)

    // Get signed URL (valid for 1 year)
    const { data: signedData, error: signedError } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, 31536000)

    if (signedError) {
      console.error("[v0] Signed URL error:", signedError)
      throw signedError
    }

    return NextResponse.json({
      success: true,
      filePath: data.path,
      signedUrl: signedData?.signedUrl || "",
      fileName: file.name,
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    )
  }
}
