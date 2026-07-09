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
      if (error.code === 'PGRST205' || error.message?.includes('Could not find the table') || error.message?.includes('no such table') || error.message?.includes('schema cache') || error.message?.includes('Your project')) {
        if (process.env.NODE_ENV === 'development') {
          console.debug('[v0] Standings table not available - using localStorage fallback')
        }
        return NextResponse.json([])
      }
      // Only log non-PGRST205 errors in development
      if (process.env.NODE_ENV === 'development') {
        console.debug('[v0] Error fetching standings:', error)
      }
      return NextResponse.json([])
    }

    return NextResponse.json(data || [])
  } catch (error) {
    // Silently fail in development and return empty array
    if (process.env.NODE_ENV === 'development') {
      console.debug('[v0] Error in standings API:', error instanceof Error ? error.message : 'Unknown error')
    }
    return NextResponse.json([])
  }
}
