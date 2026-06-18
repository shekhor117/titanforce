# Brevo SMTP Quick Setup - TitanForce

## Get Your Brevo API Key (5 minutes)

1. Sign up at https://www.brevo.com/ (free account available)
2. Log in to https://app.brevo.com/
3. Go to **Settings** → **API & Apps** → **API Keys**
4. Copy your API Key

## Add to Vercel (2 minutes)

1. Go to your Vercel project: https://vercel.com/dashboard
2. Select your TitanForce project
3. Click **Settings** → **Environment Variables**
4. Add two variables:
   ```
   BREVO_API_KEY = [your-api-key-from-above]
   BREVO_SENDER_EMAIL = noreply@titanforce.com
   ```
5. Click **Save** and wait for redeployment

## Verify Your Sender Email in Brevo (2 minutes)

1. In Brevo dashboard, go to **Senders & Templates** → **Senders**
2. Add your sender email (e.g., `noreply@titanforce.com`)
3. Confirm the verification email sent to your inbox

## Test the Connection (1 minute)

Send a test email:
```bash
curl -X POST http://localhost:3000/api/auth/test-brevo \
  -H "Content-Type: application/json" \
  -d '{"email": "your-test-email@example.com"}'
```

Or check configuration status:
```bash
curl http://localhost:3000/api/auth/test-brevo
```

## Done! 

OTP emails will now be sent via Brevo SMTP. Test by:
1. Going to https://your-domain.com/login
2. Entering your email
3. Checking your inbox for the OTP code

## Troubleshooting

- **Email not received?** Check spam folder or verify sender in Brevo
- **API error?** Verify your API key is correct in Vercel settings
- **Still not working?** Check server logs in Vercel Deployments tab

## Support Resources

- Brevo Help: https://help.brevo.com/
- Full Setup Guide: See `docs/BREVO_SMTP_SETUP.md`
- Test Endpoint: `POST /api/auth/test-brevo` with email in body
