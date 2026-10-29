import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkAdminAuth } from '@/lib/admin-api-helper'
import { validateSettings } from '@/lib/validation'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const { data, error } = await supabase
      .from('site_settings')
      .select('id, setting_key, setting_value, description, category, is_public, created_at, updated_at')
      .single()

    if (error) {
      console.error('[v0] Error fetching settings:', error)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ message: 'No settings found, using defaults' }, { status: 200 })
      }
      return NextResponse.json({ error: 'Unable to process settings request' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error in settings GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()

    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const body = await request.json()

    const validation = validateSettings(body)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }

    const { data: existingSettings } = await supabase
      .from('site_settings')
      .select('id')
      .single()

    let result

    if (existingSettings) {
      result = await supabase
        .from('site_settings')
        .update(body)
        .eq('id', existingSettings.id)
        .select()
        .single()
    } else {
      result = await supabase
        .from('site_settings')
        .insert([body])
        .select()
        .single()
    }

    const { data, error } = result

    if (error) {
      console.error('[v0] Error updating settings:', error)
      return NextResponse.json({ error: 'Unable to process settings request' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error in settings PUT:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()

    const auth = await checkAdminAuth(request)
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const body = await request.json()
    const { key, value } = body

    if (!key) {
      return NextResponse.json({ error: 'Setting key is required' }, { status: 400 })
    }

    const allowedKeys = new Set(['site_name', 'site_description', 'logo_url', 'favicon_url', 'contact_email', 'social_links', 'theme'])
    if (typeof key !== 'string' || !allowedKeys.has(key)) {
      return NextResponse.json({ error: 'Unsupported setting key' }, { status: 400 })
    }
    const updateData: Record<string, unknown> = { [key]: value }

    const validation = validateSettings(updateData)
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('site_settings')
      .update(updateData)
      .gt('id', 0)
      .select()
      .single()

    if (error) {
      console.error('[v0] Error updating setting:', error)
      return NextResponse.json({ error: 'Unable to process settings request' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Unexpected error in settings PATCH:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
