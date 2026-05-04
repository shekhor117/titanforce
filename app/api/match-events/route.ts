import { createClient } from "@/lib/supabase/client"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const matchId = searchParams.get("matchId")

    if (!matchId) {
      return NextResponse.json({ error: "matchId required" }, { status: 400 })
    }

    const supabase = createClient()

    const { data, error } = await supabase
      .from("match_events")
      .select(`
        id,
        match_id,
        event_type,
        player_id,
        minute,
        description,
        metadata,
        created_at,
        profiles:player_id(
          id,
          full_name,
          jersey_number,
          position
        )
      `)
      .eq("match_id", matchId)
      .order("minute", { ascending: true })

    if (error) throw error
    return NextResponse.json(data || [])
  } catch (error) {
    console.error("[v0] Error fetching match events:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch events" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { matchId, eventType, playerId, minute, description, metadata } = await request.json()

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

    // Create event
    const { data, error } = await supabase
      .from("match_events")
      .insert({
        match_id: matchId,
        event_type: eventType,
        player_id: playerId,
        minute,
        description,
        metadata,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error creating event:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create event" },
      { status: 500 }
    )
  }
}
