import { updateSession } from '@/lib/supabase/proxy'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip auth routes
  if (
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/admin/login') ||
    pathname.startsWith('/admin/signup') ||
    pathname.startsWith('/admin/forgot-password')
  ) {
    return NextResponse.next()
  }

  try {
    return await updateSession(request)
  } catch (error) {
    console.error('[v0] Middleware error:', error)

    // Prevent middleware crash
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}