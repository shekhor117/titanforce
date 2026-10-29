import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { validatePartial, validateContact } from '@/lib/validation'

import { checkAdminAuth } from '@/lib/admin-api-helper'
import { pickWritableFields } from '@/lib/admin-write'
// GET - Fetch all contacts or by ID
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { searchParams } = new URL(request.url)
    const contactId = searchParams.get('id')

    if (contactId) {
      // Fetch specific contact
      const { data, error } = await supabase
        .from('contact_messages')
        .select('id, name, email, subject, message, status, created_at, updated_at')
        .eq('id', contactId)
        .single()

      if (error) {
        console.error('[v0] Error fetching contact:', error)
        const statusCode = error.code === 'PGRST116' ? 404 : 500
        return NextResponse.json({ error: 'Unable to process request' }, { status: statusCode })
      }

      return NextResponse.json(data)
    } else {
      // Fetch all contacts
      const { data, error } = await supabase
        .from('contact_messages')
        .select('id, name, email, subject, message, status, created_at, updated_at')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('[v0] Error fetching contacts:', error)
        return NextResponse.json({ error: 'Unable to process request' }, { status: 500 })
      }

      return NextResponse.json(data || [])
    }
  } catch (error) {
    console.error('[v0] Error in contacts GET:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}

// POST - Create a new contact message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate contact data
    const validation = validateContact(body)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('contact_messages')
      .insert([pickWritableFields(body, ['name', 'email', 'subject', 'message', 'status'])])
      .select()
      .single()

    if (error) {
      console.error('[v0] Error creating contact:', error)
      return NextResponse.json({ error: 'Unable to process request' }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('[v0] Error in contacts POST:', error)
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    )
  }
}

// PUT - Update a contact message (for status updates like marking as read/responded)
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check admin authentication
    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const body = await request.json()
    const { id } = body
    const updates = pickWritableFields(body, ['name', 'email', 'subject', 'message', 'status'])

    if (!id) {
      return NextResponse.json({ error: 'Missing contact ID' }, { status: 400 })
    }

    // Validate contact data (partial updates are OK)
    const validation = validatePartial(updates, validateContact)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('contact_messages')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[v0] Error updating contact:', error)
      const statusCode = error.code === 'PGRST116' ? 404 : 500
      return NextResponse.json({ error: 'Unable to process request' }, { status: statusCode })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Error in contacts PUT:', error)
    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a contact message
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check admin authentication
    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const { searchParams } = new URL(request.url)
    const contactId = searchParams.get('id')

    if (!contactId) {
      return NextResponse.json({ error: 'Missing contact ID' }, { status: 400 })
    }

    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', contactId)

    if (error) {
      console.error('[v0] Error deleting contact:', error)
      return NextResponse.json({ error: 'Unable to process request' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[v0] Error in contacts DELETE:', error)
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    )
  }
}
