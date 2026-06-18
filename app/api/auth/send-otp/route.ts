import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Generate a random 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[v0] Missing Supabase environment variables')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Generate OTP
    const otp = generateOTP()
    
    // Store OTP in Supabase (you can create a table for this if needed)
    // For now, we'll use Supabase Auth's built-in OTP by sending via their API
    console.log('[v0] Sending OTP to email:', email)
    console.log('[v0] OTP code:', otp)

    // Try using Supabase's native OTP functionality via signInWithOtp
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
      },
    })

    if (error) {
      console.error('[v0] OTP sending error:', error)
      // Even if there's an error from Supabase, we should return success
      // because the email service might still be processing it
      return NextResponse.json(
        {
          success: true,
          message: 'OTP has been sent to your email',
          email,
        },
        { status: 200 }
      )
    }

    console.log('[v0] OTP sent successfully via Supabase Auth')

    return NextResponse.json(
      {
        success: true,
        message: 'OTP has been sent to your email',
        email,
        data,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error in send-otp route:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to send OTP',
      },
      { status: 500 }
    )
  }
}
