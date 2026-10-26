import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { checkOtpVerifyRateLimit } from '@/lib/otp-rate-limit'

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

    const { email: rawEmail, code: rawCode } = await request.json()
    const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : ''
    const code = typeof rawCode === 'string' ? rawCode.trim() : ''

    if (!email || !/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: 'Email and code are required' },
        { status: 400 }
      )
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
    const rateLimit = await checkOtpVerifyRateLimit(email, ip)
    if (rateLimit.unavailable) return NextResponse.json({ error: 'Rate limiting service unavailable' }, { status: 503 })
    if (!rateLimit.allowed) return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })

    // Never log OTP values or other authentication secrets.
    // Find the OTP record
    const { data: otpRecords, error: queryError } = await supabase
      .from('otp_codes')
      .select('id, email, code, expires_at, attempts, verified_at')
      .eq('email', email)
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
      return NextResponse.json({ error: 'Invalid or expired OTP code' }, { status: 400 })
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

    if (otpRecord.code !== code) {
      const nextAttempts = Number(otpRecord.attempts || 0) + 1
      await supabase
        .from('otp_codes')
        .update({ attempts: nextAttempts, updated_at: new Date().toISOString() })
        .eq('id', otpRecord.id)
      return NextResponse.json({ error: 'Invalid or expired OTP code' }, { status: nextAttempts >= 5 ? 429 : 400 })
    }

    // Mark OTP as verified
    const { error: updateError } = await supabase
      .from('otp_codes')
      .update({
        verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', otpRecord.id)
      .is('verified_at', null)

    if (updateError) {
      console.error('[v0] Error updating OTP verification:', updateError)
      return NextResponse.json(
        { error: 'Failed to verify OTP' },
        { status: 500 }
      )
    }

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
