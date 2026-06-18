import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

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

    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and code are required' },
        { status: 400 }
      )
    }

    console.log('[v0] Verifying OTP for email:', email, 'code:', code)

    // Find the OTP record
    const { data: otpRecords, error: queryError } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .is('verified_at', null)
      .order('created_at', { ascending: false })
      .limit(1)

    if (queryError) {
      console.error('[v0] Error querying OTP:', queryError)
      return NextResponse.json(
        { error: 'Failed to verify OTP' },
        { status: 500 }
      )
    }

    if (!otpRecords || otpRecords.length === 0) {
      console.warn('[v0] OTP not found or already verified for:', email)
      return NextResponse.json(
        { error: 'Invalid or expired OTP code' },
        { status: 400 }
      )
    }

    const otpRecord = otpRecords[0]

    // Check if OTP has expired
    const expiresAt = new Date(otpRecord.expires_at)
    if (new Date() > expiresAt) {
      console.warn('[v0] OTP expired for:', email)
      return NextResponse.json(
        { error: 'OTP has expired' },
        { status: 400 }
      )
    }

    // Check attempt limit (max 5 attempts)
    if (otpRecord.attempts >= 5) {
      console.warn('[v0] Too many OTP attempts for:', email)
      return NextResponse.json(
        { error: 'Too many attempts. Please request a new OTP' },
        { status: 429 }
      )
    }

    // Mark OTP as verified
    const { data: updateData, error: updateError } = await supabase
      .from('otp_codes')
      .update({
        verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', otpRecord.id)
      .select()

    if (updateError) {
      console.error('[v0] Error updating OTP verification:', updateError)
      return NextResponse.json(
        { error: 'Failed to verify OTP' },
        { status: 500 }
      )
    }

    console.log('[v0] OTP verified successfully for:', email)

    return NextResponse.json(
      {
        success: true,
        message: 'OTP verified successfully',
        email,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error in verify-otp route:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to verify OTP',
      },
      { status: 500 }
    )
  }
}
