# Brevo SMTP Configuration for TitanForce

## Overview
Configure Brevo SMTP for reliable email delivery of OTP codes in TitanForce.

## Your Brevo SMTP Settings
```
SMTP Server: smtp-relay.brevo.com
Port: 587
Login: ab4d0d001@smtp-brevo.com
```

## Step 1: Set Environment Variables

Add these to your Vercel project environment variables (or `.env.local` for development):

```
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=ab4d0d001@smtp-brevo.com
BREVO_SMTP_PASS=<your_brevo_password>
BREVO_SENDER_EMAIL=noreply@titanforce.com
```

**Important:** Get your SMTP password from Brevo:
1. Go to https://app.brevo.com/settings/account/smtp
2. Find your SMTP password (different from account password)
3. Copy it to `BREVO_SMTP_PASS`

## Step 2: Verify Sender Email

In Brevo Dashboard:
1. Go to Settings → Senders & API
2. Verify that your sender email (noreply@titanforce.com or your domain) is confirmed
3. If not verified, Brevo will send a confirmation email - click the link to verify

## Step 3: Test the Configuration

### Test via API:
```bash
curl -X GET http://localhost:3000/api/auth/test-brevo
```

### Test via Setup Page:
Visit: `http://localhost:3000/setup/migrations`

## Step 4: Verify Email Delivery

1. Try to login and request an OTP
2. Check the email inbox for the OTP code
3. The email should arrive within 1-2 minutes

## Troubleshooting

### "BREVO SMTP not configured"
- Ensure all 5 environment variables are set
- Check that values have no extra spaces
- Redeploy after setting env vars

### "Connection timeout"
- Verify port 587 is not blocked by firewall
- Try port 465 if 587 doesn't work (set BREVO_SMTP_PORT=465)
- For port 465, Brevo uses SSL (secure: true is automatic)

### "Authentication failed"
- Double-check BREVO_SMTP_USER and BREVO_SMTP_PASS
- Ensure you're using SMTP password, not account password
- Reset password in Brevo if needed

### "Invalid sender email"
- Verify sender email is confirmed in Brevo
- Check capitalization matches exactly
- Try with default noreply@titanforce.com first

### Emails not delivering
- Check Brevo Dashboard → Logs for delivery status
- Verify recipient email domain doesn't block Brevo
- Check spam/junk folder
- Verify email hasn't reached sending limit

## Email Priority

The OTP system tries email services in this order:
1. **Brevo SMTP** (if configured) - ✅ Recommended
2. **Brevo API** (if API key set)
3. **Resend API** (if API key set)
4. **Console logging** (development mode)

## Security Notes

- Never commit `.env` files with real passwords
- Use Vercel Secrets for production
- SMTP credentials are sent securely over TLS (port 587)
- OTP codes expire after 5 minutes
- OTP attempts are limited to 5 per hour

## Support

For Brevo SMTP issues, visit:
- Brevo Help: https://help.brevo.com/en/articles/4534527-configure-your-smtp
- Brevo Dashboard: https://app.brevo.com/
