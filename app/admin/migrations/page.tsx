'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle, Loader } from 'lucide-react'

export default function MigrationsPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const applyMigrations = async () => {
    setLoading(true)
    setError('')
    setMessage('')
    setStatus('loading')

    try {
      const response = await fetch('/api/admin/apply-migrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        setStatus('success')
      } else {
        setError(data.error || data.message)
        setStatus('error')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply migrations')
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-surface rounded-lg neo-soft border-border p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-foreground mb-2">Database Migrations</h1>
          <p className="text-muted-foreground mb-8">
            Apply pending database migrations to set up the OTP functionality
          </p>

          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-muted rounded-lg p-6 neo-soft border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4">Migration Status</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-muted-foreground">OTP Codes Table</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-muted-foreground">Email Indexes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-muted-foreground">RLS Policies</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-muted-foreground">Cleanup Function</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={applyMigrations}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Applying Migrations...
                </>
              ) : (
                'Apply Migrations'
              )}
            </button>

            {/* Success Message */}
            {status === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-900">{message}</h3>
                  <p className="text-sm text-green-800 mt-1">
                    Your OTP table is ready. Users can now receive OTP codes via email.
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900">Migration Failed</h3>
                  <p className="text-sm text-red-800 mt-1">{error}</p>
                  <div className="mt-4 text-sm text-red-800">
                    <p className="font-semibold mb-2">Manual Alternative:</p>
                    <p>1. Go to your Supabase dashboard</p>
                    <p>2. Open the SQL Editor</p>
                    <p>3. Copy and paste the SQL from: <code className="bg-red-100 px-2 py-1 rounded">supabase/migrations/20260618_create_otp_codes_table.sql</code></p>
                    <p>4. Execute the SQL</p>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Alternative Methods</h3>
              <div className="text-sm text-blue-800 space-y-2">
                <p><strong>Using Supabase CLI:</strong></p>
                <code className="block bg-blue-100 px-3 py-2 rounded mb-3">npx supabase db push</code>
                
                <p><strong>Using Supabase Dashboard:</strong></p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Go to SQL Editor</li>
                  <li>Create a new query</li>
                  <li>Copy SQL from migrations folder</li>
                  <li>Execute the query</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
