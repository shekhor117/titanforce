import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const role = searchParams.get('role') || 'fan'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser()

      // Save role in profiles table
      if (user) {
        await supabase.from('profiles').upsert({
          id: user.id,
          email: user.email,
          role: role,
        })
      }

      // Redirect based on role
      if (role === 'player') {
        return NextResponse.redirect(`${origin}/player/dashboard`)
      }

      if (role === 'partner') {
        return NextResponse.redirect(`${origin}/partner/dashboard`)
      }

      // Default to fan home
      return NextResponse.redirect(`${origin}/fan/home`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
