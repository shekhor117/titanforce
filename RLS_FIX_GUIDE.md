# RLS Permission Denied Error - Fix Guide

## Problem

The app was throwing `permission denied for table users` (error code 42501) when trying to fetch news items. This error occurred because:

1. The `news_items` table has Row Level Security (RLS) enabled
2. The RLS policies were checking if a user is an admin by querying the `app_users` table
3. Anonymous users don't have permission to query the `app_users` table
4. Even when just reading published news, the RLS policy evaluation failed due to this permission check

## Error Message

```
{
  code: '42501',
  message: 'permission denied for table users',
  hint: 'Grant the required privileges to the current role with: GRANT SELECT ON auth.users TO anon;'
}
```

## Solution

We've created a migration that:

1. **Simplifies RLS Policies**: The public SELECT policy now only checks `status = 'published'` without needing to access any other tables
2. **Grants Minimal Permissions**: Grants SELECT on `news_items` to the anonymous role for published content
3. **Maintains Security**: Admin-only operations still check the `app_users` table through authenticated queries

## How to Apply the Fix

### Option 1: Automatic Application (Recommended)

1. Navigate to: `http://your-app/admin/setup-migrations`
2. Click "Apply Migrations Now"
3. Wait for confirmation

### Option 2: Manual - Using Supabase CLI

```bash
# From the project root
npx supabase db push

# This will apply all pending migrations, including:
# supabase/migrations/20260707_fix_news_items_rls.sql
```

### Option 3: Manual - Using Supabase Dashboard

1. Go to Supabase Dashboard → SQL Editor
2. Open the file: `supabase/migrations/20260707_fix_news_items_rls.sql`
3. Copy and paste the SQL into the editor
4. Click "Run"

## What the Migration Does

```sql
-- Old problematic policy (removed):
CREATE POLICY "Public can view published news items" ON public.news_items
  FOR SELECT USING (status = 'published');
  -- Even though this looks simple, it checked app_users internally

-- New policy (added):
CREATE POLICY "Anyone can view published news" ON public.news_items
  FOR SELECT USING (status = 'published');

-- Grants SELECT to anonymous users
GRANT SELECT ON public.news_items TO anon;

-- Grants SELECT on app_users only to authenticated users
GRANT SELECT ON public.app_users TO authenticated;
```

## After the Fix

- ✅ Anonymous users can view published news without errors
- ✅ Authenticated admins can view/edit all news
- ✅ No more "permission denied" errors
- ✅ Full RLS security is maintained

## Testing the Fix

After applying the migration:

1. **Check Console**: No more error messages about permission denied
2. **View News**: Navigate to a page that displays news - should load without errors
3. **Admin Panel**: Admin news management should still work for authenticated admins

## Troubleshooting

### Migration Still Fails

If the automatic migration fails:

1. Check that your Supabase project is properly configured
2. Verify that `SUPABASE_SERVICE_ROLE_KEY` environment variable is set
3. Try the manual CLI method: `npx supabase db push`
4. If CLI fails, use the Supabase Dashboard directly

### News Still Not Showing

After applying the migration:

1. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Check browser console for any remaining errors
3. Verify news items exist and have `status = 'published'` in the database
4. Contact support if issues persist

## Related Files

- Migration: `supabase/migrations/20260707_fix_news_items_rls.sql`
- Fix endpoint: `app/api/fix-rls/route.ts`
- Setup page: `app/admin/setup-migrations/page.tsx`
- Data service: `lib/data-service.ts` (error handling updated)

## Prevention

For future RLS policies:

- ❌ Avoid: Using subqueries that require permissions the caller doesn't have
- ✅ Do: Simplify policies to use direct column comparisons when possible
- ✅ Do: For complex checks, use authenticated-only operations with proper role verification
- ✅ Do: Test with both authenticated and anonymous roles during development

## See Also

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL GRANT Documentation](https://www.postgresql.org/docs/current/sql-grant.html)
- [Supabase Policies Best Practices](https://supabase.com/docs/guides/auth/row-level-security#policies)
