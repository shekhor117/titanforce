import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { checkAdminAuth } from '@/lib/admin-api-helper'

export const dynamic = 'force-dynamic'

const DEFAULTS = {
  maintenance_enabled: false,
  maintenance_title: "WE'RE UPGRADING",
  maintenance_message: "We're currently improving our digital home to bring you a better experience. Stay tuned!",
  expected_return: null as string | null,
  show_countdown: false,
  updated_at: null as string | null,
}

function json(data: unknown, status = 200) {
  const response = NextResponse.json(data, { status })
  response.headers.set('Cache-Control', 'no-store, max-age=0')
  return response
}

export async function GET(request: NextRequest) {
  try {
    const admin = createAdminClient()
    if (request.nextUrl.searchParams.get('activity') === '1') {
      const auth = await checkAdminAuth(request)
      if (!auth.authorized) return json({ error: auth.error }, auth.status)
      const { data, error } = await admin
        .from('maintenance_activity')
        .select('id, actor_email, maintenance_enabled, created_at')
        .order('created_at', { ascending: false })
        .limit(20)
      if (error) return json({ error: 'Unable to load activity' }, 500)
      return json({ activity: data ?? [] })
    }

    const { data, error } = await admin
      .from('site_settings')
      .select('maintenance_enabled, maintenance_title, maintenance_message, expected_return, show_countdown, updated_at')
      .eq('key', 'maintenance_mode')
      .maybeSingle()
    if (error) return json({ error: 'Unable to load maintenance settings' }, 500)
    return json({ settings: { ...DEFAULTS, ...(data ?? {}) } })
  } catch {
    return json({ error: 'Maintenance service unavailable' }, 503)
  }
}

export async function PUT(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (!origin || origin !== request.nextUrl.origin) {
    return json({ error: 'Request origin is not allowed' }, 403)
  }
  const auth = await checkAdminAuth(request)
  if (!auth.authorized) return json({ error: auth.error }, auth.status)

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid request body' }, 400)
  }

  const title = typeof body.maintenance_title === 'string' ? body.maintenance_title.trim() : ''
  const message = typeof body.maintenance_message === 'string' ? body.maintenance_message.trim() : ''
  const enabled = body.maintenance_enabled
  const countdown = body.show_countdown
  const reopening = body.expected_return
  if (!title || title.length > 90 || !message || message.length > 500 || typeof enabled !== 'boolean' || typeof countdown !== 'boolean') {
    return json({ error: 'Check the title, message, and toggle values (title 1–90 characters; message 1–500).' }, 400)
  }
  if (reopening !== null && (typeof reopening !== 'string' || !Number.isFinite(Date.parse(reopening)))) {
    return json({ error: 'Expected reopening time is invalid' }, 400)
  }

  const admin = createAdminClient()
  const { data: current, error: currentError } = await admin
    .from('site_settings')
    .select('maintenance_enabled')
    .eq('key', 'maintenance_mode')
    .single()
  if (currentError || !current) return json({ error: 'Maintenance settings are unavailable' }, 500)

  const { data: saved, error } = await admin
    .from('site_settings')
    .update({
      maintenance_enabled: enabled,
      maintenance_title: title,
      maintenance_message: message,
      expected_return: reopening,
      show_countdown: countdown,
      updated_by: auth.user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('key', 'maintenance_mode')
    .select('maintenance_enabled, maintenance_title, maintenance_message, expected_return, show_countdown, updated_at, updated_by')
    .single()
  if (error || !saved) return json({ error: 'Unable to save maintenance settings' }, 500)

  if (current.maintenance_enabled !== enabled) {
    const { error: activityError } = await admin.from('maintenance_activity').insert({
      actor_id: auth.user.id,
      actor_email: auth.user.email ?? 'Unknown admin',
      maintenance_enabled: enabled,
    })
    if (activityError) return json({ error: 'Settings saved, but activity logging failed' }, 500)
  }

  return json({ settings: saved })
}
