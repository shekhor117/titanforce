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
      // If table doesn't exist, return empty array gracefully (don't log as error)
      if (error.code === 'PGRST205' || error.message?.includes('Could not find the table') || error.message?.includes('no such table') || error.message?.includes('schema cache')) {
        console.debug('[v0] Standings table not yet created - migration needed')
        return NextResponse.json([])
      }
      // Only log non-PGRST205 errors
      console.debug('[v0] Error fetching standings:', error)
      return NextResponse.json([])
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
