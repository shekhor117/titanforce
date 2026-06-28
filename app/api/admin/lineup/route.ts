import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateLineup } from '@/lib/validation'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const lineupId = searchParams.get('id')

    if (lineupId) {
      const { data, error } = await supabase
        .from('lineups')
        .select('*')
        .eq('id', lineupId)
        .single()

      if (error) {
        console.error('[v0] Error fetching lineup:', error)
        const statusCode = error.message?.includes('no rows') ? 404 : 400
        return NextResponse.json({ error: error.message }, { status: statusCode })
      }

      return NextResponse.json(data)
    }

    const { data, error } = await supabase
      .from('lineups')
      .select('*')
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('[v0] Error fetching lineups:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error in GET /api/admin/lineup:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const validation = validateLineup(body)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('lineups')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('[v0] Error creating lineup:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('[v0] Unexpected error in POST /api/admin/lineup:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing lineup ID' }, { status: 400 })
    }

    const validation = validateLineup(updates)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('lineups')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[v0] Error updating lineup:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error in PUT /api/admin/lineup:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const lineupId = searchParams.get('id')

    if (!lineupId) {
      return NextResponse.json({ error: 'Missing lineup ID' }, { status: 400 })
    }

    const { error } = await supabase
      .from('lineups')
      .delete()
      .eq('id', lineupId)

    if (error) {
      console.error('[v0] Error deleting lineup:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[v0] Unexpected error in DELETE /api/admin/lineup:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
