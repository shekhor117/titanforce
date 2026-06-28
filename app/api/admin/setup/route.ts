import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { validateAdminSetup } from '@/lib/validation'

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json(
      { error: 'Supabase configuration missing' },
      { status: 500 }
    )
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    const body = await request.json()
    const { email, password, name } = body

    // Validate admin setup data
    const validation = validateAdminSetup(body)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      )
    }

    console.log('[v0] Setting up admin user:', email)

    // Check if user already exists
    const { data: { users } } = await supabase.auth.admin.listUsers()
    const existingUser = users?.find(u => u.email === email)

    let userId = existingUser?.id

    if (!existingUser) {
      // Create new admin user
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        user_metadata: {
          full_name: name || 'Admin',
          role: 'admin',
        },
        email_confirm: true, // Auto-confirm email
      })

      if (error) {
        console.error('[v0] Error creating admin user:', error)
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }

      userId = data.user?.id
      console.log('[v0] Admin user created:', userId)
    } else {
      // Update existing user with admin role
      const { error } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        {
          user_metadata: {
            full_name: name || existingUser.user_metadata?.full_name || 'Admin',
            role: 'admin',
          },
        }
      )

      if (error) {
        console.error('[v0] Error updating user role:', error)
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }

      console.log('[v0] User role updated to admin:', userId)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Admin user setup successful',
        userId,
        email,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Admin setup error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Setup failed' },
      { status: 500 }
    )
  }
}
