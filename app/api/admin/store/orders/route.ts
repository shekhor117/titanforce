import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkAdminAuth } from '@/lib/admin-api-helper'
import { validatePartial, validateOrder } from '@/lib/validation'

// GET - Fetch all orders or specific order by ID
export async function GET(request: NextRequest) {
  try {
    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')

    if (orderId) {
      // Fetch specific order
      const { data, error } = await supabase
        .from('orders')
        .select('id, user_id, status, total, shipping_address, created_at, updated_at')
        .eq('id', orderId)
        .single()

      if (error) {
        console.error('[v0] Error fetching order:', error)
        const statusCode = error.code === 'PGRST116' ? 404 : 500
        return NextResponse.json({ error: 'Unable to process order request' }, { status: statusCode })
      }

      return NextResponse.json(data)
    }

    // Fetch all orders with pagination and filtering
    let query = supabase.from('orders').select('*', { count: 'exact' })

    const status = searchParams.get('status')
    if (status) {
      query = query.eq('status', status)
    }

    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0

    const { data, error, count } = await query.range(offset, offset + limit - 1)

    if (error) {
      console.error('[v0] Error fetching orders:', error)
      return NextResponse.json({ error: 'Unable to process order request' }, { status: 500 })
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

// POST - Create a new order
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check admin authentication
    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const body = await request.json()

    // Validate order data
    const validation = validateOrder(body)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }

    const writableFields = ['user_id', 'status', 'total', 'shipping_address', 'billing_address', 'items', 'notes'] as const
    const orderRecord = Object.fromEntries(writableFields.filter((field) => body[field] !== undefined).map((field) => [field, body[field]]))
    const { data, error } = await supabase
      .from('orders')
      .insert([orderRecord])
      .select()
      .single()

    if (error) {
      console.error('[v0] Error creating order:', error)
      return NextResponse.json({ error: 'Unable to process order request' }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('[v0] Unexpected error in POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update an order
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check admin authentication
    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const body = await request.json()
    const { id } = body
    const writableFields = ['status', 'shipping_address', 'billing_address', 'items', 'notes'] as const
    const updates = Object.fromEntries(writableFields.filter((field) => body[field] !== undefined).map((field) => [field, body[field]]))

    if (!id) {
      return NextResponse.json({ error: 'Missing order ID' }, { status: 400 })
    }

    // Validate order data (partial updates are OK)
    const validation = validatePartial(updates, validateOrder)
    if (Object.keys(updates).length === 0) return NextResponse.json({ error: 'No writable fields provided' }, { status: 400 })
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[v0] Error updating order:', error)
      const statusCode = error.code === 'PGRST116' ? 404 : 500
      return NextResponse.json({ error: 'Unable to process order request' }, { status: statusCode })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error in PUT:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete an order
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check admin authentication
    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')

    if (!orderId) {
      return NextResponse.json({ error: 'Missing order ID' }, { status: 400 })
    }

    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId)

    if (error) {
      console.error('[v0] Error deleting order:', error)
      return NextResponse.json({ error: 'Unable to process order request' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Unexpected error in DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
