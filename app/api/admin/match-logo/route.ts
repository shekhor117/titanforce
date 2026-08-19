import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { randomUUID } from 'node:crypto'

const BUCKET = 'app-files'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file')
  const side = formData.get('side')
  if (!(file instanceof File) || (side !== 'home' && side !== 'away')) {
    return NextResponse.json({ error: 'A logo file and side are required' }, { status: 400 })
  }
  if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Logo must be an image' }, { status: 400 })
  if (file.size > 2 * 1024 * 1024) return NextResponse.json({ error: 'Logo must be smaller than 2MB' }, { status: 400 })

  const extension = file.name.split('.').pop()?.toLowerCase() || 'png'
  const path = `match-logos/${user.id}/${side}-${randomUUID()}.${extension}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, await file.arrayBuffer(), {
    contentType: file.type,
    cacheControl: '31536000',
    upsert: false,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return NextResponse.json({ url: data.publicUrl, path })
}
