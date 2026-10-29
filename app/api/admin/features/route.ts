import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { validatePartial, validateFeature } from '@/lib/validation'

import { checkAdminAuth } from '@/lib/admin-api-helper'
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const searchParams = request.nextUrl.searchParams
    const featureId = searchParams.get('id')

    if (featureId) {
      const { data, error } = await supabase
        .from('features')
        .select('id, name, description, enabled, config, created_at, updated_at')
        .eq('id', featureId)
        .single()

      if (error) {
        console.error('[v0] Error fetching feature:', error)
        const statusCode = error.code === 'PGRST116' ? 404 : 500
        return NextResponse.json({ error: 'Unable to process request' }, { status: statusCode })
      }

      return NextResponse.json(data)
    }

    const { data, error } = await supabase
      .from('features')
      .select('id, name, description, enabled, config, created_at, updated_at')
      .order('name')

    if (error) {
      console.error('[v0] Error fetching features:', error)
      return NextResponse.json({ error: 'Unable to process request' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error in features GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const body = await request.json()

    const validation = validateFeature(body)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('features')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('[v0] Error creating feature:', error)
      return NextResponse.json({ error: 'Unable to process request' }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('[v0] Unexpected error in features POST:', error)
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
      return NextResponse.json({ error: 'Missing feature ID' }, { status: 400 })
    }

    const validation = validatePartial(updates, validateFeature)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('features')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[v0] Error updating feature:', error)
      return NextResponse.json({ error: 'Unable to process request' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error in features PUT:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing feature ID' }, { status: 400 })
    }

    const { error } = await supabase
      .from('features')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[v0] Error deleting feature:', error)
      return NextResponse.json({ error: 'Unable to process request' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Feature deleted' })
  } catch (error) {
    console.error('[v0] Unexpected error in features DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
