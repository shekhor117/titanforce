import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface Page {
  id?: string
  title: string
  slug: string
  content: string
  meta_description?: string
  meta_keywords?: string[]
  featured_image_url?: string
  featured_image_alt?: string
  status: 'draft' | 'published'
  parent_page_id?: string
}

export interface PageResponse extends Page {
  id: string
  created_at: string
  updated_at: string
  created_by?: string
}

// Get all pages with pagination
export async function getPages(
  page: number = 1,
  limit: number = 10,
  filters?: {
    status?: 'draft' | 'published'
    search?: string
  }
) {
  let query = supabase
    .from('pages')
    .select('*', { count: 'exact' })

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`)
  }

  const offset = (page - 1) * limit
  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw new Error(error.message)

  return {
    pages: data as PageResponse[],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit),
  }
}

// Get single page by slug
export async function getPageBySlug(slug: string) {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) throw new Error(error.message)
  return data as PageResponse
}

// Get single page by ID
export async function getPageById(id: string) {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data as PageResponse
}

// Create new page
export async function createPage(page: Page) {
  const { data, error } = await supabase
    .from('pages')
    .insert([{
      ...page,
      created_by: (await supabase.auth.getUser()).data.user?.id,
    }])
    .select()

  if (error) throw new Error(error.message)
  return data?.[0] as PageResponse
}

// Update page
export async function updatePage(id: string, updates: Partial<Page>) {
  const { data, error } = await supabase
    .from('pages')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) throw new Error(error.message)
  return data?.[0] as PageResponse
}

// Delete page
export async function deletePage(id: string) {
  const { error } = await supabase
    .from('pages')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  return true
}

// Publish page
export async function publishPage(id: string) {
  return updatePage(id, {
    status: 'published',
  })
}

// Save page as draft
export async function saveDraftPage(id: string) {
  return updatePage(id, {
    status: 'draft',
  })
}
