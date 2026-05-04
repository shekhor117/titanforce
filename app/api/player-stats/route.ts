import { createClient } from "@/lib/supabase/client"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const season = searchParams.get("season") || "2024-2025"
    const playerId = searchParams.get("playerId")

    const supabase = createClient()

    if (playerId) {
      // Get stats for a specific player
      const { data, error } = await supabase
        .from("player_stats")
        .select("*")
        .eq("user_id", playerId)
        .eq("season", season)
        .single()

      if (error && error.code !== "PGRST116") throw error
      return NextResponse.json(data || {})
    }

    // Get leaderboard stats for all players
    const { data, error } = await supabase
      .from("player_stats")
      .select(`
        id,
        user_id,
        season,
        goals,
        assists,
        appearances,
        minutes_played,
        yellow_cards,
        red_cards,
        profiles:user_id(
          id,
          full_name,
          photo_url,
          jersey_number
        )
      `)
      .eq("season", season)
      .order("goals", { ascending: false })

    if (error) throw error
    return NextResponse.json(data || [])
  } catch (error) {
    console.error("[v0] Error fetching player stats:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch stats" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { playerId, season, stats } = await request.json()

    const supabase = createClient()

    // Check if player is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify the player is updating their own stats or is an admin
    if (user.id !== playerId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Upsert player stats
    const { data, error } = await supabase
      .from("player_stats")
      .upsert(
        {
          user_id: playerId,
          season: season || "2024-2025",
          ...stats,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error updating player stats:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update stats" },
      { status: 500 }
    )
  }
}
