import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { validateInjury } from '@/lib/validation'

// GET - Fetch all injuries or by ID
export async function GET(request: NextRequest) {
  try {
    const userClient = await createClient()
    
    // Check admin authentication
    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    const injuryId = searchParams.get('id')

    if (injuryId) {
      const { data, error } = await supabase
        .from('injuries')
        .select('*')
        .eq('id', injuryId)
        .single()

      if (error) {
        console.error('[v0] Error fetching injury:', error)
        const statusCode = error.message?.includes('no rows') ? 404 : 400
        return NextResponse.json({ error: error.message }, { status: statusCode })
      }

      return NextResponse.json(data)
    }

    const { data, error } = await supabase
      .from('injuries')
      .select('*')
      .order('injuryDate', { ascending: false })

    if (error) {
      console.error('[v0] Error fetching injuries:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error in GET /api/admin/injuries:', error)
    return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

// POST - Create new injury
export async function POST(request: NextRequest) {
  try {
    const userClient = await createClient()

    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const validation = validateInjury(body)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('injuries')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('[v0] Error creating injury:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('[v0] Unexpected error in POST /api/admin/injuries:', error)
    return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

// PUT - Update injury
export async function PUT(request: NextRequest) {
  try {
    const userClient = await createClient()

    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing injury ID' }, { status: 400 })
    }

    const validation = validateInjury(updates)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('injuries')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[v0] Error updating injury:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error in PUT /api/admin/injuries:', error)
    return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

// DELETE - Remove injury
export async function DELETE(request: NextRequest) {
  try {
    const userClient = await createClient()

    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const injuryId = searchParams.get('id')

    if (!injuryId) {
      return NextResponse.json({ error: 'Missing injury ID' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { error } = await supabase
      .from('injuries')
      .delete()
      .eq('id', injuryId)

    if (error) {
      console.error('[v0] Error deleting injury:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[v0] Unexpected error in DELETE /api/admin/injuries:', error)
    return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
