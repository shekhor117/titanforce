import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from './supabase/server'

/**
 * Middleware to check admin authentication for API routes
 */
export async function checkAdminAuth(request: NextRequest) {
  try {
    const userClient = createClient()
    const { data: { user }, error: authError } = await userClient.auth.getUser()
    
    if (authError) {
      console.error('[v0] Auth error:', authError)
      return {
        authorized: false,
        error: 'Unauthorized',
        status: 401
      }
    }

    if (!user) {
      return {
        authorized: false,
        error: 'No user session',
        status: 401
      }
    }

    return {
      authorized: true,
      user,
      error: null,
      status: 200
    }
  } catch (error) {
    console.error('[v0] Unexpected auth error:', error)
    return {
      authorized: false,
      error: 'Authentication failed',
      status: 500
    }
  }
}

/**
 * Get admin Supabase client for database operations
 */
export function getAdminClient() {
  try {
    return createAdminClient()
  } catch (error) {
    console.error('[v0] Failed to create admin client:', error)
    throw error
  }
}

/**
 * Safe wrapper for API responses with error handling
 */
export function handleApiError(error: unknown, operation: string = 'Operation') {
  console.error(`[v0] Error in ${operation}:`, error)
  
  const message = error instanceof Error ? error.message : String(error)
  const errorResponse = {
    error: `${operation} failed`,
    details: message
  }

  return NextResponse.json(errorResponse, { status: 500 })
}

/**
 * Safe wrapper for try-catch blocks in API routes
 */
export async function wrapApiOperation<T>(
  operation: () => Promise<T>,
  operationName: string = 'Operation'
): Promise<{ success: true; data: T } | { success: false; error: string; details: string }> {
  try {
    const data = await operation()
    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[v0] Error in ${operationName}:`, message)
    return {
      success: false,
      error: `${operationName} failed`,
      details: message
    }
  }
}
