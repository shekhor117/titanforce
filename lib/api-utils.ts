import { NextResponse } from 'next/server'

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

/**
 * Get Supabase configuration or throw error
 */
export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Supabase credentials not configured')
  }

  return { url, key }
}

/**
 * Handle API errors with consistent response
 */
export function handleAPIError(error: unknown, context: string = 'API') {
  const message = error instanceof Error ? error.message : 'Unknown error'
  console.error(`[v0] ${context} error:`, message)

  // Check if it's a credential/configuration error
  if (message.includes('credentials') || message.includes('not configured')) {
    return NextResponse.json(
      {
        error: 'Database not configured',
        message: 'Supabase credentials missing',
      },
      { status: 503 }
    )
  }

  // Check for database-specific errors
  if (message.includes('relation') || message.includes('does not exist')) {
    return NextResponse.json(
      {
        error: 'Database schema error',
        message: 'Required database tables not found. Please run migrations.',
      },
      { status: 503 }
    )
  }

  return NextResponse.json(
    { error: message },
    { status: 500 }
  )
}
