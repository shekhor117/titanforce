# Database Migration Setup Guide

## Problem
The app is showing error: `Could not find the table 'public.contact_messages' in the schema cache`

This happens when the database tables haven't been created yet. The schema cache is empty because no migrations have been run.

## Solution

You need to run the database migrations in your Supabase project. Choose one of the methods below:

### Method 1: Using Supabase CLI (Recommended)

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link your project** (replace with your actual project ref):
   ```bash
   supabase link --project-ref your-project-ref
   ```
   
   To find your project ref:
   - Go to https://app.supabase.com
   - Select your project
   - Copy the project reference ID from the project URL

4. **Push migrations**:
   ```bash
   supabase db push
   ```

5. **Done!** The schema cache will be refreshed automatically.

### Method 2: Using Supabase Dashboard (Manual)

1. Go to https://app.supabase.com
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar
4. Click **"New Query"**
5. Copy the contents of each migration file from `supabase/migrations/` in this order:
   - 20250505_role_tables.sql
   - 20250516_fix_rls_performance.sql
   - 20260516163423_create_is_admin_rpc.sql
   - 20260517193131_create_gallery_table.sql
   - 20260517195125_create_products_table.sql
   - 20260517195413_create_trophies_table.sql
   - 20260517202759_add_player_ranking_column.sql
   - 20260618_create_app_users_table.sql
   - 20260618_create_contact_messages_table.sql
   - 20260618_create_otp_codes_table.sql
   - 20260618_fix_contact_messages_rls.sql
   - 20260619_create_articles_table.sql
   - 20260619_create_events_table.sql
   - 20260619_create_pages_table.sql
   - 20260628_create_news_updates_table.sql

6. Paste each migration SQL into the query editor and click **"Run"** (or press Ctrl+Enter)
7. Repeat for each migration file in order

### Method 3: Contact Vercel Support

If you encounter issues with migrations, you can reach out to Vercel support at https://vercel.com/help

## Verification

After running migrations, verify that the tables were created:

1. Go to your Supabase Dashboard
2. Click **"Table Editor"** in the sidebar
3. You should see tables like:
   - contact_messages
   - otp_codes
   - products
   - trophies
   - etc.

4. Try submitting the contact form again - it should work now!

## Important Notes

- **Run migrations IN ORDER**: Some migrations depend on previous ones
- **Schema cache refresh**: Supabase automatically refreshes the schema cache after migrations
- **Admin setup**: After setting up the database, you may need to create an admin user through the admin dashboard

## Troubleshooting

### Still getting schema cache error?
- Wait 30 seconds and try again (schema cache may be refreshing)
- Refresh the browser (Ctrl+F5 or Cmd+Shift+R)
- Check that all migrations ran successfully in the SQL Editor

### Permission denied errors?
- Ensure you're using the service role key (not the anon key)
- The Supabase CLI handles this automatically

### Migration execution failed?
- Copy the exact error message
- Check the Supabase documentation or contact support with the error details
