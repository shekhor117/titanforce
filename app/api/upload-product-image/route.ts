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

    const formData = await request.formData()
    const file = formData.get('file')
    if (!(file instanceof File)) return NextResponse.json({ error: 'Image file is required' }, { status: 400 })
    if (!ALLOWED_TYPES.has(file.type)) return NextResponse.json({ error: 'Only JPG, PNG, WEBP, and GIF images are supported' }, { status: 400 })
    if (file.size > MAX_IMAGE_SIZE) return NextResponse.json({ error: 'Image must be smaller than 5 MB' }, { status: 400 })

    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `products/${user.id}/${randomUUID()}.${extension}`
    const admin = createAdminClient()
    const { error } = await admin.storage.from(BUCKET).upload(path, await file.arrayBuffer(), {
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
