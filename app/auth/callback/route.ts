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
        // Check if profile already exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id, role, is_approved')
          .eq('id', user.id)
          .single()

        if (!existingProfile) {
          // Create main profile entry
          await supabase.from('profiles').insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
            avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
            role: role,
            is_approved: role === 'fan', // Fans auto-approved, players/partners need admin approval
            created_at: new Date().toISOString(),
          })

          // Insert into role-specific table
          if (role === 'player') {
            await supabase.from('players').insert({
              user_id: user.id,
              name: user.user_metadata?.full_name || user.user_metadata?.name || '',
              email: user.email,
              position: '',
              jersey_number: null,
              is_approved: false,
              created_at: new Date().toISOString(),
            })
          } else if (role === 'partner') {
            await supabase.from('partners').insert({
              user_id: user.id,
              name: user.user_metadata?.full_name || user.user_metadata?.name || '',
              email: user.email,
              company_name: '',
              is_approved: false,
              created_at: new Date().toISOString(),
            })
          } else if (role === 'fan') {
            await supabase.from('fans').insert({
              user_id: user.id,
              name: user.user_metadata?.full_name || user.user_metadata?.name || '',
              email: user.email,
              is_approved: true, // Fans auto-approved
              created_at: new Date().toISOString(),
            })
          }
        }

        // Check approval status for redirect
        const isApproved = existingProfile?.is_approved ?? (role === 'fan')
        
        if (!isApproved) {
          // Redirect to pending approval page
          return NextResponse.redirect(`${origin}/auth/pending-approval?role=${role}`)
        }

        // Redirect based on role
        if (role === 'player') {
          return NextResponse.redirect(`${origin}/dashboard/player`)
        }
        if (role === 'partner') {
          return NextResponse.redirect(`${origin}/dashboard/partner`)
        }
        // Default to fan dashboard
        return NextResponse.redirect(`${origin}/dashboard/fan`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
