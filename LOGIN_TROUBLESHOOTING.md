# Login Troubleshooting Guide

## Issue: Login is Blocked or Not Working

### Root Causes
The login can be blocked if:
1. **Missing database tables** - The `profiles` table hasn't been created
2. **Missing OTP table** - If OTP is enabled, the `otp_codes` table is required
3. **Profile query fails** - The authentication succeeds but profile fetching fails
4. **No test users created** - You're trying to login but no users exist in the database

### Solutions

#### 1. Apply All Database Migrations
Visit `/setup/migrations` and click **"Check Database Tables"** to see status, then apply migrations if needed.

Alternatively, run:
```bash
npx supabase db push
```

#### 2. Create a Test User
Run the test user creation script:
```bash
node scripts/create-test-user.js
```

This will create a test user with:
- **Email**: `test@example.com`
- **Password**: `Test123456!`

#### 3. Fix Profile Loading Issue
If you see "Invalid credentials" but the email/password is correct, the profile table might be missing or have permissions issues.

The login flow has been updated to handle missing profiles gracefully - profiles are optional on first login.

#### 4. Check Environment Variables
Ensure these are set in your Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Login Flow Breakdown

1. User enters email/password
2. System validates credentials with Supabase auth
3. System fetches user profile (optional - if it doesn't exist, login still works)
4. User is logged in and redirected to `/profile`

### Testing Steps

1. **Navigate to login page**: Visit `/login`
2. **Try with test user**: 
   - Email: `test@example.com`
   - Password: `Test123456!`
3. **Check browser console** for any error messages (F12 → Console)
4. **Check server logs** for Supabase errors

### Still Blocked?

If login is still blocked after trying these solutions:
1. Go to `/setup/migrations` to verify all tables exist
2. Check Supabase dashboard → RLS policies on `profiles` table
3. Ensure `SUPABASE_SERVICE_ROLE_KEY` is properly set
4. Try creating a new test user via admin dashboard

### For Regular Users

Regular users can:
- Sign up at the signup page
- Login with their credentials at `/login`
- Update their profile at `/profile`

Admin users need the `role` field set to `"admin"` or `"moderator"` in their user metadata to access `/admin` panel.
