import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface Event {
  id?: string
  title: string
  slug: string
  description?: string
  event_type: 'match' | 'tournament' | 'training' | 'other'
  start_date: string
  end_date?: string
  location?: string
  featured_image_url?: string
  featured_image_alt?: string
  status: 'draft' | 'published' | 'archived' | 'cancelled'
  capacity?: number
  registration_open?: boolean
  registration_deadline?: string
  // Match specific
  opponent_name?: string
  match_time?: string
  home_team?: string
  away_team?: string
  score_home?: number
  score_away?: number
  result?: 'won' | 'lost' | 'draw'
  // Tournament specific
  tournament_name?: string
  round?: string
}

export interface EventResponse extends Event {
  id: string
  created_at: string
  updated_at: string
  created_by?: string
}

// Get all events with pagination and filters
export async function getEvents(
  page: number = 1,
  limit: number = 10,
  filters?: {
    status?: 'draft' | 'published' | 'archived' | 'cancelled'
    event_type?: string
    search?: string
    upcoming?: boolean
  }
) {
  let query = supabase
    .from('events')
    .select('*', { count: 'exact' })

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  if (filters?.event_type) {
    query = query.eq('event_type', filters.event_type)
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  if (filters?.upcoming) {
    query = query.gte('start_date', new Date().toISOString())
  }

  const offset = (page - 1) * limit
  const { data, error, count } = await query
    .order('start_date', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw new Error(error.message)

  return {
    events: data as EventResponse[],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit),
  }
}

// Get single event by slug
export async function getEventBySlug(slug: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) throw new Error(error.message)
  return data as EventResponse
}

// Get single event by ID
export async function getEventById(id: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data as EventResponse
}

// Create new event
export async function createEvent(event: Event) {
  const { data, error } = await supabase
    .from('events')
    .insert([{
      ...event,
      created_by: (await supabase.auth.getUser()).data.user?.id,
    }])
    .select()

  if (error) throw new Error(error.message)
  return data?.[0] as EventResponse
}

// Update event
export async function updateEvent(id: string, updates: Partial<Event>) {
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) throw new Error(error.message)
  return data?.[0] as EventResponse
}

// Delete event
export async function deleteEvent(id: string) {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  return true
}

// Publish event
export async function publishEvent(id: string) {
  return updateEvent(id, {
    status: 'published',
  })
}

// Cancel event
export async function cancelEvent(id: string) {
  return updateEvent(id, {
    status: 'cancelled',
  })
}

// Archive event
export async function archiveEvent(id: string) {
  return updateEvent(id, {
    status: 'archived',
  })
}

// Update match score
export async function updateMatchScore(
  id: string,
  homeScore: number,
  awayScore: number,
  result: 'won' | 'lost' | 'draw'
) {
  return updateEvent(id, {
    score_home: homeScore,
    score_away: awayScore,
    result,
  })
}
