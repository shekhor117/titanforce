# Brevo SMTP Setup Guide for TitanForce

This guide explains how to set up Brevo SMTP for sending OTP emails in the TitanForce application.

## Prerequisites

- A Brevo account (https://www.brevo.com/)
- Access to your Brevo dashboard
- Supabase project configured

## Step 1: Get Your Brevo API Key

1. Log in to your Brevo account at https://app.brevo.com/
2. Go to **Settings** → **API & Apps** → **API Keys**
3. Copy your **API Key** (you can create a new one if needed)

## Step 2: Verify Your Sender Email

1. In the Brevo dashboard, go to **Senders & Templates** → **Senders**
2. Add or verify a sender email address (e.g., `noreply@titanforce.com`)
3. Confirm the email in your inbox if it's a new sender

## Step 3: Set Environment Variables

Add the following environment variables to your Vercel project settings:

```
BREVO_API_KEY=your_api_key_here
BREVO_SENDER_EMAIL=noreply@titanforce.com
```

### How to set environment variables in Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:
   - Name: `BREVO_API_KEY`, Value: `your_api_key`
   - Name: `BREVO_SENDER_EMAIL`, Value: `your_verified_sender_email`
4. Click "Save"
5. Redeploy your application

## Step 4: Configure Supabase (Optional)

If you want to use Brevo as the default email provider for Supabase Auth emails (not just OTPs):

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Email Templates**
3. Note that Supabase has its own email configuration separate from this custom OTP system

## Step 5: Test the OTP System

1. Navigate to the login page: `https://your-domain.com/login`
2. Enter an email address
3. Check the inbox for the OTP email
4. If using Brevo, you can track delivery in the **Transactional** → **Emails** section of your Brevo dashboard

## Email Sending Priority

The system attempts to send emails in this order:

1. **Brevo SMTP** - If `BREVO_API_KEY` is configured
2. **Resend** - If `RESEND_API_KEY` is configured
3. **Development Mode** - OTP is logged to console

## Troubleshooting

### OTP Not Received

1. **Check spam/junk folder** - Brevo emails might be flagged as spam
2. **Verify sender email** - Make sure the sender email is verified in Brevo
3. **Check API key** - Ensure the API key is correct and not expired
4. **Check server logs** - Look for error messages in Vercel deployment logs

### Sender Email Not Verified

- Go to Brevo dashboard → **Senders & Templates** → **Senders**
- Click "Verify" on your sender email
- Check your inbox for verification email

### Rate Limiting

Brevo has rate limits depending on your plan. If you're sending many OTPs:
- Check your Brevo plan limits
- Consider implementing exponential backoff for resend attempts

## Brevo Plans

- **Free**: Up to 300 emails/day
- **Premium**: Unlimited emails with better rates

See https://www.brevo.com/pricing/ for current pricing.

## Additional Resources

- Brevo SMTP API: https://developers.brevo.com/reference/sendtransacemail
- Brevo Dashboard: https://app.brevo.com/
- Brevo Help: https://help.brevo.com/

## Support

For issues with:
- **OTP System**: Check `/app/api/auth/send-otp/route.ts`
- **Brevo Integration**: Contact Brevo support or check their documentation
- **Supabase Setup**: Check Supabase documentation
