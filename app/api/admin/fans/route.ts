import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { validateFan } from '@/lib/validation'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const fanId = searchParams.get('id')

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (fanId) {
      const { data, error } = await supabase
        .from('fans')
        .select('*')
        .eq('id', fanId)
        .single()

      if (error) {
        console.error('[v0] Error fetching fan:', error)
        // Return 404 if no record found, 400 for other errors
        const statusCode = error.message?.includes('no rows') ? 404 : 400
        return NextResponse.json({ error: error.message }, { status: statusCode })
      }

      return NextResponse.json(data)
    } else {
      const { data, error } = await supabase
        .from('fans')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('[v0] Error fetching fans:', error)
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json(data)
    }
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate fan data
    const validation = validateFan(body)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('fans')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('[v0] Error creating fan:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing fan ID' }, { status: 400 })
    }

    // Validate fan data (partial updates are OK)
    const validation = validateFan(updates)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('fans')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[v0] Error updating fan:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, id: fanId })
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
