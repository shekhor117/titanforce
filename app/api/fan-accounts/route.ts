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

    // Get fan account
    const { data, error } = await supabase
      .from("fan_accounts")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (error && error.code !== "PGRST116") throw error
    return NextResponse.json(data || null)
  } catch (error) {
    console.error("[v0] Error fetching fan account:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch account" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { bio, notifications_enabled } = await request.json()
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create or update fan account
    const { data, error } = await supabase
      .from("fan_accounts")
      .upsert(
        {
          user_id: user.id,
          bio,
          notifications_enabled,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error creating fan account:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create account" },
      { status: 500 }
    )
  }
}
