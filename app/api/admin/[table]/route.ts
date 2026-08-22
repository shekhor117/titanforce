import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const ALLOWED_TABLES = new Set([
  "players", "matches", "partners", "fans", "news", "media", "contacts",
  "trophies", "standings", "injuries", "player_profiles", "player_positions",
  "match_events", "match_votes", "player_votes", "motm", "rankings", "lineup",
  "features", "settings", "site_settings", "users", "app_users", "venues",
  "seasons", "training_programs", "polls", "tickets", "testimonials",
  "subscriptions", "gallery", "news_updates", "store_products", "store_inventory",
  "store_orders",
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
      .select("role, status")
      .eq("auth_id", user.id)
      .maybeSingle()
    if (appUser?.status === "active") role = appUser.role
  }

  if (role !== "admin" && role !== "manager") {
    return { supabase, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) }
  }

  return { supabase, response: null }
}

async function tableFromParams(params: Promise<{ table: string }>) {
  const { table } = await params
  return table
}

function validateTable(table: string) {
  return ALLOWED_TABLES.has(table)
}

export async function GET(_request: Request, { params }: { params: Promise<{ table: string }> }) {
  const table = await tableFromParams(params)
  if (!validateTable(table)) return NextResponse.json({ error: "Unsupported admin table" }, { status: 400 })

  const { supabase, response } = await getAdminClient()
  if (response) return response

  const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data ?? [])
}

export async function POST(request: Request, { params }: { params: Promise<{ table: string }> }) {
  const table = await tableFromParams(params)
  if (!validateTable(table)) return NextResponse.json({ error: "Unsupported admin table" }, { status: 400 })

  const { supabase, response } = await getAdminClient()
  if (response) return response

  const body = await request.json()
  if (!body || Array.isArray(body)) return NextResponse.json({ error: "A record object is required" }, { status: 400 })
  const { data, error } = await supabase.from(table).insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}

export async function PUT(request: Request, { params }: { params: Promise<{ table: string }> }) {
  const table = await tableFromParams(params)
  if (!validateTable(table)) return NextResponse.json({ error: "Unsupported admin table" }, { status: 400 })

  const { supabase, response } = await getAdminClient()
  if (response) return response

  const body = await request.json()
  const { id, ...updates } = body ?? {}
  if (!id || !updates || Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "An id and updates are required" }, { status: 400 })
  }
  delete updates.created_at
  delete updates.updated_at
  const { data, error } = await supabase.from(table).update(updates).eq("id", id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ table: string }> }) {
  const table = await tableFromParams(params)
  if (!validateTable(table)) return NextResponse.json({ error: "Unsupported admin table" }, { status: 400 })

  const { supabase, response } = await getAdminClient()
  if (response) return response

  const id = new URL(request.url).searchParams.get("id")
  if (!id) return NextResponse.json({ error: "An id is required" }, { status: 400 })
  const { error } = await supabase.from(table).delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}

export const dynamic = "force-dynamic"
