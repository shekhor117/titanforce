import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { checkAdminAuth } from '@/lib/admin-api-helper'

const ALLOWED_TABLES = new Set([
  "partners", "fans", "news_items", "media_items", "contacts", "trophies",
  "standings", "injuries", "player_profiles", "player_positions", "motm", "rankings",
  "lineup", "features", "club_info", "footer_content", "features_content", "gallery",
  "news_updates", "banners", "social_links", "pages", "events", "articles",
  "player_honours", "honours", "gallery_categories", "sponsors", "achievements",
  "fan_clubs", "fundraisers", "performance_metrics", "products", "orders",
])

async function getAdminClient(request: NextRequest) {
  const auth = await checkAdminAuth(request)
  if (!auth.authorized) return { supabase: null, response: NextResponse.json({ error: auth.error }, { status: auth.status }) }
  return { supabase: await createClient(), response: null }
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
  const resolvedTable = resolveTable(table)
  return ALLOWED_TABLES.has(resolvedTable) && Boolean(TABLE_COLUMNS[resolvedTable])
}

const TABLE_COLUMNS: Record<string, string> = {
  partners: 'id, name, logo_url, website_url, description, is_active, sort_order, created_at, updated_at',
  fans: 'id, name, email, avatar_url, is_active, created_at, updated_at',
  news_items: 'id, title, slug, excerpt, content, image_url, category, author, published, published_at, created_at, updated_at',
  media_items: 'id, title, description, media_type, url, thumbnail_url, alt_text, category, created_at, updated_at',
  contacts: 'id, name, email, subject, message, status, created_at, updated_at',
  trophies: 'id, title, description, year, image_url, created_at, updated_at',
  standings: 'id, team_name, position, played, won, drawn, lost, goals_for, goals_against, goal_difference, points, season_year',
  injuries: 'id, player_id, injury_type, description, status, start_date, expected_return, created_at, updated_at',
  player_profiles: 'id, player_id, bio, height, weight, nationality, preferred_position, created_at, updated_at',
  player_positions: 'id, player_id, position, is_primary, created_at, updated_at',
  motm: 'id, match_id, player_id, votes, created_at, updated_at',
  rankings: 'id, player_id, category, rank, score, season_year, created_at, updated_at',
  lineup: 'id, match_id, player_id, position, is_starting, shirt_number, created_at, updated_at',
  features: 'id, name, description, enabled, config, created_at, updated_at',
  club_info: 'id, key, value, created_at, updated_at',
  footer_content: 'id, section, content, sort_order, created_at, updated_at',
  features_content: 'id, key, title, content, image_url, enabled, created_at, updated_at',
  gallery: 'id, title, description, image_url, category, sort_order, created_at, updated_at',
  news_updates: 'id, title, content, image_url, published, published_at, created_at, updated_at',
  banners: 'id, title, image_url, link_url, enabled, sort_order, created_at, updated_at',
  social_links: 'id, platform, url, label, sort_order, enabled, created_at, updated_at',
  pages: 'id, slug, title, content, published, created_at, updated_at',
  events: 'id, title, description, start_date, end_date, location, status, created_at, updated_at',
  articles: 'id, title, slug, excerpt, content, image_url, published, published_at, created_at, updated_at',
  player_honours: 'id, player_id, title, year, description, created_at, updated_at',
  honours: 'id, title, description, year, image_url, created_at, updated_at',
  gallery_categories: 'id, name, slug, description, created_at, updated_at',
  sponsors: 'id, name, logo_url, website_url, sort_order, enabled, created_at, updated_at',
  achievements: 'id, title, description, year, image_url, created_at, updated_at',
  fan_clubs: 'id, name, description, image_url, enabled, created_at, updated_at',
  fundraisers: 'id, title, description, goal, raised, status, created_at, updated_at',
  performance_metrics: 'id, name, value, period, created_at, updated_at',
  products: 'id, name, description, price, image_url, stock, category, is_active, created_at, updated_at',
  orders: 'id, user_id, status, total, shipping_address, created_at, updated_at',
}

const WRITE_FIELDS: Record<string, Set<string>> = Object.fromEntries(
  Object.entries(TABLE_COLUMNS).map(([table, columns]) => [
    table,
    new Set(columns.split(', ').filter((column) => !['id', 'created_at', 'updated_at'].includes(column))),
  ]),
)

function sanitizeRecord(table: string, value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const fields = WRITE_FIELDS[resolveTable(table)]
  if (!fields) return null
  return Object.fromEntries(Object.entries(value).filter(([key]) => fields.has(key)))
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ table: string }> }) {
  const table = await tableFromParams(params)
  if (!validateTable(table)) return NextResponse.json({ error: "Unsupported admin table" }, { status: 400 })

  const { supabase, response } = await getAdminClient(request)
  if (response) return response
  const resolvedTable = resolveTable(table)

  const { data, error } = await supabase.from(resolvedTable).select(TABLE_COLUMNS[resolvedTable])
  if (error) {
    console.error('[v0] Admin table read failed:', error.message)
    return NextResponse.json({ error: "Unable to fetch records" }, { status: 400 })
  }
  return NextResponse.json(data ?? [])
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ table: string }> }) {
  const table = await tableFromParams(params)
  if (!validateTable(table)) return NextResponse.json({ error: "Unsupported admin table" }, { status: 400 })

  const { supabase, response } = await getAdminClient(request)
  if (response) return response

  const resolvedTable = resolveTable(table)
  const body = await request.json()
  const record = sanitizeRecord(table, body)
  if (!record || Object.keys(record).length === 0) return NextResponse.json({ error: "No writable fields were provided" }, { status: 400 })
  const { data, error } = await supabase.from(resolvedTable).insert(record).select(TABLE_COLUMNS[resolvedTable]).single()
  if (error) {
    console.error('[v0] Admin table insert failed:', error.message)
    return NextResponse.json({ error: "Unable to create record" }, { status: 400 })
  }
  return NextResponse.json(data, { status: 201 })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ table: string }> }) {
  const table = await tableFromParams(params)
  if (!validateTable(table)) return NextResponse.json({ error: "Unsupported admin table" }, { status: 400 })

  const { supabase, response } = await getAdminClient(request)
  if (response) return response

  const resolvedTable = resolveTable(table)
  const body = await request.json()
  const { id } = body ?? {}
  const updates = sanitizeRecord(table, body)
  if (!id || !updates || Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "An id and writable updates are required" }, { status: 400 })
  }
  const { data, error } = await supabase.from(resolvedTable).update(updates).eq("id", id).select(TABLE_COLUMNS[resolvedTable]).single()
  if (error) {
    console.error('[v0] Admin table update failed:', error.message)
    return NextResponse.json({ error: "Unable to update record" }, { status: 400 })
  }
  return NextResponse.json(data)
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ table: string }> }) {
  const table = await tableFromParams(params)
  if (!validateTable(table)) return NextResponse.json({ error: "Unsupported admin table" }, { status: 400 })

  const { supabase, response } = await getAdminClient(request)
  if (response) return response

  const resolvedTable = resolveTable(table)
  const id = new URL(request.url).searchParams.get("id")
  if (!id) return NextResponse.json({ error: "An id is required" }, { status: 400 })
  const { error } = await supabase.from(resolvedTable).delete().eq("id", id)
  if (error) {
    console.error('[v0] Admin table delete failed:', error.message)
    return NextResponse.json({ error: "Unable to delete record" }, { status: 400 })
  }
  return NextResponse.json({ success: true })
}

export const dynamic = "force-dynamic"
