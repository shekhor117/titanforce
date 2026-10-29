import { randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { checkAdminAuth } from '@/lib/admin-api-helper'
import { checkUploadRateLimit } from '@/lib/upload-rate-limit'
import { hasValidImageSignature, normalizeImage, SUPPORTED_IMAGE_TYPES } from '@/lib/image-security'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const BUCKET = 'app-files'

export async function POST(request: NextRequest) {
  try {
    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })
    const rateLimit = await checkUploadRateLimit(auth.user.id, request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown')
    if (!rateLimit.allowed) return NextResponse.json({ error: rateLimit.unavailable ? 'Rate limiting service unavailable' : 'Too many upload requests. Please try again later.' }, { status: rateLimit.unavailable ? 503 : 429 })
    const formData = await request.formData()
    const file = formData.get('file')
    if (!(file instanceof File)) return NextResponse.json({ error: 'Image file is required' }, { status: 400 })
    if (!SUPPORTED_IMAGE_TYPES.includes(file.type as (typeof SUPPORTED_IMAGE_TYPES)[number])) return NextResponse.json({ error: 'Only JPG, PNG, WEBP, and GIF images are supported' }, { status: 400 })
    if (file.size > MAX_IMAGE_SIZE) return NextResponse.json({ error: 'Image must be smaller than 5 MB' }, { status: 400 })
    const bytes = new Uint8Array(await file.arrayBuffer())
    if (!hasValidImageSignature(bytes, file.type)) return NextResponse.json({ error: 'Invalid image file' }, { status: 400 })

    const normalized = await normalizeImage(bytes, file.type)
    const path = `products/${auth.user.id}/${randomUUID()}.${normalized.extension}`
    const admin = createAdminClient()
    const { error } = await admin.storage.from(BUCKET).upload(path, normalized.bytes, {
      contentType: normalized.contentType,
      cacheControl: '31536000',
      upsert: false,
    })
    if (error) {
      console.error('[v0] Product image storage upload failed:', error.message)
      return NextResponse.json({ error: 'Image upload failed' }, { status: 502 })
    }

    const { data } = admin.storage.from(BUCKET).getPublicUrl(path)
    return NextResponse.json({ url: data.publicUrl, path })
  } catch (error) {
    console.error('[v0] Product image upload failed:', error instanceof Error ? error.message : error)
    return NextResponse.json({ error: 'Image upload failed' }, { status: 500 })
  }
}
