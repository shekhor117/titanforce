import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('standings')
      .select('*')
      .order('position', { ascending: true })

    if (error) {
      console.error('[v0] Error fetching standings:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('[v0] Standings API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    
    // Check if it's a credentials error
    if (errorMessage.includes('Supabase') || errorMessage.includes('credentials')) {
      return NextResponse.json(
        { 
          error: 'Database configuration missing',
          message: 'Please configure your Supabase credentials in environment variables',
          details: errorMessage
        },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
