'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SetupDatabasePage() {
  const [method, setMethod] = useState<'cli' | 'dashboard'>('cli')
  const [copied, setCopied] = useState(false)

  const projectId = 'pgfxoajmqhwfpcgxygyr'

  const cliCommands = `npm install -g supabase
supabase login
supabase link --project-ref ${projectId}
supabase db push`

  const handleCopy = () => {
    navigator.clipboard.writeText(cliCommands)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Database Setup Required</h1>
          <p className="text-xl text-slate-300">
            Initialize your Supabase database with the required schema.
          </p>
        </div>

        {/* Status */}
        <div className="mb-8 p-6 bg-red-900/30 border border-red-700 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <h2 className="font-semibold">Status: Not Set Up</h2>
          </div>
          <p className="text-red-300 text-sm">
            The contact_messages table and other required database tables have not been created yet.
          </p>
        </div>

        {/* Method Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Choose a Method</h2>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {/* CLI Method */}
            <button
              onClick={() => setMethod('cli')}
              className={`p-6 rounded-lg border-2 text-left transition-all ${
                method === 'cli'
                  ? 'bg-blue-900/30 border-blue-500'
                  : 'bg-slate-800 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="text-lg font-semibold mb-2">📱 CLI Method</div>
              <div className="text-sm text-slate-300">
                Use Supabase CLI for automated setup (Recommended)
              </div>
            </button>

            {/* Dashboard Method */}
            <button
              onClick={() => setMethod('dashboard')}
              className={`p-6 rounded-lg border-2 text-left transition-all ${
                method === 'dashboard'
                  ? 'bg-blue-900/30 border-blue-500'
                  : 'bg-slate-800 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="text-lg font-semibold mb-2">🌐 Dashboard Method</div>
              <div className="text-sm text-slate-300">
                Manually execute SQL in Supabase dashboard
              </div>
            </button>
          </div>

          {/* CLI Instructions */}
          {method === 'cli' && (
            <div className="bg-slate-800 rounded-lg p-8 mb-8">
              <h3 className="text-xl font-bold mb-4">Step-by-Step Instructions</h3>

              <ol className="space-y-4 mb-6">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    1
                  </span>
                  <div>
                    <p className="font-semibold mb-1">Install Supabase CLI</p>
                    <code className="bg-black/50 px-3 py-2 rounded block text-sm">
                      npm install -g supabase
                    </code>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="flex-shrink-0 bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    2
                  </span>
                  <div>
                    <p className="font-semibold mb-1">Login to Supabase</p>
                    <code className="bg-black/50 px-3 py-2 rounded block text-sm">
                      supabase login
                    </code>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="flex-shrink-0 bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    3
                  </span>
                  <div>
                    <p className="font-semibold mb-1">Link Your Project</p>
                    <code className="bg-black/50 px-3 py-2 rounded block text-sm">
                      supabase link --project-ref {projectId}
                    </code>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="flex-shrink-0 bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    4
                  </span>
                  <div>
                    <p className="font-semibold mb-1">Push Migrations</p>
                    <code className="bg-black/50 px-3 py-2 rounded block text-sm">
                      supabase db push
                    </code>
                  </div>
                </li>
              </ol>

              <div className="bg-green-900/20 border border-green-700 rounded p-4 mb-6">
                <p className="text-sm text-green-300">
                  ✅ This will automatically execute all 15 migration files in the correct order.
                </p>
              </div>

              <button
                onClick={handleCopy}
                className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {copied ? '✓ Copied to Clipboard' : 'Copy All Commands'}
              </button>
            </div>
          )}

          {/* Dashboard Instructions */}
          {method === 'dashboard' && (
            <div className="bg-slate-800 rounded-lg p-8 mb-8">
              <h3 className="text-xl font-bold mb-4">Manual Setup via Dashboard</h3>

              <ol className="space-y-4 mb-6">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    1
                  </span>
                  <div>
                    <p className="font-semibold mb-1">Go to Supabase Dashboard</p>
                    <a
                      href={`https://app.supabase.com/projects/${projectId}/editor`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline text-sm"
                    >
                      Open SQL Editor →
                    </a>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="flex-shrink-0 bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    2
                  </span>
                  <div>
                    <p className="font-semibold mb-1">
                      Execute migrations in order from supabase/migrations/
                    </p>
                    <p className="text-sm text-slate-400">
                      Create a new query and copy-paste each .sql file content
                    </p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="flex-shrink-0 bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    3
                  </span>
                  <div>
                    <p className="font-semibold mb-1">Run migrations in this order:</p>
                    <div className="bg-black/30 p-3 rounded mt-2 text-xs space-y-1 text-slate-300">
                      <div>1. 20250505_role_tables.sql</div>
                      <div>2. 20250516_fix_rls_performance.sql</div>
                      <div>3. 20260516163423_create_is_admin_rpc.sql</div>
                      <div>... (see full list below)</div>
                      <div>9. 20260618_create_contact_messages_table.sql ⭐ Important</div>
                      <div>10. 20260618_create_otp_codes_table.sql</div>
                      <div>11. 20260618_fix_contact_messages_rls.sql</div>
                      <div>... (and 4 more)</div>
                    </div>
                  </div>
                </li>
              </ol>

              <a
                href={`https://app.supabase.com/projects/${projectId}/editor`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block text-center bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Open SQL Editor →
              </a>
            </div>
          )}
        </div>

        {/* Migration Files List */}
        <div className="bg-slate-800 rounded-lg p-8 mb-8">
          <h3 className="text-xl font-bold mb-4">📋 All Migration Files</h3>

          <div className="space-y-2 text-sm max-h-64 overflow-y-auto">
            {[
              { file: '20250505_role_tables.sql', desc: 'Role tables' },
              { file: '20250516_fix_rls_performance.sql', desc: 'RLS performance' },
              { file: '20260516163423_create_is_admin_rpc.sql', desc: 'Admin check' },
              { file: '20260517193131_create_gallery_table.sql', desc: 'Gallery' },
              { file: '20260517195125_create_products_table.sql', desc: 'Products' },
              { file: '20260517195413_create_trophies_table.sql', desc: 'Trophies' },
              { file: '20260517202759_add_player_ranking_column.sql', desc: 'Ranking' },
              { file: '20260618_create_app_users_table.sql', desc: 'App Users' },
              {
                file: '20260618_create_contact_messages_table.sql',
                desc: 'Contact Messages ⭐',
              },
              { file: '20260618_create_otp_codes_table.sql', desc: 'OTP Codes' },
              { file: '20260618_fix_contact_messages_rls.sql', desc: 'Contact RLS' },
              { file: '20260619_create_articles_table.sql', desc: 'Articles' },
              { file: '20260619_create_events_table.sql', desc: 'Events' },
              { file: '20260619_create_pages_table.sql', desc: 'Pages' },
              { file: '20260628_create_news_updates_table.sql', desc: 'News' },
            ].map((item, idx) => (
              <div key={item.file} className="flex gap-3 p-2 hover:bg-slate-700/50 rounded">
                <span className="text-slate-500">{String(idx + 1).padStart(2, '0')}</span>
                <span className="flex-1">{item.file}</span>
                <span className="text-slate-500">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-slate-800 rounded-lg p-8">
          <h3 className="text-xl font-bold mb-4">After Setup ✅</h3>

          <div className="space-y-3">
            <p className="text-slate-300">
              Once migrations are complete, the database will have:
            </p>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>✓ contact_messages table for the contact form</li>
              <li>✓ All other required tables initialized</li>
              <li>✓ Row Level Security (RLS) policies in place</li>
              <li>✓ Database functions and triggers configured</li>
            </ul>

            <p className="mt-4 pt-4 border-t border-slate-700">
              <Link href="/contact" className="text-blue-400 hover:underline">
                Return to Contact Form →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
