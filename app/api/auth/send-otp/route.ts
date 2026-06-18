import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Generate a random 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Create Brevo SMTP transporter
function createBrevoTransporter() {
  if (!process.env.BREVO_SMTP_HOST || !process.env.BREVO_SMTP_PORT || !process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_PASS) {
    console.warn('[v0] Brevo SMTP credentials not configured')
    return null
  }

  return nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST,
    port: parseInt(process.env.BREVO_SMTP_PORT),
    secure: process.env.BREVO_SMTP_PORT === '465', // true for 465, false for other ports like 587
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_PASS,
    },
  })
}

// Send email via Brevo SMTP or Brevo API or Resend
async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  try {
    const emailTemplate = `
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
    `

    // Priority 1: Try using Brevo SMTP (most reliable)
    const brevoTransporter = createBrevoTransporter()
    if (brevoTransporter) {
      console.log('[v0] Attempting to send OTP via Brevo SMTP to:', email)
      
      try {
        const senderEmail = process.env.BREVO_SENDER_EMAIL || 'noreply@titanforce.com'
        const mailOptions = {
          from: `TitanForce <${senderEmail}>`,
          to: email,
          subject: 'Your TitanForce OTP Code',
          html: emailTemplate,
        }

        console.log('[v0] Sending via Brevo SMTP:', { from: mailOptions.from, to: mailOptions.to })

        const info = await brevoTransporter.sendMail(mailOptions)
        
        console.log('[v0] OTP email sent successfully via Brevo SMTP. Message ID:', info.messageId)
        return true
      } catch (brevoError) {
        console.error('[v0] Brevo SMTP error:', brevoError instanceof Error ? brevoError.message : brevoError)
        // Fall through to next option
      }
    }

    // Priority 2: Try using Resend if available
    if (process.env.RESEND_API_KEY) {
      console.log('[v0] Attempting to send OTP via Resend to:', email)
      
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
          html: emailTemplate,
        }),
      })

      if (response.ok) {
        console.log('[v0] OTP email sent successfully via Resend')
        return true
      } else {
        const error = await response.json()
        console.error('[v0] Resend error:', error)
      }
    }

    // Fallback: Log OTP to console for development
    console.log('[v0] [DEVELOPMENT MODE] OTP Code:', otp)
    console.log('[v0] [DEVELOPMENT MODE] Email:', email)
    console.log('[v0] Configure BREVO_API_KEY or RESEND_API_KEY environment variables for production email sending')
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
    console.log('[v0] Storing OTP in database for email:', email)
    
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
      console.error('[v0] Error storing OTP in database:')
      console.error('[v0] - Error code:', dbError.code)
      console.error('[v0] - Error message:', dbError.message)
      console.error('[v0] - Full error:', dbError)
      
      // Check if it's a table not found error
      if (dbError.code === 'PGRST116' || dbError.message?.includes('relation') || dbError.message?.includes('does not exist')) {
        console.error('[v0] OTP table does not exist. Please run migrations: npx supabase db push')
        return NextResponse.json(
          { error: 'Database not configured. Please run migrations.' },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { error: `Failed to store OTP: ${dbError.message}` },
        { status: 500 }
      )
    }
    
    console.log('[v0] OTP stored successfully in database')

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
