import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { validatePartial, validateNews } from '@/lib/validation'

import { checkAdminAuth } from '@/lib/admin-api-helper'
// GET - Fetch all news or by ID
export async function GET(request: NextRequest) {
  try {
    // Use admin client for public access to published news
    const supabase = createAdminClient()

    const { searchParams } = new URL(request.url)
    const newsId = searchParams.get('id')

    if (newsId) {
      // Fetch specific news
      const { data, error } = await supabase
        .from('news_items')
        .select('id, title, slug, excerpt, content, image_url, category, author, published, published_at, created_at, updated_at')
        .eq('id', newsId)
        .single()

      if (error) {
        console.error('[v0] Error fetching news:', error)
        const statusCode = error.message?.includes('no rows') ? 404 : 400
        return NextResponse.json({ error: 'Unable to process request' }, { status: statusCode })
      }

      return NextResponse.json(data)
    } else {
      // Fetch all news
      const { data, error } = await supabase
        .from('news_items')
        .select('id, title, slug, excerpt, content, image_url, category, author, published, published_at, created_at, updated_at')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('[v0] Error fetching news:', error)
        return NextResponse.json({ error: 'Unable to process request' }, { status: 400 })
      }

      return NextResponse.json(data || [])
    }
  } catch (error) {
    console.error('[v0] Error in news GET:', error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      { 
        error: 'Failed to fetch news'
      },
      { status: 500 }
    )
  }
}

// POST - Create a new news item
export async function POST(request: NextRequest) {
  try {
    const userClient = await createClient()

    // Check admin authentication
    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const body = await request.json()

    // Validate news data
    const validation = validateNews(body)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }

    // Use admin client for database operations
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('news_items')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('[v0] Error creating news:', error)
      console.error('[v0] Table: news_items, Error code:', error.code)
      return NextResponse.json({ error: 'Unable to process request' }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('[v0] Error in news POST:', error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      { 
        error: 'Failed to create news'
      },
      { status: 500 }
    )
  }
}

// PUT - Update a news item
export async function PUT(request: NextRequest) {
  try {
    const userClient = await createClient()

    // Check admin authentication
    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing news ID' }, { status: 400 })
    }

    // Validate news data (partial updates are OK)
    const validation = validatePartial(updates, validateNews)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }

    // Use admin client for database operations
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('news_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[v0] Error updating news:', error)
      const statusCode = error.message?.includes('no rows') ? 404 : 400
      return NextResponse.json({ error: 'Unable to process request' }, { status: statusCode })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Error in news PUT:', error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      { 
        error: 'Failed to update news'
      },
      { status: 500 }
    )
  }
}

// DELETE - Delete a news item
export async function DELETE(request: NextRequest) {
  try {
    const userClient = await createClient()

    // Check admin authentication
    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const { searchParams } = new URL(request.url)
    const newsId = searchParams.get('id')

    if (!newsId) {
      return NextResponse.json({ error: 'Missing news ID' }, { status: 400 })
    }

    // Use admin client for database operations
    const supabase = createAdminClient()

    const { error } = await supabase
      .from('news_items')
      .delete()
      .eq('id', newsId)

    if (error) {
      console.error('[v0] Error deleting news:', error)
      return NextResponse.json({ error: 'Unable to process request' }, { status: 400 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[v0] Error in news DELETE:', error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      { 
        error: 'Failed to delete news'
      },
      { status: 500 }
    )
  }
}
