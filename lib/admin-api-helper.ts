import { NextRequest, NextResponse } from 'next/server'
import type { User } from '@supabase/supabase-js'
import { createClient, createAdminClient } from './supabase/server'

const ADMIN_ROLES = new Set(['admin', 'super_admin', 'moderator', 'manager'])

type AdminAuthResult =
  | { authorized: true; user: User; role: string; error: null; status: 200 }
  | { authorized: false; user?: undefined; role?: undefined; error: string; status: 401 | 403 | 500 }

/**
 * Authenticates and authorizes every admin API request.
 * Roles must come from server-controlled app_metadata or an active app_users row;
 * editable user_metadata is intentionally never used for authorization.
 */
export async function checkAdminAuth(_request: NextRequest): Promise<AdminAuthResult> {
  try {
    const userClient = await createClient()
    const { data: { user }, error: authError } = await userClient.auth.getUser()

    if (authError || !user) {
      return { authorized: false, error: 'Unauthorized', status: 401 as const }
    }

    const metadataRole = typeof user.app_metadata?.role === 'string'
      ? user.app_metadata.role.trim().toLowerCase()
      : ''
    let role = metadataRole
    const { data: appUser } = await userClient
      .from('app_users')
      .select('role, is_active')
      .eq('email', user.email ?? '')
      .maybeSingle()

    if (appUser && appUser.is_active !== true) {
      return { authorized: false, error: 'Forbidden', status: 403 as const }
    }

    if (!ADMIN_ROLES.has(role) && appUser?.is_active === true && typeof appUser.role === 'string') {
      role = appUser.role.trim().toLowerCase()
    }

    if (!ADMIN_ROLES.has(role)) {
      return { authorized: false, error: 'Forbidden', status: 403 as const }
    }

    return { authorized: true, user, role, error: null, status: 200 as const }
  } catch (error) {
    console.error('[v0] Unexpected auth error:', error)
    return { authorized: false, error: 'Authentication failed', status: 500 as const }
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
  
  const errorResponse = {
    error: `${operation} failed`
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
      details: 'The operation could not be completed.'
    }
  }
}
