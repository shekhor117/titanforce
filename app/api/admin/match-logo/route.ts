import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { checkAdminAuth } from '@/lib/admin-api-helper'
import { normalizeImage } from '@/lib/image-security'
import { randomUUID } from 'node:crypto'

const BUCKET = 'app-files'

export async function POST(request: NextRequest) {
  const auth = await checkAdminAuth(request)
  if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })
  const supabase = createAdminClient()

  const formData = await request.formData()
  const file = formData.get('file')
  const side = formData.get('side')
  if (!(file instanceof File) || (side !== 'home' && side !== 'away')) {
    return NextResponse.json({ error: 'A logo file and side are required' }, { status: 400 })
  }
  if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) return NextResponse.json({ error: 'Logo must be a supported image' }, { status: 400 })
  if (file.size > 2 * 1024 * 1024) return NextResponse.json({ error: 'Logo must be smaller than 2MB' }, { status: 400 })

  const normalized = await normalizeImage(new Uint8Array(await file.arrayBuffer()), file.type)
  const path = `match-logos/${auth.user.id}/${side}-${randomUUID()}.${normalized.extension}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, normalized.bytes, {
    contentType: normalized.contentType,
    cacheControl: '31536000',
    upsert: false,
  })
  if (error) {
    console.error('[v0] Match logo upload failed:', error.message)
    return NextResponse.json({ error: 'Logo upload failed' }, { status: 500 })
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return NextResponse.json({ url: data.publicUrl, path })
}
