'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle, Copy, ExternalLink } from 'lucide-react'

export default function MigrationsPage() {
  const [selectedTab, setSelectedTab] = useState<'status' | 'cli' | 'dashboard'>('status')
  const [copied, setCopied] = useState(false)
  const projectId = 'pgfxoajmqhwfpcgxygyr'

  const migrations = [
    { file: '20250505_role_tables.sql', desc: 'Role and authentication tables' },
    { file: '20250516_fix_rls_performance.sql', desc: 'RLS performance optimization' },
    { file: '20260516163423_create_is_admin_rpc.sql', desc: 'Admin check RPC' },
    { file: '20260517193131_create_gallery_table.sql', desc: 'Gallery table' },
    { file: '20260517195125_create_products_table.sql', desc: 'Store products' },
    { file: '20260517195413_create_trophies_table.sql', desc: 'Team trophies' },
    { file: '20260517202759_add_player_ranking_column.sql', desc: 'Player ranking' },
    { file: '20260618_create_app_users_table.sql', desc: 'App users' },
    { file: '20260618_create_contact_messages_table.sql', desc: 'Contact messages (CRITICAL)' },
    { file: '20260618_create_otp_codes_table.sql', desc: 'OTP codes' },
    { file: '20260618_fix_contact_messages_rls.sql', desc: 'Contact RLS' },
    { file: '20260619_create_articles_table.sql', desc: 'Articles' },
    { file: '20260619_create_events_table.sql', desc: 'Events' },
    { file: '20260619_create_pages_table.sql', desc: 'CMS Pages' },
    { file: '20260628_create_news_updates_table.sql', desc: 'News updates' },
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Database Migrations</h1>
          <p className="text-muted-foreground">Initialize your Supabase database schema</p>
        </div>

        {/* Critical Status Alert */}
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Database Not Initialized</h3>
            <p className="text-sm text-red-800 mt-1">0 tables found. Run migrations to initialize the schema.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-surface rounded-lg border border-border mb-6">
          <div className="flex border-b border-border">
            {[
              { id: 'status', label: 'Status' },
              { id: 'cli', label: 'CLI Method (Fastest)' },
              { id: 'dashboard', label: 'Dashboard Method' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex-1 px-4 py-3 font-medium transition-colors text-center ${
                  selectedTab === tab.id
                    ? 'text-primary border-b-2 border-primary -mb-[2px]'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {selectedTab === 'status' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-foreground mb-4">Current Status</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Database Connection</p>
                      <p className="text-lg font-bold text-green-600">✓ Connected</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Tables Created</p>
                      <p className="text-lg font-bold text-red-600">0 / 15</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-foreground mb-4">Required Actions</h2>
                  <ol className="space-y-3 text-foreground">
                    <li className="flex gap-3">
                      <span className="font-bold text-primary flex-shrink-0">1.</span>
                      <span>Choose migration method below</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-primary flex-shrink-0">2.</span>
                      <span>Run all 15 migrations in order</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-primary flex-shrink-0">3.</span>
                      <span>Refresh page to verify (status will update)</span>
                    </li>
                  </ol>
                </div>

                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Refresh Status
                </button>
              </div>
            )}

            {selectedTab === 'cli' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-foreground mb-2">Supabase CLI (Recommended)</h2>
                  <p className="text-muted-foreground mb-4">Fastest and most reliable method.</p>
                </div>

                <div className="space-y-4">
                  {[
                    { step: '1', cmd: 'npm install -g supabase', desc: 'Install Supabase CLI' },
                    { step: '2', cmd: 'supabase login', desc: 'Login to Supabase' },
                    { step: '3', cmd: `supabase link --project-ref ${projectId}`, desc: 'Link your project' },
                    { step: '4', cmd: 'supabase db push', desc: 'Push migrations' },
                  ].map((item) => (
                    <div key={item.step}>
                      <p className="text-sm font-semibold text-foreground mb-2">
                        Step {item.step}: {item.desc}
                      </p>
                      <div className="bg-muted rounded-lg p-3 flex items-center justify-between group">
                        <code className="font-mono text-sm text-foreground">{item.cmd}</code>
                        <button
                          onClick={() => copyToClipboard(item.cmd)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                          title="Copy"
                        >
                          <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {copied && (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Copied to clipboard
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'dashboard' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-foreground mb-2">Supabase Dashboard</h2>
                  <p className="text-muted-foreground mb-4">Manual method if you prefer not to use CLI.</p>
                </div>

                <div className="space-y-4">
                  <ol className="space-y-3 text-foreground">
                    <li className="flex gap-3">
                      <span className="font-bold text-primary flex-shrink-0">1.</span>
                      <span>
                        Go to{' '}
                        <a
                          href="https://app.supabase.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline inline-flex items-center gap-1"
                        >
                          app.supabase.com <ExternalLink className="w-3 h-3" />
                        </a>
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-primary flex-shrink-0">2.</span>
                      <span>Select your project</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-primary flex-shrink-0">3.</span>
                      <span>Go to SQL Editor (left sidebar)</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-primary flex-shrink-0">4.</span>
                      <span>Create new query</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-primary flex-shrink-0">5.</span>
                      <span>Copy each migration SQL file (in order)</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-primary flex-shrink-0">6.</span>
                      <span>Run each migration</span>
                    </li>
                  </ol>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <h3 className="font-bold text-foreground mb-3">Migration Files (in order):</h3>
                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {migrations.map((m, i) => (
                      <div key={m.file} className="flex gap-2 text-sm py-1.5 px-2 hover:bg-surface rounded">
                        <span className="text-muted-foreground flex-shrink-0 w-5">{String(i + 1).padStart(2, '0')}.</span>
                        <div>
                          <p className="font-mono text-foreground text-xs">{m.file}</p>
                          <p className="text-muted-foreground text-xs">{m.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-semibold text-yellow-900">Important</p>
                    <p className="text-yellow-800">Run migrations in order. Critical file: 20260618_create_contact_messages_table.sql</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <h3 className="font-bold text-foreground mb-3">Having issues?</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Make sure you&apos;re in the project directory when using CLI</li>
            <li>• All 15 migrations must run in order</li>
            <li>• Contact support if you encounter SSL certificate errors</li>
            <li>• After migrations complete, data fetching will work automatically</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
