import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface Article {
  id?: string
  title: string
  slug: string
  content: string
  excerpt?: string
  featured_image_url?: string
  featured_image_alt?: string
  status: 'draft' | 'published' | 'archived'
  published_at?: string
  scheduled_publish_at?: string
  category?: string
  tags?: string[]
  seo_title?: string
  seo_description?: string
  seo_keywords?: string[]
}

export interface ArticleResponse extends Article {
  id: string
  author_id?: string
  created_at: string
  updated_at: string
  view_count: number
}

// Get all articles with pagination and filters
export async function getArticles(
  page: number = 1,
  limit: number = 10,
  filters?: {
    status?: 'draft' | 'published' | 'archived'
    category?: string
    search?: string
  }
) {
  let query = supabase
    .from('articles')
    .select('*', { count: 'exact' })

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  if (filters?.category) {
    query = query.eq('category', filters.category)
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
    articles: data as ArticleResponse[],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit),
  }
}

// Get single article by slug
export async function getArticleBySlug(slug: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) throw new Error(error.message)
  return data as ArticleResponse
}

// Get single article by ID
export async function getArticleById(id: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data as ArticleResponse
}

// Create new article
export async function createArticle(article: Article) {
  const { data, error } = await supabase
    .from('articles')
    .insert([{
      ...article,
      author_id: (await supabase.auth.getUser()).data.user?.id,
    }])
    .select()

  if (error) throw new Error(error.message)
  return data?.[0] as ArticleResponse
}

// Update article
export async function updateArticle(id: string, updates: Partial<Article>) {
  const { data, error } = await supabase
    .from('articles')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) throw new Error(error.message)
  return data?.[0] as ArticleResponse
}

// Delete article
export async function deleteArticle(id: string) {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  return true
}

// Publish article
export async function publishArticle(id: string) {
  return updateArticle(id, {
    status: 'published',
    published_at: new Date().toISOString(),
  })
}

// Archive article
export async function archiveArticle(id: string) {
  return updateArticle(id, {
    status: 'archived',
  })
}

// Schedule article for publishing
export async function scheduleArticle(id: string, publishAt: Date) {
  return updateArticle(id, {
    scheduled_publish_at: publishAt.toISOString(),
  })
}
