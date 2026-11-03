import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path")?.trim() ?? ""

  const lowerPath = path.toLowerCase()
  const isSquadImage = lowerPath.startsWith("squad/") || lowerPath.includes("/squad/")
  if (!isSquadImage || path.includes("..") || path.length > 500) {
    return NextResponse.json({ error: "Invalid player image path" }, { status: 400 })
  }

  const supabase = createAdminClient()
  let imagePath = path
  let { data, error } = await supabase.storage.from("app-files").createSignedUrl(imagePath, 300)

  if (error || !data?.signedUrl) {
    const filename = path.split("/").pop()
    if (!filename || !/^[\w.-]+$/.test(filename)) {
      return NextResponse.json({ error: "Player image unavailable" }, { status: 404 })
    }

    const { data: files } = await supabase.storage.from("app-files").list("Player image/squad", { limit: 1000 })
    if (!files?.some((file) => file.name === filename)) {
      return NextResponse.json({ error: "Player image unavailable" }, { status: 404 })
    }

    imagePath = `Player image/squad/${filename}`
    const fallback = await supabase.storage.from("app-files").createSignedUrl(imagePath, 300)
    data = fallback.data
    error = fallback.error
  }

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: "Player image unavailable" }, { status: 404 })
  }

  return NextResponse.redirect(data.signedUrl, {
    headers: { "Cache-Control": "public, max-age=240, stale-while-revalidate=60" },
  })
}
