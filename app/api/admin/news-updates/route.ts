import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { validateNewsUpdate } from '@/lib/validation'

export async function GET(request: NextRequest) {
  try {
    // Use admin client to bypass RLS for listing all news items
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    const updateId = searchParams.get('id')

    if (updateId) {
      const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .eq('id', updateId)
        .single()

      if (error) {
        console.error('[v0] Error fetching news update:', error)
        const statusCode = error.message?.includes('no rows') ? 404 : 400
        return NextResponse.json({ error: error.message }, { status: statusCode })
      }

      return NextResponse.json(data)
    }

    const { data, error } = await supabase
      .from('news_items')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[v0] Error fetching news items:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error in GET /api/admin/news-updates:', error)
    return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientSupa = await createClient()

    const { data: { user }, error: authError } = await clientSupa.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const validation = validateNewsUpdate(body)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 })
    }

    // Use admin client for insert
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('news_items')
      .insert([{ ...body, author_id: user.id }])
      .select()
      .single()

    if (error) {
      console.error('[v0] Error creating news item:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('[v0] Unexpected error in POST /api/admin/news-updates:', error)
    return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const clientSupa = await createClient()

    const { data: { user }, error: authError } = await clientSupa.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing news item ID' }, { status: 400 })
    }

    const validation = validateNewsUpdate(updates)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 })
    }

    // Use admin client for update
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('news_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[v0] Error updating news item:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error in PUT /api/admin/news-updates:', error)
    return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const clientSupa = await createClient()

    const { data: { user }, error: authError } = await clientSupa.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const updateId = searchParams.get('id')

    if (!updateId) {
      return NextResponse.json({ error: 'Missing news item ID' }, { status: 400 })
    }

    // Use admin client for delete
    const supabase = createAdminClient()
    const { error } = await supabase
      .from('news_items')
      .delete()
      .eq('id', updateId)

    if (error) {
      console.error('[v0] Error deleting news update:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[v0] Unexpected error in DELETE /api/admin/news-updates:', error)
    return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
