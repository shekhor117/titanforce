import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string' || !name.trim() || !email.trim() || !message.trim() || name.length > 120 || email.length > 320 || message.length > 5000) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 })

    const { error } = await supabase
      .from("contact_messages")
      .insert({
        user_id: user.id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
        status: "unread",
        created_at: new Date().toISOString(),
      })

    if (error) {
      console.error('[v0] Contact message persistence failed:', error.message)
      return NextResponse.json({ error: "Unable to save your message" }, { status: 502 })
    }

    return NextResponse.json({ success: true, message: "Message saved successfully" })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    )
  }
}
