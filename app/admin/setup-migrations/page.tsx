'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function SetupMigrationsPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const applyMigrations = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/fix-rls', {
        method: 'POST',
      })

      const data = await response.json()
      setResult(data)

      if (!response.ok) {
        setError(data.error || 'Failed to apply migrations')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Database Migrations Setup</h1>

        <div className="bg-card rounded-lg border p-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">Status</h2>
            <div className="space-y-2 text-sm">
              <p>This page applies necessary database migrations to fix RLS (Row Level Security) policies.</p>
              <p className="text-muted-foreground">
                The app was experiencing permission denied errors when accessing news items. This fixes those issues.
              </p>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded p-4">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">
              ⚠️ What this does:
            </p>
            <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1 list-disc list-inside">
              <li>Updates RLS policies on the news_items table</li>
              <li>Fixes permission denied errors for anonymous users</li>
              <li>Grants necessary permissions to authenticated users</li>
              <li>Allows published news to be viewable by everyone</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Option 1: Automatic Migration (Recommended)</h3>
            <Button
              onClick={applyMigrations}
              disabled={loading}
              size="lg"
              className="w-full"
            >
              {loading ? 'Applying Migrations...' : 'Apply Migrations Now'}
            </Button>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Option 2: Manual Migration</h3>
            <p className="text-sm text-muted-foreground mb-3">
              If automatic migration fails, run this in Supabase dashboard:
            </p>
            <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded font-mono text-xs overflow-auto">
              <pre>{`npx supabase db push`}</pre>
            </div>
          </div>

          {result && (
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded p-4">
              <p className="font-semibold text-green-900 dark:text-green-100 mb-2">
                ✓ {result.message}
              </p>
              <div className="text-sm text-green-800 dark:text-green-200 space-y-1">
                <p>Successfully executed: {result.successCount}/{result.totalStatements} statements</p>
                {result.failedCount > 0 && (
                  <p className="text-amber-600 dark:text-amber-400">
                    Failed: {result.failedCount} statement(s) - see details below
                  </p>
                )}
              </div>
              {result.results && result.results.length > 0 && (
                <details className="mt-3 text-xs">
                  <summary className="cursor-pointer font-medium">View Details</summary>
                  <div className="mt-2 space-y-1 text-green-700 dark:text-green-300">
                    {result.results.map((r: any, i: number) => (
                      <div key={i}>
                        [{r.status.toUpperCase()}] {r.sql}
                        {r.error && <div className="text-red-600 ml-4">Error: {r.error}</div>}
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded p-4">
              <p className="font-semibold text-red-900 dark:text-red-100 mb-2">
                ✗ Error: {error}
              </p>
              <p className="text-sm text-red-800 dark:text-red-200 mb-3">
                Please try the manual migration option above, or contact support if the issue persists.
              </p>
            </div>
          )}

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Migration file: <code className="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">
                supabase/migrations/20260707_fix_news_items_rls.sql
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
