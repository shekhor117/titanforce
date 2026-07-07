-- Fix news_items RLS to prevent permission denied errors
-- Issue: RLS policies try to query app_users which anonymous role cannot access
-- Solution: Use direct auth checks instead of app_users lookup for public queries

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Public can view published news items" ON public.news_items;
DROP POLICY IF EXISTS "Admin can view all news items" ON public.news_items;
DROP POLICY IF EXISTS "Admin can create news items" ON public.news_items;
DROP POLICY IF EXISTS "Admin can update news items" ON public.news_items;
DROP POLICY IF EXISTS "Admin can delete news items" ON public.news_items;

-- New simplified policies

-- Policy 1: Anyone (including anonymous) can view published news items
CREATE POLICY "Anyone can view published news" ON public.news_items
  FOR SELECT USING (status = 'published');

-- Policy 2: Authenticated users who are admins can view all news items
CREATE POLICY "Admins can view all news" ON public.news_items
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.app_users
      WHERE app_users.auth_id = auth.uid()
      AND app_users.role IN ('admin', 'moderator')
    )
  );

-- Policy 3: Authenticated admins can create news items
CREATE POLICY "Admins can create news" ON public.news_items
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.app_users
      WHERE app_users.auth_id = auth.uid()
      AND app_users.role IN ('admin', 'moderator')
    )
  );

-- Policy 4: Authenticated admins can update news items
CREATE POLICY "Admins can update news" ON public.news_items
  FOR UPDATE USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.app_users
      WHERE app_users.auth_id = auth.uid()
      AND app_users.role IN ('admin', 'moderator')
    )
  ) WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.app_users
      WHERE app_users.auth_id = auth.uid()
      AND app_users.role IN ('admin', 'moderator')
    )
  );

-- Policy 5: Authenticated admins can delete news items
CREATE POLICY "Admins can delete news" ON public.news_items
  FOR DELETE USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.app_users
      WHERE app_users.auth_id = auth.uid()
      AND app_users.role IN ('admin', 'moderator')
    )
  );

-- Grant minimal permissions to anon role to help RLS work
-- This allows anon to see published content without accessing user data
GRANT SELECT ON public.news_items TO anon;
GRANT SELECT ON public.app_users TO authenticated;
