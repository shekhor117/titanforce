import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { validatePartial, validatePartner } from '@/lib/validation'

import { checkAdminAuth } from '@/lib/admin-api-helper'
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const partnerId = searchParams.get('id')

    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    if (partnerId) {
      const { data, error } = await supabase
        .from('partners')
        .select('id, name, logo_url, website_url, description, is_active, sort_order, created_at, updated_at')
        .eq('id', partnerId)
        .single()

      if (error) {
        console.error('[v0] Error fetching partner:', error)
        // Return 404 if no record found, 400 for other errors
        const statusCode = error.message?.includes('no rows') ? 404 : 400
        return NextResponse.json({ error: 'Unable to process request' }, { status: statusCode })
      }

      return NextResponse.json(data)
    } else {
      const { data, error } = await supabase
        .from('partners')
        .select('id, name, logo_url, website_url, description, is_active, sort_order, created_at, updated_at')
        .order('name', { ascending: true })

      if (error) {
        console.error('[v0] Error fetching partners:', error)
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

    // Validate partner data
    const validation = validatePartner(body)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('partners')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('[v0] Error creating partner:', error)
      return NextResponse.json({ error: 'Unable to process request' }, { status: 400 })
    }

    console.log('[v0] Partner created:', data)
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
      return NextResponse.json({ error: 'Missing partner ID' }, { status: 400 })
    }

    // Validate partner data (partial updates are OK)
    const validation = validatePartial(updates, validatePartner)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('partners')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[v0] Error updating partner:', error)
      return NextResponse.json({ error: 'Unable to process request' }, { status: 400 })
    }

    console.log('[v0] Partner updated:', data)
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
    const partnerId = searchParams.get('id')

    if (!partnerId) {
      return NextResponse.json({ error: 'Missing partner ID' }, { status: 400 })
    }

    const { error } = await supabase
      .from('partners')
      .delete()
      .eq('id', partnerId)

    if (error) {
      console.error('[v0] Error deleting partner:', error)
      return NextResponse.json({ error: 'Unable to process request' }, { status: 400 })
    }

    console.log('[v0] Partner deleted:', partnerId)
    return NextResponse.json({ success: true, id: partnerId })
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
