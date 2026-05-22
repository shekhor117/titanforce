import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Types
export interface CMSPage {
  id: string
  slug: string
  title: string
  title_bn: string
  content?: string
  content_bn?: string
  excerpt?: string
  excerpt_bn?: string
  featured_image?: string
  meta_description?: string
  meta_keywords?: string
  status: 'draft' | 'published'
  author_id?: string
  created_at: string
  updated_at: string
  published_at?: string
}

export interface ContentBlock {
  id: string
  page_id: string
  block_type: 'text' | 'image' | 'video' | 'gallery' | 'testimonial' | 'team'
  title?: string
  content: Record<string, any>
  order_index: number
  created_at: string
  updated_at: string
}

export interface MenuItem {
  id: string
  label: string
  url: string
  children?: MenuItem[]
}

export interface CMSMenu {
  id: string
  name: string
  slug: string
  menu_items: MenuItem[]
  created_at: string
  updated_at: string
}

export interface CMSSEO {
  id: string
  page_id: string
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  og_title?: string
  og_description?: string
  og_image?: string
  twitter_card?: string
  canonical_url?: string
  created_at: string
  updated_at: string
}

export interface CMSMedia {
  id: string
  filename: string
  file_path: string
  file_type?: string
  file_size?: number
  alt_text?: string
  caption?: string
  uploaded_by?: string
  created_at: string
}

export interface CMSSetting {
  id: string
  key: string
  value: Record<string, any>
  description?: string
  created_at: string
  updated_at: string
}

// CMS Service
class CMSService {
  // ============ PAGES ============
  async getPages(includeArchived = false) {
    let query = supabase.from('cms_pages').select('*')
    if (!includeArchived) {
      query = query.eq('status', 'published')
    }
    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error
    return data as CMSPage[]
  }

  async getPageBySlug(slug: string) {
    const { data, error } = await supabase
      .from('cms_pages')
      .select('*')
      .eq('slug', slug)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    return data as CMSPage | null
  }

  async getPageById(id: string) {
    const { data, error } = await supabase
      .from('cms_pages')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data as CMSPage
  }

  async createPage(page: Omit<CMSPage, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('cms_pages')
      .insert([page])
      .select()
      .single()
    if (error) throw error
    return data as CMSPage
  }

  async updatePage(id: string, updates: Partial<CMSPage>) {
    const { data, error } = await supabase
      .from('cms_pages')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as CMSPage
  }

  async deletePage(id: string) {
    const { error } = await supabase.from('cms_pages').delete().eq('id', id)
    if (error) throw error
  }

  async publishPage(id: string) {
    return this.updatePage(id, {
      status: 'published',
      published_at: new Date().toISOString(),
    })
  }

  // ============ CONTENT BLOCKS ============
  async getBlocksByPageId(pageId: string) {
    const { data, error } = await supabase
      .from('cms_content_blocks')
      .select('*')
      .eq('page_id', pageId)
      .order('order_index', { ascending: true })
    if (error) throw error
    return data as ContentBlock[]
  }

  async createBlock(block: Omit<ContentBlock, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('cms_content_blocks')
      .insert([block])
      .select()
      .single()
    if (error) throw error
    return data as ContentBlock
  }

  async updateBlock(id: string, updates: Partial<ContentBlock>) {
    const { data, error } = await supabase
      .from('cms_content_blocks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as ContentBlock
  }

  async deleteBlock(id: string) {
    const { error } = await supabase
      .from('cms_content_blocks')
      .delete()
      .eq('id', id)
    if (error) throw error
  }

  async reorderBlocks(pageId: string, blockIds: string[]) {
    const updates = blockIds.map((id, index) => ({
      id,
      order_index: index,
    }))
    for (const update of updates) {
      await this.updateBlock(update.id, { order_index: update.order_index })
    }
  }

  // ============ MENUS ============
  async getMenus() {
    const { data, error } = await supabase
      .from('cms_menus')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data as CMSMenu[]
  }

  async getMenuBySlug(slug: string) {
    const { data, error } = await supabase
      .from('cms_menus')
      .select('*')
      .eq('slug', slug)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    return data as CMSMenu | null
  }

  async createMenu(menu: Omit<CMSMenu, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('cms_menus')
      .insert([menu])
      .select()
      .single()
    if (error) throw error
    return data as CMSMenu
  }

  async updateMenu(id: string, updates: Partial<CMSMenu>) {
    const { data, error } = await supabase
      .from('cms_menus')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as CMSMenu
  }

  async deleteMenu(id: string) {
    const { error } = await supabase.from('cms_menus').delete().eq('id', id)
    if (error) throw error
  }

  // ============ SEO ============
  async getSEOByPageId(pageId: string) {
    const { data, error } = await supabase
      .from('cms_seo')
      .select('*')
      .eq('page_id', pageId)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    return data as CMSSEO | null
  }

  async createSEO(seo: Omit<CMSSEO, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('cms_seo')
      .insert([seo])
      .select()
      .single()
    if (error) throw error
    return data as CMSSEO
  }

  async updateSEO(id: string, updates: Partial<CMSSEO>) {
    const { data, error } = await supabase
      .from('cms_seo')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as CMSSEO
  }

  // ============ MEDIA LIBRARY ============
  async getMediaLibrary(limit = 50) {
    const { data, error } = await supabase
      .from('cms_media_library')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    return data as CMSMedia[]
  }

  async uploadMedia(file: File, altText?: string, caption?: string) {
    const fileName = `${Date.now()}-${file.name}`
    const filePath = `cms/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file)
    if (uploadError) throw uploadError

    const { data: publicData } = supabase.storage
      .from('media')
      .getPublicUrl(filePath)

    const { data, error } = await supabase
      .from('cms_media_library')
      .insert([
        {
          filename: file.name,
          file_path: publicData.publicUrl,
          file_type: file.type,
          file_size: file.size,
          alt_text: altText,
          caption: caption,
        },
      ])
      .select()
      .single()
    if (error) throw error
    return data as CMSMedia
  }

  async deleteMedia(id: string) {
    const media = await supabase
      .from('cms_media_library')
      .select('file_path')
      .eq('id', id)
      .single()

    if (media.data?.file_path) {
      const path = media.data.file_path.replace(
        `${supabaseUrl}/storage/v1/object/public/media/`,
        ''
      )
      await supabase.storage.from('media').remove([path])
    }

    const { error } = await supabase
      .from('cms_media_library')
      .delete()
      .eq('id', id)
    if (error) throw error
  }

  // ============ SETTINGS ============
  async getSetting(key: string) {
    const { data, error } = await supabase
      .from('cms_settings')
      .select('*')
      .eq('key', key)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    return data as CMSSetting | null
  }

  async updateSetting(key: string, value: Record<string, any>) {
    const existing = await this.getSetting(key)
    if (existing) {
      const { data, error } = await supabase
        .from('cms_settings')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('key', key)
        .select()
        .single()
      if (error) throw error
      return data as CMSSetting
    } else {
      const { data, error } = await supabase
        .from('cms_settings')
        .insert([{ key, value }])
        .select()
        .single()
      if (error) throw error
      return data as CMSSetting
    }
  }

  // ============ SUBSCRIPTIONS ============
  subscribeToPages(
    callback: (pages: CMSPage[]) => void,
    errorCallback: (error: Error) => void
  ) {
    return supabase
      .from('cms_pages')
      .on('*', () => {
        this.getPages(true)
          .then(callback)
          .catch(errorCallback)
      })
      .subscribe()
  }

  subscribeToBlocks(
    pageId: string,
    callback: (blocks: ContentBlock[]) => void,
    errorCallback: (error: Error) => void
  ) {
    return supabase
      .from('cms_content_blocks')
      .on('*', () => {
        this.getBlocksByPageId(pageId)
          .then(callback)
          .catch(errorCallback)
      })
      .subscribe()
  }
}

let cmsServiceInstance: CMSService | null = null

export function getCMSService(): CMSService {
  if (!cmsServiceInstance) {
    cmsServiceInstance = new CMSService()
  }
  return cmsServiceInstance
}

export default getCMSService
