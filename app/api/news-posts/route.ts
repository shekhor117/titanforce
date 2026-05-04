import { createClient } from "@/lib/supabase/client"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get("published") === "true"

    const supabase = createClient()

    let query = supabase
      .from("news_posts")
      .select(`
        id,
        admin_id,
        title,
        content,
        image_url,
        published,
        created_at,
        updated_at,
        profiles:admin_id(
          id,
          full_name,
          photo_url
        )
      `)

    if (published) {
      query = query.eq("published", true)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) throw error
    return NextResponse.json(data || [])
  } catch (error) {
    console.error("[v0] Error fetching news:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch news" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { title, content, imageUrl, published } = await request.json()

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

    // Create news post
    const { data, error } = await supabase
      .from("news_posts")
      .insert({
        admin_id: user.id,
        title,
        content,
        image_url: imageUrl,
        published: published || false,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error creating news:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create news" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { postId, title, content, imageUrl, published } = await request.json()

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

    // Update news post
    const { data, error } = await supabase
      .from("news_posts")
      .update({
        title,
        content,
        image_url: imageUrl,
        published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", postId)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error updating news:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update news" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get("postId")

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

    // Delete news post
    const { error } = await supabase
      .from("news_posts")
      .delete()
      .eq("id", postId)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting news:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete news" },
      { status: 500 }
    )
  }
}
