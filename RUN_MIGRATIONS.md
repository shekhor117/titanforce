# Running Database Migrations

The "Failed to store OTP" error occurs when the `otp_codes` table hasn't been created in your Supabase database.

## Quick Fix

Run this command to apply all pending migrations:

```bash
npx supabase db push
```

This will:
1. Create the `otp_codes` table
2. Set up proper RLS policies
3. Create indexes for performance
4. Grant proper permissions

## Manual SQL (if the above doesn't work)

If `npx supabase db push` doesn't work, run this SQL directly in your Supabase dashboard:

1. Go to: https://app.supabase.com
2. Select your project → SQL Editor
3. Click "New query"
4. Copy and paste the contents of: `/supabase/migrations/20260618_create_otp_codes_table.sql`
5. Click "Run"

## Verify It Worked

After running migrations, you should see:
- ✅ A new table named `otp_codes` in the Tables list
- ✅ No "Failed to store OTP" error when sending OTP
- ✅ OTP codes appear in the database

## Troubleshooting

**Error: "relation does not exist"**
- The table wasn't created. Run the SQL migration manually (see above)

**Error: "permission denied"**
- Make sure you're using the Supabase dashboard with admin rights

**OTP still not storing**
- Check the browser console (F12) for detailed error messages
- Look at the server logs for "[v0]" debug messages
