# OTP Sender Setup Instructions

## Quick Start (5 minutes)

Follow these steps to enable OTP authentication:

---

## Step 1: Create Database Table

### Option A: Using Supabase Dashboard (Recommended)

1. Go to https://app.supabase.com
2. Login to your TitanForce project
3. Go to **SQL Editor** (left sidebar)
4. Click **"New Query"**
5. Copy and paste the SQL from: `/supabase/migrations/20260702_create_otp_codes.sql`
6. Click **"Run"**
7. You should see success message

### Option B: Using CLI

```bash
# From project root
supabase db push
```

---

## Step 2: Configure Email Service

Choose ONE email service below:

### Option A: Brevo SMTP (Recommended - Free tier available)

#### 2A.1 Create Account
```
1. Go to https://www.brevo.com
2. Click "Sign up"
3. Fill in details and verify email
```

#### 2A.2 Get SMTP Credentials
```
1. Login to Brevo dashboard
2. Go to Settings → SMTP & API
3. Enable SMTP
4. Copy these credentials:
   - SMTP Server: smtp-relay.brevo.com
   - Port: 587
   - Login: your-brevo-email@example.com
   - Password: (unique SMTP password, not your login password)
```

#### 2A.3 Add Environment Variables
Go to your Vercel project settings (or local .env.local):

```env
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=your-brevo-email@example.com
BREVO_SMTP_PASS=your-unique-smtp-password
BREVO_SENDER_EMAIL=noreply@titanforce.com
```

---

### Option B: Resend (Alternative - Fast setup)

#### 2B.1 Create Account
```
1. Go to https://resend.com
2. Click "Get Started"
3. Verify email
```

#### 2B.2 Get API Key
```
1. Login to Resend dashboard
2. Go to API Keys section
3. Copy your API key
```

#### 2B.3 Add Environment Variables
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@titanforce.com
```

---

## Step 3: Test OTP Sending

### Test 1: Verify Database Table Exists
```bash
curl -X GET http://localhost:3000/api/admin/apply-migrations
```

Expected response:
```json
{
  "success": true,
  "message": "OTP table already exists",
  "status": "ready"
}
```

### Test 2: Send Test OTP
```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com"}'
```

Expected response:
```json
{
  "success": true,
  "message": "OTP has been sent to your email"
}
```

### Test 3: Check Email
- Check your inbox for email from noreply@titanforce.com
- Look for 6-digit OTP code
- Code expires in 5 minutes

### Test 4: Verify OTP
```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com","code":"123456"}'
```

---

## API Endpoints

### Send OTP
**URL:** `POST /api/auth/send-otp`

**Request:**
```json
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

**Response (Error):**
```json
{
  "success": false,
  "error": "Invalid email format" | "Too many requests" | "Email service not configured"
}
```

---

### Verify OTP
**URL:** `POST /api/auth/verify-otp`

**Request:**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "email": "user@example.com"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Invalid or expired OTP" | "Too many attempts" | "OTP code not found"
}
```

---

## OTP Details

- **Format:** 6-digit numeric code (100000-999999)
- **Expiry:** 5 minutes from generation
- **Max Attempts:** 5 failed verification attempts
- **Rate Limit:** 1 OTP per email per minute
- **Resend:** User can request new OTP after expiry

---

## Email Template

OTP emails include:
- TitanForce logo (red branding)
- "Your OTP Code" title
- 6-digit code in large font
- Expiry information
- "If you didn't request this, ignore" message
- Professional footer with branding

---

## Troubleshooting

### "Could not find table otp_codes"
**Solution:** Run Step 1 (Database Table creation)

### "Email not received"
**Check:**
1. Email service configured? (Brevo or Resend)
2. Check spam folder
3. Verify sender email is whitelisted
4. Check for typos in environment variables

### "SMTP Connection Failed"
**Solution:**
1. Verify BREVO_SMTP_HOST is correct
2. Verify BREVO_SMTP_PORT is 587
3. Check username/password (not login password, but SMTP-specific password)
4. Ensure credentials are in .env.local or Vercel settings

### "OTP Code Invalid"
**Note:** Code expires after 5 minutes. Request new OTP.

### "Too Many Attempts"
**Note:** After 5 failed attempts, user must request new OTP code.

### Development Mode (No Email Service)
When no email service is configured:
- OTP code is logged to browser console
- Check console to get OTP code
- Use code for testing
- Good for local development without external dependencies

---

## File Locations

```
API Routes:
- app/api/auth/send-otp/route.ts
- app/api/auth/verify-otp/route.ts

Database:
- supabase/migrations/20260702_create_otp_codes.sql

Admin Tools:
- app/admin/migrations/page.tsx - Migration runner
- app/api/admin/apply-migrations/route.ts - Migration API
```

---

## Integration with Login

The OTP system integrates with the authentication flow:

```
Login Page
  ↓
User clicks "Login with OTP"
  ↓
Enters email
  ↓
API: POST /api/auth/send-otp
  ↓
User receives OTP email
  ↓
Enters OTP code
  ↓
API: POST /api/auth/verify-otp
  ↓
Session created
  ↓
Redirected to dashboard
```

---

## Status Check

After setup, verify everything works:

```bash
# 1. Check table exists
curl http://localhost:3000/api/admin/apply-migrations

# 2. Send test OTP
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# 3. Check email received
# Look for email from noreply@titanforce.com

# 4. Verify OTP works
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","code":"XXXXXX"}'
```

---

## Summary

✅ **After completing these steps:**
- Database table created
- Email service configured
- OTP sending works
- OTP verification works
- Secure authentication enabled
- Production-ready

**Time to completion:** 5-10 minutes

**Questions?** Check the troubleshooting section or review environment variables.
