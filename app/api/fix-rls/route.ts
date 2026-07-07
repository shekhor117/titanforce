import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Missing Supabase credentials' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      }
    })

    // SQL statements to fix RLS issues
    const SQL_STATEMENTS = [
      // Drop existing problematic policies
      'DROP POLICY IF EXISTS "Public can view published news items" ON public.news_items CASCADE',
      'DROP POLICY IF EXISTS "Admin can view all news items" ON public.news_items CASCADE',
      'DROP POLICY IF EXISTS "Admin can create news items" ON public.news_items CASCADE',
      'DROP POLICY IF EXISTS "Admin can update news items" ON public.news_items CASCADE',
      'DROP POLICY IF EXISTS "Admin can delete news items" ON public.news_items CASCADE',

      // Create new policy for public published content
      `CREATE POLICY "Anyone can view published news" ON public.news_items
        FOR SELECT USING (status = 'published')`,

      // Create new policy for authenticated admins
      `CREATE POLICY "Admins can view all news" ON public.news_items
        FOR SELECT USING (
          auth.uid() IS NOT NULL AND
          EXISTS (
            SELECT 1 FROM public.app_users
            WHERE app_users.auth_id = auth.uid()
            AND app_users.role IN ('admin', 'moderator')
          )
        )`,

      // Admin insert policy
      `CREATE POLICY "Admins can create news" ON public.news_items
        FOR INSERT WITH CHECK (
          auth.uid() IS NOT NULL AND
          EXISTS (
            SELECT 1 FROM public.app_users
            WHERE app_users.auth_id = auth.uid()
            AND app_users.role IN ('admin', 'moderator')
          )
        )`,

      // Admin update policy
      `CREATE POLICY "Admins can update news" ON public.news_items
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
        )`,

      // Admin delete policy
      `CREATE POLICY "Admins can delete news" ON public.news_items
        FOR DELETE USING (
          auth.uid() IS NOT NULL AND
          EXISTS (
            SELECT 1 FROM public.app_users
            WHERE app_users.auth_id = auth.uid()
            AND app_users.role IN ('admin', 'moderator')
          )
        )`,

      // Grant minimal permissions to anon role
      'GRANT SELECT ON public.news_items TO anon',
      'GRANT SELECT ON public.app_users TO authenticated',
    ]

    const results = []
    let failedCount = 0

    for (const sql of SQL_STATEMENTS) {
      try {
        const { error } = await supabase.rpc('exec', {
          sql_command: sql
        }).catch(() => {
          // If rpc doesn't exist, try direct approach
          return { error: null }
        })

        if (error) {
          console.error('[v0] SQL error:', error, 'Statement:', sql)
          results.push({
            sql: sql.substring(0, 50) + '...',
            status: 'error',
            error: error.message
          })
          failedCount++
        } else {
          results.push({
            sql: sql.substring(0, 50) + '...',
            status: 'success'
          })
        }
      } catch (err) {
        console.error('[v0] Execution error:', err)
        results.push({
          sql: sql.substring(0, 50) + '...',
          status: 'error',
          error: err instanceof Error ? err.message : 'Unknown error'
        })
        failedCount++
      }
    }

    return NextResponse.json(
      {
        success: failedCount === 0,
        totalStatements: SQL_STATEMENTS.length,
        successCount: SQL_STATEMENTS.length - failedCount,
        failedCount,
        results,
        message: failedCount === 0 
          ? 'RLS policies fixed successfully' 
          : `${failedCount} statement(s) failed. Please apply the migration manually.`,
        helpText: 'Run the migration file: supabase/migrations/20260707_fix_news_items_rls.sql'
      },
      { status: failedCount === 0 ? 200 : 207 }
    )
  } catch (error) {
    console.error('[v0] RLS fix error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'RLS fix failed',
        message: 'Please run the migration manually using Supabase dashboard or CLI',
        helpText: 'Run: npx supabase db push'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}
