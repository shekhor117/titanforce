import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Image file is required' }, { status: 400 })
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Only JPG, PNG, WEBP, and GIF images are supported' }, { status: 400 })
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: 'Image must be smaller than 5 MB' }, { status: 400 })
    }

    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const blob = await put(`products/${crypto.randomUUID()}.${extension}`, file, {
      access: 'public',
      addRandomSuffix: false,
      contentType: file.type,
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error('[v0] Product image upload failed:', error)
    return NextResponse.json({ error: 'Image upload failed' }, { status: 500 })
  }
}
