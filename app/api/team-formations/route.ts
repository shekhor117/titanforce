import { createClient } from "@/lib/supabase/client"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const matchId = searchParams.get("matchId")

    const supabase = createClient()

    let query = supabase.from("team_formations").select("*")

    if (matchId) {
      query = query.eq("match_id", matchId).single()
    } else {
      query = query.order("created_at", { ascending: false })
    }

    const { data, error } = await query

    if (error && error.code !== "PGRST116") throw error
    return NextResponse.json(data || (matchId ? {} : []))
  } catch (error) {
    console.error("[v0] Error fetching formations:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch formations" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { matchId, formation, startingLineup, substitutions, tactics } = await request.json()

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user is admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profileError || profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Create or update formation
    const { data, error } = await supabase
      .from("team_formations")
      .upsert(
        {
          match_id: matchId,
          formation,
          starting_lineup: startingLineup,
          substitutions,
          tactics,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "match_id" }
      )
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error saving formation:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save formation" },
      { status: 500 }
    )
  }
}
