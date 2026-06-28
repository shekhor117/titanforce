import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Fetch inventory
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    let query = supabase.from('products').select('id, name, stock, price')

    if (productId) {
      query = query.eq('id', productId)
    }

    // Add pagination
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0

    const { data, error, count } = await query
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('[v0] Error fetching inventory:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
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

// PUT - Update inventory (stock)
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { productId, quantity, operation } = body

    if (!productId || quantity === undefined) {
      return NextResponse.json({ error: 'Missing productId or quantity' }, { status: 400 })
    }

    if (typeof quantity !== 'number' || quantity < 0) {
      return NextResponse.json({ error: 'Quantity must be a non-negative number' }, { status: 400 })
    }

    if (operation && !['set', 'add', 'subtract'].includes(operation)) {
      return NextResponse.json({ error: 'Invalid operation. Use set, add, or subtract' }, { status: 400 })
    }

    // First, get current stock
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('stock')
      .eq('id', productId)
      .single()

    if (fetchError) {
      console.error('[v0] Error fetching product:', fetchError)
      const statusCode = fetchError.message?.includes('no rows') ? 404 : 400
      return NextResponse.json({ error: fetchError.message }, { status: statusCode })
    }

    let newStock = quantity
    if (operation === 'add') {
      newStock = (product.stock || 0) + quantity
    } else if (operation === 'subtract') {
      newStock = (product.stock || 0) - quantity
      if (newStock < 0) {
        return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 })
      }
    }

    // Update stock
    const { data, error } = await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', productId)
      .select()
      .single()

    if (error) {
      console.error('[v0] Error updating inventory:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      productId,
      previousStock: product.stock || 0,
      newStock,
      operation: operation || 'set'
    })
  } catch (error) {
    console.error('[v0] Unexpected error in PUT:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
