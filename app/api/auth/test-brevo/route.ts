import { NextRequest, NextResponse } from 'next/server'

/**
 * Test endpoint to verify Brevo SMTP connection
 * Usage: POST /api/auth/test-brevo
 * Body: { "email": "test@example.com" }
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check for Brevo configuration
    const brevoApiKey = process.env.BREVO_API_KEY
    const brevoSenderEmail = process.env.BREVO_SENDER_EMAIL || 'noreply@titanforce.com'

    const configStatus = {
      hasBrevoApiKey: !!brevoApiKey,
      brevoSenderEmail,
      timestamp: new Date().toISOString(),
    }

    if (!brevoApiKey) {
      return NextResponse.json(
        {
          success: false,
          message: 'Brevo API key not configured',
          config: configStatus,
          instruction: 'Set BREVO_API_KEY environment variable in Vercel',
        },
        { status: 400 }
      )
    }

    // Test Brevo API connection
    console.log('[v0] Testing Brevo connection with email:', email)

    const testResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': brevoApiKey,
      },
      body: JSON.stringify({
        to: [{ email }],
        sender: {
          email: brevoSenderEmail,
          name: 'TitanForce Test',
        },
        subject: 'TitanForce Brevo SMTP Test',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #c41e3a;">Brevo SMTP Connection Test</h2>
            <p>This is a test email from TitanForce to verify your Brevo SMTP connection is working correctly.</p>
            <p>If you received this email, your Brevo SMTP is properly configured!</p>
            <hr />
            <p style="color: #aaa; font-size: 12px;">
              Sent at: ${new Date().toISOString()}<br/>
              Sender: ${brevoSenderEmail}
            </p>
          </div>
        `,
      }),
    })

    const responseData = await testResponse.json()

    if (testResponse.ok) {
      console.log('[v0] Brevo test email sent successfully')
      return NextResponse.json(
        {
          success: true,
          message: 'Brevo SMTP connection is working! Check your inbox for test email.',
          config: configStatus,
          messageId: responseData.messageId,
        },
        { status: 200 }
      )
    } else {
      console.error('[v0] Brevo test failed:', responseData)
      return NextResponse.json(
        {
          success: false,
          message: 'Brevo SMTP connection failed',
          error: responseData,
          config: configStatus,
          instruction: 'Check your API key and sender email configuration',
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('[v0] Error testing Brevo connection:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        instruction: 'Check server logs for detailed error information',
      },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint to check Brevo configuration status
 */
export async function GET() {
  const brevoApiKey = process.env.BREVO_API_KEY
  const brevoSenderEmail = process.env.BREVO_SENDER_EMAIL

  return NextResponse.json({
    brevoConfigured: !!brevoApiKey,
    brevoSenderEmail: brevoSenderEmail || 'noreply@titanforce.com',
    message: brevoApiKey
      ? 'Brevo is configured. Use POST method to send a test email.'
      : 'Brevo is not configured. Set BREVO_API_KEY environment variable.',
  })
}
