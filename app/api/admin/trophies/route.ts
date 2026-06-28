import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateTrophy } from '@/lib/validation'

// GET - Fetch all trophies or by ID
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { searchParams } = new URL(request.url)
    const trophyId = searchParams.get('id')

    if (trophyId) {
      // Fetch specific trophy
      const { data, error } = await supabase
        .from('trophies')
        .select('*')
        .eq('id', trophyId)
        .single()

      if (error) {
        console.error('[v0] Error fetching trophy:', error)
        const statusCode = error.message?.includes('no rows') ? 404 : 400
        return NextResponse.json({ error: error.message }, { status: statusCode })
      }

      return NextResponse.json(data)
    } else {
      // Fetch all trophies
      const { data, error } = await supabase
        .from('trophies')
        .select('*')
        .order('year', { ascending: false })

      if (error) {
        console.error('[v0] Error fetching trophies:', error)
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json(data || [])
    }
  } catch (error) {
    console.error('[v0] Error in trophies GET:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch trophies' },
      { status: 500 }
    )
  }
}

// POST - Create a new trophy
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate trophy data
    const validation = validateTrophy(body)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('trophies')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('[v0] Error creating trophy:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('[v0] Error in trophies POST:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create trophy' },
      { status: 500 }
    )
  }
}

// PUT - Update a trophy
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing trophy ID' }, { status: 400 })
    }

    // Validate trophy data (partial updates are OK)
    const validation = validateTrophy(updates)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('trophies')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[v0] Error updating trophy:', error)
      const statusCode = error.message?.includes('no rows') ? 404 : 400
      return NextResponse.json({ error: error.message }, { status: statusCode })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Error in trophies PUT:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update trophy' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a trophy
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const trophyId = searchParams.get('id')

    if (!trophyId) {
      return NextResponse.json({ error: 'Missing trophy ID' }, { status: 400 })
    }

    const { error } = await supabase
      .from('trophies')
      .delete()
      .eq('id', trophyId)

    if (error) {
      console.error('[v0] Error deleting trophy:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[v0] Error in trophies DELETE:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete trophy' },
      { status: 500 }
    )
  }
}
