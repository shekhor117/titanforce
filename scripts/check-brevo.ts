import fetch from 'node-fetch'

/**
 * Brevo SMTP Connection Checker
 * Usage: npx ts-node scripts/check-brevo.ts [test-email@example.com]
 */

async function checkBrevoConfiguration() {
  console.log('\n=== TitanForce Brevo SMTP Configuration Checker ===\n')

  // Check environment variables
  const brevoApiKey = process.env.BREVO_API_KEY
  const brevoSenderEmail = process.env.BREVO_SENDER_EMAIL
  const brevoReplyTo = process.env.BREVO_REPLY_TO

  console.log('📋 Environment Variables Status:')
  console.log('  BREVO_API_KEY:', brevoApiKey ? '✓ Configured' : '✗ Not set')
  console.log('  BREVO_SENDER_EMAIL:', brevoSenderEmail ? `✓ ${brevoSenderEmail}` : '✗ Not set')
  console.log('  BREVO_REPLY_TO:', brevoReplyTo ? `✓ ${brevoReplyTo}` : '✗ Not set (optional)')

  if (!brevoApiKey) {
    console.error(
      '\n❌ Brevo API key is not configured. Add BREVO_API_KEY to your environment variables.\n'
    )
    return false
  }

  if (!brevoSenderEmail) {
    console.warn(
      '\n⚠️ BREVO_SENDER_EMAIL is not set. Using default: noreply@titanforce.com\n'
    )
  }

  console.log('\n🔍 Testing Brevo API Connection...\n')

  try {
    // Test API connection
    const testResponse = await fetch('https://api.brevo.com/v3/account', {
      method: 'GET',
      headers: {
        'api-key': brevoApiKey,
      },
    })

    if (testResponse.ok) {
      const accountData = await testResponse.json()
      console.log('✓ Brevo API connection successful!')
      console.log('  Account email:', accountData.email)
      console.log('  Account name:', accountData.firstName, accountData.lastName)
    } else {
      console.error('✗ Brevo API connection failed (status:', testResponse.status, ')')
      const error = await testResponse.json()
      console.error('  Error:', error)
      return false
    }
  } catch (error) {
    console.error('✗ Failed to connect to Brevo:', error instanceof Error ? error.message : error)
    return false
  }

  // Check sender email verification
  const senderEmail = brevoSenderEmail || 'noreply@titanforce.com'
  console.log('\n📧 Checking sender email verification...')

  try {
    const sendersResponse = await fetch('https://api.brevo.com/v3/smtp/sender', {
      method: 'GET',
      headers: {
        'api-key': brevoApiKey,
      },
    })

    if (sendersResponse.ok) {
      const sendersData = await sendersResponse.json()
      const senders = sendersData.senders || []
      const verifiedSender = senders.find(
        (s: any) => s.email?.toLowerCase() === senderEmail.toLowerCase()
      )

      if (verifiedSender) {
        console.log(`✓ Sender email "${senderEmail}" is verified`)
        console.log('  Status:', verifiedSender.isVerified ? 'Verified' : 'Not verified')
      } else {
        console.warn(
          `⚠️ Sender email "${senderEmail}" is not verified in Brevo account`
        )
        console.log('  Verified senders:')
        senders.forEach((s: any) => {
          console.log(`    - ${s.email} (${s.isVerified ? 'verified' : 'not verified'})`)
        })
      }
    }
  } catch (error) {
    console.warn('⚠️ Could not verify sender email:', error instanceof Error ? error.message : error)
  }

  console.log('\n✅ Brevo SMTP Configuration Check Complete!\n')
  return true
}

async function sendTestEmail(testEmail: string) {
  const brevoApiKey = process.env.BREVO_API_KEY
  if (!brevoApiKey) {
    console.error('❌ BREVO_API_KEY not set')
    return
  }

  console.log(`\n📤 Sending test email to: ${testEmail}\n`)

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': brevoApiKey,
      },
      body: JSON.stringify({
        to: [{ email: testEmail }],
        sender: {
          email: process.env.BREVO_SENDER_EMAIL || 'noreply@titanforce.com',
          name: 'TitanForce',
        },
        subject: 'TitanForce Brevo SMTP Test Email',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d1a1a 100%); padding: 40px; border-radius: 8px; text-align: center;">
              <h1 style="color: #c41e3a; margin: 0 0 20px 0;">TitanForce</h1>
              <h2 style="color: #fff; margin: 0 0 30px 0;">Brevo SMTP Test</h2>
              <p style="color: #fff; font-size: 16px; margin: 20px 0;">
                Your Brevo SMTP connection is working correctly!
              </p>
              <p style="color: #aaa; font-size: 12px; margin: 20px 0;">
                If you received this email, you can now use Brevo to send OTP codes and other transactional emails.
              </p>
              <p style="color: #aaa; font-size: 11px; margin: 20px 0;">
                Sent at: ${new Date().toISOString()}
              </p>
            </div>
          </div>
        `,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✓ Test email sent successfully!')
      console.log('  Message ID:', data.messageId)
      console.log(`  Check your inbox at ${testEmail}`)
    } else {
      const error = await response.json()
      console.error('✗ Failed to send test email:', error)
    }
  } catch (error) {
    console.error('✗ Error sending test email:', error instanceof Error ? error.message : error)
  }
}

// Main execution
;(async () => {
  const testEmail = process.argv[2]

  const configOk = await checkBrevoConfiguration()

  if (configOk && testEmail) {
    await sendTestEmail(testEmail)
  } else if (!testEmail) {
    console.log('💡 To send a test email, run:')
    console.log('   npx ts-node scripts/check-brevo.ts your-email@example.com\n')
  }
})()
