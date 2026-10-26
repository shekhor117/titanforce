import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { createAdminClient, createClient } from '@/lib/supabase/server'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const BUCKET = 'app-files'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    const role = user.app_metadata?.role
    if (!['admin', 'super_admin', 'moderator'].includes(String(role))) {
      return NextResponse.json({ error: 'Admin authorization required' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file')
    if (!(file instanceof File)) return NextResponse.json({ error: 'Image file is required' }, { status: 400 })
    if (!ALLOWED_TYPES.has(file.type)) return NextResponse.json({ error: 'Only JPG, PNG, WEBP, and GIF images are supported' }, { status: 400 })
    if (file.size > MAX_IMAGE_SIZE) return NextResponse.json({ error: 'Image must be smaller than 5 MB' }, { status: 400 })
    const bytes = new Uint8Array(await file.arrayBuffer())
    const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
    const isPng = bytes.slice(0, 8).every((byte, index) => byte === [137, 80, 78, 71, 13, 10, 26, 10][index])
    const isGif = bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46
    const isWebp = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
    if (!isJpeg && !isPng && !isGif && !isWebp) return NextResponse.json({ error: 'Invalid image file' }, { status: 400 })

    const extensionByType: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
    }
    const path = `products/${user.id}/${randomUUID()}.${extensionByType[file.type]}`
    const admin = createAdminClient()
    const { error } = await admin.storage.from(BUCKET).upload(path, bytes, {
      contentType: file.type,
      cacheControl: '31536000',
      upsert: false,
    })
    if (error) return NextResponse.json({ error: `Image upload failed: ${error.message}` }, { status: 502 })

    const { data } = admin.storage.from(BUCKET).getPublicUrl(path)
    return NextResponse.json({ url: data.publicUrl, path })
  } catch (error) {
    console.error('[v0] Product image upload failed:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Image upload failed' }, { status: 500 })
  }
}
