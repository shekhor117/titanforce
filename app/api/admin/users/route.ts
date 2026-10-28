import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { validatePartial, validateUser } from '@/lib/validation'
import { checkAdminAuth } from '@/lib/admin-api-helper'

export async function GET(request: NextRequest) {
  const adminAuth = await checkAdminAuth(request)
  if (!adminAuth.authorized) return NextResponse.json({ error: adminAuth.error }, { status: adminAuth.status })

  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id')

    if (userId) {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name, role, is_active, created_at, updated_at')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('[v0] Error fetching user:', error)
        const statusCode = error.message?.includes('no rows') ? 404 : 400
        return NextResponse.json({ error: statusCode === 404 ? 'User not found' : 'Unable to fetch user' }, { status: statusCode })
      }

      return NextResponse.json(data)
    }

    const { data, error } = await supabase
      .from('users')
      .select('id, email, full_name, role, is_active, created_at, updated_at')
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('[v0] Error fetching users:', error)
      return NextResponse.json({ error: 'Unable to process user request' }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error in GET /api/admin/users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const adminAuth = await checkAdminAuth(request)
  if (!adminAuth.authorized) return NextResponse.json({ error: adminAuth.error }, { status: adminAuth.status })

  try {
    const supabase = await createClient()

    const body = await request.json()

    const validation = validateUser(body)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }

    const userRecord = {
      email: body.email,
      full_name: body.full_name,
      role: body.role,
      is_active: body.is_active,
    }
    const { data, error } = await supabase
      .from('users')
      .insert([userRecord])
      .select()
      .single()

    if (error) {
      console.error('[v0] Error creating user:', error)
      return NextResponse.json({ error: 'Unable to process user request' }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('[v0] Unexpected error in POST /api/admin/users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const adminAuth = await checkAdminAuth(request)
  if (!adminAuth.authorized) return NextResponse.json({ error: adminAuth.error }, { status: adminAuth.status })

  try {
    const supabase = await createClient()

    const body = await request.json()
    const { id } = body
    const updates = {
      email: body.email,
      full_name: body.full_name,
      role: body.role,
      is_active: body.is_active,
    }
    Object.keys(updates).forEach((key) => {
      if (updates[key as keyof typeof updates] === undefined) delete updates[key as keyof typeof updates]
    })

    if (!id) {
      return NextResponse.json({ error: 'Missing user ID' }, { status: 400 })
    }

    const validation = validatePartial(updates, validateUser)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[v0] Error updating user:', error)
      return NextResponse.json({ error: 'Unable to process user request' }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error in PUT /api/admin/users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const adminAuth = await checkAdminAuth(request)
  if (!adminAuth.authorized) return NextResponse.json({ error: adminAuth.error }, { status: adminAuth.status })

  try {
    const supabase = await createClient()

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id')

    if (!userId) {
      return NextResponse.json({ error: 'Missing user ID' }, { status: 400 })
    }

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)

    if (error) {
      console.error('[v0] Error deleting user:', error)
      return NextResponse.json({ error: 'Unable to process user request' }, { status: 400 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[v0] Unexpected error in DELETE /api/admin/users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
