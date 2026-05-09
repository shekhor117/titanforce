import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { userId, name, email, message } = await request.json()

    if (!userId || !name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    if (!supabase) {
      // Fallback: return success without saving (localStorage handles it on client)
      return NextResponse.json({ success: true, message: "Message received" })
    }

    // Try to save to Supabase
    const { error } = await supabase
      .from("contact_messages")
      .insert({
        user_id: userId,
        name,
        email,
        message,
        status: "unread",
        created_at: new Date().toISOString(),
      })

    if (error) {
      console.error("[v0] Error saving contact message:", error)
      // Still return success - localStorage has already saved it
      return NextResponse.json({ success: true, message: "Message received" })
    }

    return NextResponse.json({ success: true, message: "Message saved successfully" })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    )
  }
}
