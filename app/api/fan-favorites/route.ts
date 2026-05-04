import { createClient } from "@/lib/supabase/client"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get favorite players
    const { data, error } = await supabase
      .from("fan_favorites")
      .select(`
        id,
        player_user_id,
        profiles:player_user_id(
          id,
          full_name,
          photo_url,
          jersey_number,
          position
        )
      `)
      .eq("fan_user_id", user.id)

    if (error) throw error
    return NextResponse.json(data || [])
  } catch (error) {
    console.error("[v0] Error fetching favorites:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch favorites" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { playerUserId } = await request.json()
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Add favorite player
    const { data, error } = await supabase
      .from("fan_favorites")
      .insert({
        fan_user_id: user.id,
        player_user_id: playerUserId,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error adding favorite:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to add favorite" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const playerUserId = searchParams.get("playerUserId")

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Remove favorite player
    const { error } = await supabase
      .from("fan_favorites")
      .delete()
      .eq("fan_user_id", user.id)
      .eq("player_user_id", playerUserId)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error removing favorite:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to remove favorite" },
      { status: 500 }
    )
  }
}
