import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { validatePartial, validateFan } from '@/lib/validation'

import { checkAdminAuth } from '@/lib/admin-api-helper'
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const fanId = searchParams.get('id')

    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    if (fanId) {
      const { data, error } = await supabase
        .from('fans')
        .select('id, name, email, avatar_url, is_active, created_at, updated_at')
        .eq('id', fanId)
        .single()

      if (error) {
        console.error('[v0] Error fetching fan:', error)
        // Return 404 if no record found, 400 for other errors
        const statusCode = error.message?.includes('no rows') ? 404 : 400
        return NextResponse.json({ error: 'Unable to process request' }, { status: statusCode })
      }

      return NextResponse.json(data)
    } else {
      const { data, error } = await supabase
        .from('fans')
        .select('id, name, email, avatar_url, is_active, created_at, updated_at')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('[v0] Error fetching fans:', error)
        return NextResponse.json({ error: 'Unable to process request' }, { status: 400 })
      }

      return NextResponse.json(data)
    }
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const body = await request.json()

    // Validate fan data
    const validation = validateFan(body)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('fans')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('[v0] Error creating fan:', error)
      return NextResponse.json({ error: 'Unable to process request' }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()

    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing fan ID' }, { status: 400 })
    }

    // Validate fan data (partial updates are OK)
    const validation = validatePartial(updates, validateFan)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('fans')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[v0] Error updating fan:', error)
      return NextResponse.json({ error: 'Unable to process request' }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const { searchParams } = new URL(request.url)
    const fanId = searchParams.get('id')

    if (!fanId) {
      return NextResponse.json({ error: 'Missing fan ID' }, { status: 400 })
    }

    const { error } = await supabase
      .from('fans')
      .delete()
      .eq('id', fanId)

    if (error) {
      console.error('[v0] Error deleting fan:', error)
      return NextResponse.json({ error: 'Unable to process request' }, { status: 400 })
    }

    return NextResponse.json({ success: true, id: fanId })
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
