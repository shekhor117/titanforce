'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle, Loader, Zap } from 'lucide-react'

interface MigrationResult {
  file: string
  success: boolean
  error?: string
}

export default function MigrationsPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [results, setResults] = useState<MigrationResult[]>([])

  const applyMigrations = async () => {
    setLoading(true)
    setError('')
    setMessage('')
    setStatus('loading')
    setResults([])

    try {
      const response = await fetch('/api/admin/auto-migrate', {
        method: 'POST',
      })

      const data = await response.json()

      if (data.success) {
        setMessage(data.message)
        setResults(data.results || [])
        setStatus('success')
      } else {
        setError(data.error || 'Failed to apply migrations')
        setResults(data.results || [])
        setStatus('error')
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to apply migrations'
      setError(errorMsg)
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-surface rounded-lg border-border p-8 shadow-lg">
          <h1 className="text-4xl font-bold text-foreground mb-2">Auto-Apply Migrations</h1>
          <p className="text-muted-foreground mb-8">
            Click one button to automatically apply all database migrations and enable data saving
          </p>

          <div className="space-y-6">
            {/* Main Action Button */}
            <button
              onClick={applyMigrations}
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-6 px-8 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl disabled:shadow-md smooth-button"
            >
              {loading ? (
                <>
                  <Loader className="w-6 h-6 animate-spin" />
                  Applying Migrations... {results.length > 0 && `(${results.length})`}
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6" />
                  Apply All Migrations Now
                </>
              )}
            </button>

            {/* Success Message */}
            {status === 'success' && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 flex gap-4">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-green-900">{message}</h3>
                  <p className="text-sm text-green-800 mt-2">
                    Your database is ready! Go to Admin Panel → Matches and start saving data.
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {status === 'error' && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 flex gap-4">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-red-900">Migration Error</h3>
                  <p className="text-sm text-red-800 mt-2">{error}</p>
                </div>
              </div>
            )}

            {/* Migration Results */}
            {results.length > 0 && (
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="bg-muted p-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">
                    Migration Results: {results.filter((r) => r.success).length}/{results.length} Successful
                  </h3>
                </div>
                <div className="divide-y divide-border max-h-64 overflow-y-auto">
                  {results.map((result, i) => (
                    <div key={i} className="p-3 flex items-start gap-3">
                      {result.success ? (
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-1" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-mono font-semibold text-foreground truncate">
                          {result.file}
                        </p>
                        {result.error && (
                          <p className="text-xs text-red-600 mt-1">{result.error}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">How It Works</h3>
              <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc">
                <li>Automatically creates all database tables</li>
                <li>Sets up security policies (RLS)</li>
                <li>Creates indexes for performance</li>
                <li>No manual SQL needed!</li>
              </ul>
            </div>

            {/* What Gets Created */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="font-semibold text-purple-900 mb-3">Database Tables Created</h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-purple-800">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  Matches & Fixtures
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  Standings
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  Players & Teams
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  News & Articles
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  Events & Stats
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  OTP & Auth
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
