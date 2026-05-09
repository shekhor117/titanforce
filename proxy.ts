import { updateSession } from '@/lib/supabase/proxy'
import { type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  // Allow auth pages to be accessed without blocking
  const pathname = request.nextUrl.pathname
  
  // Don't apply session middleware to these paths
  if (pathname.startsWith('/auth/') || pathname.startsWith('/admin/login') || pathname.startsWith('/admin/signup') || pathname.startsWith('/admin/forgot-password')) {
    return
  }
  
  try {
    return await updateSession(request)
  } catch (error) {
    console.error('[v0] Proxy middleware error:', error)
    // Continue request even if middleware fails
    return
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
