'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, Download, Copy } from 'lucide-react'

interface MigrationFile {
  file: string
  content: string
  success: boolean
}

export default function MigrationsPage() {
  const [loading, setLoading] = useState(false)
  const [migrations, setMigrations] = useState<MigrationFile[]>([])
  const [error, setError] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    fetchMigrations()
  }, [])

  const fetchMigrations = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/auto-migrate', {
        method: 'POST',
      })

      const data = await response.json()

      if (data.success && data.results) {
        setMigrations(data.results.filter((r: any) => r.success))
        setStatus('success')
      } else {
        setError(data.error || 'Failed to load migrations')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load migrations')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (content: string, fileName: string) => {
    navigator.clipboard.writeText(content)
    setCopied(fileName)
    setTimeout(() => setCopied(null), 2000)
  }

  const downloadFile = (content: string, fileName: string) => {
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
    element.setAttribute('download', fileName)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-surface rounded-lg border-border p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-foreground mb-2">Database Migrations</h1>
          <p className="text-muted-foreground mb-8">
            Manual setup: Copy/paste migration SQL files into Supabase to create tables and enable data saving
          </p>

          <div className="space-y-6">
            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900">Error</h3>
                  <p className="text-sm text-red-800 mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Manual Setup Instructions
              </h3>
              <ol className="text-sm text-blue-800 space-y-2 ml-7 list-decimal">
                <li>Go to <strong>Supabase Dashboard</strong> → <strong>SQL Editor</strong></li>
                <li>Click <strong>New Query</strong></li>
                <li>For each migration file below, copy the SQL content</li>
                <li>Paste into the query editor and click <strong>Run</strong></li>
                <li>Repeat for all files in order</li>
                <li>Return here and your app will work!</li>
              </ol>
            </div>

            {/* Migration Files */}
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
                <p className="text-muted-foreground mt-2">Loading migrations...</p>
              </div>
            ) : migrations.length > 0 ? (
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="bg-muted p-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">
                    {migrations.length} Migration Files Ready
                  </h3>
                </div>
                <div className="divide-y divide-border max-h-96 overflow-y-auto">
                  {migrations.map((migration, i) => (
                    <div key={i} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-sm font-medium text-foreground truncate">
                            {migration.file}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {migration.content.split('\n').length} lines
                          </p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => copyToClipboard(migration.content, migration.file)}
                            title="Copy SQL to clipboard"
                            className="p-2 hover:bg-primary/10 rounded transition-colors"
                          >
                            <Copy
                              className={`w-4 h-4 ${
                                copied === migration.file
                                  ? 'text-green-600'
                                  : 'text-muted-foreground hover:text-foreground'
                              }`}
                            />
                          </button>
                          <button
                            onClick={() => downloadFile(migration.content, migration.file)}
                            title="Download SQL file"
                            className="p-2 hover:bg-primary/10 rounded transition-colors"
                          >
                            <Download className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                          </button>
                        </div>
                      </div>
                      <div className="bg-muted/30 rounded p-2 max-h-24 overflow-hidden text-xs font-mono text-muted-foreground">
                        <pre className="whitespace-pre-wrap break-words">
                          {migration.content.substring(0, 200)}
                          {migration.content.length > 200 && '...'}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Final Step */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                After Running All Migrations
              </h3>
              <p className="text-sm text-green-800">
                Go to Admin Panel → Matches and try saving a match. Your data will now persist to the database instead of localStorage!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
