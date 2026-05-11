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

      if (user) {
        const now = new Date().toISOString()
        const userData = {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
          avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
          created_at: now,
          updated_at: now,
        }

        // Insert into main profiles table with role and approval status
        await supabase.from('profiles').upsert({
          ...userData,
          role: role,
          status: role === 'fan' ? 'approved' : 'pending', // Fans auto-approved, players/partners need approval
        })

        // Insert into role-specific table
        if (role === 'player') {
          await supabase.from('players').upsert({
            ...userData,
            position: null,
            jersey_number: null,
            status: 'pending', // Requires admin approval
          })
        } else if (role === 'partner') {
          await supabase.from('partners').upsert({
            ...userData,
            company_name: null,
            partnership_type: null,
            status: 'pending', // Requires admin approval
          })
        } else {
          // Fan - auto approved
          await supabase.from('fans').upsert({
            ...userData,
            status: 'approved',
          })
        }
      }

      // Redirect based on role
      if (role === 'player') {
        return NextResponse.redirect(`${origin}/dashboard/player?pending=true`)
      }

      if (role === 'partner') {
        return NextResponse.redirect(`${origin}/dashboard/partner?pending=true`)
      }

      // Default to fan dashboard (auto-approved)
      return NextResponse.redirect(`${origin}/dashboard/fan`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
