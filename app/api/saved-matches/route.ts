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

    // Get saved matches
    const { data, error } = await supabase
      .from("saved_matches")
      .select(`
        id,
        match_id,
        matches:match_id(*)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error
    return NextResponse.json(data || [])
  } catch (error) {
    console.error("[v0] Error fetching saved matches:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch saved matches" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { matchId } = await request.json()
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Save match
    const { data, error } = await supabase
      .from("saved_matches")
      .insert({
        user_id: user.id,
        match_id: matchId,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error saving match:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save match" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const matchId = searchParams.get("matchId")

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Remove saved match
    const { error } = await supabase
      .from("saved_matches")
      .delete()
      .eq("user_id", user.id)
      .eq("match_id", matchId)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error removing saved match:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to remove saved match" },
      { status: 500 }
    )
  }
}
