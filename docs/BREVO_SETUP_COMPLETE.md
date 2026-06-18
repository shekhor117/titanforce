# Brevo SMTP Setup Guide for TitanForce

## Overview
This guide walks you through setting up Brevo SMTP for sending OTP codes and transactional emails in the TitanForce application.

## Prerequisites
- A Brevo account (free tier available at https://www.brevo.com)
- Vercel project access
- A verified sender email domain

## Step-by-Step Setup

### 1. Create a Brevo Account
1. Go to https://www.brevo.com and sign up for a free account
2. Verify your email address
3. Complete the account setup wizard

### 2. Get Your API Key
1. Log in to your Brevo account
2. Go to **Settings** → **API** (or https://app.brevo.com/settings/api)
3. Under "API Keys", click **Generate API Key**
4. Select "Full access" 
5. Copy the API v3 key (starts with `xkeysib-`)
6. Store it securely - you'll need this in step 4

### 3. Verify Your Sender Email
1. In Brevo, go to **Senders & Contacts** → **Senders** (or https://app.brevo.com/senders)
2. Click **Add a new sender**
3. Enter your sender email (e.g., `noreply@titanforce.com`)
4. Click **Add sender**
5. Check your email for a verification link and click it
6. Once verified, you'll see a green checkmark next to the sender

**Important:** Brevo requires sender verification. Use a domain you control. You can also set up SPF/DKIM records for better deliverability (optional but recommended).

### 4. Set Environment Variables in Vercel

Add the following environment variables to your Vercel project:

#### Option A: Using Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select your `titanforce` project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```
BREVO_API_KEY=xkeysib-[your-api-key-here]
BREVO_SENDER_EMAIL=noreply@titanforce.com
BREVO_REPLY_TO=support@titanforce.com (optional)
```

#### Option B: Using Vercel CLI
```bash
vercel env add BREVO_API_KEY
# Paste: xkeysib-[your-api-key-here]

vercel env add BREVO_SENDER_EMAIL
# Paste: noreply@titanforce.com

vercel env add BREVO_REPLY_TO
# Paste: support@titanforce.com
```

### 5. Test the Configuration

#### Local Testing
1. Make sure you have the environment variables set locally:
```bash
export BREVO_API_KEY=xkeysib-[your-key]
export BREVO_SENDER_EMAIL=noreply@titanforce.com
```

2. Run the configuration checker:
```bash
npx ts-node scripts/check-brevo.ts your-test-email@example.com
```

This will:
- Verify your API key
- Check sender email verification status
- Send a test email to your inbox

#### API Endpoint Testing
```bash
# Check configuration status
curl -X GET http://localhost:3000/api/auth/test-brevo

# Send test email
curl -X POST http://localhost:3000/api/auth/test-brevo \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@example.com"}'
```

### 6. Deploy and Test in Production

1. After adding environment variables, redeploy your project:
```bash
git push  # Triggers automatic Vercel deployment
```

2. Test OTP email sending:
   - Go to https://titanforce.vercel.app/login
   - Enter a test email address
   - Click "Send OTP"
   - Check your inbox for the email

3. Monitor emails in Brevo:
   - Go to https://app.brevo.com/activity
   - You'll see all sent emails with delivery status

## Troubleshooting

### Email not received?

**Check 1: API Key Issues**
```bash
# Verify API key is valid and has full access
curl -X GET https://api.brevo.com/v3/account \
  -H "api-key: YOUR_API_KEY"
```

**Check 2: Sender Email Not Verified**
- Go to Brevo Senders page
- Ensure your sender email has a green checkmark
- If not verified, check your email for verification link

**Check 3: Check Brevo Activity Log**
- Go to https://app.brevo.com/activity
- Look for bounced emails or delivery issues
- Review error codes if emails failed to send

**Check 4: Spam Folder**
- Check spam/junk folder
- Add noreply@titanforce.com to contacts to whitelist

### Configuration Issues

**Error: "Sender email not verified in Brevo"**
- Solution: Go to Brevo Senders page and verify the sender email

**Error: "Invalid API key"**
- Solution: Check that BREVO_API_KEY environment variable is correct (starts with `xkeysib-`)

**Error: "Brevo API connection failed"**
- Solution: Ensure your Brevo account is active and API access is enabled

## API Documentation

### Send OTP Endpoint
```
POST /api/auth/send-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "OTP has been sent to your email",
  "email": "user@example.com"
}
```

### Test Brevo Connection
```
GET /api/auth/test-brevo

POST /api/auth/test-brevo
Content-Type: application/json

{
  "email": "test@example.com"
}
```

## Email Priority Order

The system attempts to send emails in this order:
1. **Brevo SMTP** (primary) - If BREVO_API_KEY is configured
2. **Resend** (fallback) - If RESEND_API_KEY is configured
3. **Console Logging** (development) - For local testing without external services

## Production Checklist

- [ ] Brevo account created and verified
- [ ] API key generated and stored securely
- [ ] Sender email verified in Brevo
- [ ] BREVO_API_KEY environment variable set in Vercel
- [ ] BREVO_SENDER_EMAIL environment variable set
- [ ] Test email sent successfully
- [ ] OTP emails received in inbox
- [ ] Project redeployed with environment variables
- [ ] Production email sending tested

## Support

For issues with Brevo:
- Visit https://help.brevo.com
- Check Brevo status page: https://status.brevo.com

For issues with TitanForce:
- Check application logs in Vercel
- Review database/OTP logs in Supabase

## Next Steps

- Configure SPF/DKIM records for better deliverability
- Set up email templates in Brevo
- Monitor email metrics and delivery rates
- Implement email unsubscribe handling if needed
