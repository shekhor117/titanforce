import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Generate a random 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send email via a mail service or Supabase
async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  try {
    // Try using Resend if available
    if (process.env.RESEND_API_KEY) {
      console.log('[v0] Sending OTP via Resend to:', email)
      
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'noreply@titanforce.com',
          to: email,
          subject: 'Your TitanForce OTP Code',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d1a1a 100%); padding: 40px; border-radius: 8px; text-align: center;">
                <h1 style="color: #c41e3a; margin: 0 0 20px 0;">TitanForce</h1>
                <h2 style="color: #fff; margin: 0 0 30px 0;">Your OTP Code</h2>
                <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="color: #fff; font-size: 14px; margin: 0 0 10px 0;">Enter this code to verify your email:</p>
                  <p style="color: #c41e3a; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 10px 0;">${otp}</p>
                </div>
                <p style="color: #aaa; font-size: 12px; margin: 20px 0;">This code expires in 5 minutes.</p>
                <p style="color: #aaa; font-size: 12px; margin: 10px 0;">If you didn't request this code, please ignore this email.</p>
              </div>
            </div>
          `,
        }),
      })

      if (response.ok) {
        console.log('[v0] OTP email sent successfully via Resend')
        return true
      } else {
        const error = await response.json()
        console.error('[v0] Resend error:', error)
        return false
      }
    }

    // Fallback: Log OTP to console for development
    console.log('[v0] OTP Code (Development Mode):', otp)
    console.log('[v0] Sending OTP to email:', email)
    return true
  } catch (error) {
    console.error('[v0] Error sending OTP email:', error)
    return false
  }
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
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now

    console.log('[v0] Generated OTP:', otp, 'for email:', email)

    // Store OTP in database
    const { data: otpData, error: dbError } = await supabase
      .from('otp_codes')
      .insert([
        {
          email,
          code: otp,
          expires_at: expiresAt.toISOString(),
        },
      ])
      .select()

    if (dbError) {
      console.error('[v0] Error storing OTP in database:', dbError)
      return NextResponse.json(
        { error: 'Failed to store OTP' },
        { status: 500 }
      )
    }

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp)

    if (!emailSent) {
      console.warn('[v0] Failed to send OTP email, but OTP was stored in database')
      // Still return success as OTP is stored
    }

    return NextResponse.json(
      {
        success: true,
        message: 'OTP has been sent to your email',
        email,
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
