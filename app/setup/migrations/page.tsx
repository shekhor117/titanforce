'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle, Loader, Copy } from 'lucide-react'

export default function MigrationsSetupPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'setup_required'>('idle')
  const [copied, setCopied] = useState(false)
  const [tableStatus, setTableStatus] = useState<any>(null)

  const checkTables = async () => {
    setLoading(true)
    setError('')
    setMessage('')
    setTableStatus(null)
    setStatus('loading')

    try {
      console.log('[v0] Checking database tables...')
      const response = await fetch('/api/admin/setup-all-tables', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      console.log('[v0] Table check response:', data)

      setTableStatus(data.tables)

      if (response.status === 200) {
        setMessage('✓ All required tables exist and are configured!')
        setStatus('success')
      } else if (response.status === 202) {
        setMessage(data.message)
        setStatus('setup_required')
        setError('')
      } else {
        setError(data.error || 'Failed to check tables')
        setStatus('error')
      }
    } catch (err) {
      console.error('[v0] Table check error:', err)
      setError(err instanceof Error ? err.message : 'Failed to check tables')
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const applyMigrations = async () => {
    setLoading(true)
    setError('')
    setStatus('loading')

    try {
      console.log('[v0] Starting migration process...')
      const response = await fetch('/api/setup/run-migration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      console.log('[v0] Migration response:', data)

      if (response.ok) {
        setMessage(data.message || 'Database migrations applied successfully!')
        setStatus('success')
        
        // Check tables again after migration
        setTimeout(() => {
          checkTables()
        }, 2000)
      } else {
        setError(data.error || data.message || 'Failed to apply migrations')
        setStatus('error')
      }
    } catch (err) {
      console.error('[v0] Migration error:', err)
      setError(err instanceof Error ? err.message : 'Failed to apply migrations')
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText('npx supabase db push')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-3">Database Setup</h1>
          <p className="text-lg text-muted-foreground">
            Check and configure all required database tables
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Table Status Check */}
          <div className="bg-surface rounded-lg neo-input border p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-foreground mb-6">Database Status</h2>
            <button
              onClick={checkTables}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Checking Tables...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Check Database Tables
                </>
              )}
            </button>

            {tableStatus && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-3">
                  Total: {tableStatus.total} | Existing: {tableStatus.existing} | Missing: {tableStatus.missing}
                </p>
                {tableStatus.missing > 0 && tableStatus.missingList && (
                  <div className="text-sm">
                    <p className="font-semibold text-red-600 mb-2">Missing tables:</p>
                    <ul className="list-disc list-inside text-red-500 space-y-1">
                      {tableStatus.missingList.map((table: string) => (
                        <li key={table}>{table}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Setup Card */}
          <div className="bg-surface rounded-lg neo-input border p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-foreground mb-6">Setup Methods</h2>
            
            {/* Method 1: CLI Command */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm">1</span>
                Using Supabase CLI (Recommended)
              </h3>
              <div className="bg-muted rounded-lg p-4 neo-soft border-border">
                <p className="text-sm text-muted-foreground mb-3">Run this command in your project terminal:</p>
                <div className="flex items-center gap-2 bg-background rounded p-3">
                  <code className="text-foreground font-mono text-sm flex-1">npx supabase db push</code>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 hover:bg-muted rounded transition-colors"
                  >
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                {copied && (
                  <p className="text-sm text-green-600 mt-2">✓ Copied to clipboard</p>
                )}
              </div>
            </div>

            {/* Method 2: Auto Setup */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm">2</span>
                Auto Setup (Try Now)
              </h3>
              <button
                onClick={applyMigrations}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Applying Migrations...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Apply Database Migrations Now
                  </>
                )}
              </button>
            </div>

            {/* Method 3: Manual */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm">3</span>
                Manual Setup
              </h3>
              <div className="bg-muted rounded-lg p-4 neo-soft border-border text-sm space-y-3">
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Go to <a href="https://app.supabase.com" target="_blank" className="text-primary hover:underline">Supabase Dashboard</a></li>
                  <li>Select your project and navigate to SQL Editor</li>
                  <li>Click "New Query" and create a new SQL query</li>
                  <li>Open <code className="bg-background px-2 py-1 rounded text-foreground">supabase/migrations/20260618_create_otp_codes_table.sql</code> from your repo</li>
                  <li>Copy and paste the entire SQL content</li>
                  <li>Click "Run" to execute the migration</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {status === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex gap-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-green-900 text-lg">{message}</h3>
                <p className="text-green-800 mt-2">
                  Your OTP table is ready. Users can now receive OTP codes via Brevo email. Refresh the page to test the login flow.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {status === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-red-900 text-lg">Migration Failed</h3>
                <p className="text-red-800 mt-2">{error}</p>
                <p className="text-red-700 mt-3 text-sm">Try using Method 1 (Supabase CLI) or Method 3 (Manual Setup) instead.</p>
              </div>
            </div>
          )}

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Database Tables:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ players, matches, news_items</li>
                <li>✓ media_items, honours, injuries</li>
                <li>✓ otp_codes, site_settings</li>
                <li>✓ partnerships & contact messages</li>
              </ul>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-2">After setup:</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>✓ All admin features enabled</li>
                <li>✓ User authentication ready</li>
                <li>✓ OTP email system active</li>
                <li>✓ Complete database schema</li>
              </ul>
            </div>
          </div>

          {/* Need Help */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">Need help?</span> Check the migration logs in your browser console (F12) for detailed error messages.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
