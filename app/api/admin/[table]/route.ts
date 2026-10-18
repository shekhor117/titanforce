import { NextResponse } from "next/server"
import { createAdminClient, createClient } from "@/lib/supabase/server"

const ALLOWED_TABLES = new Set([
  "players", "matches", "partners", "fans", "news", "media", "contacts",
  "trophies", "standings", "injuries", "player_profiles", "player_positions",
  "match_events", "match_votes", "player_votes", "motm", "rankings", "lineup",
  "features", "settings", "site_settings", "users", "app_users", "venues",
  "seasons", "training_programs", "polls", "tickets", "testimonials",
  "subscriptions", "gallery", "news_updates", "store_products", "store_inventory",
  "store_orders", "banners", "social_links", "club_info", "footer_content",
  "shop_categories", "features_content", "testimonials", "venues", "seasons", "products", "orders", "profiles", "contact_messages", "media", "gallery", "store_inventory", "player_ratings", "subscriptions",
  "pages", "events", "articles", "player_honours", "honours", "news_items", "media_items",
  "cms_pages", "cms_content_blocks", "cms_menus", "cms_seo", "cms_settings", "cms_media_library",
  "gallery_categories", "sponsors", "achievements", "fan_clubs", "fundraisers", "performance_metrics",
])

async function getAdminClient() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) return { supabase, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }

  let role = user.app_metadata?.role as string | undefined

  // Keep authorization server-side and support existing app_users records while
  // still refusing editable user_metadata as an authorization source.
  if (role !== "admin" && role !== "manager") {
    const { data: appUser } = await supabase
      .from("app_users")
      .select("role, is_active")
      .eq("email", user.email ?? "")
      .maybeSingle()
    if (appUser?.is_active !== false) role = appUser?.role
  }

  if (role !== "admin" && role !== "manager") {
    return { supabase, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) }
  }

  // Use the service-role client only after the user has been authenticated and
  // authorized above, so admin CRUD is not blocked by public-table RLS policies.
  return { supabase: createAdminClient(), response: null }
}

async function tableFromParams(params: Promise<{ table: string }>) {
  const { table } = await params
  return table
}

const PUBLIC_TABLE_ALIASES: Record<string, string> = {
  news: "news_items",
  media: "media_items",
  store_products: "products",
  store_orders: "orders",
}

function resolveTable(table: string) {
  return PUBLIC_TABLE_ALIASES[table] ?? table
}

function validateTable(table: string) {
  return ALLOWED_TABLES.has(table)
}

export async function GET(_request: Request, { params }: { params: Promise<{ table: string }> }) {
  const table = await tableFromParams(params)
  if (!validateTable(table)) return NextResponse.json({ error: "Unsupported admin table" }, { status: 400 })

  const { supabase, response } = await getAdminClient()
  if (response) return response
  const resolvedTable = resolveTable(table)

  const { data, error } = await supabase.from(resolvedTable).select("*")
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data ?? [])
}

export async function POST(request: Request, { params }: { params: Promise<{ table: string }> }) {
  const table = await tableFromParams(params)
  if (!validateTable(table)) return NextResponse.json({ error: "Unsupported admin table" }, { status: 400 })

  const { supabase, response } = await getAdminClient()
  if (response) return response

  const resolvedTable = resolveTable(table)
  const body = await request.json()
  if (!body || Array.isArray(body)) return NextResponse.json({ error: "A record object is required" }, { status: 400 })
  const { data, error } = await supabase.from(resolvedTable).insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}

export async function PUT(request: Request, { params }: { params: Promise<{ table: string }> }) {
  const table = await tableFromParams(params)
  if (!validateTable(table)) return NextResponse.json({ error: "Unsupported admin table" }, { status: 400 })

  const { supabase, response } = await getAdminClient()
  if (response) return response

  const resolvedTable = resolveTable(table)
  const body = await request.json()
  const { id, ...updates } = body ?? {}
  if (!id || !updates || Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "An id and updates are required" }, { status: 400 })
  }
  delete updates.created_at
  delete updates.updated_at
  const { data, error } = await supabase.from(resolvedTable).update(updates).eq("id", id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ table: string }> }) {
  const table = await tableFromParams(params)
  if (!validateTable(table)) return NextResponse.json({ error: "Unsupported admin table" }, { status: 400 })

  const { supabase, response } = await getAdminClient()
  if (response) return response

  const resolvedTable = resolveTable(table)
  const id = new URL(request.url).searchParams.get("id")
  if (!id) return NextResponse.json({ error: "An id is required" }, { status: 400 })
  const { error } = await supabase.from(resolvedTable).delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}

export const dynamic = "force-dynamic"
