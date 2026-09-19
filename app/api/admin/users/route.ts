import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, createClient } from '@/lib/supabase/server'

const ADMIN_ROLES = ['admin', 'super_admin', 'moderator']

type AuthUser = {
  id: string
  email?: string
  user_metadata?: Record<string, unknown>
  app_metadata?: Record<string, unknown>
  created_at?: string
  last_sign_in_at?: string | null
  email_confirmed_at?: string | null
  banned_until?: string | null
}

function toAppUser(user: AuthUser) {
  const role = typeof user.app_metadata?.role === 'string' && ADMIN_ROLES.includes(user.app_metadata.role)
    ? user.app_metadata.role
    : 'user'
  const name = typeof user.user_metadata?.full_name === 'string'
    ? user.user_metadata.full_name
    : user.email?.split('@')[0] || 'User'

  return {
    id: user.id,
    name,
    email: user.email || '',
    role,
    status: user.banned_until ? 'banned' : 'active',
    emailVerified: Boolean(user.email_confirmed_at),
    createdAt: user.created_at || null,
    lastSignInAt: user.last_sign_in_at || null,
  }
}

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  const role = typeof user?.app_metadata?.role === 'string' ? user.app_metadata.role : ''
  if (error || !user || !ADMIN_ROLES.includes(role)) return null
  return user
}

export async function GET() {
  try {
    if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const admin = createAdminClient()
    const { data, error } = await admin.auth.admin.listUsers({ perPage: 1000 })
    if (error) return NextResponse.json({ error: 'Unable to load Supabase Auth users' }, { status: 502 })
    return NextResponse.json(data.users.map(toAppUser))
  } catch (error) {
    console.error('[v0] Admin Auth users GET failed:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    if (typeof body.email !== 'string' || typeof body.password !== 'string' || body.password.length < 6) {
      return NextResponse.json({ error: 'Email and a password of at least 6 characters are required' }, { status: 400 })
    }
    const admin = createAdminClient()
    const { data, error } = await admin.auth.admin.createUser({
      email: body.email.trim(),
      password: body.password,
      email_confirm: body.email_confirmed !== false,
      user_metadata: { full_name: typeof body.name === 'string' ? body.name.trim() : undefined },
    })
    if (error || !data.user) return NextResponse.json({ error: error?.message || 'Unable to create user' }, { status: 400 })
    return NextResponse.json(toAppUser(data.user as AuthUser), { status: 201 })
  } catch (error) {
    console.error('[v0] Admin Auth users POST failed:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    if (typeof body.id !== 'string') return NextResponse.json({ error: 'Missing user ID' }, { status: 400 })
    const admin = createAdminClient()
    const { data, error } = await admin.auth.admin.updateUserById(body.id, {
      email: typeof body.email === 'string' ? body.email.trim() : undefined,
      user_metadata: typeof body.name === 'string' ? { full_name: body.name.trim() } : undefined,
      ban_duration: body.status === 'banned' ? '876000h' : 'none',
    })
    if (error || !data.user) return NextResponse.json({ error: error?.message || 'Unable to update user' }, { status: 400 })
    return NextResponse.json(toAppUser(data.user as AuthUser))
  } catch (error) {
    console.error('[v0] Admin Auth users PUT failed:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const adminUser = await requireAdmin()
    if (!adminUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userId = new URL(request.url).searchParams.get('id')
    if (!userId || userId === adminUser.id) return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    const { error } = await createAdminClient().auth.admin.deleteUser(userId)
    if (error) return NextResponse.json({ error: 'Unable to delete user' }, { status: 400 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Admin Auth users DELETE failed:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
