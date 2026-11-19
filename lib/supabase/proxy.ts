import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from './server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // If Supabase is not configured, skip session handling
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes - redirect to login if not authenticated
  // But allow access to /admin/login without authentication
  const isAdminLogin = request.nextUrl.pathname === '/admin/login' || 
                       request.nextUrl.pathname === '/admin/signup' ||
                       request.nextUrl.pathname === '/admin/forgot-password' ||
                       request.nextUrl.pathname.startsWith('/admin/auth/') ||
                       request.nextUrl.pathname.startsWith('/(admin-auth)/')
  
  const protectedPaths = ['/dashboard', '/profile', '/admin']
  const isProtectedPath = !isAdminLogin && protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  const pathname = request.nextUrl.pathname
  const maintenanceExempt = pathname === '/maintenance' || pathname.startsWith('/_next/') || pathname.startsWith('/api/maintenance') || pathname.startsWith('/auth/') || pathname === '/login' || pathname === '/admin/login' || pathname === '/admin/signup' || pathname === '/admin/forgot-password' || pathname.startsWith('/admin/auth/')
  const isAdminArea = pathname === '/admin' || pathname.startsWith('/admin/') || pathname.startsWith('/api/admin/')

  if (!maintenanceExempt) {
    try {
      const adminClient = createAdminClient()
      const { data: setting, error } = await adminClient
        .from('site_settings')
        .select('maintenance_enabled')
        .eq('key', 'maintenance_mode')
        .maybeSingle()

      if (!error && setting?.maintenance_enabled) {
        let isAuthorizedAdmin = false
        if (user?.email && isAdminArea) {
          const { data: appUser } = await adminClient
            .from('app_users')
            .select('role, is_active')
            .eq('email', user.email.toLowerCase())
            .maybeSingle()
          isAuthorizedAdmin = appUser?.is_active === true && ['admin', 'super_admin', 'moderator', 'manager'].includes(String(appUser.role).toLowerCase())
        }

        if (!isAuthorizedAdmin) {
          const headers = new Headers({ 'Retry-After': '3600', 'X-Robots-Tag': 'noindex, nofollow, noarchive', 'Cache-Control': 'no-store, max-age=0' })
          if (pathname.startsWith('/api/')) {
            return NextResponse.json({ error: 'The website is temporarily unavailable for maintenance.' }, { status: 503, headers })
          }
          const destination = request.nextUrl.clone()
          destination.pathname = '/maintenance'
          destination.search = ''
          return NextResponse.rewrite(destination, { status: 503, headers })
        }
      }
    } catch {
      // Keep the public website available if the maintenance store is temporarily unreachable.
    }
  }

  // If user is logged in and trying to access login/signup, redirect to profile
  const authPaths = ['/login', '/auth/login', '/auth/sign-up']
  const isAuthPath = authPaths.some(path => 
    request.nextUrl.pathname === path
  )

  if (isAuthPath && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/profile'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
