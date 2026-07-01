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

    try {
      const supabase = await createClient()

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
        console.warn('[v0] Failed to save contact message to Supabase:', error.message)
        // Still return success - client will retry or handle locally
        return NextResponse.json({ success: true, message: "Message received", stored: false })
      }

      return NextResponse.json({ success: true, message: "Message saved successfully", stored: true })
    } catch (dbError) {
      const errorMessage = dbError instanceof Error ? dbError.message : 'Database error'
      console.warn('[v0] Database not available:', errorMessage)
      // Return success anyway - client handles fallback
      return NextResponse.json({ success: true, message: "Message received", stored: false })
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to process message'
    console.error('[v0] Contact API error:', errorMessage)
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
