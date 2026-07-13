'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function RunMigrationsPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [details, setDetails] = useState<any>(null)

  const handleRunMigrations = async () => {
    setStatus('loading')
    setMessage('Running migrations...')
    
    try {
      const response = await fetch('/api/admin/run-all-migrations', {
        method: 'POST',
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        setStatus('success')
        setMessage(data.message)
        setDetails(data)
      } else {
        setStatus('error')
        setMessage(data.error || 'Failed to run migrations')
        setDetails(data)
      }
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Failed to run migrations')
    }
  }

  const handleManualMigration = () => {
    const instructions = `
To run migrations manually:

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Click "SQL Editor" in the left sidebar
4. Click "New query"
5. Copy and paste the contents of one of these migration files (in order):
   - supabase/migrations/20260702_create_matches_standings_tables.sql
   - supabase/migrations/20260702_setup_complete_db_schema.sql
6. Click "Run"
7. Repeat for each migration file

Key files to run:
- 20260702_create_matches_standings_tables.sql (for standings table)
- 20260702_setup_complete_db_schema.sql (for schema setup)
- Any other migration files in the migrations folder

After running migrations, refresh this page.
    `
    alert(instructions)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/admin" className="text-blue-500 hover:underline text-sm">
            ← Back to Admin
          </Link>
        </div>

        <div className="bg-card rounded-lg border border-border p-8">
          <h1 className="text-3xl font-bold mb-4">Database Migrations</h1>
          <p className="text-foreground/70 mb-6">
            This page will help you apply pending database migrations to your Supabase project.
            This creates necessary tables like standings, matches, news items, etc.
          </p>

          <div className="space-y-4 mb-8">
            <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded">
              <h3 className="font-semibold mb-2">Current Status:</h3>
              <p className="text-sm">
                If you see "Standings table not available" in the app, it means the migrations haven&apos;t been applied yet.
              </p>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded">
              <h3 className="font-semibold mb-2">ℹ️ Important:</h3>
              <p className="text-sm">
                The automated migration runner may have limitations due to Supabase API restrictions.
                If it doesn&apos;t work, use the manual method below.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleRunMigrations}
              disabled={status === 'loading'}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded transition"
            >
              {status === 'loading' ? 'Running Migrations...' : 'Run Migrations Automatically'}
            </button>

            <button
              onClick={handleManualMigration}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded transition"
            >
              Show Manual Migration Instructions
            </button>
          </div>

          {message && (
            <div className={`mt-6 p-4 rounded border ${
              status === 'success' 
                ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' 
                : status === 'error'
                ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
                : 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
            }`}>
              <p className={status === 'success' ? 'text-green-700 dark:text-green-200' : status === 'error' ? 'text-red-700 dark:text-red-200' : 'text-blue-700 dark:text-blue-200'}>
                {message}
              </p>
            </div>
          )}

          {details && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded border border-border">
              <h3 className="font-semibold mb-2">Details:</h3>
              <pre className="text-xs overflow-auto max-h-64">
                {JSON.stringify(details, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-border">
            <h2 className="text-lg font-semibold mb-4">Quick Setup Guide</h2>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="font-bold">1.</span>
                <span>First try the "Run Migrations Automatically" button above</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">2.</span>
                <span>If that doesn&apos;t work, click "Show Manual Migration Instructions"</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">3.</span>
                <span>Go to your Supabase Dashboard → SQL Editor</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">4.</span>
                <span>Run the migration SQL files from the supabase/migrations folder</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">5.</span>
                <span>Refresh the app - the standings table should now work</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
