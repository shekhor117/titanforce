import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { validatePartial, validateProduct } from '@/lib/validation'
import { checkAdminAuth } from '@/lib/admin-api-helper'

// GET - Fetch all products or specific product by ID
export async function GET(request: NextRequest) {
  const adminAuth = await checkAdminAuth(request)
  if (!adminAuth.authorized) return NextResponse.json({ error: adminAuth.error }, { status: adminAuth.status })

  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')

    if (productId) {
      // Fetch specific product
      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, price, image_url, stock, category, is_active, created_at, updated_at')
        .eq('id', productId)
        .single()

      if (error) {
        console.error('[v0] Error fetching product:', error)
        const statusCode = error.code === 'PGRST116' ? 404 : 500
        return NextResponse.json({ error: 'Unable to process product request' }, { status: statusCode })
      }

      return NextResponse.json(data)
    }

    // Fetch all products with pagination
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0

    const { data, error, count } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('[v0] Error fetching products:', error)
      return NextResponse.json({ error: 'Unable to process product request' }, { status: 500 })
    }

    return NextResponse.json({
      data,
      total: count,
      limit,
      offset
    })
  } catch (error) {
    console.error('[v0] Unexpected error in GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create a new product
export async function POST(request: NextRequest) {
  const adminAuth = await checkAdminAuth(request)
  if (!adminAuth.authorized) return NextResponse.json({ error: adminAuth.error }, { status: adminAuth.status })

  try {
    const userClient = await createClient()

    // Check admin authentication

    const body = await request.json()

    // Validate product data
    const validation = validateProduct(body)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }
    const writableFields = ['name', 'description', 'price', 'image_url', 'category', 'stock', 'is_active'] as const
    const productRecord = Object.fromEntries(writableFields.filter((field) => body[field] !== undefined).map((field) => [field, body[field]]))

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('products')
      .insert([productRecord])
      .select()
      .single()

    if (error) {
      console.error('[v0] Error creating product:', error)
      return NextResponse.json({ error: 'Unable to process product request' }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('[v0] Unexpected error in POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update a product
export async function PUT(request: NextRequest) {
  const adminAuth = await checkAdminAuth(request)
  if (!adminAuth.authorized) return NextResponse.json({ error: adminAuth.error }, { status: adminAuth.status })

  try {
    const userClient = await createClient()

    // Check admin authentication

    const body = await request.json()
    const { id } = body
    const writableFields = ['name', 'description', 'price', 'image_url', 'category', 'stock', 'is_active'] as const
    const updates = Object.fromEntries(writableFields.filter((field) => body[field] !== undefined).map((field) => [field, body[field]]))

    if (!id) {
      return NextResponse.json({ error: 'Missing product ID' }, { status: 400 })
    }

    // Validate product data (partial updates are OK)
    const validation = validatePartial(updates, validateProduct)
    if (Object.keys(updates).length === 0) return NextResponse.json({ error: 'No writable fields provided' }, { status: 400 })
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[v0] Error updating product:', error)
      const statusCode = error.code === 'PGRST116' ? 404 : 500
      return NextResponse.json({ error: 'Unable to process product request' }, { status: statusCode })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error in PUT:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete a product
export async function DELETE(request: NextRequest) {
  const adminAuth = await checkAdminAuth(request)
  if (!adminAuth.authorized) return NextResponse.json({ error: adminAuth.error }, { status: adminAuth.status })

  try {
    const userClient = await createClient()

    // Check admin authentication

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')

    if (!productId) {
      return NextResponse.json({ error: 'Missing product ID' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)

    if (error) {
      console.error('[v0] Error deleting product:', error)
      return NextResponse.json({ error: 'Unable to process product request' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Unexpected error in DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
