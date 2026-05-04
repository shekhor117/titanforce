import { createClient } from "@/lib/supabase/client"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get("postId")

    if (!postId) {
      return NextResponse.json({ error: "postId required" }, { status: 400 })
    }

    const supabase = createClient()

    const { data, error } = await supabase
      .from("news_comments")
      .select(`
        id,
        post_id,
        user_id,
        content,
        created_at,
        updated_at,
        profiles:user_id(
          id,
          full_name,
          photo_url
        )
      `)
      .eq("post_id", postId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return NextResponse.json(data || [])
  } catch (error) {
    console.error("[v0] Error fetching comments:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch comments" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { postId, content } = await request.json()

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create comment
    const { data, error } = await supabase
      .from("news_comments")
      .insert({
        post_id: postId,
        user_id: user.id,
        content,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error creating comment:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create comment" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const commentId = searchParams.get("commentId")

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user owns the comment or is admin
    const { data: comment, error: fetchError } = await supabase
      .from("news_comments")
      .select("user_id")
      .eq("id", commentId)
      .single()

    if (fetchError || !comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    if (comment.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Delete comment
    const { error } = await supabase
      .from("news_comments")
      .delete()
      .eq("id", commentId)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting comment:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete comment" },
      { status: 500 }
    )
  }
}
