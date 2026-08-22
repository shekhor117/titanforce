import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_URL
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey)
}

let browserClient: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  // Keep one browser client so auth listeners and the session cookie store
  // are shared across the app instead of being recreated during renders.
  browserClient ??= createBrowserClient(supabaseUrl, supabaseAnonKey)
  return browserClient
}
