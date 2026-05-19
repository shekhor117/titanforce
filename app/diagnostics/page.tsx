'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { seedDatabaseWithSampleData } from '@/lib/seed-data'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { getDataService } from '@/lib/data-service'
import { AlertCircle, CheckCircle, Loader, Database } from 'lucide-react'

export default function DiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState({
    supabaseConfigured: false,
    supabaseConnected: false,
    playersCount: 0,
    matchesCount: 0,
    newsCount: 0,
    productsCount: 0,
    galleryCount: 0,
    error: '',
  })
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [seedResult, setSeedResult] = useState('')

  useEffect(() => {
    const runDiagnostics = async () => {
      try {
        const supabaseConfigured = isSupabaseConfigured()
        const supabase = createClient()

        let supabaseConnected = false
        let counts = {
          players: 0,
          matches: 0,
          news: 0,
          products: 0,
          gallery: 0,
        }

        if (supabase) {
          try {
            // Test connection
            const { data: testData, error: testError } = await supabase
              .from('players')
              .select('id')
              .limit(1)

            supabaseConnected = !testError

            if (supabaseConnected) {
              // Count records
              const { count: playersCount, error: playersError } = await supabase
                .from('players')
                .select('*', { count: 'exact', head: true })

              const { count: matchesCount, error: matchesError } = await supabase
                .from('matches')
                .select('*', { count: 'exact', head: true })

              const { count: newsCount, error: newsError } = await supabase
                .from('news')
                .select('*', { count: 'exact', head: true })

              const { count: productsCount, error: productsError } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true })

              const { count: galleryCount, error: galleryError } = await supabase
                .from('gallery')
                .select('*', { count: 'exact', head: true })

              counts = {
                players: playersCount || 0,
                matches: matchesCount || 0,
                news: newsCount || 0,
                products: productsCount || 0,
                gallery: galleryCount || 0,
              }
            }
          } catch (err) {
            console.error('[v0] Diagnostics error:', err)
          }
        }

        setDiagnostics({
          supabaseConfigured,
          supabaseConnected,
          playersCount: counts.players,
          matchesCount: counts.matches,
          newsCount: counts.news,
          productsCount: counts.products,
          galleryCount: counts.gallery,
          error: supabaseConnected ? '' : 'Could not connect to Supabase',
        })
      } catch (err) {
        console.error('[v0] Diagnostics failed:', err)
        setDiagnostics(prev => ({
          ...prev,
          error: err instanceof Error ? err.message : 'Unknown error',
        }))
      } finally {
        setLoading(false)
      }
    }

    runDiagnostics()
  }, [])

  const handleSeedData = async () => {
    setSeeding(true)
    setSeedResult('')
    try {
      const success = await seedDatabaseWithSampleData()
      setSeedResult(success ? 'Data seeded successfully! Refresh to see updates.' : 'Seeding failed. Check console for details.')
      
      // Refresh diagnostics
      if (success) {
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      }
    } catch (err) {
      setSeedResult(err instanceof Error ? err.message : 'Error seeding data')
    } finally {
      setSeeding(false)
    }
  }

  const needsSeeding = 
    diagnostics.playersCount === 0 || 
    diagnostics.matchesCount === 0 || 
    diagnostics.productsCount === 0

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Database Diagnostics</h1>
          <p className="text-foreground/60">Check your website data connection with the admin panel</p>
        </div>

        {/* Status Indicators */}
        {loading ? (
          <div className="bg-secondary rounded-lg p-6 text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
            <p className="text-foreground">Running diagnostics...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Supabase Status */}
            <div className="bg-secondary rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Supabase Connection
                </h2>
                {diagnostics.supabaseConnected ? (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span>Connected</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    <span>Not Connected</span>
                  </div>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-foreground/70">
                  Configured: {diagnostics.supabaseConfigured ? '✓ Yes' : '✗ No'}
                </p>
                <p className="text-foreground/70">
                  Connected: {diagnostics.supabaseConnected ? '✓ Yes' : '✗ No'}
                </p>
                {diagnostics.error && (
                  <p className="text-red-400">{diagnostics.error}</p>
                )}
              </div>
            </div>

            {/* Data Counts */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-secondary rounded-lg p-4">
                <p className="text-foreground/60 text-sm mb-2">Players</p>
                <p className="text-3xl font-bold text-primary">{diagnostics.playersCount}</p>
              </div>
              <div className="bg-secondary rounded-lg p-4">
                <p className="text-foreground/60 text-sm mb-2">Matches</p>
                <p className="text-3xl font-bold text-primary">{diagnostics.matchesCount}</p>
              </div>
              <div className="bg-secondary rounded-lg p-4">
                <p className="text-foreground/60 text-sm mb-2">News</p>
                <p className="text-3xl font-bold text-primary">{diagnostics.newsCount}</p>
              </div>
              <div className="bg-secondary rounded-lg p-4">
                <p className="text-foreground/60 text-sm mb-2">Products</p>
                <p className="text-3xl font-bold text-primary">{diagnostics.productsCount}</p>
              </div>
              <div className="bg-secondary rounded-lg p-4">
                <p className="text-foreground/60 text-sm mb-2">Gallery</p>
                <p className="text-3xl font-bold text-primary">{diagnostics.galleryCount}</p>
              </div>
            </div>

            {/* Seed Data Action */}
            {needsSeeding && (
              <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-bold text-yellow-400 mb-2">No Data Detected</h3>
                    <p className="text-yellow-300/80 text-sm mb-4">
                      Your database appears to be empty. This is normal for a new installation. 
                      Click below to populate sample data to see how the website connects with the admin panel.
                    </p>
                    <button
                      onClick={handleSeedData}
                      disabled={seeding}
                      className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {seeding ? 'Seeding...' : 'Seed Sample Data'}
                    </button>
                  </div>
                </div>
                {seedResult && (
                  <p className={`mt-4 text-sm ${seedResult.includes('successfully') ? 'text-green-400' : 'text-red-400'}`}>
                    {seedResult}
                  </p>
                )}
              </div>
            )}

            {/* Success State */}
            {!needsSeeding && diagnostics.supabaseConnected && (
              <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-green-400 mb-1">All Systems Operational</h3>
                    <p className="text-green-300/80 text-sm">
                      Your website data is properly connected to the admin panel. 
                      Changes made in the admin panel will automatically appear on the website.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="bg-secondary rounded-lg p-6">
              <h3 className="font-bold text-foreground mb-4">Navigation</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <Link href="/" className="px-4 py-2 bg-primary text-foreground rounded-lg hover:bg-primary/80 transition-colors text-center text-sm font-medium">
                  View Website
                </Link>
                <Link href="/admin/dashboard" className="px-4 py-2 bg-primary text-foreground rounded-lg hover:bg-primary/80 transition-colors text-center text-sm font-medium">
                  Admin Dashboard
                </Link>
                <Link href="/shop" className="px-4 py-2 bg-primary text-foreground rounded-lg hover:bg-primary/80 transition-colors text-center text-sm font-medium">
                  Shop
                </Link>
                <Link href="/gallery" className="px-4 py-2 bg-primary text-foreground rounded-lg hover:bg-primary/80 transition-colors text-center text-sm font-medium">
                  Gallery
                </Link>
                <Link href="/team-squad" className="px-4 py-2 bg-primary text-foreground rounded-lg hover:bg-primary/80 transition-colors text-center text-sm font-medium">
                  Squad
                </Link>
                <Link href="/fixtures-results" className="px-4 py-2 bg-primary text-foreground rounded-lg hover:bg-primary/80 transition-colors text-center text-sm font-medium">
                  Matches
                </Link>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-secondary rounded-lg p-6">
              <h3 className="font-bold text-foreground mb-4">How Data Sync Works</h3>
              <ol className="space-y-3 text-foreground/80 text-sm">
                <li className="flex gap-3">
                  <span className="text-primary font-bold">1.</span>
                  <span>Admin panel uploads data (players, matches, news, products, gallery)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">2.</span>
                  <span>Data is stored in Supabase database</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">3.</span>
                  <span>Website fetches data from Supabase using real-time subscriptions</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">4.</span>
                  <span>Changes appear instantly on the website (Gallery, Shop, Squad, Matches, etc.)</span>
                </li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
